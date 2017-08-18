const CLASS_FREEZE = '-js-freeze';

export function freeze() {
  document.body.classList.add(CLASS_FREEZE);
}

export function release() {
  document.body.classList.remove(CLASS_FREEZE);
}
