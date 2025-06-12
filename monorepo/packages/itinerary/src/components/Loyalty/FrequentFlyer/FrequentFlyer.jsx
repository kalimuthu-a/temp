import React, { useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import BookingInfo from '../../BookingInfo/BookingInfo';
import VerifyPaxFFNumber from './VerifyPaxFFNumber';

import './FrequentFlyer.scss';
import { CONSTANTS } from '../../../constants';

const FrequentFlyer = ({ onClose, handleUpdateFfn, setFfNumberVerifiedObject }) => {
  const [selectedPaxFF, setSelectedPaxFF] = useState([]);
  const [proceedToFFVerify, setProceedToFFVerify] = useState(false);
  const [ffNumberVerified, setFfNumberVerified] = useState([]);
  const { proceedLabel,
    submitFfnButtonLabel,
    enrollMeNowCtaLabel,
    editOrUpdateFfNumber,
    verifyYourFfNumberLabel,
    doItLaterCtaLabel,
    passengerLabel } = useSelector(
    (state) => state.itinerary?.mfAdditionalDatav2?.itineraryAdditionalByPath.item,
  ) || [];

  const mfBookingData = useSelector(
    (state) => state.itinerary?.mfDatav2?.itineraryMainByPath.item,
  ) || [];
  const { passengers, bookingDetails, journeyDetails } = useSelector((state) => state.itinerary?.apiData) || {};

  const onSelectCheckBox = (selectedPaxKey = '') => {
    const selectPaxKeyArr = [...selectedPaxFF];
    if (selectedPaxFF?.indexOf(selectedPaxKey) === -1) {
      selectPaxKeyArr.push(selectedPaxKey);
      setSelectedPaxFF(selectPaxKeyArr);
    }
    if (selectedPaxFF?.indexOf(selectedPaxKey) !== -1) {
      const newSelectPaxKeyArr = selectPaxKeyArr?.filter((paxNumber) => paxNumber !== selectedPaxKey);
      setSelectedPaxFF(newSelectPaxKeyArr);
    }
  };
  const handleFFVerifyButtonClick = () => {
    setProceedToFFVerify(true);
    handleUpdateFfn();
    onClose();
  };
  const handleEnrollMeNowClick = () => {
    const toggleLoginPopupEvent = (config) => new CustomEvent(CONSTANTS.TOGGLE_LOGIN_POPUP_EVENT, config);
    document.dispatchEvent(
      toggleLoginPopupEvent({ bubbles: true, detail: CONSTANTS.LOGIN_POPUP }),
    );
  };

  const handleDoItLater = () => {
    onClose();
  };
  const handleFfNumberVerifyObject = (object) => {
    setFfNumberVerified(object);
    setFfNumberVerifiedObject(object);
  };

  const renderBookingInfo = () => {
    return (
      <BookingInfo
        mfData={mfBookingData}
        bookingDetails={bookingDetails}
        journeyDetail={journeyDetails}
        passengerDetails={passengers}
        isCancelFlight
      />
    );
  };
  const renderButton = () => {
    const buttonProps = {
      disabled: false,
    };
    buttonProps.disabled = !selectedPaxFF.length;
    return (
      <Button
        color="primary"
        size="small"
        {...buttonProps}
        onClick={() => setProceedToFFVerify(true)}
      >
        {proceedLabel}
      </Button>
    );
  };
  const renderFFVerifyButton = () => {
    const buttonProps = {
      disabled: false,
    };
    const ffNumberVerifiedStatus = ffNumberVerified?.map(
      (ffNumber) => ffNumber?.paxFFNumberVerified === true,
    )?.every((t) => t === true);
    buttonProps.disabled = !ffNumberVerifiedStatus;
    return (
      <Button
        color="primary"
        size="small"
        {...buttonProps}
        onClick={handleFFVerifyButtonClick}
      >
        {submitFfnButtonLabel || 'Submit'}
      </Button>
    );
  };

  const renderEnrollMeNowButton = () => {
    const authUser = Cookies.get(CONSTANTS.BROWSER_STORAGE_KEYS.AUTH_USER, true, true);
    const isLoggedInLoyaltyUser = authUser?.loyaltyMemberInfo?.FFN;
    if (isLoggedInLoyaltyUser) {
      return null;
    }

    return (
      <>
        <Button
          color="primary"
          size="small"
          onClick={handleEnrollMeNowClick}
        >
          {enrollMeNowCtaLabel}
        </Button>
        <Button
          variant="link"
          onClick={handleDoItLater}
        >{doItLaterCtaLabel}
        </Button>
      </>

    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase();
  };
  useEffect(() => {
    if (passengers?.length > 0) {
      const ffNumberVerifiedArr = [];
      passengers.map(((paxInfo) => {
        if (selectedPaxFF.indexOf(paxInfo.passengerKey) > -1) {
          ffNumberVerifiedArr?.push({
            passengerKey: paxInfo?.passengerKey,
            paxFFNumberVerified: false,
            title: paxInfo?.name?.title,
            fname: paxInfo?.name?.first,
            lname: paxInfo?.name?.last,
            ffn: '',
          });
        }

        return null;
      }));
      setFfNumberVerified(ffNumberVerifiedArr);
    }
  }, [passengers, selectedPaxFF]);
  const description = !proceedToFFVerify
    ? { html: editOrUpdateFfNumber?.description?.html }
    : { html: verifyYourFfNumberLabel };
  return (
    <OffCanvas
      onClose={onClose}
      containerClassName="mobile-variation1 frequent-flyer"
    >
      <div className="change-flight-details__container">
        <div className="head">
          <p className="heading">{editOrUpdateFfNumber?.heading}</p>
          <div className="desc">
            <Heading heading="h4" mobileHeading="h3" containerClass="sub-title">
              <div
                dangerouslySetInnerHTML={{
                  __html: description?.html,
                }}
              />
            </Heading>
          </div>
        </div>
        {!proceedToFFVerify ? (
          <div className="container-info frequent-flyer-booking-container">
            {renderBookingInfo()}
            {passengers?.map((pax, pIndex) => {
              if (pax.passengerTypeCode === CONSTANTS.PASSENGER_TYPE.CHILD) return null;
              const paxName = `${pax?.name?.first} ${pax?.name?.last}`;
              const nameAvtar = `${capitalizeFirstLetter(pax?.name?.first)}${capitalizeFirstLetter(pax?.name?.last)}`;
              return (
                <div aria-hidden="true" className="flight-card" onClick={() => onSelectCheckBox(pax?.passengerKey)}>
                  <div>
                    <div className="flight-card-passenger">
                      <div className="flight-card-passenger-avtar">{nameAvtar}</div>
                      <div className="flight-card-passenger-info">
                        <div className="flight-card-passenger-info-prename">
                          {`${passengerLabel} ${pIndex + 1}`}
                        </div>
                        <div className="flight-card-passenger-info-name">{paxName}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="checkbox">
                      <input
                        type="checkbox"
                        className="checkbox-selected"
                        value={pax?.passengerKey}
                        checked={selectedPaxFF?.indexOf(pax?.passengerKey) !== -1}
                        onChange={() => {
                          onSelectCheckBox(pax?.passengerKey);
                        }}
                      />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="frequent-flyer-verify-container">
            {selectedPaxFF?.map((paxKey, index) => {
              return (
                <VerifyPaxFFNumber
                  passengerKeys={paxKey}
                  enableFFNumberVerify={handleFfNumberVerifyObject}
                  ffNumberVerified={ffNumberVerified}
                  index={index}
                />
              );
            })}
            { proceedToFFVerify && renderFFVerifyButton() }
          </div>
        )}
        <div className="change-flight-details__footer ff-enroll-button footer">
          { !proceedToFFVerify ? renderButton() : renderEnrollMeNowButton() }
        </div>
      </div>
    </OffCanvas>
  );
};
FrequentFlyer.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleUpdateFfn: PropTypes.func.isRequired,
  setFfNumberVerifiedObject: PropTypes.func.isRequired,
};
export default FrequentFlyer;
