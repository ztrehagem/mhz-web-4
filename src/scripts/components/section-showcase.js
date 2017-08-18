import Component from './component';
import SectionShowcaseItem from './section-showcase-item';
import ModalView from './modal-view';

export default class SectionShowcase extends Component {
  constructor($root) {
    super();
    this.$root = $root;
    this.sectionShowcaseItems = SectionShowcaseItem.deploy(this.$root);
    ModalView.setOnPopstateTarget(this.modalViews);
  }

  get modalViews() {
    return this.sectionShowcaseItems.map(item => item.modalView);
  }

  static deploy() {
    const $target = document.querySelector('.section-showcase._js');
    return new SectionShowcase($target);
  }
};
