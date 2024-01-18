export function logFiberChain(fiber) {
  const list = [];
  while (fiber) {
    list.unshift(String(fiber.type).slice(0, 5));
    fiber = fiber.parent;
  }
  console.log(list.join(' -> '));
}

export function compareFiberChain(fiber1, fiber2) {
  logFiberChain(fiber1);
  logFiberChain(fiber2);
  console.log('---------------');
}
