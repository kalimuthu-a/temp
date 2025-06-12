import each from 'lodash/each';

class BaseModel {
  constructor(obj) {
    each(obj, (value, key) => {
      this[key] = value;
    });
  }
}

export default BaseModel;
