class Modal {
  constructor(root, opts = {}) {
    if (!root) throw new Error('Modal root is required');
    this.root = root;
    this.dialog = root.querySelector('.modal__dialog');
    this.overlay = root.querySelector('.modal__overlay');
    this.opts = Object.assign({ closeOnOverlay: true, closeOnEsc: true, trapFocus: true }, opts);

    this.isOpen = false;
    this.lastActive = null;
    this.focusables = [];
    this.trapIndex = 0;
    this.scrollLocked = false;
    this.inertApplied = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onFocusTrap = this.onFocusTrap.bind(this);

    this.root.addEventListener('click', this.onClick);
  }
  followLink(el) {
    if (!el) return;
    let url = null;
    let target = '_self';
    if (el instanceof HTMLAnchorElement) {
      url = el.getAttribute('href');
      target = el.getAttribute('target') || '_self';
    } else if (el.dataset && el.dataset.link) {
      url = el.dataset.link;
      target = el.dataset.target || '_self';
    }
    if (!url || url === '#' || url.trim() === '') return;
    if (target === '_self') { window.location.href = url; }
    else { window.open(url, target, 'noopener'); }
  }
  getFocusableElements() {
    const sel = [
      'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
      'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'audio[controls]',
      'video[controls]', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
    ].join(',');
    const nodes = Array.from(this.dialog.querySelectorAll(sel));
    return nodes.filter(el => el.offsetParent !== null || el === document.activeElement);
  }
  open(triggerEl = null) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.lastActive = triggerEl || document.activeElement;
    this.root.hidden = false;
    this.root.setAttribute('data-state', 'open');
    if (!this.scrollLocked) { document.body.style.overflow = 'hidden'; this.scrollLocked = true; }
    const main = document.querySelector('main') || document.body;
    if ('inert' in HTMLElement.prototype) { try { main.inert = true; this.inertApplied = true; } catch(_){} }
    else { main.setAttribute('aria-hidden', 'true'); this.inertApplied = true; }
    this.focusables = this.getFocusableElements();
    const first = this.focusables[0] || this.dialog;
    this.trapIndex = 0;
    document.addEventListener('keydown', this.onKeyDown);
    if (this.opts.trapFocus) document.addEventListener('focus', this.onFocusTrap, true);
    requestAnimationFrame(() => first.focus({ preventScroll: true }));
    this.root.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
    if (triggerEl) this.followLink(triggerEl);
  }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.root.setAttribute('data-state', 'closed');
    if (this.scrollLocked) { document.body.style.overflow = ''; this.scrollLocked = false; }
    const main = document.querySelector('main') || document.body;
    if (this.inertApplied) {
      if ('inert' in HTMLElement.prototype) { try { main.inert = false; } catch(_){} }
      else { main.removeAttribute('aria-hidden'); }
      this.inertApplied = false;
    }
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('focus', this.onFocusTrap, true);
    setTimeout(() => { this.root.hidden = true; }, 20);
    if (this.lastActive && typeof this.lastActive.focus === 'function') this.lastActive.focus({ preventScroll: true });
    this.root.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
  }
  toggle(triggerEl = null) { this.isOpen ? this.close() : this.open(triggerEl); }
  onKeyDown(e) {
    if (e.key === 'Escape' && this.opts.closeOnEsc) { e.preventDefault(); this.close(); return; }
    if (!this.opts.trapFocus || !this.isOpen) return;
    if (e.key === 'Tab') {
      this.focusables = this.getFocusableElements();
      if (this.focusables.length === 0) return;
      const currentIndex = this.focusables.indexOf(document.activeElement);
      let nextIndex = currentIndex;
      if (e.shiftKey) nextIndex = currentIndex <= 0 ? this.focusables.length - 1 : currentIndex - 1;
      else nextIndex = currentIndex === this.focusables.length - 1 ? 0 : currentIndex + 1;
      e.preventDefault();
      this.focusables[nextIndex].focus();
    }
  }
  onFocusTrap(e) {
    if (!this.isOpen) return;
    if (!this.root.contains(e.target)) { (this.focusables[0] || this.dialog).focus(); }
  }
  onClick(e) {
    const t = e.target;
    if (t instanceof HTMLElement) {
      const dismissEl = t.closest('[data-dismiss="modal"]');
      if (dismissEl) { e.preventDefault(); this.close(); this.followLink(dismissEl); return; }
    }
    if (this.opts.closeOnOverlay && t === this.overlay) { this.close(); }
  }
}
(function bootstrapModals(){
  const cache = new Map();
  function getOrCreate(modalEl){ if (!cache.has(modalEl)) cache.set(modalEl, new Modal(modalEl)); return cache.get(modalEl); }
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-modal-target]');
    if (!trigger) return;
    const selector = trigger.getAttribute('data-modal-target');
    const modalEl = selector ? document.querySelector(selector) : null;
    if (!modalEl) return;
    e.preventDefault();
    getOrCreate(modalEl).open(trigger);
  });
})();