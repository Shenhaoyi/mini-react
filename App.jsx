import React from './core/React.js';
import { SwitchChild } from './components/SwitchChild.jsx';
import { RemoveChild } from './components/RemoveChild.jsx';

let props = { id: 'shen' };
function Counter({ num }) {
  console.log('count');
  const [count, setCount] = React.useState(1);
  const [bar, setBar] = React.useState('bar');
  const handleClick = () => {
    props = {};
    setCount(count + 1);
    setBar((bar) => 'bar');
  };
  React.useEffect(() => {
    console.log('use effect');
  }, [bar]);
  return (
    <div {...props}>
      count:{count}
      &nbsp;
      <hr></hr>
      bar: {bar}
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
      <hr />
      <h1>update children</h1>
      <SwitchChild></SwitchChild>
      <h1>remove children</h1>
      <RemoveChild></RemoveChild>
    </div>
  );
}

export default App;
