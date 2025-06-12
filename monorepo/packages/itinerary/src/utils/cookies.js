const Cookies = {
  // eslint-disable-next-line consistent-return
  get(name = '', parsed = false) {
    const _name = `${name}=`;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      let _cookie = cookie;
      while (_cookie.charAt(0) === ' ') {
        _cookie = _cookie.substring(1, _cookie.length);
      }
      if (_cookie.indexOf(_name) === 0) {
        const result = _cookie.substring(_name.length, _cookie.length);
        if (parsed) {
          return JSON.parse(result);
        }
        return result;
      }
    }
  },
  remove(name) {
    const cookie = Cookies.get(name);
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    return cookie;
  },
  set(name, value, domain, expirationInMs) {
    let expires = '';
    let _domain = '';
    if (expirationInMs) {
      const date = new Date();
      date.setTime(date.getTime() + expirationInMs);
      expires = `; expires=${date.toUTCString()}`;
    }
    if (domain) {
      _domain = `; domain=${domain}`;
    }
    document.cookie = `${name}=${JSON.stringify(
      value,
    )}${expires}${_domain};path=/`;
  },
};

export default Cookies;
