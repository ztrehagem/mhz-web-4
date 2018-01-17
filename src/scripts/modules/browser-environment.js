export const isTouchDevice = 'ontouchstart' in document.documentElement;

export function setClass() {
  if (isTouchDevice) {
    window.document.body.classList.add('_browserenv-touch');
  }
}
