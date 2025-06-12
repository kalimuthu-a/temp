import parse from 'date-fns/parse';
import differenceInYears from 'date-fns/differenceInYears';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import Nominee from './Models/Nominee';

export const requiredValidator = (key, value) => {
  const formValue = value?.trim();
  if (!formValue) {
    return `${key} is required`;
  }
  return '';
};

export const isNomineeValid = (nominee, duplicateNominee) => {
  const data = { isValid: false, errors: {}, isDirty: true };
  const { DOB } = nominee;

  const keys = ['FirstName', 'LastName', 'Gender', 'DOB'];

  keys.forEach((key) => {
    const _error = requiredValidator(key, nominee[key]);
    if (_error) {
      data.errors[key] = _error;
    }
  });

  if (duplicateNominee?.isDuplicateNominee) {
    return data;
  }

  if (Object.keys(data.errors).length > 0) {
    return data;
  }

  try {
    const dobDate = parse(DOB, 'dd-MM-yyyy', new Date());
    const years = differenceInYears(new Date(), dobDate);

    if (years >= 2) {
      return { ...data, isValid: true, errors: {} };
    }
  } catch (error) {
    return { ...data, isValid: false, errors: { DOB: 'Invalid Date' } };
  }

  return data;
};

export const isDuplicateNominee = (nominee, nominees, index) => {
  const loyaltyLoggedInData = Cookies.get('auth_user', true, true);
  const { first, last } = loyaltyLoggedInData?.name || {};

  const loyaltyUserDuplicate = (first?.toLowerCase() === nominee?.FirstName?.toLowerCase()
  && last?.toLowerCase() === nominee?.LastName?.toLowerCase());
  let isLoggedLoyaltyName = false;
  let isNommineeName = false;
  const isDuplicate = nominees?.some((nomineeData, i) => {
    if (
      ((nominee?.FirstName && nomineeData?.FirstName
        && nominee?.FirstName?.toLowerCase() === nomineeData?.FirstName?.toLowerCase()
        && nominee?.LastName && nomineeData?.LastName
        && nominee?.LastName?.toLowerCase() === nomineeData?.LastName?.toLowerCase())
        || loyaltyUserDuplicate)
    && (index !== i)
    && nominee?.isNew
    ) {
      if (loyaltyUserDuplicate) {
        isLoggedLoyaltyName = true;
        isNommineeName = false;
      } else {
        isNommineeName = true;
        isLoggedLoyaltyName = false;
      }
      return true;
    }
  });
  if (isDuplicate) return ({ duplicateNominee: { isDuplicateNominee: true, isLoggedLoyaltyName, isNommineeName } });
  return ({ duplicateNominee: { isDuplicateNominee: false } });
};

export const getUpdatedNominees = (updatedNominees) => {
  return updatedNominees.map((nomin, i) => {
    if (!nomin?.duplicateNominee?.isDuplicateNominee) return nomin;

    const duplicateNomin = isDuplicateNominee(nomin, updatedNominees, i);
    return new Nominee({
      ...nomin,
      ...duplicateNomin,
      ...isNomineeValid(nomin, duplicateNomin?.duplicateNominee),
    });
  });
};
