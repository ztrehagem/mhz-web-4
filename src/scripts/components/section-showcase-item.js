import Component from './component';
import ModalView from './modal-view';

export default class SectionShowcaseItem extends Component {
  constructor($root) {
    super();
    this.$root = $root
    this.$button = this.$root.querySelector(':scope > .button');
    this.modalView = ModalView.deploy(this.$root);
    this._addEventListeners();
  }

  _addEventListeners() {
    this.$button.addEventListener('click', (event) => {
      event.preventDefault();
      this.modalView.openWithPushState();
    });
  }

  static deploy($element) {
    const $targets = $element.querySelectorAll('.section-showcase-item._js');
    return Array.from($targets).map($target => new SectionShowcaseItem($target));
  }
}
