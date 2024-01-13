function createTextNode(text) {
  return {
    type: 'TEXT_NODE',
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
      children,
    },
  };
}

const textVNode = createTextNode('app');
const appVNode = createElement('div', { id: 'app' }, textVNode);

const app = document.createElement(appVNode.type);
const root = document.getElementById('root');
root.appendChild(app);
const text = document.createTextNode(textVNode.props.text);
app.appendChild(text);
