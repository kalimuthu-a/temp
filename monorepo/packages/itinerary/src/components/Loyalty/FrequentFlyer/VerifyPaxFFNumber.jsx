import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import InputField from 'skyplus-design-system-app/dist/des-system/InputField';
import { useSelector } from 'react-redux';
import { getValidateFFN } from '../../../services';

const VerifyPaxFFNumber = ({ passengerKeys, enableFFNumberVerify, ffNumberVerified, index }) => {
  const [formData, setFormData] = useState('');
  const [ffVerifyState, setFfVerifyState] = useState('');
  const { enterFfNumberLabel,
    enterValidFfNumberMessage,
    ffNumberVerifiedMessage } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath.item,
  ) || [];
  const { passengers } = useSelector((state) => state.itinerary?.apiData) || {};
  const paxInfo = passengers?.filter((pax) => passengerKeys?.indexOf(pax.passengerKey) !== -1)?.[0] || '';
  const paxName = `${paxInfo?.name?.first} ${paxInfo?.name?.last}`;
  const paxTitleLabel = { html: 'Passenger {paxNumber}: {paxName}' };
  const debounceTimeout = useRef(null);
  const valiadteFFN = async (ffNumberValue, first, last, paxkey) => {
    const validateFFNResponse = await getValidateFFN(ffNumberValue, first, last);
    const newFfNumberVerified = [...ffNumberVerified];
    if (validateFFNResponse.data.ffnValidate) {
      if (ffNumberVerified?.length !== 0) {
        newFfNumberVerified?.map((ffData) => {
          if (String(ffData?.passengerKey) === String(paxkey)) {
            // eslint-disable-next-line no-param-reassign
            ffData.paxFFNumberVerified = true;
            // eslint-disable-next-line no-param-reassign
            ffData.ffn = ffNumberValue;
          }
          return ffData;
        });
      }
      enableFFNumberVerify(newFfNumberVerified);
      setFfVerifyState('ffNumberVerified');
    } else {
      newFfNumberVerified?.map((ffData) => {
        if (ffData?.passengerKey === paxkey && ffData?.paxFFNumberVerified) {
          // eslint-disable-next-line no-param-reassign
          ffData.paxFFNumberVerified = false;
        }
        return ffData;
      });
      setFfVerifyState('ffNumberFailed');
      enableFFNumberVerify(newFfNumberVerified);
    }
  };
  const checkFFNumberHandler = (ffNumberValue, paxkey) => {
    const currentPax = passengers?.filter((pax) => pax.passengerKey === paxkey)?.[0] || '';
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      valiadteFFN(ffNumberValue, currentPax?.name?.first, currentPax?.name?.last, paxkey);
    }, 500);
  };

  const onChangeFormData = (paxkey, values) => {
    if (Number(values?.length) <= 32) {
      checkFFNumberHandler(values, paxkey);
    } else if (ffVerifyState !== '') {
      setFfVerifyState('');
      if (ffNumberVerified) {
        const newFfNumberVerified = [...ffNumberVerified];
        newFfNumberVerified?.map((ffData) => {
          const newFfData = { ...ffData };
          if (newFfData?.passengerKey === paxkey) {
            newFfData.paxFFNumberVerified = true;
          }
          return newFfData;
        });
        enableFFNumberVerify(newFfNumberVerified);
      }
    }
    setFormData(values);
  };

  const onKeyHandler = (event) => {
    if (event.key === 'Enter') {
      checkFFNumberHandler();
    }
  };
  const inputProps = {
    onKeyPress: onKeyHandler,
  };
  return (
    <div className="frequent-flyer-verify-pax-details">
      <HtmlBlock
        className="frequent-flyer-verify-pax-details-title"
        html={paxTitleLabel?.html?.replace('{paxNumber}', (index + 1)).replace('{paxName}', paxName)}
      />
      <div className="frequent-flyer-verifypax-details-input">
        <InputField
          placeholder={enterFfNumberLabel}
          onChangeHandler={(e) => {
            const { value } = e.target;
            onChangeFormData(paxInfo?.passengerKey, value);
          }}
          value={formData}
          variation="DEFAULT"
          error={enterValidFfNumberMessage}
          customClass="frequent-flyer-verify--field"
          inputProps={inputProps}
          maxLength={32}
          register={() => {}}
          hideLabel={false}
        />
        {ffVerifyState === 'ffNumberFailed' && (
        <span className="common-msg error-msg">
          {enterValidFfNumberMessage}
        </span>
        )}
        {ffVerifyState === 'ffNumberVerified' && (
        <span className="common-msg success-msg">
          <i className="icon-check text-forest-green" />
          {ffNumberVerifiedMessage}
        </span>
        )}
      </div>
    </div>
  );
};
VerifyPaxFFNumber.propTypes = {
  passengerKeys: PropTypes.array.isRequired,
  enableFFNumberVerify: PropTypes.bool.isRequired,
  ffNumberVerified: PropTypes.bool,
  index: PropTypes.number,
};
export default VerifyPaxFFNumber;
