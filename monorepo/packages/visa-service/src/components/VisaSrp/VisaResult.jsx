/* eslint-disable i18next/no-literal-string */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import FlightJourneyTab from 'skyplus-design-system-app/dist/des-system/FlightJourneyTab';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import SearchResult from './SearchResult';
import { AppContext } from '../../context/AppContext';
import {
  getCountryDetailsGroupedByName, getPassengersDetails,
  getCountryList, getWidgetData,
} from '../../services';
import VisaSrpShimmer from '../commonComponents/Shimmer/VisaSrpShimmer';
import { visaServiceActions } from '../../context/reducer';
import { pushAnalytic } from '../../utils/analyticEvents';
import { AA_CONSTANTS, EVENTS_NAME } from '../../utils/analytic';
import { itineraryJson } from '../../../public/mockApi/itinerary';
import VisaServiceFooterComponent from '../commonComponents/VisaFooter';
import { formatDate, PAX_CODES, UTIL_CONSTANTS } from '../../utils';
import VisaCountryNotAvailablePopup from '../commonComponents/VisaHeaderSection/VisaCountryNotAvailablePopup';
import ReadMoreLess from '../commonComponents/ReadMoreLess';
import useHeightAdjustments from '../../hook/useHeightAdjustments';
import VisaDisclaimerPopup from './VisaDisclaimerPopup';

// eslint-disable-next-line sonarjs/cognitive-complexity
const VisaResult = () => {
  const {
    state: {
      visaSrpByPath,
      selectedVisaPax,
      getItineraryDetails,
      visaAllQuotations,
      visaPaxSelectByPath,
      visaCountriesDetails,
      showFullVisaBookingWidget,
      selectedVisaDetails,
    },
    dispatch,
  } = React.useContext(AppContext);

  const aemLabel = visaSrpByPath || {};
  const visaAemLabel = visaPaxSelectByPath || {};
  const [getAllVisaQuotes, setAllVisaQuotes] = useState([]);
  const [getItinerary, setItinerary] = useState(getItineraryDetails || null);
  const [selectedVisaPassengers, setSelectedVisaPassengers] = useState([]);
  const [countryList, setCountryList] = useState(null);
  const [express, setExpress] = useState([]);
  const [standard, setStandard] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedIndexQuote, setSelectedIndexQuote] = useState(0);
  const [countryNames, setCountryNames] = useState([]);
  const [getBookingWidgetData, setBookingWidgetData] = useState(null);
  const [visaAppliedCountryName, setVisaAppliedCountryName] = useState('');
  const [isVisaQuotesLoading, setIsVisaQuotesLoading] = useState(true);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isMobile] = useIsMobile();
  // eslint-disable-next-line no-unused-vars
  const [isVisaQuotesFetchedOnce, setIsVisaQuotesFetchedOnce] = useState(false);
  const { journeysDetail, passengers } = getItinerary || {};
  const [notAvailableCountryName, setNotAvailableCountryName] = useState('');
  const [journeyKeyByDesCode, setJourneyKeyByDesCode] = useState([{ journeyKey: '', desCode: '', countryName: '' }]);
  const [isDisclaimerPopupOpen, setDisclaimerPopupOpen] = useState(false);

  const visaJourneyDetails = journeysDetail?.filter((jItem) => {
    let isInternational = false;
    jItem?.segments?.forEach((sItem) => {
      if (sItem?.international) {
        isInternational = true;
      }
    });
    return isInternational ? jItem : null;
  });

  const visaJourneyDetailsObj = visaJourneyDetails?.filter(
    (journey) => journey?.journeydetail?.destinationCityName?.toLowerCase(),
  );

  useEffect(() => {
    if (journeyKeyByDesCode?.[0]?.desCode === '' && visaJourneyDetails && visaJourneyDetails.length > 0) {
      const visaJourneyDetailsjourneyKey = visaJourneyDetails?.map((jDetail) => {
        return { journeyKey: jDetail?.journeyKey, desCode: jDetail?.journeydetail?.destination, countryName: '' };
      });
      setJourneyKeyByDesCode(visaJourneyDetailsjourneyKey);
    }
  }, [visaJourneyDetails, journeyKeyByDesCode]);

  const journeyDate = visaJourneyDetails?.[0]?.journeydetail?.departure;

  const destinationIataCode = visaJourneyDetailsObj?.map(
    (vjd) => vjd?.journeydetail?.destination,
  );
  const handleContinueCTA = () => {
    // for seting visa type (standerd |express)
    const { displayQuotes } = visaAllQuotations?.data || {};
    const keys = Object.keys(displayQuotes);

    dispatch({ type: 'SELECTED_VISA_DETAILS', payload: { ...selectedQuote, processingType: keys[selectedIndex] } });
    dispatch({ type: 'PAGE_SECTION_TYPE', payload: 'visa-plan-details' });
  };

  const analyticVisaSelected = () => {
    const visaDetail = selectedQuote;

    /* Visa Selected analytic */
    pushAnalytic({
      event: EVENTS_NAME.VISA_SELECT,
      data: {
        pnrResponse: {
          bookingDetails: {},
          passengers: selectedVisaPax,
        },
        _event: EVENTS_NAME.VISA_SELECTED,
        _eventInfoName: 'Continue',
        _componentName: 'Visa Select',
        pageName: 'Visa Search Result',
        position: '',
        visaDetails: {
          currencyCode: visaDetail?.currency || 'INR',
          tripFares: visaDetail?.basePrice,
          visaName: `${visaDetail?.stayPeriod} ${visaDetail?.entryType}`,
          visaEntryType: selectedQuote?.processingType,
          visaType: visaDetail?.purpose,
          visaValidity: visaDetail?.validity,
          visaStay: visaDetail?.stayPeriod,
          visaDelivery: selectedQuote?.processingType,
          sector: visaDetail?.countryName,
          departureDate: journeyDate ? formatDate(
            new Date(journeyDate),
            UTIL_CONSTANTS.DATE_HYPHEN_DDMMYYYY,
          ) : '',
        },
      },
    });
  };

  const VisaQuotationRenderer = () => {
    const selectedQuoteIndex = (index, quote) => {
      setSelectedIndexQuote(index);
      setSelectedQuote(quote);
    };
    return getAllVisaQuotes?.map((quote, index) => {
      const updatedQuote = quote;
      const findPrice = updatedQuote.priceDistribution.length;
      if (findPrice === 1) {
        const price = updatedQuote.priceDistribution[0];
        updatedQuote.adultPrice = price;
        updatedQuote.childPrice = price;
        updatedQuote.totalPriceAdult = (price?.basePrice || 0) + (price?.fee || 0) + (price?.serviceTax || 0);
        updatedQuote.totalPriceChild = (price?.basePrice || 0) + (price?.fee || 0) + (price?.serviceTax || 0);
      } else {
        const findChild = quote.priceDistribution.find((x) => x.minAge === 0);
        const findAdult = quote.priceDistribution.find((x) => x.minAge !== 0);
        updatedQuote.childPrice = findChild;
        updatedQuote.adultPrice = findAdult;
        updatedQuote.totalPriceAdult = (findAdult?.basePrice || 0)
        + (findAdult?.fee || 0) + (findAdult?.serviceTax || 0);
        updatedQuote.totalPriceChild = (findChild?.basePrice || 0)
        + (findChild?.fee || 0) + (findChild?.serviceTax || 0);
      }
      return (
        <SearchResult
          key={quote?.quoteId}
          index={index}
          quote={updatedQuote}
          title={quote?.entryType}
          adultPrice={updatedQuote?.totalPriceAdult}
          childPrice={updatedQuote?.totalPriceChild}
          currency={quote?.currency}
          processing={quote?.processingTime}
          processingType={quote?.processingType}
          validity={quote?.validity}
          stayPeriod={quote?.stayPeriod}
          terms={quote?.disclaimers}
          journeyDate={journeyDate}
          selectedQuoteIndex={selectedQuoteIndex}
          handleContinueCTA={handleContinueCTA}
          selectedIndexQuote={selectedIndexQuote}
          selectedVisaPax={selectedVisaPax}
        />
      );
    });
  };

  const sector = [
    {
      origin: aemLabel?.visaTypeTabs?.[0].value,
      destination: null,
      key: 1,
      selectedIndex: 0,
      onClick: () => setSelectedIndex(0),
    },
    {
      origin: null,
      destination: aemLabel?.visaTypeTabs?.[1].value,
      key: 2,
      selectedIndex: 1,
      onClick: () => setSelectedIndex(1),
    },
  ];

  const getVisaDetailsByCountryName = (response) => {
    const stdCard = response?.data?.displayQuotes?.standard?.filter((stdVisa) => {
      if (stdVisa?.purpose === 'Tourist') {
        return stdVisa;
      }
      return [];
    });
    const expCard = response?.data?.displayQuotes?.express?.filter((exp) => {
      if (exp?.purpose === 'Tourist') {
        return exp;
      }
      return [];
    });
    setStandard(stdCard || []);
    setExpress(expCard || []);
    setIsVisaQuotesFetchedOnce(true);
    setIsVisaQuotesLoading(false);
    // setAllVisaQuotes(touristVisaDetail);
    dispatch({
      type: visaServiceActions.GET_VISA_QUOTATIONS,
      payload: response,
    });
  };

  /* Cancel visa booking, redirect to itinerary page */
  const cancelVisaBooking = () => {
    setDisclaimerPopupOpen(false);
    window.open(visaSrpByPath?.backToVisaHomeLink, '_self');
  };

  /* Get Visa quotations by country name */

  useEffect(() => {
    if (visaCountriesDetails?.activeCountryName) {
      let failedApiCall = false;
      const getVisaData = async () => {
        const response = await getCountryDetailsGroupedByName(visaCountriesDetails?.activeCountryName);
        if (response?.error) {
          failedApiCall = true;
          setIsVisaQuotesFetchedOnce(true);
          setIsVisaQuotesLoading(false);
          return;
        }

        const stdCard = response?.data?.displayQuotes?.standard?.filter((stdVisa) => stdVisa?.purpose === 'Tourist');

        const expCard = response?.data?.displayQuotes?.express?.filter((exp) => exp?.purpose === 'Tourist');

        setStandard(stdCard || []);
        setExpress(expCard || []);
        // setAllVisaQuotes(touristVisaDetail);
        dispatch({
          type: visaServiceActions.GET_VISA_QUOTATIONS,
          payload: response,
        });

        if (response?.data) {
          const standardLength = Number(response?.data?.displayQuotes?.standard?.length);
          const expressLength = Number(response?.data?.displayQuotes?.express?.length);

          const safeStandardLength = Number.isNaN(standardLength) ? 0 : standardLength;
          const safeExpressLength = Number.isNaN(expressLength) ? 0 : expressLength;

          const resultCount = `${safeStandardLength}|${safeExpressLength}`;
          // event on Page Load
          const obj = {
            event: EVENTS_NAME.VISA_VIEW,
            data: {
              pageName: AA_CONSTANTS.Visa_Search_Result,
              _event: EVENTS_NAME.VISA_VIEWED,
              visaDetails: {
                totalPax: selectedVisaPax?.length || '1',
                sector: response?.data?.country,
                searchResultCount: resultCount,
              },
            },
          };
          pushAnalytic(obj);
        } else {
          pushAnalytic({
            event: EVENTS_NAME.NO_VISA_FOUND,
            data: {
              pnrResponse: {
                bookingDetails: {},
                passengers: selectedVisaPax,
              },
              _event: EVENTS_NAME.NO_RESULT_FOUND,
              _eventInfoName: AA_CONSTANTS.No_Visa,
              _componentName: AA_CONSTANTS.Visa,
              visaDetails: {
                currencyCode: AA_CONSTANTS.INR,
                sector: visaCountriesDetails?.activeCountryName,
                reason: response?.error?.msg || 'Api error',
              },
            },
          });
        }
        // return null;
        getVisaDetailsByCountryName(response);
        setIsVisaQuotesLoading(false);
      };
      if (((!failedApiCall && !visaAllQuotations)
        || (visaAllQuotations && visaAllQuotations?.data?.country !== visaCountriesDetails?.activeCountryName))) {
        getVisaData();
      } else if (visaAllQuotations) {
        const stdCard = visaAllQuotations?.data?.displayQuotes?.standard?.filter(
          (stdVisa) => stdVisa?.purpose === 'Tourist',
        );
        const expCard = visaAllQuotations?.data?.displayQuotes?.express?.filter(
          (exp) => exp?.purpose === 'Tourist',
        );

        setStandard(stdCard || []);
        setExpress(expCard || []);
        setIsVisaQuotesLoading(false);
        // for reselecting on click back button
        if (selectedVisaDetails) {
          const displayQuotes = visaAllQuotations?.data?.displayQuotes || {};
          const processingTypeKey = selectedVisaDetails?.processingType?.trim().toLowerCase();
          const keys = Object.keys(displayQuotes);
          const typeIndex = keys.indexOf(processingTypeKey);
          const quotes = displayQuotes[processingTypeKey] || [];

          const selectedKey = quotes.filter((s) => s?.purpose === 'Tourist').findIndex(
            (s) => String(s?.quoteId) === String(selectedVisaDetails.quoteId),
          );

          setSelectedIndex(typeIndex);
          setSelectedQuote(selectedVisaDetails?.quoteId || null);
          setSelectedIndexQuote(selectedKey);
        }
      }
    }
  }, [visaAllQuotations, countryNames, visaCountriesDetails]);

  useEffect(() => {
    if (selectedIndex !== 0) {
      setAllVisaQuotes(express);
    } else {
      setAllVisaQuotes(standard);
    }
  }, [express, standard, selectedIndex]);

  /* Get get itinerary data */
  useEffect(() => {
    if (!getItinerary) {
      const getItineraryApicalling = async () => {
        const response = await getPassengersDetails();
        if (response?.data?.passengers) {
          setItinerary(response?.data);
          dispatch({
            type: visaServiceActions.GET_ITINERARY_DETAILS,
            payload: response?.data,
          });
        } else {
          setItinerary(itineraryJson?.data);
          dispatch({
            type: visaServiceActions.GET_ITINERARY_DETAILS,
            payload: itineraryJson?.data,
          });
        }
      };
      getItineraryApicalling();
    }
  }, [getItinerary]);
  useEffect(() => {
    if (!selectedVisaPax && selectedVisaPassengers?.length === 0 && passengers && passengers?.length !== 0) {
      const paxs = [...passengers];
      const findPaxLabel = visaAemLabel?.paxList?.find((pax) => pax.typeCode === PAX_CODES.INFANT);
      const findChildCode = visaAemLabel?.paxList?.find((pax) => pax.typeCode === PAX_CODES.CHILD);
      passengers?.forEach((passenger, pIndex) => {
        if (passenger?.infant) {
          const paxKey = `${passenger?.passengerKey}${findPaxLabel?.paxLabel?.toLowerCase()}`;
          const isInfantAlreadyAdded = paxs?.some((p) => p?.passengerKey === paxKey);
          if (!isInfantAlreadyAdded) {
            const infantPax = {
              ...passenger,
              name: passenger?.infant?.name,
              info: {
                dateOfBirth: passenger?.infant?.dateOfBirth,
                gender: passenger?.infant?.gender,
                nationality: passenger?.infant?.nationality,
              },
              passengerKey: '',
              passengerTypeCode: findChildCode?.typeCode,
              passengerInfantKey: `${paxKey}-${pIndex}`,
            };
            paxs.push(infantPax);
          }
        }
      });

      dispatch({
        type: visaServiceActions.VISA_SELECTED_PAX,
        payload: paxs,
      });

      setSelectedVisaPassengers(paxs);
    }
  }, [selectedVisaPassengers, getItinerary]);

  /* Get all visa booking countries */
  useEffect(() => {
    if (!countryList) {
      let failedApiCall = false;
      const apiCalling = async () => {
        const response = await getCountryList();
        const { data, error } = response;
        if (error) {
          failedApiCall = true;
          return;
        }
        dispatch({
          type: visaServiceActions.GET_COUNTRY_LIST,
          payload: data?.countryIsoCode || {},
        });
        setCountryList(data?.countryIsoCode);
      };
      if (!failedApiCall) {
        apiCalling();
      }
    }
  }, [countryList]);

  /* Get Booking widget Data */
  useEffect(() => {
    if (!getBookingWidgetData) {
      let failedApiCall = false;
      const apiCalling = async () => {
        const bwResponse = await getWidgetData();
        if (bwResponse?.error) {
          failedApiCall = true;
          return;
        }
        setBookingWidgetData(bwResponse?.data?.masterDataModel);
      };
      if (!failedApiCall) {
        apiCalling();
      }
    }
  }, [getBookingWidgetData]);

  const isButtonDisabled = (selectedIndexQuote < 0) || ((selectedIndex === 0 && standard?.length === 0)
    || (selectedIndex === 1 && express?.length === 0));
  // footer props
  const footerProps = {
    handleClick: () => {
      handleContinueCTA();
      analyticVisaSelected();
    },
    buttonText: 'Continue',
    buttonProps: {
      disabled: isButtonDisabled,
    },
    setFooterHeight,
  };

  // call when footerHeight set
  useHeightAdjustments(footerHeight);

  /* Get visa booking countries name by destinationIataCode */
  useEffect(() => {
    if ((countryNames?.length === 0) && (destinationIataCode?.length > 0) && (journeyKeyByDesCode?.[0]?.desCode !== '')
      && (countryList && Object.keys(countryList)?.length > 0) && getBookingWidgetData
    && !visaCountriesDetails?.activeCountryName) {
      const getCountryCodeByDesCity = getBookingWidgetData;

      const visaBookingCountrtyCode = destinationIataCode?.map((IataCode) => {
        return getCountryCodeByDesCity?.filter(
          (country) => (country?.countryCode !== 'IN')
            && ((country?.cityCode === IataCode) || (country?.stationCode === IataCode)),
        )?.[0]?.countryCode;
      })?.filter((t) => t !== undefined);

      const visaBookingCountrtyNames = destinationIataCode?.map((IataCode) => {
        return getCountryCodeByDesCity?.filter(
          (country) => (country?.countryCode !== 'IN')
            && ((country?.cityCode === IataCode) || (country?.stationCode === IataCode)),
        )?.[0]?.countryName;
      })?.filter((t) => t !== undefined);

      const visaBookingCountrtyJourneyKey = destinationIataCode?.map((IataCode) => {
        let countyObj = {};
        journeyKeyByDesCode.filter((i) => {
          if (i.desCode === IataCode) {
            const jcountryCode = getCountryCodeByDesCity?.filter(
              (country) => (country?.countryCode !== 'IN')
                && ((country?.cityCode === i.desCode) || (country?.stationCode === i.desCode)),
            )?.[0]?.countryCode;

            const match = Object.entries(countryList).find(
              ([, value]) => value?.isoCodeA2 === jcountryCode,
            );

            countyObj = { ...i, countryName: match?.[0] };
          }
          return null;
        });

        return countyObj;
      })?.filter((t) => t !== undefined);

      const visaBookingNotAvaiilableCountry = destinationIataCode?.map((IataCode) => {
        return getCountryCodeByDesCity?.filter(
          (country) => (country?.countryCode !== 'IN')
            && (country?.cityCode === IataCode || country?.stationCode === IataCode),
        )?.[0]?.countryName;
      })?.filter((t) => t !== undefined);

      const country = visaBookingCountrtyCode?.map((countyCode) => {
        const match = Object.entries(countryList).find(
          ([, value]) => value?.isoCodeA2 === countyCode,
        );
        return match?.[0];
      }).filter(Boolean);

      if (country?.length === 0) {
        setNotAvailableCountryName(visaBookingNotAvaiilableCountry?.[0]);
      }
      setDisclaimerPopupOpen(true);
      setCountryNames(country);
      setVisaAppliedCountryName(country?.[0]);

      const countriesInfo = {
        flightBookingCountries: visaBookingCountrtyNames,
        flightBookingCountriesCode: visaBookingCountrtyCode,
        activeCountryIndex: 0,
        activeCountryName: country?.[0],
        destinationsCode: destinationIataCode,
        activeCountryCode: visaBookingCountrtyCode?.[0],
        countryDetials: visaBookingCountrtyJourneyKey,

      };
      dispatch({ type: 'GET_VISA_COUNTRIES_DETAILS', payload: countriesInfo });
    }
  }, [countryNames, countryList, destinationIataCode, journeyKeyByDesCode]);
  /* Change visa quotations based on country chagned */
  useEffect(() => {
    if (visaAppliedCountryName
      && (visaAppliedCountryName?.toLocaleLowerCase()
        !== visaCountriesDetails?.activeCountryName?.toLocaleLowerCase())) {
      let failedApiCall = false;
      const getVisaData = async () => {
        const response = await getCountryDetailsGroupedByName(visaCountriesDetails?.activeCountryName);
        if (response?.error) {
          failedApiCall = true;
          return;
        }
        setVisaAppliedCountryName(visaCountriesDetails?.activeCountryName);
        getVisaDetailsByCountryName(response);
      };
      if (!failedApiCall) {
        getVisaData();
      }
    }
  }, [visaAppliedCountryName, visaCountriesDetails?.activeCountryName]);

  /* Show shimmer content and visa country is not available popup */
  if (isVisaQuotesLoading) {
    if (!notAvailableCountryName) {
      return <VisaSrpShimmer />;
    }
    return (
      <>
        <VisaSrpShimmer />
        <VisaCountryNotAvailablePopup
          onClose={() => {
            setNotAvailableCountryName('');
            window.open(visaPaxSelectByPath?.backToItineraryLink, '_self');
          }}
          description={aemLabel?.visaServiceNotAvailablePopup?.description}
          title={aemLabel?.visaServiceNotAvailablePopup?.title}
          buttonText={aemLabel?.visaServiceNotAvailablePopup?.ctaLabel}
          countryName={notAvailableCountryName}
        />
      </>
    );
  }

  return (
    <>
      <div className="visa-srp-head">

        <Heading
          heading="h1"
          mobileHeading="h1"
          className="visa-pax-selection-note-block-heading "
        />

        {isMobile ? (
          <>
            <div
              className="visa-pax-selection-note-block-des visa-srp-head-text"
              dangerouslySetInnerHTML={{
                __html: aemLabel?.visaTypeMobileTitle?.html
                  ?.replace('{country}', visaCountriesDetails?.activeCountryName) || '',
              }}
            />
            <p className="text-subtitle">{aemLabel?.visaTypeMobileDescription}</p>
          </>
        ) : (
          <div
            className="visa-pax-selection-note-block-des visa-srp-head-text"
            dangerouslySetInnerHTML={{
              __html: aemLabel?.chooseVisaTypeLabel?.html
                ?.replace('{country}', visaCountriesDetails?.activeCountryName) || '',
            }}
          />
        )}

        <div className="visa-srp-head-tabs">
          <FlightJourneyTab
            sectors={sector}
            selectedIndex={selectedIndex}
            onChangeCallback={() => {
              if (selectedIndex === 0) {
                setSelectedIndex(1);
              } else {
                setSelectedIndex(0);
              }
            }}
            containerClass="visa-srp-head-tabs-btn"
          />
        </div>
      </div>
      {(getAllVisaQuotes?.length > 0) ? <VisaQuotationRenderer /> : (
        <div className="no-visa-message">
          {selectedIndex === 0 && standard?.length === 0 && (
            <p
              dangerouslySetInnerHTML={{
                __html: aemLabel?.visaTypeTabs?.[0]?.description?.html || '',
              }}
            />
          )}
          {selectedIndex === 1 && express?.length === 0 && (
            <p
              dangerouslySetInnerHTML={{
                __html: aemLabel?.visaTypeTabs?.[1]?.description?.html || '',
              }}
            />
          )}
        </div>
      )}
      <div className="note">
        <span className="note-disclaimer">{aemLabel?.disclaimerLabel}</span>
        <ReadMoreLess
          lessText={aemLabel?.visa2FlyServicesInfo?.html || ''}
          moreText={aemLabel?.visa2FlyServicesFullInfo?.html || ''}
        />
      </div>
      {isDisclaimerPopupOpen
        ? (
          <VisaDisclaimerPopup
            isOpen={isDisclaimerPopupOpen}
            onClose={() => setDisclaimerPopupOpen(false)}
            onCancel={() => cancelVisaBooking()}
          />
        )
        : null}
      {!showFullVisaBookingWidget ? <VisaServiceFooterComponent {...footerProps} /> : null}
    </>
  );
};

export default VisaResult;
