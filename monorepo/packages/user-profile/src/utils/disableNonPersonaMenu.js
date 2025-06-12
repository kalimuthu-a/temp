import { scrollToTop } from './utilFunctions';

const disableNonPersonaMenu = (personasType = 'Member') => {
  document.querySelectorAll('[data-persona]').forEach((elem) => {
    const { persona } = elem.dataset;
    const { hash } = window.location;
    if (elem.hash === hash) {
      elem.classList.add('active');
    } else {
      elem.classList.remove('active');
    }
    elem.addEventListener('click', () => {
      scrollToTop(0);
    });
    const { parentNode } = elem;
    if (persona?.toLowerCase() !== personasType?.roleName?.toLowerCase() && parentNode) {
      parentNode.style.display = 'none';
    }
  });
};

export default disableNonPersonaMenu;
