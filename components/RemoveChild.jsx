/*
  diff:节点删除案例
*/
import React from '../core/React.js';
let shouldRemove = false;
export function RemoveChild() {
  const handleClick = () => {
    shouldRemove = !shouldRemove;
    React.update();
  };
  return (
    <div>
      <div>
        {shouldRemove ? (
          <div>1</div>
        ) : (
          <div>
            1<div>2</div>
            <div>3</div>
          </div>
        )}
      </div>
      <button onClick={handleClick}>{shouldRemove ? 'reset' : 'remove'}</button>
    </div>
  );
}
