// write the utility methods related to MF

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import add from 'date-fns/add';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { personaConstant } from 'skyplus-design-system-app/src/constants/analytics';

import { COOKIE_KEYS } from '../constants';

export const emptyFn = () => {
  // Empty Function
};

export const isDayAfterWeek = (date) => {
  return differenceInCalendarDays(date, new Date()) > 7;
};

export const cityFormattedValue = (v, defaultLabel) => {
  return v ? `${v.fullName}, ${v.stationCode}`.substring(0, 12) : defaultLabel;
};

export const triggerClosePopup = () => {
  setTimeout(() => {
    document
      .querySelector('.popover__wrapper.focused')
      ?.querySelector('.icon-circle')
      ?.click();

    document.body.classList.remove('overflow-hidden');
  }, 100);
};

export const isBefore7Days = (value, advancePurchaseDays) => {
  const days = advancePurchaseDays ?? 0;

  return differenceInCalendarDays(value, new Date()) < days;
};

export const getPaxCount = (pax) => parseInt(pax?.Count || 0, 10);

export const getMaxDateForCalendar = () => {
  return add(new Date(), { years: 1 });
};

export const getRoleDetails = () => {
  return (
    Cookies.get(COOKIE_KEYS.ROLE_DETAILS, true) || {
      roleName: 'Anonymous',
      roleCode: 'WWWA',
    }
  );
};

export const isSMEAdmin = () => {
  const roleDetails = getRoleDetails();
  return roleDetails.roleName === personaConstant.PERSONA_CORP_ADMIN;
};

export const isSMEUser = () => {
  const roleDetails = getRoleDetails();
  return roleDetails.roleName === personaConstant.PERSONA_CORP_USER;
};

export function scrollBookingDropdownsIntoView() {
  document.querySelector('.bookingmf-container.homepage')?.scrollIntoView({
    behavior: 'smooth', // Optional: adds a smooth scrolling animation
    block: 'start', // Scrolls to the top of the element
  });
}

export const isMemberAndGuestUser = () => {
  const roleDetails = getRoleDetails();
  return (
    roleDetails.roleName === personaConstant.ANONYMOUS ||
    roleDetails.roleName === personaConstant.PERSONA_MEMBER
  );
};

export function updateMultipleQueryParams(urlString, updates) {
    const url = new URL(urlString);
    const params = url?.searchParams;

    for (const [key, valueToAdd] of Object.entries(updates)) {
      if (params.has(key)) {
        const existingValue = params.get(key);
        // Append new value to existing one, separated by comma
        params.set(key, existingValue + ',' + valueToAdd);
      } else {
        params.set(key, valueToAdd);
      }
    }

    return url.toString();
  };