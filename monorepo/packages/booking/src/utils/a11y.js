export const screenLiveAnnouncer = (value) => {
  const elem = document.querySelector('#bw-announcer');

  if (elem) {
    document.querySelector('#bw-announcer').innerText = value;
  }
};

export const keys = {
  keyCodes: {},
};
