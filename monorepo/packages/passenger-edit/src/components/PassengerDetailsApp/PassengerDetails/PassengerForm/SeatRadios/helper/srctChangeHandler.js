import { localStorageKeys } from '../../../../../../constants';
import {
  DOUBLE_SEAT_CODE,
  DOUBLE_SEAT_LABEL,
  NONE_SEAT_CODE,
  TRIPLE_SEAT_CODE,
  TRIPLE_SEAT_LABEL,
} from '../../../../../../constants/constants';
import LocalStorage from '../../../../../../utils/LocalStorage';

const srctChangeHandler = (
  {
    val,
    paxKey,
    paxType,
    paxName,
    setInput,
    modifiedSeats,
    setModalProps,
    srctExtraSeats,
    seniorCitizenExtraDoubleSeat,
    seniorCitizenExtraTripleSeat,
    onEveryInputChange,
  },
) => {
  const seats = { ...modifiedSeats };
  const { srctDoubleSeats = [], srctTripleSeats = [] } = srctExtraSeats;
  let selectedSrctDoubleSeats = [...srctDoubleSeats];
  let selectedSrctTripleSeats = [...srctTripleSeats];

  if (val === DOUBLE_SEAT_LABEL) {
    if (seniorCitizenExtraDoubleSeat === selectedSrctDoubleSeats.length) {
      setModalProps({ flag: true, type: DOUBLE_SEAT_CODE, label: DOUBLE_SEAT_LABEL, paxKey, paxName, paxType });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT' };
      selectedSrctTripleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedSrctTripleSeats.splice(index, 1);
        }
      });
      onEveryInputChange(val);
      selectedSrctDoubleSeats.push(selecteSeats);
    }
  }
  if (val === TRIPLE_SEAT_LABEL) {
    if (seniorCitizenExtraTripleSeat === selectedSrctTripleSeats.length) {
      setModalProps({ flag: true, type: TRIPLE_SEAT_CODE, label: TRIPLE_SEAT_LABEL, paxKey, paxName, paxType });
    } else {
      setInput(val);
      const selecteSeats = { key: val, paxKey, keyCode: 'EXT2' };
      selectedSrctDoubleSeats.forEach((seat, index) => {
        if (seat.paxKey === paxKey) {
          selectedSrctDoubleSeats.splice(index, 1);
        }
      });
      onEveryInputChange(val);
      selectedSrctTripleSeats.push(selecteSeats);
    }
  }
  if (val === NONE_SEAT_CODE) {
    selectedSrctDoubleSeats = selectedSrctDoubleSeats.filter((item) => item.paxKey !== paxKey);
    selectedSrctTripleSeats = selectedSrctTripleSeats.filter((item) => item.paxKey !== paxKey);
  }
  seats.srctExtraSeats = {
    srctDoubleSeats: selectedSrctDoubleSeats,
    srctTripleSeats: selectedSrctTripleSeats,
  };
  LocalStorage.set(localStorageKeys.ext_pax_keys, seats);
};

const srctChangeSeatTagging = (
  data,
  paxKey,
  srctExtraSeats,
  selectedPaxInfo,
) => {
  const extraSeats = { ...srctExtraSeats };
  const { srctDoubleSeats = [], srctTripleSeats = [] } = extraSeats;
  const selectedSrctDoubleSeats = [...srctDoubleSeats];
  const selectedSrctTripleSeats = [...srctTripleSeats];

  if (data.label === DOUBLE_SEAT_LABEL) {
    selectedSrctDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedSrctDoubleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT' };
    selectedSrctTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedSrctTripleSeats.splice(index, 1);
      }
    });
    selectedSrctDoubleSeats.push(selecteSeats);
    extraSeats.srctTripleSeats = selectedSrctTripleSeats;
    extraSeats.srctDoubleSeats = selectedSrctDoubleSeats;
  }
  if (data.label === TRIPLE_SEAT_LABEL) {
    selectedSrctTripleSeats.forEach((seat, index) => {
      if (seat.paxKey === selectedPaxInfo.paxKey) {
        selectedSrctTripleSeats.splice(index, 1);
      }
    });
    const selecteSeats = { key: data.label, paxKey, keyCode: 'EXT2' };
    selectedSrctDoubleSeats.forEach((seat, index) => {
      if (seat.paxKey === paxKey) {
        selectedSrctDoubleSeats.splice(index, 1);
      }
    });
    selectedSrctTripleSeats.push(selecteSeats);
    extraSeats.srctTripleSeats = selectedSrctTripleSeats;
    extraSeats.srctDoubleSeats = selectedSrctDoubleSeats;
  }
  return {
    extraSeatPax: extraSeats,
    resetPax: selectedPaxInfo?.paxKey,
  };
};

export { srctChangeHandler, srctChangeSeatTagging };
