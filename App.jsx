import React from './core/React.js';
import { SwitchChild } from './components/SwitchChild.jsx';
import { RemoveChild } from './components/RemoveChild.jsx';

let count = 1;
let props = { id: 'shen' };
function Counter({ num }) {
  const handleClick = () => {
    count += num;
    React.update();
    props = {};
  };
  return (
    <div {...props}>
      count:{count}
      &nbsp;
      <button onClick={handleClick}>+{num}</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      app
      <hr />
      <Counter num={1}></Counter>
      <Counter num={2}></Counter>
      <hr />
      <h1>update children</h1>
      <SwitchChild></SwitchChild>
      <h1>remove children</h1>
      <RemoveChild></RemoveChild>
    </div>
  );
}

export default App;
