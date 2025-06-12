import { localStorageKeys } from '../../../../../../constants';
import {
  DOUBLE_SEAT_CODE,
  DOUBLE_SEAT_LABEL,
  NONE_SEAT_CODE,
  TRIPLE_SEAT_CODE,
  TRIPLE_SEAT_LABEL,
} from '../../../../../../constants/constants';
import LocalStorage from '../../../../../../utils/LocalStorage';

const adultChangeHandler = (
  {
    val,
    paxKey,
    paxType,
    paxName,
    setInput,
    modifiedSeats,
    setModalProps,
    adultExtraSeats,
    adultExtraDoubleSeat,
    adultExtraTripleSeat,
    onEveryInputChange,
  },
) => {
  const seats = { ...modifiedSeats };
  const { adultDoubleSeats = [], adultTripleSeats = [] } = adultExtraSeats;
  let selectedAdultDoubleSeats = [...adultDoubleSeats];
  let selectedAdultTripleSeats = [...adultTripleSeats];

  if (val === DOUBLE_SEAT_LABEL) {
    if (adultExtraDoubleSeat === selectedAdultDoubleSeats.length) {
      setModalProps({
        flag: true, type: DOUBLE_SEAT_CODE, label: DOUBLE_SEAT_LABEL, paxKey, paxName, paxType,
      });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT' };
      selectedAdultTripleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedAdultTripleSeats.splice(index, 1);
        }
      });
      selectedAdultDoubleSeats.push(selecteSeats);
      onEveryInputChange(val);
    }
  }
  if (val === TRIPLE_SEAT_LABEL) {
    if (adultExtraTripleSeat === selectedAdultTripleSeats.length) {
      setModalProps({
        flag: true, type: TRIPLE_SEAT_CODE, label: TRIPLE_SEAT_LABEL, paxKey, paxName, paxType,
      });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT2' };
      selectedAdultDoubleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedAdultDoubleSeats.splice(index, 1);
        }
      });
      selectedAdultTripleSeats.push(selecteSeats);
      onEveryInputChange(val);
    }
  }
  if (val === NONE_SEAT_CODE) {
    selectedAdultDoubleSeats = selectedAdultDoubleSeats.filter((item) => item.paxKey !== paxKey);
    selectedAdultTripleSeats = selectedAdultTripleSeats.filter((item) => item.paxKey !== paxKey);
  }
  seats.adultExtraSeats = {
    adultDoubleSeats: selectedAdultDoubleSeats,
    adultTripleSeats: selectedAdultTripleSeats,
  };
  LocalStorage.set(localStorageKeys.ext_pax_keys, seats);
};

const adultChangeSeatTagging = (
  data,
  paxKey,
  adultExtraSeats,
  selectedPaxInfo,
) => {
  const extraSeats = { ...adultExtraSeats };
  const { adultDoubleSeats = [], adultTripleSeats = [] } = extraSeats;
  const selectedAdultDoubleSeats = [...adultDoubleSeats];
  const selectedAdultTripleSeats = [...adultTripleSeats];

  if (data.label === DOUBLE_SEAT_LABEL) {
    selectedAdultDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedAdultDoubleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT' };
    selectedAdultTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedAdultTripleSeats.splice(index, 1);
      }
    });
    selectedAdultDoubleSeats.push(selecteSeats);
    extraSeats.adultTripleSeats = selectedAdultTripleSeats;
    extraSeats.adultDoubleSeats = selectedAdultDoubleSeats;
  }
  if (data.label === TRIPLE_SEAT_LABEL) {
    selectedAdultTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedAdultTripleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT2' };
    selectedAdultDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedAdultDoubleSeats.splice(index, 1);
      }
    });
    selectedAdultTripleSeats.push(selecteSeats);
    extraSeats.adultTripleSeats = selectedAdultTripleSeats;
    extraSeats.adultDoubleSeats = selectedAdultDoubleSeats;
  }
  return {
    extraSeatPax: extraSeats,
    resetPax: selectedPaxInfo?.paxKey,
  };
};

export { adultChangeHandler, adultChangeSeatTagging };
