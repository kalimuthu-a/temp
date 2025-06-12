import { MONTH_NAMES } from '../../../constants';

const convertZuluToFormattedDate = (date, isUtcRequired) => {
  const dateOut = new Date(date);
  try {
    const dd = isUtcRequired ? dateOut.getUTCDate() : dateOut.getDate();
    const mmIndex = isUtcRequired ? dateOut.getUTCMonth() : dateOut.getMonth();
    const yyyy = isUtcRequired
      ? dateOut.getUTCFullYear()
      : dateOut.getFullYear();
    let timehh = isUtcRequired ? dateOut.getUTCHours() : dateOut.getHours();
    const timemm = isUtcRequired
      ? dateOut.getUTCMinutes()
      : dateOut.getMinutes();
    // const timesec = isUtcRequired
    //   ? dateOut.getUTCSeconds()
    //   : dateOut.getSeconds();
    const tt = timehh >= 12 ? 'PM' : 'AM';
    timehh = timehh % 12 || 12;
    const mm = MONTH_NAMES[mmIndex];
    return `${dd.toString().padStart(2, '0')} ${mm} ${yyyy} 
    ${timehh.toString().padStart(2, '0')}:${timemm
  .toString()
  .padStart(2, '0')} ${tt}`;
  } catch (error) {
    return '';
  }
};
export default convertZuluToFormattedDate;
