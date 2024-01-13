const TEXT_NODE = 'TEXT_NODE';

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

function render(node, container) {
  const { type, props } = node;
  // 1、创建 dom 节点
  const dom = type === TEXT_NODE ? document.createTextNode(props.text) : document.createElement(type);
  // 2、添加属性
  Object.keys(node).forEach((key) => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
  // 3、挂载节点
  container.appendChild(dom);
  // 4、递归挂载子节点
  props.children.forEach((child) => render(child, dom));
}

const appVNode = createElement('div', { id: 'app' }, 'app');

const root = document.getElementById('root');
render(appVNode, root);
