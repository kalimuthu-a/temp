import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import LocalStorage from '../../../../../../utils/LocalStorage';
import { localStorageKeys } from '../../../../../../constants';
import SeatTaggingChangeModal from '../../SeatTaggingChangeModal/SeatTaggingChangeModal';
import { adultChangeHandler, adultChangeSeatTagging } from '../helper/adultChangeHandler';
import { srctChangeHandler, srctChangeSeatTagging } from '../helper/srctChangeHandler';
import { childChangeHandler, childChangeSeatTagging } from '../helper/childChangeHandler';
import { AppContext } from '../../../../../../context/appContext';
import { NONE_SEAT_CODE } from '../../../../../../constants/constants';

const RadioInput = (props) => {
  const {
    name,
    item,
    paxKey,
    paxName,
    paxType,
    disabled,
    fieldValue,
    paxAllData,
    selectedValue,
    setFieldValue,
    isSRCTPaxType,
    isAdultPaxType,
    isChildPaxType,
    onEveryInputChange,
  } = props;

  const { state: {
    passengers,
    bookingContext: {
      seatWiseSelectedPaxInformation: {
        childrenExtraDoubleSeat,
        childrenExtraTripleSeat,
        adultExtraDoubleSeat,
        adultExtraTripleSeat,
        seniorCitizenExtraDoubleSeat,
        seniorCitizenExtraTripleSeat,
      },
    },
    modificationFlow,
  } } = useContext(AppContext);

  const prevSelectedSeats = [];
  const [selectedPax, setSelectedPax] = useState({});
  const [modalProps, setModalProps] = useState({ flag: false, type: '', paxName: '', paxType: '' });
  const extraSeatsLocalStoreage = LocalStorage.getAsJson(localStorageKeys.ext_pax_keys);
  const allPrevSeats = paxAllData?.filter((pax) => pax.paxKey !== paxKey);
  const { adultExtraSeats = {}, srctExtraSeats = {}, childExtraSeats = {} } = extraSeatsLocalStoreage || {};

  if (modalProps?.flag) {
    Object.values(fieldValue)?.forEach(
      (seat) => {
        if (seat?.value === modalProps?.label && seat?.paxType === modalProps?.paxType) {
          const selectedSeats = allPrevSeats?.filter((pax) => seat?.key === pax?.paxKey);
          if (selectedSeats?.length) {
            prevSelectedSeats.push(selectedSeats[0]);
          }
        }
      },
    );
  }

  const selectedPaxInfo = allPrevSeats?.filter((pax) => selectedPax?.[pax?.paxKey]?.isChecked)?.[0];
  const onDismiss = () => {
    setModalProps({ flag: false, type: '' });
    setFieldValue(fieldValue);
  };
  const setInput = (val, resetPax) => {
    const fieldData = { ...fieldValue };
    fieldData[paxKey] = { value: val, paxType, key: paxKey };
    if (selectedPaxInfo?.paxKey) delete fieldData[selectedPaxInfo.paxKey];
    if (resetPax) {
      const resetPaxIndex = passengers.findIndex((pax) => pax.passengerKey === resetPax);
      fieldData[resetPax] = { value: '', paxType, key: resetPax };
      onEveryInputChange(`userFields.${resetPaxIndex}.extraSeatTag`, '');
    }
    setFieldValue(fieldData);
    onEveryInputChange(name, val);
  };

  const changeSeatTagging = (data) => {
    const modifiedSeats = { ...extraSeatsLocalStoreage };
    let resetPax = '';
    if (isAdultPaxType) {
      const extraSeats = adultChangeSeatTagging(
        data,
        paxKey,
        adultExtraSeats,
        selectedPaxInfo,
      );
      resetPax = extraSeats.resetPax;
      modifiedSeats.adultExtraSeats = { ...extraSeats.extraSeatPax };
    }
    if (isSRCTPaxType) {
      const extraSeats = srctChangeSeatTagging(
        data,
        paxKey,
        srctExtraSeats,
        selectedPaxInfo,
      );
      resetPax = extraSeats.resetPax;
      modifiedSeats.srctExtraSeats = { ...extraSeats.extraSeatPax };
    }
    if (isChildPaxType) {
      const extraSeats = childChangeSeatTagging(
        data,
        paxKey,
        childExtraSeats,
        selectedPaxInfo,
      );
      resetPax = extraSeats.resetPax;
      modifiedSeats.childExtraSeats = { ...extraSeats.extraSeatPax };
    }

    LocalStorage.set(localStorageKeys.ext_pax_keys, modifiedSeats);

    setInput(data.label, resetPax);
    setModalProps({ flag: false, type: '' });
  };

  const onChangeHandler = (e) => {
    const val = e.target.value;
    const modifiedSeats = { ...extraSeatsLocalStoreage };
    if (val === NONE_SEAT_CODE) {
      setInput(val);
    }
    if (isAdultPaxType) {
      adultChangeHandler(
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
      );
    }
    if (isSRCTPaxType) {
      srctChangeHandler(
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
      );
    }
    if (isChildPaxType) {
      childChangeHandler(
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
      );
    }
  };

  useEffect(() => {
    if (selectedValue?.[paxKey]?.value && !modificationFlow) {
      onChangeHandler({ target: { value: selectedValue[paxKey].value } });
    }
  }, [selectedValue]);

  const isDisabled = disabled || item.disabled;
  const disabledClass = isDisabled ? 'radio-disabled' : '';
  const isChecked = fieldValue?.[paxKey]?.value === item?.value;
  const isCheckedClass = isChecked ? 'radio-checked' : '';
  return (
    <div className={`d-flex flex-wrap align-items-center ms-8 ${disabledClass} ${isCheckedClass}`}>
      <input
        id={name}
        name={name}
        type="radio"
        value={item.value}
        checked={isChecked}
        disabled={isDisabled}
        className="custom-radio-btn"
        onChange={(e) => onChangeHandler(e)}
      />
      <label
        htmlFor={name}
        className="custom-radio-label body-small-medium"
      >
        {item.label}
      </label>
      {modalProps.flag && prevSelectedSeats?.length && !modificationFlow ? (
        <ModalComponent modalContentClass="mx-8">
          <SeatTaggingChangeModal
            seatLabel={modalProps.label}
            seatType={modalProps.type}
            paxKey={modalProps.paxKey}
            paxName={modalProps.paxName}
            selectedPax={selectedPax}
            setSelectedPax={setSelectedPax}
            allPrevSeats={prevSelectedSeats}
            seatTaggingChangeModalHandler={() => changeSeatTagging(modalProps)}
            onToggleModal={() => onDismiss()}
          />
        </ModalComponent>
      ) : null}
    </div>
  );
};

RadioInput.propTypes = {
  item: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,

  }),
  name: PropTypes.string,
  paxType: PropTypes.string,
  paxName: PropTypes.string,
  disabled: PropTypes.bool,
  fieldValue: PropTypes.shape({}),
  setFieldValue: PropTypes.func,
  paxKey: PropTypes.string,
  paxAllData: PropTypes.arrayOf(PropTypes.shape({})),
  selectedValue: PropTypes.shape({}),
  isSRCTPaxType: PropTypes.bool,
  isAdultPaxType: PropTypes.bool,
  isChildPaxType: PropTypes.bool,
  onEveryInputChange: PropTypes.func,

};

export default RadioInput;
