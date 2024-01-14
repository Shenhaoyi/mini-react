const el = document.createElement('div');
document.body.appendChild(el);
let i = 0;
el.textContent = i;
const taskSize = 100000;

function run() {
  if (i > taskSize) return;
  requestIdleCallback((IdleDeadline) => {
    while (IdleDeadline.timeRemaining() > 0 && i < taskSize) {
      i++;
      el.textContent = i;
    }
    run();
  });
}

run();
