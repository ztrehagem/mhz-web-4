import Component from './component';
import { smoothScrollTo } from 'smoothscroll-module';

export default class ScrollButton extends Component {
  constructor($root) {
    super();

    this.$root = $root;
    const targetQuery = this.$root.getAttribute('data-target');
    this.$target = document.querySelector(targetQuery);

    this.$root.addEventListener('click', ()=> this.onClick());
  }

  onClick() {
    smoothScrollTo(this.$target, 400);
  }

  static deploy() {
    const $targets = document.querySelectorAll('.scroll-button');
    return Array.from($targets).map($target => new ScrollButton($target));
  }
}
