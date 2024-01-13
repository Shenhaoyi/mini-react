import ReactDOM from './core/ReactDOM.js';
import React from './core/React.js';

const appVNode = React.createElement('div', { id: 'app' }, 'app');

ReactDOM.createRoot(document.getElementById('root')).render(appVNode);
