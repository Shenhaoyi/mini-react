import React from './core/React.js';

function Counter({ num }) {
  return <div>count:{num}</div>;
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
