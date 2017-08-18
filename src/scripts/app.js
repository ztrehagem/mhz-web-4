const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(()=> {
  const $profile = document.querySelector('.section-profile._js');
  const $btn = $profile.querySelector(':scope > .section-profile-button');
  const $area = $profile.querySelector(':scope > .section-profile-body');
  const btnHeight = $btn.getBoundingClientRect().height;

  let isCollapsed = true;

  $btn.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    const height = $area.getBoundingClientRect().height;
    const targetHeight = isCollapsed ? btnHeight : (btnHeight + height);
    $profile.style.height = `${targetHeight}px`;
    $profile.classList[isCollapsed ? 'remove' : 'add']('opened');
  });
})();

(() => {
  const BodyLocker = new class {
    constructor() {
      this.scrollAmount = 0;
    }
    lock() {
      this.scrollAmount = document.body.scrollTop;
      document.body.style.top = this.scrollAmount;
      document.body.classList.add('-freeze');
    }
    release() {
      document.body.style.top = 0;
      document.body.classList.remove('-freeze');
      document.body.scrollTop = this.scrollAmount;
    }
  };

  class Modal {
    constructor($modalBg) {
      this.$modalBg = $modalBg;
      this.$modal = this.$modalBg.querySelector(':scope > .modal-window');
      this.$closeButtons = this.$modal.querySelectorAll('.close');

      const onClose = () => this.closeWithPushState();
      this.$modalBg.addEventListener('click', onClose);
      Array.from(this.$closeButtons).forEach($button => $button.addEventListener('click', onClose));

      this.$modal.addEventListener('click', event => event.stopPropagation());
    }
    open() {
      Modal.activeModal = this;
      BodyLocker.lock();
      this.$modalBg.style.display = 'block';
      this.$modalBg.style.opacity = 0;
      this.$modalBg.scrollTop = 0;
      wait(10).then(() => this.$modalBg.style.opacity = 1);
    }
    close() {
      Modal.activeModal = null;
      BodyLocker.release();
      this.$modalBg.style.opacity = 0;
      return wait(410).then(() => this.$modalBg.style.display = 'none');
    }
    closeWithPushState() {
      window.history.pushState(null, null, window.location.pathname);
      this.close();
    }
  };

  const $items = document.querySelectorAll('.section-showcase-item._js');

  const modals = Array.from($items).reduce((modals, $item) => {
    const $button = $item.querySelector(':scope > .button');
    const id = $item.getAttribute('id');
    const modal = new Modal($item.querySelector(':scope > .modal-view'));

    $button.addEventListener('click', (event) => {
      event.preventDefault();
      modal.open();
      window.history.pushState(null, null, `#${id}`);
    });

    return Object.assign(modals, {[id]: modal});
  }, {});

  const initFromHash = (id) => {
    (Modal.activeModal ? Modal.activeModal.close() : wait(0)).then(() => {
      modals[id] && modals[id].open();
    });
  };

  window.onpopstate = () => initFromHash(window.location.hash.substring(1));
  initFromHash(window.location.hash.substring(1));
})();
