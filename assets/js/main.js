(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      mobileMenu.classList.toggle('hidden');

    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation menu');
        mobileMenu.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  }
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const dialog = document.querySelector('[data-enquiry-dialog]');
    dialog.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
    contactForm.querySelector('[data-enquiry-submit]').disabled = false;
    contactForm.querySelectorAll('[required]').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      contactForm.querySelectorAll('[required]').forEach(field => field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.'));
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const data = new FormData(contactForm);
      const subject = data.get('subject') || 'Website enquiry';
      const body = [
        `Name: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Company / Organization: ${data.get('company') || ''}`,
        '',
        data.get('message') || ''
      ].join('\n');

      dialog.querySelector('[data-preview-subject]').textContent = subject;
      dialog.querySelector('[data-preview-body]').textContent = body;
      dialog.showModal();
    });
  }
  if (contactForm) {
    const product = new URLSearchParams(location.search).get('product');
    if (product) contactForm.elements.subject.value = 'Product enquiry: ' + product;
  }
  const search = document.querySelector('#product-search');
  const category = document.querySelector('#product-category');
  if (search && category) {
    const cards = [...document.querySelectorAll('[data-product-card]')];
    const filter = () => {
      let count = 0;
      cards.forEach(card => {
        const visible = card.dataset.search.includes(search.value.trim().toLowerCase()) && (!category.value || card.dataset.category === category.value);
        card.hidden = !visible;
        if (visible) count++;
      });
      document.querySelector('#product-count').textContent = count + (count === 1 ? ' product' : ' products');
      document.querySelector('#product-empty').hidden = count !== 0;
    };
    search.addEventListener('input', filter);
    category.addEventListener('change', filter);
  }
})();
