import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

import useAppContext from '../hooks/useAppContext';
import SplitPnrNote from '../components/SplitPnrNote';
import SplitPnrConditions from '../components/SplitPnrConditions';
import BookingDetails from '../components/BookingDetails';
import PassengerSelectionSection from '../components/PassengerSelectionSection';

import { splitPnrActions } from '../context/reducer';
import { getSplitPnrPassengers } from '../utils';

function SplitPnrLanding(props) {
  const {
    state: { main, selectedPassengersList, api },
    dispatch,
  } = useAppContext();
  const { classNameText, errorToast, retrievePnrErrorMsg } = props;
  const { bookingInfo, messageCode } = api || {};

  const splitPnrNotApplicableMsg = useMemo(() => {
    if (!messageCode || !main.PnrNotEligibleErrorMessage) return null;

    const { value = '' } = main.PnrNotEligibleErrorMessage.find((el) => el?.key === messageCode) || {};

    return value;
  }, [messageCode, main?.PnrNotEligibleErrorMessage?.length]);

  const { passengers = [] } = bookingInfo || {};
  const [passengerList, passengerListWithChild] = useMemo(
    () => getSplitPnrPassengers(passengers),
    [passengers],
  );

  const isSubmitDisabled = useMemo(() => {
    if (!passengerList?.length || !selectedPassengersList?.length) return true;

    return selectedPassengersList?.length === passengerList?.length;
  }, [passengerList, selectedPassengersList?.length]);

  useEffect(() => {
    if (isSubmitDisabled && !!selectedPassengersList?.length) {
      errorToast(main?.deselectPassengerToSplitMessage);
    }

    return () => {
      errorToast();
    };
  }, [isSubmitDisabled, selectedPassengersList]);

  return (
    <>
      {main?.selectPassengersTitle?.html && (
        <HtmlBlock
          html={main?.selectPassengersTitle?.html}
          className={`${classNameText}--title`}
        />
      )}
      {main?.selectPassengersTitle?.html && (
        <HtmlBlock
          html={main?.splitPnrDescription?.html}
          className={`${classNameText}--text`}
        />
      )}
      {!retrievePnrErrorMsg && !splitPnrNotApplicableMsg && (
        <SplitPnrNote
          noteLabel={main?.noteLabel}
          noteDescription={main?.noteDescription}
        />
      )}
      <SplitPnrConditions
        title={main?.splitPnrNotApplicableConditionsText?.html}
        conditions={main?.splitPnrNotApplicableConditionsDetails}
        errMsg={!api ? retrievePnrErrorMsg : splitPnrNotApplicableMsg}
      />
      <BookingDetails />
      <PassengerSelectionSection
        passengerList={passengerListWithChild}
        isCheckBoxDisabled={!!splitPnrNotApplicableMsg}
      />
      {!!passengerList?.length && (
        <Button
          containerClass={`${classNameText}--submit-button-wrapper`}
          onClick={() => {
            dispatch({
              type: splitPnrActions.SET_POPUP,
              payload: {
                show: true,
                data: main?.splitPnrPopupDetails,
              },
            });
          }}
          disabled={isSubmitDisabled}
        >
          {main?.continueCTALabel}
        </Button>
      )}
    </>
  );
}

SplitPnrLanding.propTypes = {
  classNameText: PropTypes.string,
  errorToast: PropTypes.func,
  retrievePnrErrorMsg: PropTypes.string,
};

export default SplitPnrLanding;
