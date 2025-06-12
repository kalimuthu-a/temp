import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { LOYALTY_KEY } from 'skyplus-design-system-app/src/functions/globalConstants';
import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { isSMEUser } from '../utils';

export const paxForStudents = {
  ADT: {
    Count: 1,
    maxCount: 9,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 1,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 1,
    maxAllowed: 9,
    totalSeatCount: 1,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
};

export const paxDefault = {
  ADT: {
    Count: 1,
    maxCount: 9,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 1,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 1,
    maxAllowed: 9,
    totalSeatCount: 1,
  },
  SRCT: {
    Count: 0,
    maxCount: 8,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 9,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 4,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 1,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
};

export const paxForVAXI = {
  ADT: {
    Count: 1,
    maxCount: 9,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 1,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 1,
    maxAllowed: 9,
    totalSeatCount: 0,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 9,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 4,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 1,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
};

export const paxForUMNR = {
  ADT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 1,
    maxCount: 4,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 1,
  },
  INFT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
};

export const paxForLoyltyUMNR = {
  ADT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 4,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
};

export const paxForFNF = {
  ADT: {
    Count: 4,
    maxCount: 9,
    minCount: 4,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 1,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 1,
    maxAllowed: 9,
    totalSeatCount: 4,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 9,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 4,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 4,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
};

export const paxForDFN = {
  ADT: {
    Count: 1,
    maxCount: 9,
    minCount: 1,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 1,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 1,
    maxAllowed: 9,
    totalSeatCount: 1,
  },
  SRCT: {
    Count: 0,
    maxCount: 0,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 0,
    totalSeatCount: 0,
  },
  CHD: {
    Count: 0,
    maxCount: 4,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
  INFT: {
    Count: 0,
    maxCount: 1,
    minCount: 0,
    ExtraDoubleSeat: 0,
    maxExtraDoubleSeat: 0,
    ExtraTripleSeat: 0,
    maxExtraTripleSeat: 0,
    maxAllowed: 4,
    totalSeatCount: 0,
  },
};

export const getPaxTypes = (payload) => {
   const specialFare = payload?.key === LOYALTY_KEY ? payload.data : payload;
  // Right Now Logic For Min Max Count of pax is hrdcoded at UI side
  const {
    // maxSeniorCitizens = 0,
    // maxInfants = 0,
    // maxAdults = 0,
    // maxChildren = 0,
    // minimumPaxSectorBased = 1,
    specialFareCode,
  } = specialFare || {};

  const restrictPassengerForSpecialFare = {
    // ADT: {
    //   maxCount: maxAdults,
    //   maxAllowed: maxAdults,
    //   Count: minimumPaxSectorBased || 1,
    //   minCount: minimumPaxSectorBased || 1,
    //   totalSeatCount: minimumPaxSectorBased || 1,
    // },
    // SRCT: {
    //   maxAllowed: maxSeniorCitizens,
    // },
    // CHD: {
    //   maxAllowed: maxChildren,
    // },
    // INFT: {
    //   maxCount: maxInfants,
    //   maxAllowed: maxInfants,
    // },
  };

  switch (specialFareCode) {
    case specialFareCodes.STU: {
      return merge(paxForStudents, restrictPassengerForSpecialFare);
    }

    case specialFareCodes.UMNR: {
      if (payload?.key === LOYALTY_KEY) {
        return merge(paxForLoyltyUMNR, restrictPassengerForSpecialFare);
      }

      return merge(paxForUMNR, restrictPassengerForSpecialFare);
    }

    case specialFareCodes.FNF: {
      return merge(paxForFNF, restrictPassengerForSpecialFare);
    }

    case specialFareCodes.DFN: {
      return merge(paxForDFN, restrictPassengerForSpecialFare);
    }

    case specialFareCodes.VAXI: {
      return merge(paxForVAXI, restrictPassengerForSpecialFare);
    }

    default: {
      if (isSMEUser()) {
        paxDefault.ADT.maxCount = 1;
        paxDefault.ADT.maxAllowed = 1;
      }
      return cloneDeep(paxDefault);
    }
  }
};

export const defaultCurreny = {
  currencyCode: 'INR',
  currencySymbol: '₹',
};
