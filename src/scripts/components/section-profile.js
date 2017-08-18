import Component from './component';

const CLASS_OPENED = '-js-opened';

export default class SectionProfile extends Component {
  constructor($root) {
    super();
    this.isCollapsed = true;
    this.$root = $root;
    this.$btn = this.$root.querySelector(':scope > .section-profile-button');
    this.$body = this.$root.querySelector(':scope > .section-profile-body');
    this.btnHeight = this.$btn.getBoundingClientRect().height;
    this._addEventListeners();
  }

  _addEventListeners() {
    this.$btn.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    const rootHeight = this.isCollapsed ? (this.btnHeight) : (this.btnHeight + this.bodyHeight);
    this.$root.style.height = `${rootHeight}px`;
    this.$root.classList[this.isCollapsed ? 'remove' : 'add'](CLASS_OPENED);
  }

  get bodyHeight() {
    return this.$body.getBoundingClientRect().height;
  }

  static deploy() {
    const $target = document.querySelector('.section-profile._js');
    return new SectionProfile($target);
  }
};
