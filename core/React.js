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
      children: children.map((child) => (typeof child === 'string' ? createTextNode(child) : child)),
    },
  };
}

let nextUnitOfFiber = null;
function fiberLoop() {
  if (!nextUnitOfFiber) return;
  requestIdleCallback((IdleDeadline) => {
    while (IdleDeadline.timeRemaining() > 0 && nextUnitOfFiber) {
      nextUnitOfFiber = performUnitOfFiber(nextUnitOfFiber);
    }
    fiberLoop();
  });
}

function render(node, container) {
  nextUnitOfFiber = {
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

function performUnitOfFiber(fiber) {
  const { type, props } = fiber;
  if (!fiber.dom) {
    // 1、创建 dom 节点
    const dom = type === TEXT_NODE ? document.createTextNode(props.text) : document.createElement(type);
    fiber.dom = dom;
    // 2、添加属性
    Object.keys(fiber).forEach((key) => {
      if (key !== 'children') {
        dom[key] = props[key];
      }
    });
    // 3、挂载节点
    fiber.parent.dom.appendChild(dom);
  }

  // 4、先序遍历挂载
  let sibling = null;
  props.children.forEach((child, index) => {
    const childFiber = {
      ...child,
      parent: fiber,
      child: null,
      sibling,
      dom: null,
    };
    if (index === 0) {
      fiber.child = childFiber;
    }
    sibling = childFiber;
  });
  if (fiber.child) {
    return fiber.child;
  } else if (fiber.sibling) {
    return sibling;
  } else if (fiber.parent) {
    return fiber.parent.sibling;
  } else {
    return null;
  }
}

export default {
  render,
  createElement,
};
