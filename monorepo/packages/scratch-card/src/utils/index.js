/* eslint-disable no-console */
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { getErrorMsgForCode } from 'skyplus-design-system-app/src/functions/errorHandling';
import BROWSER_STORAGE_KEYS from '../constants';

/* eslint-disable consistent-return */

export const getEnvObj = () => {
  const defaultObj = {};
  const envKey = '_env_scratch_card';
  try {
    return window[envKey] || defaultObj;
  } catch (error) {
    console.error(error, '8299500600');
  }
};
export const getSessionToken = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.TOKEN, true);
    return tokenObj.token || '';
  } catch (error) {
    console.error(error, '8299500600');
  }
};
export const getSessionUserScratchCard = () => {
  try {
    const tokenObj = Cookies.get(BROWSER_STORAGE_KEYS.ROLE_DETAILS, true);
    return tokenObj || '';
  } catch (error) {
    return error;
  }
};
export const getSessionUser = () => {
  try {
    const authuser = Cookies.get(BROWSER_STORAGE_KEYS.USER, true, true);
    if (authuser) {
      authuser.mobileNumber = authuser?.mobileNumber?.replace(/[^0-9]/g, '');
    }
    return authuser.mobileNumber || '';
  } catch (error) {
    console.error(error, '8299500600');
  }
};

export const mapDataWithOfferId = (data, brandIds, ...offerIds) => {
  if (!data || !data.partnersBrand || !brandIds || !offerIds) {
    return [];
  }

  const mappedData = [];

  brandIds.forEach((brandId) => {
    const filteredBrands = data?.partnersBrand?.filter((brand) => Number(brand.partnerId) === Number(brandId));

    filteredBrands.forEach((brand) => {
      brand?.brandOffers?.forEach((offer) => {
        const offerid = Number(offer.offerid);

        if (offerIds.includes(offerid)) {
          mappedData.push({
            ...offer,
            partnerId: brand.partnerId,
            partnerName: brand.partnerName,
            unscratchedImage: brand?.defaultUnscratchedImage?._path,
            confettiPath: brand.confettiPath,
          });
        }
      });
    });
  });

  return mappedData;
};

export const mergeStatusIntoOffers = (offers, statuses) => {
  if (!offers || !statuses) {
    return [];
  }
  const offerIds = offers.map((item) => item.offerid);
  const filteredArray = statuses.filter((item) => offerIds.includes(item.offer_id.toString()));
  return filteredArray.map((filteredItem) => {
    const correspondingFirstItem = offers.find((firstItem) => firstItem.offerid === filteredItem.offer_id.toString());

    if (correspondingFirstItem) {
      return {
        ...filteredItem,
        ...correspondingFirstItem,
      };
    }
    return filteredItem;
  });
};

export const hideConfetti = (setShowConfettiFunc, delay = 4000) => {
  setTimeout(() => {
    setShowConfettiFunc(false);
  }, delay);
};

// function to catch errors for data dog
export const ddRumErrorPayload = (payload, errorData) => {
  let errorMessage = '';
  let errorCode = '';
  const errorPayload = payload;

  if (Array.isArray(errorData) && errorData.length > 0) {
    errorMessage = errorData[0]?.message;
    errorCode = errorData[0]?.code;
  } else {
    errorMessage = errorData?.message;
    errorCode = errorData?.code;
  }
  const errorCatch = errorCode && getErrorMsgForCode(errorCode);
  errorPayload.error = errorData;
  errorPayload.errorMessageForUser = errorCatch?.message || errorMessage;
  errorPayload.errorMessage = errorMessage;
  errorPayload.errorCode = errorCode;

  return errorPayload;
};
