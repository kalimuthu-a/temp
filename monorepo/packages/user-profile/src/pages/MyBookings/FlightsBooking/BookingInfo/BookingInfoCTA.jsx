/* eslint-disable consistent-return */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import {
  btnKeys,
  flightStatus,
  paymentStatuses,
  tripStatus,
  webCheckInStatus,
} from '../../../../constants/common';
import { getButtonLabelObj } from '../../../../utils/utilFunctions';
import LinkFilled from '../../../../components/common/LinkButtons/LinkFilled';
import LinkHollow from '../../../../components/common/LinkButtons/LinkHollow';
import {
  ctaAnalytics,
} from './BookingInfoAnalytics';
import MyBookingsContext from '../../MyBookingsContext';
import { myBookingsActions } from '../../MyBookingsReducer';
import { retrievePnr } from '../../../../services/retrievePnr.service';

const BookingInfoCta = (props) => {
  const {
    isPastTrip,
    isUpcomingTrip,
    bookingData,
    bookingStatus,
    isOneWay,
    paymentStatus,
    labels,
    anyMultiNoShow,
    holdExpiry,
    lastName,
    isTimerZero
  } = props;
  const { dispatch } = useContext(MyBookingsContext);

  const btnLabels = labels?.buttonOptions;

  const callRetrievePnr = async (link) => {
    try {
      dispatch({
        type: myBookingsActions.SET_LOADER,
        payload: true,
      });
      const response = await retrievePnr(bookingData?.pnr, lastName, true);
      if (response.data) {
        window.location.href = link;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API Error:', error);
    } finally {
      dispatch({
        type: myBookingsActions.SET_LOADER,
        payload: false,
      });
    }
  };

  const handlePayNowClick = (e) => {
    e.preventDefault();
    const btnObj = getButtonLabelObj(btnKeys.PAY_NOW, btnLabels);
    ctaAnalytics(bookingData?.analyticsData);
    callRetrievePnr(btnObj?.path);
  };

  const handleWebCheckInClick = (e, type) => {
    e.preventDefault();

    let btnKey = '';
    if (type === 'smart-checkin') {
      btnKey = btnKeys.SMART_CHECK_IN;
    } else if (type === 'web-checkin') {
      btnKey = btnKeys.WEB_CHECK_IN;
    }

    const btnObj = getButtonLabelObj(btnKey, btnLabels);
    ctaAnalytics(bookingData?.analyticsData);
    callRetrievePnr(btnObj?.path);
  };

  // Pay now button
  if (holdExpiry !== null
    && bookingStatus === tripStatus[5]
    && [paymentStatuses[2], paymentStatuses[4]].includes(paymentStatus)) {
    const btnObj = getButtonLabelObj(btnKeys.PAY_NOW, btnLabels);
    return (
      <LinkFilled
        label={btnObj?.buttonValue}
        link={btnObj?.path}
        onClickHandler={(e) => handlePayNowClick(e)}
        disabled={isTimerZero}
      />
    );
  }

  // smart check in button
  if (
    isUpcomingTrip
    && bookingStatus === tripStatus[2]
    && bookingData?.isSmartCheckin
  ) {
    const btnObj = getButtonLabelObj(btnKeys.SMART_CHECK_IN, btnLabels);
    return (
      <LinkFilled
        label={btnObj?.buttonValue}
        link={btnObj?.path}
        onClickHandler={(e) => handleWebCheckInClick(e, 'smart-checkin')}
      />
    );
  }

  // Web checkin button
  if (
    isUpcomingTrip
    && bookingStatus === tripStatus[2]
    && bookingData?.webCheckinStatus === webCheckInStatus.OPEN
    && !bookingData?.isAllPaxCheckedIn
  ) {
    const btnObj = getButtonLabelObj(btnKeys.WEB_CHECK_IN, btnLabels);
    return (
      <LinkFilled
        label={btnObj?.buttonValue || 'Web check-in'}
        link={btnObj?.path}
        onClickHandler={(e) => handleWebCheckInClick(e, 'web-checkin')}
      />
    );
  }

  // Need Help button
  if (
    isUpcomingTrip
    && bookingStatus === tripStatus[1]
    // && bookingData?.isSmartCheckin
  ) {
    const btnObj = getButtonLabelObj(btnKeys.NEED_HELP, btnLabels);
    return (
      <LinkHollow
        label={btnObj?.buttonValue}
        link={btnObj?.path}
        extraClasses="btn"
        onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
      />
    );
  }

  // Pay Now button if booking status is complete and payment status is pending
  if (
    isUpcomingTrip
    && bookingStatus === tripStatus[2]
    && paymentStatus === paymentStatuses[2]
  ) {
    const btnObj = getButtonLabelObj(btnKeys.PAY_NOW, btnLabels);
    return (
      <LinkFilled
        label={btnObj?.buttonValue}
        link={btnObj?.path}
        onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
      />
    );
  }

  // view boarding pass
  if (
    isUpcomingTrip
    && bookingStatus === tripStatus[2]
    && bookingData?.isAllPaxCheckedIn
  ) {
    const btnObj = getButtonLabelObj(btnKeys.VIEW_BOARDING_PASS, btnLabels);
    return (
      <LinkFilled
        label={btnObj?.buttonValue}
        link={btnObj?.path}
        onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
      />
    );
  }

  if (isPastTrip && bookingStatus === tripStatus[2] && !isOneWay) {
    const btnObjBookAgain = getButtonLabelObj(btnKeys.BOOK_AGAIN, btnLabels);
    const btnObjNeedHelp = getButtonLabelObj(btnKeys.NEED_HELP, btnLabels);

    if (!bookingData?.isLastItem) {
      return null;
    }

    return (
      <>
        <LinkFilled
          label={btnObjBookAgain?.buttonValue}
          link={btnObjBookAgain?.path}
          extraClasses="btn"
          onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
        />
        <div className="my-8" />
        {anyMultiNoShow ? (
          <LinkHollow
            label={btnObjNeedHelp?.buttonValue}
            link={btnObjNeedHelp?.path}
            extraClasses="btn"
            onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
          />
        ) : null}
      </>
    );
  }

  if (isPastTrip && bookingStatus === tripStatus[2] && isOneWay) {
    const btnObjNeedHelp = getButtonLabelObj(btnKeys.NEED_HELP, btnLabels);

    return <PastComplete {...props} btnObjNeedHelp={btnObjNeedHelp} extraClasses="btn" />;
  }
};

const PastComplete = ({ labels, bookingData, btnObjNeedHelp, extraClasses = '' }) => {
  return (
    <>
      <a
        className="text-decoration-none py-6 px-12 py-md-8 px-md-14 bg-secondary-light rounded-pill
    border-0 w-100 d-flex justify-content-between align-items-center"
        href={labels?.bookReturnFlight?.path}
      >
        <div className="text-start">
          <p className="text-primary-main body-small-medium">
            {labels?.bookReturnFlight?.title}
          </p>
          <HtmlBlock
            html={labels?.bookReturnFlight?.note}
            className="text-secondary body-small-light"
          />
          {/* <p
    className="text-secondary body-small-light"
    dangerouslySetInnerHTML={{ __html: labels?.bookReturnFlight?.description }}
  /> */}
        </div>
        <i className="bg-primary-main icon-arrow-top-right icon-size-sm p-5 rounded-pill text-white" />
      </a>
      {bookingData?.flightStatus === flightStatus.NO_SHOW ? (
        <LinkHollow
          extraClasses={`my-8 ${extraClasses}`}
          label={btnObjNeedHelp?.buttonValue}
          link={btnObjNeedHelp?.path}
          onClickHandler={() => ctaAnalytics(bookingData?.analyticsData)}
        />
      ) : null}
    </>
  );
};

BookingInfoCta.propTypes = {
  isPastTrip: PropTypes.bool,
  isUpcomingTrip: PropTypes.bool,
  bookingData: PropTypes.object,
  bookingStatus: PropTypes.string,
  holdExpiry: PropTypes.string,
  isOneWay: PropTypes.bool,
  paymentStatus: PropTypes.string,
  labels: PropTypes.object,
  anyMultiNoShow: PropTypes.bool,
  lastName: PropTypes.string,
  isTimerZero: PropTypes.bool,
};

PastComplete.propTypes = {
  labels: PropTypes.object,
  bookingData: PropTypes.object,
  btnObjNeedHelp: PropTypes.object,
  extraClasses: PropTypes.string,
};

export default BookingInfoCta;
