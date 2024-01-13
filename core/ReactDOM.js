import React from './React.js';

const ReactDOM = {
  createRoot(root) {
    return {
      render: function (app) {
        React.render(app, root);
      },
    };
  },
};
export default ReactDOM;
