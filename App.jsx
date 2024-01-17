import React from './core/React.js';

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
      <Counter num={1}></Counter>
      <Counter num={2}></Counter>
    </div>
  );
}

export default App;
