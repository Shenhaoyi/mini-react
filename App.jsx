import React from './core/React.js';

function Counter({ num }) {
  const handleClick = () => {
    console.log('+1');
  };
  return (
    <div>
      count:{num}
      &nbsp;
      <button onClick={handleClick}>+1</button>
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
