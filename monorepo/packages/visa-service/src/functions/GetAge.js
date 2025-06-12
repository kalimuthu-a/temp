/* eslint-disable import/prefer-default-export */
export const getAge = (dob) => {
  if (!dob) return null;

  try {
    const toDate = new Date();
    const fromDate = new Date(dob);

    const year = [toDate.getFullYear(), fromDate.getFullYear()];
    let yearDiff = year[0] - year[1];
    const month = [toDate.getMonth(), fromDate.getMonth()];
    const monthDiff = month[0] - month[1];
    const _days = [toDate.getDate(), fromDate.getDate()];
    const daysDiff = _days[0] - _days[1];

    if (monthDiff < 0 || (monthDiff === 0 && daysDiff < 0)) {
      // eslint-disable-next-line no-plusplus
      yearDiff--;
    }

    return `${yearDiff} years`;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('log:::Error::getAge--', e);
    return 'Error calculating age';
  }
};
