import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import getAllPaxDetails from '../../../functions/getAllPaxDetails';
import createPaxFields from './PaxFields/PaxFields';
import './PassengerDetails.scss';
import SinglePaxCard from './SinglePaxCard/SinglePaxCard';
import { SRCT_ID, CONSENT_TYPE_YES, CONSET_TYPE_NO, PASSENGER_TYPE } from '../../../constants/constants';
import MinorConsent from './PassengerForm/MinorConsent/MinorConsent';
import { AppContext } from '../../../context/appContext';
import passengerEditActions from '../../../context/actions';
import MinorRadios from './PassengerForm/MinorRadios/MinorRadios';

const PassengerDetails = (props) => {
  const {
    allPaxFields,
    bookingContext,
    triggerOnSubmit,
    originalPassengersData,
    setInputValues,
    ssr,
    infantPrice } = props;
  const {
    state: {
      aemMainData: {
        euCitizenLabel,
      },
      modificationFlow,
      adultMinorConsent,
      adultConsentData,
      getPrivacyPolicyData,
    },
    dispatch,
  } = useContext(AppContext);

  // to show loyalty signup checkbox only for first adult or senior
  let isFirstAdultOrSeniorPassenger = false;
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [allPaxDetails, setAllPaxDetails] = useState({});
  const [fieldValue, setFieldValue] = useState({});
  const [validateThisCard, setValidateThisCard] = useState('');
  const [filledFields, setFilledFields] = useState({});
  const [isMinorSliderOpen, setisMinorSliderOpen] = useState(false);
  let srctIndex = 0;

  const { paxDetails, paxAllPersonalDetails } = allPaxDetails;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const data = getAllPaxDetails(allPaxFields, originalPassengersData);
    setAllPaxDetails(data);
  }, [allPaxFields, validateThisCard]);

  const onMinorRadioChange = (name, value) => {
    dispatch({
      type: passengerEditActions.SET_ADULT_MINOR_CONSENT,
      payload: value,
    });
    if (value === CONSENT_TYPE_YES) {
      setisMinorSliderOpen(true);
    } else {
      dispatch({
        type: passengerEditActions.SET_ADULT_CONSENT_DATA,
        payload: [],
      });
    }
  };

  const checkIfNoAdultMinorSelected = () => {
    return adultConsentData?.length <= 0 || !adultConsentData?.some((x) => x.isSelected === true);
  };

  const onMinorSliderCloseHandler = () => {
    if (checkIfNoAdultMinorSelected()) {
      dispatch({
        type: passengerEditActions.SET_ADULT_MINOR_CONSENT,
        payload: CONSET_TYPE_NO,
      });
    }
    setisMinorSliderOpen(false);
  };

  const onMinorFormSubmitHandler = () => {
    setisMinorSliderOpen(false);
  };

  useEffect(() => {
    let isAdultConsent = CONSET_TYPE_NO;
    if (getPrivacyPolicyData && !getPrivacyPolicyData?.errors) {
      isAdultConsent = getPrivacyPolicyData?.some((x) => x.AdultConsent === true) ? CONSENT_TYPE_YES : CONSET_TYPE_NO;
    }
    if (checkIfNoAdultMinorSelected() || isAdultConsent === CONSENT_TYPE_YES) {
      dispatch({
        type: passengerEditActions.SET_ADULT_MINOR_CONSENT,
        payload: isAdultConsent,
      });
    }
  }, [adultConsentData]);

  const checkValidNameAdult = () => {
    let flag = true;
    const adultUser = paxDetails.filter((x) => x.paxTypeCode === PASSENGER_TYPE.ADULT
      && x.discountCode !== SRCT_ID);
    for (let i = 0; i < adultUser?.length; i += 1) {
      if (adultUser?.[i]?.name?.first?.trim().length < 1
        || adultUser?.[i]?.name?.last?.trim().length < 1) {
        flag = false;
      }
    }
    return flag;
  };

  return (
    <div className="passengers-details-form">
      {paxDetails?.map((paxInfo, index) => {
        const { paxTypeCode, cardIndex, discountCode } = paxInfo;
        if (!isFirstAdultOrSeniorPassenger && !['CHD', 'INFT'].includes(paxTypeCode)) {
          isFirstAdultOrSeniorPassenger = true;
          paxInfo.isFirstAdultOrSeniorPassenger = true;// eslint-disable-line no-param-reassign
        }
        const adultPassengers = paxDetails.filter((x) => x.paxTypeCode === PASSENGER_TYPE.ADULT
          && x.discountCode !== SRCT_ID);
        const isSRCT = discountCode === SRCT_ID;
        const PaxFields = createPaxFields(
          [paxInfo],
          cardIndex,
          srctIndex,
          paxTypeCode,
          discountCode,
          bookingContext,
          paxAllPersonalDetails,
          originalPassengersData[cardIndex],
        );

        if (isSRCT) srctIndex = +1;

        return (
          <>
            <SinglePaxCard
              bookingContext={bookingContext}
              validateThisCard={validateThisCard}
              selectedCardIndex={selectedCardIndex}
              setFilledFields={setFilledFields}
              setSelectedCardIndex={setSelectedCardIndex}
              setValidateThisCard={setValidateThisCard}
              setInputValues={setInputValues}
              filledFields={filledFields}
              triggerOnSubmit={triggerOnSubmit}
              paxInfo={paxInfo}
              cardIndex={cardIndex}
              setFieldValue={setFieldValue}
              fieldValue={fieldValue}
              PaxFields={PaxFields}
              ssr={ssr}
              infantPrice={infantPrice}
              setisMinorSliderOpen={setisMinorSliderOpen}
              minorCheckboxData={adultConsentData}
            />
            {
              (adultPassengers?.length === index + 1) && (
              <div className="px-sm-6 px-md-12">
                <div>
                  {euCitizenLabel}
                </div>
                {PaxFields?.paxMinorRadioData?.map((pax) => {
                  return (
                    <div className="minor-conset-radio">
                      <MinorRadios
                        errors={errors}
                        register={register}
                        cardIndex={cardIndex}
                        disabled={modificationFlow || !checkValidNameAdult()}
                        selectedValue={adultMinorConsent}
                        onEveryInputChange={onMinorRadioChange}
                        {...pax}
                      />
                    </div>
                  );
                })}
                {isMinorSliderOpen && (
                <OffCanvas
                  onClose={() => onMinorSliderCloseHandler()}
                >
                  <MinorConsent
                    paxDetails={paxDetails}
                    onMinorFormSubmitHandler={() => onMinorFormSubmitHandler()}
                    checkboxData={adultConsentData}
                  />
                </OffCanvas>
                )}
              </div>
              )
          }
          </>
        );
      })}
    </div>
  );
};

PassengerDetails.propTypes = {
  allPaxFields: PropTypes.shape([{}]),
  triggerOnSubmit: PropTypes.bool,
  errors: PropTypes.shape({ userFields: [] }),
  bookingContext: PropTypes.shape({ }),
  setInputValues: PropTypes.func,
  originalPassengersData: PropTypes.shape({ }),
  ssr: PropTypes.array,
  infantPrice: PropTypes.any,
};

export default PassengerDetails;
