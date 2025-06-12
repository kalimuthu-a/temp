import { DOUBLE_LABEL, DOUBLE_SEAT_LABEL, TRIPLE_LABEL, TRIPLE_SEAT_LABEL } from '../constants/constants';

const checkIfAllSeatsTagged = (data = {}, seatWiseSelectedPaxInformation = {}) => {
  const {
    childrenExtraDoubleSeat,
    childrenExtraTripleSeat,
    adultExtraDoubleSeat,
    adultExtraTripleSeat,
    seniorCitizenExtraDoubleSeat,
    seniorCitizenExtraTripleSeat,
  } = seatWiseSelectedPaxInformation;

  const { userFields = [] } = data;
  let allSeatsTagged = true;
  const totalDoubleSeats = childrenExtraDoubleSeat + adultExtraDoubleSeat + seniorCitizenExtraDoubleSeat;
  const totalTripleSeats = childrenExtraTripleSeat + adultExtraTripleSeat + seniorCitizenExtraTripleSeat;
  const allTaggedDoubleSeats = userFields.filter((field) => field.extraSeatTag === DOUBLE_SEAT_LABEL
   || field.extraSeatTag === DOUBLE_LABEL.toUpperCase());
  const allTaggedTripleSeats = userFields.filter((field) => field.extraSeatTag === TRIPLE_SEAT_LABEL
  || field.extraSeatTag === TRIPLE_LABEL.toUpperCase());
  if (allTaggedDoubleSeats.length !== totalDoubleSeats || allTaggedTripleSeats.length !== totalTripleSeats) {
    allSeatsTagged = false;
  }
  return allSeatsTagged;
};

export default checkIfAllSeatsTagged;
