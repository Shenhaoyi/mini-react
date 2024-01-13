const textVNode = {
  type: 'TEXT_NODE',
  props: {
    text: 'app',
    children: [],
  },
};

const appVNode = {
  type: 'div',
  props: {
    id: 'app',
    children: [textVNode],
  },
};

const app = document.createElement(appVNode.type);
const root = document.getElementById('root');
root.appendChild(app);
const text = document.createTextNode(textVNode.props.text);
app.appendChild(text);
