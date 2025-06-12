import { differenceInMinutes, format } from 'date-fns';

export const validator = (regEx) => (value) => {
  if (!value) {
    return false; // Always return false for falsy values
  }
  const stringifiedValue = `${value}`;
  return !!regEx.exec(stringifiedValue); // Use exec() method instead
};

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_profile';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    console.log(error);
    return defaultObj;
  }
};

export const replaceCurlyBraces = (template, replacement) => {
  return template?.replace(/{[^}]+}/g, replacement);
};

export const calculateRemainingTime = (boardingTimeUTC) => {
  if (!boardingTimeUTC) return { remainingTime: '0hr 0mins', futureTime: format(new Date(), 'h:mm a') };
  const currentTime = new Date();
  const boardingTime = new Date(boardingTimeUTC); 
  const timeDiffInMinutes = differenceInMinutes(boardingTime, currentTime);
  if (timeDiffInMinutes < 0) {
    return {
      remainingTime: '0hr 0mins',
      futureTime: format(currentTime, 'h:mm a'),
    };
  }
  const hoursLeft = Math.floor(timeDiffInMinutes / 60);
  const minutesLeft = timeDiffInMinutes % 60;
  const formattedFutureTime = format(boardingTime, 'h:mm a');
  const remainingTime = `${hoursLeft}hr ${minutesLeft}mins`;

  return {
    remainingTime,
    futureTime: formattedFutureTime,
  };
};