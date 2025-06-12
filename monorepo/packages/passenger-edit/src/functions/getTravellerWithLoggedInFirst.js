import { getDateComponents } from './getDateComponents';
import calculateAge from './calculateAge';
import { isOlderThanDays } from '../helpers';

export const mergedUnique = (travellers) => {
  const keys = [
    'type',
    'title',
    'firstname',
    'lastname',
    'dobDay',
    'dobMonth',
    'dobYear',
  ];
  const uniqueArray = [];
  const map = new Map();

  for (const item of travellers) {
    let normalizedType = '';
    if (item?.type?.toLowerCase() === 'adt' || item?.type?.toLowerCase() === 'adult') {
      normalizedType = 'ADT';
    } else if (item?.type?.toLowerCase() === 'chd' || item?.type?.toLowerCase() === 'child') {
      normalizedType = 'CHD';
    } else {
      normalizedType = item?.type;
    }

    const compositeKey = keys
      .map((key) => (key === 'type' ? normalizedType : item[key]))
      .join('|');

    if (!map.has(compositeKey)) {
      map.set(compositeKey, true);
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
};

export const getTravellerWithLoggedInFirst = ({ loggedInUserData, travellers }) => {
  if (!travellers.length) {
    return [loggedInUserData];
  }
  const uniqueArray = mergedUnique(travellers);
  const travellerIndex = uniqueArray.findIndex((traveller) => {
    const { firstname, lastname, dobDay, dobMonth, dobYear } = traveller;
    return (
      firstname === loggedInUserData.firstname
      && lastname === loggedInUserData.lastname
      && dobDay === loggedInUserData.dobDay
      && dobMonth === loggedInUserData.dobMonth
      && dobYear === loggedInUserData.dobYear
    );
  });

  if (travellerIndex !== -1) {
    uniqueArray.splice(travellerIndex, 1);
    uniqueArray.unshift(loggedInUserData);
  } else {
    uniqueArray.unshift(loggedInUserData);
  }

  return uniqueArray;
};

const getUserType = (dateOfBirth) => {
  const age = calculateAge(dateOfBirth);
  if (isOlderThanDays(dateOfBirth) && age < 2) {
    return 'INFT';
  }
  if (age >= 3 && age < 12) {
    return 'CHD';
  }
  if (age >= 60) {
    return 'SRCT';
  }
  return 'ADT';
};

export const getLoggedInUser = ({ name, details }) => {
  if (!name || !details) {
    return false;
  }
  let user = {};
  const { dob, dom, doy } = getDateComponents(details.dateOfBirth);
  user = {
    firstname: name.first,
    lastname: name.last,
    dobDay: String(dob),
    dobMonth: String(dom),
    dobYear: String(doy),
    type: details.passengerType || getUserType(details.dateOfBirth),
    title: name.title.toLowerCase(),
    isLoggedInUser: true,
  };

  return user;
};
