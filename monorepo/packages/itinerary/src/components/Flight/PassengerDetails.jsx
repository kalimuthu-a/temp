import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PropTypes from 'prop-types';
import { getSegmentBasedPassengerInfo, onClickViewBoardingPass, bindWithDeepLinkUrl } from './dataConfig';
import { CONSTANTS } from '../../constants';
import PassengerBarcode from '../PassengerBarcode/PassengerBarcode';
import { checkPassengerIsNotNomini, getLoyaltyTierLabel } from '../common/utils';

const PassengerDetails = ({ jKey }) => {
  const { journeysDetail, passengers, bookingDetails } = useSelector((state) => state.itinerary?.apiData) || [];
  const mfData = useSelector((state) => state.itinerary?.mfDatav2) || {};
  const { checkedInLabel, flownLabel, noShowLabel, addonOptions,
    etickerLabel, barcodeTitle, barcodeDescription, frequentFlyerNo, tierLabel, nomineeLabel } = mfData?.itineraryMainByPath?.item || {};

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [paxUiData, setPaxUiData] = useState([]);
  const currentJourney = journeysDetail?.find((jItem) => jItem.journeyKey === jKey) || {};
  const [activeButton, setActiveButton] = useState(currentJourney?.segments?.[0].segmentKey);
  const [showMoreSsr, setShowMoreSsr] = useState(null);
  const [flag, setFlag] = useState(false);
  // State to track active button
  const ssrListAbbreviation = useSelector((state) => state.itinerary?.ssrListAbbreviation) || [];
  const converObj = {};
  const { ssrList } = addonOptions?.filter((addonData) => addonData?.categoryBundleCode === 'Meal')?.[0] || [];
  ssrListAbbreviation.forEach((itm) => {
    converObj[itm.ssrCode] = itm.name;
  });

  let jouneryInfoNotThereInPassenger = false;
  const refAddonSsr = useRef(null);
  // for cancelled one ,we will not get the journey information in that scenario,we should show only name
  const { journeys } = passengers[0]?.seatsAndSsrs || [];
  if (
    passengers
    && passengers[0]
    && journeys?.length > 0
  ) {
    jouneryInfoNotThereInPassenger = true;
  }
  const mfAdditionalData = useSelector((state) => state.itinerary?.mfAdditionalDatav2) || {};
  const { viewHealthFormCtaLabel, viewHealthFormCtaPath, fillHealthFormCtaLabel,
    fillHealthFormCtaPath, downloadBoardingPassCtaLabel, downloadBoardingPassCtaPath,
  } = mfAdditionalData?.itineraryAdditionalByPath?.item || {};

  const isCodeShareEnable = bookingDetails?.recordLocators?.length;
  const getSeatsList = (pItem) => {
    return pItem?.matchedJourney?.matchedSegment?.seats?.map((sItem) => sItem.unitDesignator).toString();
  };

  const getBundleCode = (pItem) => {
    return pItem?.matchedJourney?.matchedSegment?.bundleCode;
  };

  const getBaggageList = (pItem) => {
    const { baggageData } = pItem?.matchedJourney?.journeyDetails || {};
    return baggageData;
  };

  const getAge = (fromdateT) => {
    try {
      const todate = new Date();
      const fromdate = new Date(fromdateT);

      const year = [todate.getFullYear(), fromdate.getFullYear()];
      let yearDiff = year[0] - year[1];
      const month = [todate.getMonth(), fromdate.getMonth()];
      const monthdiff = month[0] - month[1];
      const days = [todate.getDate(), fromdate.getDate()];
      const daysdiff = days[0] - days[1];

      if (monthdiff < 0 || (monthdiff === 0 && daysdiff < 0)) {
        // eslint-disable-next-line no-plusplus
        yearDiff--;
      }

      return `${yearDiff} years`;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('log:::Error::getAge--', e);
      return 'Error calculating age';
    }
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleToggle = (index) => {
    setActiveAccordion((prevActive) => (prevActive === index ? null : index));
  };

  const getPreferenceType = (apiSsrList) => {
    let preferenceType = '';
    ssrList?.filter((ssrData) => {
      apiSsrList?.map((ssrCode) => {
        if ((ssrCode?.ssrCode !== 'FFWD' && ssrCode !== 'WCHC') && ssrData?.ssrCode === ssrCode?.ssrCode) {
          preferenceType = ssrData?.preference;
        }
        return null;
      });
      return null;
    });
    return preferenceType;
  };

  useEffect(() => {
    const paxInfo = getSegmentBasedPassengerInfo(passengers, activeButton);
    setPaxUiData(paxInfo);
  }, [activeButton]);

  const passengerButton = () => {
    return (
      <div className="passenger-details__button-container">
        {currentJourney?.segments?.length > 1 && currentJourney?.segments?.map((sItem) => {
          const journeyFlightlabel = `${sItem?.segmentDetails?.origin} - ${sItem?.segmentDetails?.destination}`;
          return (
            <div
              key={uniq()}
              aria-hidden="true"
              className={`passenger-details__button ${activeButton === sItem.segmentKey ? 'active' : ''}`}
              onClick={() => handleButtonClick(sItem.segmentKey)}
            >
              <span className="icon-flight">
                <span className="path1" />
                <span className="path2" />
                <span className="path3" />
                <span className="path4" />
              </span>
              {journeyFlightlabel}
            </div>
          );
        })}
      </div>
    );
  };

  const getPassengerType = (passengerTypeCode) => {
    const passengerTypeMapping = {
      ADT: 'Adult',
      SRCT: 'Adult',
      CHD: 'Child',
      INFT: 'Infant',
    };
    return passengerTypeMapping[passengerTypeCode] || null;
  };

  const getTopSectionData = (passengerTopSectionObj) => {
    const passengerTopSectionData = Object.keys(passengerTopSectionObj).map((key) => {
      if (passengerTopSectionObj[key]) {
        return passengerTopSectionObj[key];
      }
      return null;
    }).filter((value) => value !== null && value !== undefined);
    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {passengerTopSectionData
        && passengerTopSectionData?.map((item) => (
          <span key={uniq()} className="passenger-details__top-section__p-info__age-group">
            {item}
          </span>
        ))}
      </>
    );
  };
  const isMealSSR = (mealSsr) => ((ssrList.filter(
    (ssrs) => ssrs?.ssrCode?.toLowerCase() === mealSsr?.toLowerCase(),
  )?.length > 0));

  const getIconClass = (ssrCode) => {
    if (ssrCode && isMealSSR(ssrCode)) {
      return 'icon icon-6e-eats';
    }
    switch (ssrCode) {
      case 'FFWD':
        return 'icon icon-fast-forward';
      case 'WCHR':
        return 'icon icon-Wheelchair';
      case 'IFNR':
      case 'IFNI':
        return 'icon icon-cancellation-assistance';
      case 'PROT':
        return 'icon icon-lifestyle-assistance';
      case 'SPEQ':
        return 'icon icon-sports-equipment';
      case 'ABHF':
      case 'XBPA':
      case 'XBPB':
      case 'XBPC':
      case 'XBPD':
      case 'XBPE':
      case 'XBPJ':
      case 'IXBA':
      case 'IXBB':
      case 'IXBC':
      case 'XBPK':
      case 'XBPH':
      case 'XBPF':
      case 'XBPI':
      case 'XBPG':
        return 'icon icon-additional-baggage';
      case 'baggage':
        return 'icon icon-baggage-tag';
      case '6EBAR':
        return 'icon icon-mini-bar';
      case 'Lounge':
        return 'icon icon-lounge';
      case 'PRBG':
        return 'icon icon-free-fast-forward';
      case 'Goodnight':
        return 'icon icon-night';
      case 'EXST':
      case 'EXST2':
      case 'EXT':
      case 'EXT2':
        return 'icon icon-seat-single';
      case 'SRCT':
        return 'icon icon-senior-citizen';
      case 'UMNR':
      case 'UNMX':
        return 'icon icon-umnr';
      case 'STU':
      case 'STUD':
        return 'icon icon-profile-solid';
      case 'VAXI':
      case 'VCN1':
      case 'VCN2':
      case 'VCNX':
        return 'icon icon-vaccine';
      case 'FNF':
        return 'icon icon-group-booking';
      case 'DFN':
      case 'DFNS':
      case 'SSB':
      case 'WPNX':
        return 'icon icon-defence';
      case 'MEDICAL':
        return 'icon icon-health';
      case 'LBG':
        return 'icon icon-baggage-tag';
      case 'CSBK':
      case 'SUPR':
      case 'TPMT':
      case 'TRFR':
      case 'U255':
      case 'UKDM':
      case 'UMRA':
      case 'UPMA':
        return '';
      default:
        return '';
    }
  };

  const getShowMoreChild = () => {
    let remainingChildToshow = 0;
    let allChildWidth = 0;
    if (refAddonSsr?.current !== null) {
      const totalWidth = Number(refAddonSsr?.current?.clientWidth) - 120;
      if (refAddonSsr?.current?.childNodes?.length > 0) {
        refAddonSsr?.current?.childNodes?.forEach((child) => {
          allChildWidth += (Number(child?.clientWidth) + 16);
          if (allChildWidth > totalWidth) {
            remainingChildToshow += 1;
          }
        });
      }
    }
    return remainingChildToshow > 0 ? { show: true, remainingChildToshow } : null;
  };
  const doubleTripleSeatIconRenderer = (seatFlag, doubleTripleSeatLabel) => {
    return (doubleTripleSeatLabel?.toLowerCase()?.indexOf('triple') !== -1
      ? (
        <div className="triple-seat"><i className="icon-seat-single" />
          <i className="icon-seat-single" /><i className="icon-seat-single" />
          <span>{`${doubleTripleSeatLabel} Seat(s)`}</span>
        </div>
      )
      : (
        <div className="double-seat"><i className="icon-seat-single" />
          <i className="icon-seat-single" />
          <span>{`${doubleTripleSeatLabel} Seat(s)`}</span>
        </div>
      ));
  };

  const getDataBottomSectionData = (passengerListAddOnObj) => {
    const ssrCodeArr = [];
    return (
      <>
        {passengerListAddOnObj?.seatList && (
          <div className="passenger-details__bottom-section__seat-info seat-info">
            <div className="icon icon-seat-single" />
            {passengerListAddOnObj?.seatList}
          </div>
        )}
        { passengerListAddOnObj?.foodPreference && (
          <div className="passenger-details__bottom-section__food-info food-info">
            {passengerListAddOnObj?.foodPreference
            === CONSTANTS.PREFERENCE_TYPE.NON_VEG ? (
              <div className="icon icon-non-veg" />
              ) : (
                passengerListAddOnObj?.foodPreference && <div className="icon icon-veg" />
              )}
            {passengerListAddOnObj?.foodPreference}
          </div>
        )}
        {passengerListAddOnObj?.baggageData?.handBaggageWeight ? (
          <div className="passenger-details__bottom-section__luggage-info luggage-info">
            <div className="icon icon-cabin-bag" />
            {`${passengerListAddOnObj?.baggageData?.handBaggageWeight}KG Cabin bag`}
          </div>
        ) : null}
        {passengerListAddOnObj?.baggageData?.checkinBaggageWeight ? (
          <div className="passenger-details__bottom-section__luggage-info luggage-info">
            <div className="icon icon-checkin-bag" />
            {`${passengerListAddOnObj?.baggageData?.checkinBaggageWeight}KG Check-in bag`}
          </div>
        ) : null}
        {passengerListAddOnObj?.ssrs?.map((sItem) => {
          if (ssrCodeArr?.indexOf(sItem.ssrCode) !== -1) {
            return null;
          }
          ssrCodeArr.push(sItem?.ssrCode);
          return (
            <div
              key={sItem.ssrCode}
              className="passenger-details__bottom-section__icon-common common-style"
            >
              {
              (sItem.ssrCode === CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_TRIPLE_SEAT_DISCOUNT_CODE_EXST
                || sItem.ssrCode === CONSTANTS.PASSENGER_EXTRA_SEAT.DOUBLE_TRIPLE_SEAT_DISCOUNT_CODE_EXST_2)
                ? doubleTripleSeatIconRenderer(sItem.ssrCode, passengerListAddOnObj?.doubleTripleSeatLabel)
                : (
                  <><div className={getIconClass(sItem.ssrCode)} />
                    {converObj[sItem.ssrCode] || sItem.ssrCode}
                  </>
                )
                }
              {/* {converObj[sItem.ssrCode] || sItem.ssrCode} */}
            </div>
          );
        })}
      </>
    );
  };

  const renderChip = (liftStatus) => {
    if (liftStatus === CONSTANTS.API_LIFT_STATUS.CHECKEDIN) {
      return (
        <>
          <br />
          <span className="sector-chip sector-chip-checked-in">
            <span className="icon-check" />
            {checkedInLabel || 'Checked-In'}
          </span>
        </>
      );
    }
    if (liftStatus === CONSTANTS.API_LIFT_STATUS.NOSHOW) {
      return (
        <>
          <br />
          <span className="sector-chip sector-chip-no-show">
            <span className="icon-close-circle icon-style-common" />
            {noShowLabel || 'No-show'}
          </span>
        </>
      );
    }
    if (liftStatus === CONSTANTS.API_LIFT_STATUS.BOARDED) {
      return (
        <>
          <br />
          <span className="sector-chip sector-chip-flown">
            <span className="icon-flight icon-style-common">
              <span className="path1" />
              <span className="path2" />
              <span className="path3" />
              <span className="path4" />
            </span>
            { flownLabel || 'Flown'}
          </span>
        </>

      );
    }
    return null;
  };

  const passengerListRender = () => {
    return (
      <div className="passenger-detail__wrapper">
        {currentJourney?.segments?.length > 1 && passengerButton()}
        {paxUiData?.map((pItem, index) => {
          const seatList = getSeatsList(pItem);
          const baggageData = getBaggageList(pItem);
          const genderValue = pItem?.info?.gender !== 1 ? 'Female' : 'Male';
          const age = pItem?.info?.dateOfBirth ? getAge(pItem?.info?.dateOfBirth) : null;
          const bundleCode = getBundleCode(pItem) !== null ? getBundleCode(pItem) : null;
          const passengerType = getPassengerType(pItem?.passengerTypeCode);
          const passengerTitle = pItem?.name
            ? `${pItem?.name?.first.charAt(0)}${pItem?.name?.last.charAt(0)}`
            : '';
          const foodPreference = getPreferenceType(pItem.matchedJourney?.matchedSegment?.ssrs || []);
          const passengerTopSectionObj = {
            nomineeLabel: checkPassengerIsNotNomini(pItem) ? nomineeLabel : '',
            genderValue,
            age,
            bundleCode,
            passengerType,
          };
          if (pItem?.program?.number) {
            passengerTopSectionObj.ffNu = `${frequentFlyerNo} ${pItem?.program?.number}`;
            const tierCodeBasedLabel = getLoyaltyTierLabel(pItem?.program?.levelCode);
            passengerTopSectionObj.tier = `${tierLabel} ${tierCodeBasedLabel}`;
          }
          const { ExtraSeatTag } = pItem || '';
          const doubleTripleSeatLabel = ExtraSeatTag !== '' ? ExtraSeatTag : '';
          const passengerListAddOnObj = {
            seatList,
            baggageData,
            foodPreference,
            ssrs: pItem.matchedJourney?.matchedSegment?.ssrs || [],
            doubleTripleSeatLabel,
          };
          const liftStatus = pItem?.matchedJourney?.matchedSegment?.liftStatus || '';
          const etickerLabels = etickerLabel || { html: 'E-Ticket No: {eticketnumber}' };
          const etickerNumber = etickerLabels?.html.replace('{eticketnumber}', pItem?.eTicketNumber);
          const barcodeString = pItem?.matchedJourney?.matchedSegment?.barcodestring || '';
          return (
            <div className="passenger-details" key={uniq()}>
              <div className="passenger-details__top-section">
                <div className="passenger-details__top-section__sm-name skyplus-text sh7">
                  {passengerTitle}
                </div>
                <div className="passenger-details__top-section-container">
                  <div
                    className={`passenger-details__top-section__full-name skyplus-text sh6 acordion-header
                        ${activeAccordion === index
                      ? 'active  icon-accordion-up-simple' : 'icon-accordion-down-simple'}`}
                    onClick={() => handleToggle(index)}
                    aria-hidden="true"
                  >
                    <span className="passenger-details__top-section__full-name">{pItem.passengerName}</span>
                  </div>
                  <div className="passenger-details__top-section__p-info">
                    {getTopSectionData(passengerTopSectionObj)}
                  </div>
                  {(isCodeShareEnable > 0) && pItem?.eTicketNumber && (
                  <div className="passenger-details__top-section-pax-e-ticket">
                    {etickerNumber}
                  </div>
                  )}
                  <div className="passenger-details-middle-section">
                    {liftStatus && renderChip(liftStatus)}
                    {pItem.matchedJourney?.matchedSegment?.isShowFillHealthFormLink && fillHealthFormCtaLabel && (
                      <span className="health-form">
                        <a
                          className="health-form-fill"
                          href={bindWithDeepLinkUrl(fillHealthFormCtaPath)}
                        >{fillHealthFormCtaLabel}
                        </a>
                      </span>
                    )}
                    {pItem.matchedJourney?.matchedSegment?.isShowViewHealthFormLink && viewHealthFormCtaLabel && (
                      <span className="health-form">
                        <a
                          className="health-form-view"
                          href={bindWithDeepLinkUrl(viewHealthFormCtaPath)}
                        >{viewHealthFormCtaLabel}
                        </a>
                      </span>
                    )}
                    {pItem?.matchedJourney?.matchedSegment?.isShowBoardingPass && (
                      <span className="health-form">
                        <button
                          type="button"
                          className="health-form-download-boarding-pass"
                          onClick={
                            () => onClickViewBoardingPass(
                              pItem.matchedJourney?.journeyKey,
                              [pItem?.passengerKey],
                              downloadBoardingPassCtaPath || '',
                            )
                          }
                        >
                          {downloadBoardingPassCtaLabel || 'Donwload Boarding Pass'}
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`passenger-details__bottom-section accordion-body 
                ${activeAccordion === index ? 'expanded' : 'collapsed'}`}
                ref={refAddonSsr}
              >
                {barcodeString && (
                  <PassengerBarcode
                    barValue={barcodeString || ''}
                    barcodeTitle={barcodeTitle}
                    barcodeDescription={barcodeDescription}
                  />
                )}
                {getDataBottomSectionData(passengerListAddOnObj)}
                {
                  showMoreSsr?.show && (
                  <div className="passenger-details__bottom-section__showmore showmore">
                    {`... | +${showMoreSsr?.remainingChildToshow} more`}
                  </div>
                  )
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (!flag) {
      setFlag(true);
    }
    if (!showMoreSsr && refAddonSsr?.current !== null) {
      const getShowMoreObj = getShowMoreChild();
      setShowMoreSsr(getShowMoreObj);
    }
  }, [showMoreSsr, refAddonSsr?.current, flag]);

  return (
    <div>
      {jouneryInfoNotThereInPassenger ? (
        passengerListRender()
      ) : (
        ''
      )}
    </div>
  );
};

PassengerDetails.propTypes = {
  jKey: PropTypes.string,
};

export default PassengerDetails;
