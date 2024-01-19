import { compareFiberChain, logFiberChain } from './help.js';
export const TEXT_NODE = 'TEXT_NODE';

function createTextNode(textContent) {
  return {
    type: TEXT_NODE,
    props: {
      textContent,
      children: [],
    },
  };
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode = ['string', 'number'].includes(typeof child);
        return isTextNode ? createTextNode(String(child)) : child;
      }),
    },
  };
}

// 先序遍历提交挂载
function commitFiber(fiber) {
  if (!fiber) return;
  if (fiber.effectTag === 'update') {
    updateProps(fiber);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom /* function component 的 fiber 没有 dom */) {
      let parent = fiber.parent;
      while (!parent.dom) parent = parent.parent;
      parent.dom.appendChild(fiber.dom);
    }
  }

  commitFiber(fiber.child);
  commitFiber(fiber.sibling);
}

let wipRoot = null; // work in progress
let currentRoot; // alternate root
let deletions = [];
let activeFCFiber = null; // 当前处理的函数式组件 fiber
function commitRoot() {
  if (!wipRoot) return;
  deletions.forEach(deleteNode);
  commitFiber(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function deleteNode(fiber) {
  if (fiber.dom) {
    fiber.parent.dom.removeChild(fiber.dom);
  } else {
    // 函数式组件 fiber 处理：卸载组件根节点，循环查找父节点
    let parent = fiber.parent;
    while (!parent.dom) parent = parent.parent;
    parent.dom.removeChild(fiber.child.dom);
  }
}

let nextUnitOfFiber = null;
function fiberLoop() {
  if (!nextUnitOfFiber) {
    // 统一提交
    commitRoot();
    return;
  }
  requestIdleCallback((IdleDeadline) => {
    while (IdleDeadline.timeRemaining() > 0 && nextUnitOfFiber) {
      if (activeFCFiber?.alternate && activeFCFiber?.sibling?.type === nextUnitOfFiber?.type) {
        nextUnitOfFiber = null;
        activeFCFiber = null;
        break;
      }
      nextUnitOfFiber = performUnitOfFiber(nextUnitOfFiber);
    }
    fiberLoop();
  });
}

function render(node, container) {
  nextUnitOfFiber = wipRoot = {
    type: null,
    props: {
      children: [node],
    },
    parent: null,
    child: null,
    sibling: null,
    dom: container,
  };
  fiberLoop();
}

function createDom(fiber) {
  const { type, props } = fiber;
  return type === TEXT_NODE ? document.createTextNode(props.textContent) : document.createElement(type);
}

function updateProps(fiber) {
  const { props: newProps, dom, alternate } = fiber;
  const oldProps = alternate?.props || {};
  const oldKeys = Object.keys(oldProps).filter((key) => key !== 'children');
  const newKeys = Object.keys(newProps).filter((key) => key !== 'children');
  // 1. 删除：老的有，新的没有
  oldKeys.forEach((key) => {
    if (!newKeys.includes(key)) {
      dom.removeAttribute(key);
    }
  });
  // 2. 全等判断：老的没有，新的有; 老的有，新的有
  newKeys.forEach((key) => {
    if (newProps[key] !== oldProps[key]) {
      /*
        分类
          1、children props(上面过滤掉了)
          2、事件绑定
          3、一般 props
      */
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom.removeEventListener(eventType, oldProps[key]);
        dom.addEventListener(eventType, newProps[key]);
      } else {
        dom[key] = newProps[key];
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let lastChild = null;
  const isSameType = fiber.alternate && fiber.type === fiber.alternate.type;
  let oldFiber = isSameType ? fiber.alternate?.child : null; // 父节点类型相同才有必要比较子节点
  children.forEach((child, index) => {
    const isChildSameType = oldFiber && child.type === oldFiber.type;
    const childFiber = {
      ...child,
      parent: fiber,
      child: null,
      sibling: null,
      alternate: oldFiber,
    };
    if (isChildSameType) {
      // 更新节点
      childFiber.dom = oldFiber.dom; // 沿用旧 dom，这样遍历到这个节点的时候，updateHostComponent 中就不会再创建 dom 了
      childFiber.effectTag = 'update';
    } else {
      childFiber.dom = null;
      childFiber.effectTag = 'placement';
      if (oldFiber) {
        // 节点 type 不同
        deletions.push(oldFiber);
      }
    }
    if (index === 0) {
      fiber.child = childFiber;
    } else {
      lastChild.sibling = childFiber;
    }
    lastChild = childFiber;
    oldFiber = oldFiber?.sibling;
  });
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  activeFCFiber = fiber;
  resetStateHooks();
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
    updateProps(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function performUnitOfFiber(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) updateFunctionComponent(fiber);
  else updateHostComponent(fiber);

  if (fiber.child) {
    return fiber.child;
  } else if (fiber.sibling) {
    return fiber.sibling;
  } else if (fiber.parent) {
    // 因为函数式组件节点多套了一层，所以需要循环查找（直接这么写，不用多思考，反正没有找到的是结束递归）
    let parent = fiber.parent;
    while (parent && !parent.sibling && parent.parent) {
      parent = parent.parent;
    }
    return parent.sibling;
  } else {
    return null;
  }
}

// 供函数式组件手动更新时调用
function update() {
  const thisFCFiber = activeFCFiber;
  return () => {
    activeFCFiber = thisFCFiber;
    nextUnitOfFiber = wipRoot = {
      ...thisFCFiber,
      child: null,
      alternate: thisFCFiber,
    };
    fiberLoop();
  };
}

let stateHooks = [];
let stateHookIndex = 0;
function resetStateHooks() {
  stateHooks = [];
  stateHookIndex = 0;
}
function useState(initial) {
  const cachedUpdate = update();
  const oldStateHooks = activeFCFiber.alternate?.stateHooks;
  const stateHook = {
    state: oldStateHooks ? oldStateHooks[stateHookIndex].state : initial,
    queue: oldStateHooks ? oldStateHooks[stateHookIndex].queue : [],
  };
  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });
  stateHook.queue = [];
  stateHookIndex++;
  stateHooks.push(stateHook);
  activeFCFiber.stateHooks = stateHooks; // stateHook 缓存在 fiber 上
  const setState = (action) => {
    stateHook.queue.push(typeof action === 'function' ? action : () => action);
    // 数据更新之后更新组件视图, 有空闲时间才会更新，所以 setState 是可能多次调用而视图还没有更新的
    cachedUpdate();
  };
  return [stateHook.state, setState];
}

export default {
  render,
  update,
  useState,
  createElement,
};
