export const TEXT_NODE = 'TEXT_NODE';

function createTextNode(text) {
  return {
    type: TEXT_NODE,
    props: {
      text,
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
  if (fiber.dom /* function component 的 fiber 没有 dom */) {
    let parent = fiber.parent;
    while (!parent.dom) parent = parent.parent;
    parent.dom.appendChild(fiber.dom);
  }

  commitFiber(fiber.child);
  commitFiber(fiber.sibling);
}

let root = null;
function commitRoot() {
  if (!root) return;
  commitFiber(root.child);
  root = null;
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
      nextUnitOfFiber = performUnitOfFiber(nextUnitOfFiber);
    }
    fiberLoop();
  });
}

function render(node, container) {
  nextUnitOfFiber = root = {
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
  return type === TEXT_NODE ? document.createTextNode(props.text) : document.createElement(type);
}

function updateProps(fiber) {
  const { props, dom } = fiber;
  // 2、添加属性
  Object.keys(props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  let lastChild = null;
  children.forEach((child, index) => {
    const childFiber = {
      ...child,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = childFiber;
    } else {
      lastChild.sibling = childFiber;
    }
    lastChild = childFiber;
  });
}

function isFunctionComponent(fiber) {
  return fiber && typeof fiber.type === 'function';
}

function performUnitOfFiber(fiber) {
  const { type, props } = fiber;
  if (!fiber.dom && !isFunctionComponent(fiber)) {
    fiber.dom = createDom(fiber);
    updateProps(fiber);
  }
  const children = isFunctionComponent(fiber) ? [type(props)] : props.children;
  initChildren(fiber, children);

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

export default {
  render,
  createElement,
};
