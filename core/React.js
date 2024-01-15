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

function initChildren(fiber) {
  let lastChild = null;
  fiber.props.children.forEach((child, index) => {
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

function performUnitOfFiber(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber));
    updateProps(fiber);
    fiber.parent.dom.appendChild(dom);
  }

  initChildren(fiber);

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
