/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import VisaPaxSelection from '../commonComponents/VisaPaxSelection/VisaPaxSelection';
import TrackVisa from './TrackVisa/TrackVisa';
import BookingInfo from './BookingInfo/BookingInfo';
import { AppContext } from '../../context/AppContext';
import PaxSelectShimmer from '../commonComponents/Shimmer/PaxSelectShimmer';
import useSidePanelAdjustments from '../../hook/useSidePanelAdjustments';
import { itineraryJson } from '../../../public/mockApi/itinerary';
import { getPassengersDetails } from '../../services';
import { EVENTS_NAME } from '../../utils/analytic';
import { pushAnalytic } from '../../utils/analyticEvents';
import { visaServiceActions } from '../../context/reducer';

const VisaPaxSelector = () => {
  const {
    state: {
      visaPaxSelectByPath,
      getItineraryDetails,
      visaBookingDetailsByPath,
    },
    dispatch,
  } = React.useContext(AppContext);

  const { bookingIdLabel,
  } = visaBookingDetailsByPath || {};

  const [activeIndex, setActiveIndex] = useState(0);
  const [trackVisaJourney] = useState(false);
  const [combineJourney] = useState(false);
  const [getPaxDetails, setPaxDetails] = useState([]);
  const [isDataloading, setIsDataLoading] = useState(false);

  const {
    selectPassengersTitle, noteLabel, noteDescription, travellersLabel, trackVisaTitle,
    trackVisaInformation, visaConvenienceInformation,
  } = visaPaxSelectByPath || {};// AEM content data

  const mainHeading = combineJourney
    ? (activeIndex === 0 ? trackVisaTitle : selectPassengersTitle)
    : (trackVisaJourney ? trackVisaTitle : selectPassengersTitle);

  const descriptionText = combineJourney
    ? (activeIndex === 0 ? trackVisaInformation : visaConvenienceInformation)
    : (trackVisaJourney ? trackVisaInformation : visaConvenienceInformation);

  const noteBlockDescription = combineJourney
    ? (activeIndex === 0 ? trackVisaInformation : noteDescription)
    : (trackVisaJourney ? trackVisaInformation : noteDescription);

  const noteBlockRenderer = () => {
    return (
      <div className="visa-pax-selection-note-block">
        <Heading
          heading="h5"
          mobileHeading="h5"
          className="visa-pax-selection-note-block-heading"
        >
          <Text
            containerClass="text-text-primary"
            variation="body-large-medium"
            mobileVariation="body-small-medium"
          >
            {noteLabel || 'Note :'}
          </Text>
        </Heading>
        <HtmlBlock
          className="visa-pax-selection-note-block-des"
          html={noteBlockDescription?.html || ''}
        />
      </div>
    );
  };

  const navCtaItemRenderer = (props) => {
    return (
      <div
        className="visa-journey-tab-container__outer"
        role="tab"
        tabIndex={0}
      >
        <div className="visa-journey-tab-container__leg">
          <span
            aria-hidden="true"
            className={`visa-journey-tab-container__outer__tab 
              ${activeIndex === 0 ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(0)}
          >{props?.visaAppliedTab}
          </span>
          <span
            aria-hidden="true"
            className={`visa-journey-tab-container__outer_tab ${activeIndex === 1 ? 'active' : ''
            }`}
            onClick={() => setActiveIndex(1)}
          >{props?.visaOtherTab}
          </span>
        </div>
      </div>
    );
  };

  const navCtaRenderer = () => {
    const props = {
      visaAppliedTab: visaPaxSelectByPath?.visaAppliedTabTitle || 'Visa applied',
      visaOtherTab: visaPaxSelectByPath?.otherTabTitle || 'Other',
    };
    return (
      <div className="visa-journey-tab-wrapper">
        <div
          className="visa-journey-tab-container"
          role="tablist"
          aria-labelledby="Journey Tab"
          tabIndex={-1}
        >
          {navCtaItemRenderer(props)}
        </div>
      </div>
    );
  };

  useSidePanelAdjustments(true);

  useEffect(() => {
    if (getPaxDetails?.length === 0) {
      const getPaxApicalling = async () => {
        const response = await getPassengersDetails();
        if (response?.data?.passengers) {
          setPaxDetails(response?.data?.passengers);
          dispatch({
            type: visaServiceActions.GET_ITINERARY_DETAILS,
            payload: response?.data,
          });
        } else {
          setPaxDetails(itineraryJson?.data?.passengers);
          dispatch({
            type: visaServiceActions.GET_ITINERARY_DETAILS,
            payload: response?.data,
          });
        }
      };
      getPaxApicalling();
    }
    // console.log(getPaxDetails, 'getPaxDetails');
    if (getPaxDetails?.length !== 0) {
      pushAnalytic({
        data: {
          pnrResponse: { ...getItineraryDetails },
          _event: EVENTS_NAME.VISA_PASSENGERS_PAGE_LOAD,
        },
      });
    }
  }, [getPaxDetails]);

  useEffect(() => {
    if (!isDataloading && getPaxDetails?.length > 0) {
      setTimeout(() => {
        setIsDataLoading(true);
        const classElement = '.pe-right-side-v2';
        if (document.querySelector(classElement)) {
          document.querySelector(classElement).style.display = 'block';
          document.querySelector(classElement).style.marginTop = '64px';
        }
      }, 200);
    }
  }, [isDataloading, getPaxDetails]);

  return (
    <>
      {!isDataloading ? <PaxSelectShimmer /> : null}
      {isDataloading
        ? (
          <div className="visa-pax-selection">
            <Heading
              heading="h2"
              mobileHeading="h3"
              containerClass="visa-pax-selection-heading"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: mainHeading?.html,
                }}
              />
            </Heading>
            <HtmlBlock
              className="visa-pax-selection-des"
              html={descriptionText?.html}
            />
            {noteBlockRenderer()}
            {
              combineJourney ? (
                <>{navCtaRenderer()}
                  {activeIndex === 0 ? <TrackVisa />
                    : (
                      <>
                        <BookingInfo
                          bookingIdLabel={bookingIdLabel}
                          heading=""
                          isVisaDetail
                        />
                        <Heading
                          heading="h5"
                          mobileHeading="h5"
                          containerClass="visa-pax-selection-taveller"
                        >
                          {travellersLabel || 'Traveller(s)'}
                        </Heading>
                        <VisaPaxSelection
                          key={uniq()}
                          passengers={getPaxDetails}
                          itineraryDetail={getItineraryDetails}
                        />
                      </>
                    )}
                </>
              )
                : null
            }
            {
              trackVisaJourney
                ? <TrackVisa />
                : !combineJourney ? (
                  <>
                    <BookingInfo
                      itineraryData={getItineraryDetails}
                      bookingIdLabel={bookingIdLabel}
                      heading=""
                      isVisaDetail
                    />
                    <Heading
                      heading="h5"
                      mobileHeading="h5"
                      containerClass="visa-pax-selection-taveller"
                    >
                      {travellersLabel || 'Traveller(s)'}
                    </Heading>
                    <VisaPaxSelection
                      key={uniq()}
                      passengers={getPaxDetails}
                      itineraryDetail={getItineraryDetails}
                    />
                  </>
                ) : null
            }
          </div>
        ) : null}
    </>
  );
};
VisaPaxSelector.propTypes = {
  visaAppliedTab: PropTypes.string,
  visaOtherTab: PropTypes.string,
};
export default VisaPaxSelector;
