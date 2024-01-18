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

let showBar = true;
function SwitchChild() {
  const Bar = <span>Bar</span>;
  const Foo = function () {
    return <div>Foo</div>;
  };
  const handleClick = () => {
    showBar = !showBar;
    React.update();
  };
  return (
    <div>
      <div>{showBar ? Bar : <Foo></Foo>}</div>
      <button onClick={handleClick}>switch</button>
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
    </div>
  );
}

export default App;
