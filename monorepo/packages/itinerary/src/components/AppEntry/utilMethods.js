// eslint-disable-next-line import/prefer-default-export
export const getFareConfigObjByProductClass = (fareConfig = [], productClass = '') => {
  let obj = {};
  try {
    fareConfig.forEach((item) => {
      if (item.productClass === productClass) {
        obj = item;
      }
    });
    return obj;
  } catch (error) {
    return {};
  }
};
