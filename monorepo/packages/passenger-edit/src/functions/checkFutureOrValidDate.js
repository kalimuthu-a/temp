import moment from 'moment';
import { FUTURE_DATE_ERROR_MSG, INVALID_DATE_ERROR_MSG, dateFormats } from '../constants/constants';

const checkFutureOrValidDate = (dob, travelDate) => {
  // Define the date format
  const dateFormat = dateFormats.USER_FRIENDLY_FORMAT;

  // Create a date to check
  const dateToCheck = moment(dob, dateFormat);

  // Check if the date is valid and in the future
  if (!dateToCheck.isValid()) {
    return INVALID_DATE_ERROR_MSG;
  }
  if (dateToCheck.isAfter(moment(travelDate))) {
    return FUTURE_DATE_ERROR_MSG;
  }
  return '';
};

export const isValidAndNotFutureDate = (date) => {
  const format = dateFormats.USER_FRIENDLY_FORMAT;
  if (!moment(date, format, true).isValid()) {
    return false;
  }
  return !moment(date, format).isAfter(moment());
};

// Function to convert date to DD-MM-YYYY format
export const convertToDDMMYYYY = (dateString) => {
  // Define the DD-MM-YYYY format
  const ddmmyyyyFormat = dateFormats.USER_FRIENDLY_FORMAT;

  // Parse the input date string using the specified format
  const date = moment(dateString, [ddmmyyyyFormat, 'YYYY-MM-DDTHH:mm:ss'], true);

  // Check if the date is valid
  if (!date.isValid()) {
    return '';
  }

  // If the input date string is already in DD-MM-YYYY format, return it as is
  if (moment(dateString, ddmmyyyyFormat, true).isValid()) {
    return dateString;
  }

  // Otherwise, format the date to DD-MM-YYYY
  return date.format(ddmmyyyyFormat);
};

export const daysUntilDate = (targetDateStr) => {
  try {
    const targetDate = new Date(targetDateStr);
    const currentDate = new Date();

    // Check if targetDate is a valid date
    if (Number.isNaN(targetDate.getTime())) {
      throw new Error('Invalid date');
    }

    // Calculate the difference in time
    const timeDifference = targetDate - currentDate;

    // Convert time difference from milliseconds to days
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  } catch (error) {
    return '';
  }
};

export const getTimeFromString = (dateTimeStr) => {
  // Parse the date-time string
  const dateTime = moment(dateTimeStr);

  // Format to extract only the hours and minutes
  return dateTime.format('HH:mm');
};

export default checkFutureOrValidDate;
