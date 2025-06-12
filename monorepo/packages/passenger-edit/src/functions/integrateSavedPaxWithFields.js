import { FEMALE_GENDER_TYPE, MALE_GENDER_TYPE } from '../constants/constants';
import { getPassengerTypeCode } from '../helpers';

const updateSavedPaxWithFields = (favoritePax, userFields) => {
  const updatedFields = userFields.map((field) => ({
    ...field,
    name: { first: '', middle: '', last: '' },
    gender: '',
    info: { dateOfBirth: '', gender: '' },
    taggedWithFavPax: '',
  }));
  console.log('--savepax::::', userFields, favoritePax);

  if (favoritePax.length) {
    favoritePax.forEach((favPax) => {
      let updateCount = 0;
      updatedFields.forEach((field, index) => {
        const paxTypeCode = getPassengerTypeCode(
          field?.passengerTypeCode,
          field?.discountCode,
          field?.infant,
        );
        const favTravPaxType = favPax?.type?.toLowerCase() === 'adult' ? 'ADT' : favPax?.type;
        if (
          !field?.name?.first
          && !updateCount
          && favPax?.isSelected
          && paxTypeCode === favTravPaxType
        ) {
          if (!updatedFields[index].info) {
            updatedFields[index].info = {};
          }
          updatedFields[index].name = { first: favPax?.firstname, last: favPax?.lastname };
          updatedFields[index].gender = ['MRS', 'MS'].includes(favPax?.title?.toUpperCase())
            ? FEMALE_GENDER_TYPE : MALE_GENDER_TYPE;
          updatedFields[index].info.dateOfBirth = `${favPax?.dobDay}-${favPax?.dobMonth}-${favPax?.dobYear}`;
          updatedFields[index].taggedWithFavPax = {
            paxKey: `${favPax?.firstname}-${index}`,
          };
          updateCount += 1;
        } else if (
          !updateCount
          && field?.taggedWithFavPax?.paxKey
            === `${favPax?.firstname}-${index}`
          && paxTypeCode === favPax?.passengerTypeCode
          && !favPax?.isSelected
        ) {
          updatedFields[index].name = { first: '', last: '' };
          updatedFields[index].gender = '';
          updatedFields[index].info.dateOfBirth = '';
          updatedFields[index].taggedWithFavPax = '';
          updateCount += 1;
        }
      });
    });
  }

  return updatedFields;
};

export default updateSavedPaxWithFields;
