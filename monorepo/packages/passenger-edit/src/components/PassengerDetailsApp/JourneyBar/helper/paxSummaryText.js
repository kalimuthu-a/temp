import { DOUBLE_SEAT_LABEL, PASSENGER_TYPE_NAME, TRIPLE_SEAT_LABEL } from '../../../../constants/constants';

const seatCountText = (doubleCount, tripleCount) => {
  let text = '';
  text += doubleCount ? `${doubleCount} ${DOUBLE_SEAT_LABEL}` : '';
  text += doubleCount && tripleCount ? ' & ' : '';
  text += tripleCount ? `${tripleCount} ${TRIPLE_SEAT_LABEL}` : '';

  return text ? ` (${text}), ` : ', ';
};

const summaryText = (paxCount, paxStr, doubleCount, tripleCount) => {
  return `${paxCount} ${paxStr}${seatCountText(doubleCount, tripleCount)}`;
};

const paxSummary = (seatPaxInfo) => {
  let text = '';
  if (seatPaxInfo?.adultCount) {
    text += summaryText(
      seatPaxInfo?.adultCount,
      PASSENGER_TYPE_NAME.ADULT,
      seatPaxInfo?.adultExtraDoubleSeat,
      seatPaxInfo?.adultExtraTripleSeat,
    );
  }
  if (seatPaxInfo?.seniorCitizenCount) {
    text += summaryText(
      seatPaxInfo?.seniorCitizenCount,
      PASSENGER_TYPE_NAME.SENIOUR,
      seatPaxInfo?.seniorCitizenExtraDoubleSeat,
      seatPaxInfo?.seniorCitizenExtraTripleSeat,
    );
  }
  if (seatPaxInfo?.childrenCount) {
    text += summaryText(
      seatPaxInfo?.childrenCount,
      PASSENGER_TYPE_NAME.CHILD,
      seatPaxInfo?.childrenExtraDoubleSeat,
      seatPaxInfo?.childrenExtraTripleSeat,
    );
  }
  if (seatPaxInfo?.infantCount) {
    text += summaryText(
      seatPaxInfo?.infantCount,
      PASSENGER_TYPE_NAME.INFANT,
    );
  }

  return text.slice(0, -2);
};

export default paxSummary;
