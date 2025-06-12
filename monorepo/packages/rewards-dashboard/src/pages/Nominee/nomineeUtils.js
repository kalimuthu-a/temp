import parse from 'date-fns/parse';
import differenceInYears from 'date-fns/differenceInYears';

export const requiredValidator = (key, value) => {
  const formValue = value?.trim();
  if (!formValue) {
    return `${key} is required`;
  }
  return '';
};

export const isNomineeValid = (nominee) => {
  const data = { isValid: false, errors: {}, isDirty: true };
  const { DOB } = nominee;

  const keys = ['FirstName', 'LastName', 'Gender', 'DOB'];

  keys.forEach((key) => {
    const _error = requiredValidator(key, nominee[key]);
    if (_error) {
      data.errors[key] = _error;
    }
  });

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
