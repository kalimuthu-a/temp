import { NOMINEE, SELF } from '../constants/constants';

const getNomineeType = (documents) => {
  const documentNumber = documents?.[0]?.number || '';
  const documentNumberArray = documentNumber.split('|');
  if (documentNumberArray?.[0].trim() === NOMINEE) {
    return {
      isSelf: false,
      isNominee: true,
      NomineeId: documentNumberArray?.[1].trim(),
    };
  } if (documentNumberArray?.[0].trim() === SELF) {
    return { isSelf: true, isNominee: false, NomineeId: '' };
  }
  return { isSelf: false, isNominee: false, NomineeId: '' };
};

export default getNomineeType;
