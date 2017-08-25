import Component from './component';
import * as BodyFreezer from '../modules/body-freezer';
import { wait } from '../utils/promise';

export default class ModalView extends Component {
  constructor($root) {
    super();
    this.$root = $root;
    this.$window = this.$root.querySelector(':scope > .modal-window');
    this.$closeBtns = this.$window.querySelectorAll('.close');
    this.id = this.$root.getAttribute('id');
    this._addEventListeners();
  }

  _addEventListeners() {
    const onClose = () => this.closeWithPushState();
    this.$root.addEventListener('click', onClose);
    Array.from(this.$closeBtns).forEach($btn => $btn.addEventListener('click', onClose));
    this.$window.addEventListener('click', event => event.stopPropagation());
  }

  async open() {
    ModalView.activeModal = this;
    BodyFreezer.freeze();
    this.$root.style.display = 'block';
    this.$root.style.opacity = 0;
    this.$root.scrollTop = 0;
    await wait(10);
    this.$root.style.opacity = 1;
  }

  openWithPushState() {
    history.pushState(null, null, `#${this.id}`);
    this.open();
  }

  async close() {
    ModalView.activeModal = null;
    BodyFreezer.release();
    this.$root.style.opacity = 0;
    await wait(410);
    this.$root.style.display = 'none';
  }

  closeWithPushState() {
    history.pushState(null, null, location.pathname);
    this.close();
  }

  static deploy($element) {
    const $target = $element.querySelector('.modal-view._js');
    return new ModalView($target);
  }

  static async _detectHashWithOpenFrom(modalViews) {
    const id = location.hash.substring(1);
    const target = modalViews.filter(modalView => modalView.id == id)[0];
    if (ModalView.activeModal) await ModalView.activeModal.close();
    if (target) await target.open();
  }

  static setOnPopstateTarget(modalViews) {
    window.addEventListener('popstate', () => ModalView._detectHashWithOpenFrom(modalViews));
    ModalView._detectHashWithOpenFrom(modalViews);
  }
};
