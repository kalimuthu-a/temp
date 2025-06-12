export const keyCodes = {
  enter: 13,
  space: 32,
  end: 35,
  home: 36,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  delete: 46,
  escape: 27,
  tab: 9,
};

export const key = {
  enter: 'Enter',
  space: 'Space',
  tab: 'Tab',
};

export const screenLiveAnnouncer = (value) => {
  const elem = document.querySelector('#srp-announcer');

  if (elem) {
    elem.innerText = value;
  }
};
