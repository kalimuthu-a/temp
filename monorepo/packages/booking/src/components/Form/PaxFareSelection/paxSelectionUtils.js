import { specialFareCodes } from 'skyplus-design-system-app/dist/des-system/globalConstants';
import { isSMEUser } from '../../../utils';

export const applyPersona = (payload) => {
  const { ADT } = payload;

  if (isSMEUser()) {
    ADT.maxCount = 1;
    ADT.maxExtraDoubleSeat = 1;
    ADT.maxExtraTripleSeat = 1;
    if (ADT.ExtraDoubleSeat === 1) {
      ADT.maxExtraTripleSeat = 0;
    } else if (ADT.ExtraTripleSeat === 1) {
      ADT.maxExtraDoubleSeat = 0;
    }
  }

  return { ...payload, ADT };
};

const applySpecialFare = (payload, specialFareCode) => {
  const { ADT, CHD } = payload;

  if (specialFareCode === specialFareCodes.STU) {
    CHD.maxCount = 0;
  }
  if (specialFareCode === specialFareCodes.UMNR) {
    ADT.maxCount = 0;
    CHD.maxExtraDoubleSeat = 0;
    CHD.maxExtraTripleSeat = 0;
  }
  if (specialFareCode === specialFareCodes.FNF) {
    ADT.minCount = Math.max(4 - CHD.Count, 1);
    CHD.minCount = Math.max(4 - ADT.Count, 0);
  }

  return { ...payload, ADT, CHD };
};

export const paxInfoAfterChangeSeat = ({
  key,
  value,
  paxInfo,
  maxPAxSelectionCount,
  selectedSpecialFare,
}) => {
  let { INFT, ADT, CHD, SRCT } = { ...paxInfo, [key]: value };

  const maxExtraDoubleTripleSeatCalc = (obj) => {
    const { ExtraDoubleSeat, ExtraTripleSeat, Count, maxAllowed } = obj;
    const morphObj = obj;

    morphObj.maxExtraDoubleSeat = Math.min(
      Math.floor(maxAllowed - 3 * ExtraTripleSeat - Count),
      Count - ExtraTripleSeat,
    );
    morphObj.maxExtraTripleSeat = Math.min(
      Math.floor((maxAllowed - 2 * ExtraDoubleSeat - Count) / 2),
      Count - ExtraDoubleSeat,
    );

    return morphObj;
  };

  const totalPaxCount =
    ADT.totalSeatCount + SRCT.totalSeatCount + CHD.totalSeatCount;

  ADT.maxAllowed =
    maxPAxSelectionCount - SRCT.totalSeatCount - CHD.totalSeatCount;
  CHD.maxAllowed =
    maxPAxSelectionCount - ADT.totalSeatCount - SRCT.totalSeatCount;
  SRCT.maxAllowed =
    maxPAxSelectionCount - ADT.totalSeatCount - CHD.totalSeatCount;

  if (key === 'ADT') {
    SRCT.maxCount = maxPAxSelectionCount - totalPaxCount + SRCT.Count;
    CHD.maxCount = maxPAxSelectionCount - totalPaxCount + CHD.Count;
    SRCT = maxExtraDoubleTripleSeatCalc(SRCT);
    CHD = maxExtraDoubleTripleSeatCalc(CHD);
  } else if (key === 'SRCT') {
    ADT.maxCount = maxPAxSelectionCount - totalPaxCount + ADT.Count;
    CHD.maxCount = maxPAxSelectionCount - totalPaxCount + CHD.Count;
    ADT = maxExtraDoubleTripleSeatCalc(ADT);
    CHD = maxExtraDoubleTripleSeatCalc(CHD);
  } else if (key === 'CHD') {
    ADT.maxCount = maxPAxSelectionCount - totalPaxCount + ADT.Count;
    SRCT.maxCount = maxPAxSelectionCount - totalPaxCount + SRCT.Count;
    ADT = maxExtraDoubleTripleSeatCalc(ADT);
    SRCT = maxExtraDoubleTripleSeatCalc(SRCT);
  }

  CHD.maxCount = Math.min(CHD.maxCount, 4);

  if (ADT.Count >= 1 && SRCT.Count >= 1) {
    ADT.minCount = 0;
    SRCT.minCount = 0;
  }

  if (ADT.Count + SRCT.Count === 1) {
    ADT.minCount = ADT.Count > 0 ? 1 : 0;
    SRCT.minCount = SRCT.Count > 0 ? 1 : 0;
  }

  if (['ADT', 'SRCT', 'INFT'].includes(key)) {
    const maxComboCount = Math.min(ADT.Count + SRCT.Count, INFT.maxAllowed);
    INFT = { ...INFT, maxCount: maxComboCount };

    if (INFT.Count > maxComboCount) {
      INFT.Count = maxComboCount;
    }
  }

  const specialFareCode = selectedSpecialFare?.specialFareCode;

  const payload = applySpecialFare({ INFT, ADT, CHD, SRCT }, specialFareCode);
  return applyPersona(payload);
};
