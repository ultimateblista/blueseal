/*
  Blue Seal visual refresh helpers.
  Adds a mobile menu to legacy pages that only have desktop nav markup.
*/

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav, .site-nav');
  if (!nav) return;

  let hamburger = nav.querySelector('.nav-hamburger');
  let mobileMenu = document.querySelector('.nav-mobile, .nav-mobile-menu');

  const createdHamburger = !hamburger;
  const createdMenu = !mobileMenu;

  if (createdHamburger) {
    hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger mobile-only';
    hamburger.type = 'button';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);
  }

  if (createdMenu) {
    const desktopLinks = nav.querySelectorAll('.nav-links a[href]');
    mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile';
    desktopLinks.forEach((link) => {
      const clone = link.cloneNode(true);
      clone.removeAttribute('class');
      mobileMenu.appendChild(clone);
    });
    document.body.appendChild(mobileMenu);
  }

  if (!createdHamburger && !createdMenu) return;

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
});
