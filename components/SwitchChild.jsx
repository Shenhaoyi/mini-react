/*
  diff:节点替换案例
*/
import React from '../core/React.js';
let showBar = true;
const Bar = <span>Bar</span>;
const Foo = function () {
  return <div>Foo</div>;
};
export function SwitchChild() {
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
