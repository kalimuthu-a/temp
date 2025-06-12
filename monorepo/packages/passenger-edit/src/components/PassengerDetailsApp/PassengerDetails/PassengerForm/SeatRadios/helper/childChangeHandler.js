import { localStorageKeys } from '../../../../../../constants';
import {
  DOUBLE_SEAT_CODE,
  DOUBLE_SEAT_LABEL,
  NONE_SEAT_CODE,
  TRIPLE_SEAT_CODE,
  TRIPLE_SEAT_LABEL,
} from '../../../../../../constants/constants';
import LocalStorage from '../../../../../../utils/LocalStorage';

const childChangeHandler = (
  {
    val,
    paxKey,
    paxType,
    paxName,
    setInput,
    modifiedSeats,
    setModalProps,
    childExtraSeats,
    childrenExtraDoubleSeat,
    childrenExtraTripleSeat,
    onEveryInputChange,
  },
) => {
  const seats = { ...modifiedSeats };
  const { childDoubleSeats = [], childTripleSeats = [] } = childExtraSeats;
  let selectedChildDoubleSeats = [...childDoubleSeats];
  let selectedChildTripleSeats = [...childTripleSeats];

  if (val === DOUBLE_SEAT_LABEL) {
    if (childrenExtraDoubleSeat === selectedChildDoubleSeats.length) {
      setModalProps({ flag: true, type: DOUBLE_SEAT_CODE, label: DOUBLE_SEAT_LABEL, paxKey, paxName, paxType });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT' };
      selectedChildTripleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedChildTripleSeats.splice(index, 1);
        }
      });
      onEveryInputChange(val);
      selectedChildDoubleSeats.push(selecteSeats);
    }
  }
  if (val === TRIPLE_SEAT_LABEL) {
    if (childrenExtraTripleSeat === selectedChildTripleSeats.length) {
      setModalProps({ flag: true, type: TRIPLE_SEAT_CODE, label: TRIPLE_SEAT_LABEL, paxKey, paxName, paxType });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT2' };
      selectedChildDoubleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedChildDoubleSeats.splice(index, 1);
        }
      });
      selectedChildTripleSeats.push(selecteSeats);
      onEveryInputChange(val);
    }
  }
  if (val === NONE_SEAT_CODE) {
    selectedChildDoubleSeats = selectedChildDoubleSeats.filter((item) => item.paxKey !== paxKey);
    selectedChildTripleSeats = selectedChildTripleSeats.filter((item) => item.paxKey !== paxKey);
  }
  seats.childExtraSeats = {
    childDoubleSeats: selectedChildDoubleSeats,
    childTripleSeats: selectedChildTripleSeats,
  };
  LocalStorage.set(localStorageKeys.ext_pax_keys, seats);
};

const childChangeSeatTagging = (
  data,
  paxKey,
  childExtraSeats,
  selectedPaxInfo,
) => {
  const extraSeats = { childExtraSeats };
  const { childDoubleSeats = [], childTripleSeats = [] } = extraSeats;
  const selectedChildDoubleSeats = [...childDoubleSeats];
  const selectedChildTripleSeats = [...childTripleSeats];

  if (data.label === DOUBLE_SEAT_LABEL) {
    selectedChildDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedChildDoubleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT' };
    selectedChildTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedChildTripleSeats.splice(index, 1);
      }
    });
    selectedChildDoubleSeats.push(selecteSeats);
    extraSeats.childTripleSeats = selectedChildTripleSeats;
    extraSeats.childDoubleSeats = selectedChildDoubleSeats;
  }
  if (data.label === TRIPLE_SEAT_LABEL) {
    selectedChildTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedChildTripleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT2' };
    selectedChildDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedChildDoubleSeats.splice(index, 1);
      }
    });
    selectedChildTripleSeats.push(selecteSeats);
    extraSeats.childTripleSeats = selectedChildTripleSeats;
    extraSeats.childDoubleSeats = selectedChildDoubleSeats;
  }
  return {
    extraSeatPax: extraSeats,
    resetPax: selectedPaxInfo?.paxKey,
  };
};

export { childChangeHandler, childChangeSeatTagging };
