/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext, useMemo, useEffect, useState, useRef } from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { calculateAge } from 'skyplus-design-system-app/dist/des-system/utils';
import {
  PayWithModes,
  specialFareCodes,
  Pages, LOYALTY_KEY,
} from 'skyplus-design-system-app/src/functions/globalConstants';
import Cookies from 'skyplus-design-system-app/dist/des-system/cookies';
import { COOKIE_KEYS } from '../../../constants';
import { bookingActions } from '../../../context/reducer';
import Popover from '../../common/Popover/Popover';
import PaxSelection from './PaxSelection';
import FormField from '../FormField';
import useAppContext from '../../../hooks/useAppContext';
import MobileBottom from './MobileBottom';
import { FormContext } from '../FormContext';
import { formActions } from '../formReducer';
import HintLabel from './HintLabel';
import { isSMEUser } from '../../../utils';

const { XPLORE } = Pages;
const PaxFareSelection = () => {
  const {
    dispatch,
    state: {
      additional,
      main,
      isModificationFlow,
      isLoyaltyEnabled,
      pageType,
      widgetsModel,
      nomineeDetails,
      authUser,
    },
  } = useAppContext();
  const authUserCookie = authUser || Cookies.get(COOKIE_KEYS.USER, true, true);
  const [popoverVis, setPopoverVis] = useState(false);
  const [showNomineeMessage, setShowNomineeMessage] = useState(false);
  const bookingWidgetLoaded = useRef(false);
  const [adultCount, setAdultCount] = useState(0);
  const [seniorCitizenCount, setSeniorCitizenCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);

  const nomineeMessage =
    additional?.currentNomineesNumberInfo?.replace(
      /{nomineeCount}/g,
      nomineeDetails?.length,
    ) || '';

  const {
    formState: {
      paxInfo,
      selectedSpecialFare,
      specialFares,
      specialFareError,
      sixEExclusiveError,
      promocode,
      payWith,
      LOYALTY_NOMINEE_COUNT,
    },
    dispatch: dispatch2,
  } = useContext(FormContext);

  const onSelectSpecialFare = (data) => {
    let value = data;
    if (
      isLoyaltyEnabled &&
      (authUserCookie?.loyaltyMemberInfo?.FFN || authUserCookie?.loyaltyMemberInfo?.ffn) &&
      payWith !== PayWithModes.CASH &&
      LOYALTY_NOMINEE_COUNT.CHD_COUNT === 0
    ) {
      value = {
        data,
        key: LOYALTY_KEY,
      };
    }
    dispatch2({ type: formActions.SET_SELECTED_SPECIAL_FARE, payload: value });
  };

  const maxPAxSelectionCount = useMemo(() => {
    return payWith === PayWithModes.CASH
      ? widgetsModel?.maxSeatCount
      : additional?.maximumLoyaltyTravellers;
  }, [payWith]);

  const { middleLabel, extra } = useMemo(() => {
    if (
      payWith === PayWithModes.CASH &&
      paxInfo.ADT &&
      !selectedSpecialFare &&
      !isSMEUser()
    ) {
      paxInfo.ADT.maxCount = maxPAxSelectionCount;
    }

    const total = paxInfo.ADT.Count + paxInfo.SRCT.Count + paxInfo.CHD.Count;
    const doubleSeatS =
      paxInfo.ADT.ExtraDoubleSeat +
      paxInfo.SRCT.ExtraDoubleSeat +
      paxInfo.CHD.ExtraDoubleSeat;
    const tripleSeatS =
      paxInfo.ADT.ExtraTripleSeat +
      paxInfo.SRCT.ExtraTripleSeat +
      paxInfo.CHD.ExtraTripleSeat;

    return {
      middleLabel: `${total} ${
        total > 1 ? additional.passengersLabel : additional.paxLabel
      }`,
      extra: doubleSeatS + 2 * tripleSeatS,
    };
  }, [paxInfo, payWith]);

  const dividePassengerAccordingToAge = (dob) => {
    const calculatedAge = calculateAge(dob);

    if (calculatedAge >= 60) {
      setSeniorCitizenCount((prevState) => prevState + 1);
    } else if (calculatedAge >= 2 && calculatedAge <= 12) {
      setChildrenCount((prevState) => prevState + 1);
    } else {
      setAdultCount((prevState) => prevState + 1);
    }
  };

  useEffect(() => {
    if (nomineeDetails?.length) {
      nomineeDetails.forEach((element) => {
        dividePassengerAccordingToAge(element.dob);
      });
    }
  }, []);

  useEffect(() => {
    dispatch2({
      type: formActions.SET_LOYALTY_NOMINEE_COUNT,
      payload: { adultCount, seniorCitizenCount, childrenCount },
    });
  }, [adultCount, seniorCitizenCount, childrenCount]);

  useEffect(() => {
    if (
      isLoyaltyEnabled &&
      payWith !== PayWithModes.CASH &&
      bookingWidgetLoaded.current && pageType !== 'flight-select-modification'
    ) {
      onSelectSpecialFare('');
    }
    if (isLoyaltyEnabled &&
      (authUserCookie?.loyaltyMemberInfo?.FFN || authUserCookie?.loyaltyMemberInfo?.ffn) &&
      payWith !== PayWithModes.CASH && LOYALTY_NOMINEE_COUNT.CHD_COUNT === 0 &&
      selectedSpecialFare?.specialfarecode === specialFareCodes.UMNR && bookingWidgetLoaded.current) {
      onSelectSpecialFare('');
    }
    bookingWidgetLoaded.current = true;
    setShowNomineeMessage(false);
  }, [payWith]);
  useEffect(() => {
    if (!popoverVis && payWith !== PayWithModes.CASH && isLoyaltyEnabled) {
      dispatch({ type: bookingActions.SET_SHOW_LOYALTY_BOX, payload: true });
    } else {
      dispatch({ type: bookingActions.SET_SHOW_LOYALTY_BOX, payload: false });
    }
  }, [payWith, popoverVis]);

  useEffect(() => {
    setShowNomineeMessage(false);
  }, [selectedSpecialFare]);

  return (
    <Popover
      renderElement={() => {
        return (
          <FormField
            containerClass="notsearchable"
            topLabel={main.paxAndSpecialFareLabel}
            middleLabel={middleLabel}
            hintLabel={
              <HintLabel
                extra={extra}
                defaultLabel=""
                selectedSpecialFare={selectedSpecialFare}
                extraSeatsLabel={additional.extraSeatsLabel}
              />
            }
            filled
            accessiblityProps={{
              'aria-label': 'Pax Selection',
            }}
          />
        );
      }}
      onClose={() => {
        setPopoverVis(false);
      }}
      openPopover={popoverVis}
      onOpen={() => {
        setPopoverVis(true);
        dispatch({
          type: bookingActions.SET_SHOW_LOYALTY_BOX,
          payload: false,
        });
      }}
      renderPopover={() => (
        <div className="pax-fare-selection-popover">
          <div className="pax-fare-selection-popover--mobile py-12">
            <Heading heading="h5 text-center">
              {additional.travellingWithLabel}
            </Heading>
          </div>
          {specialFares.length > 0 && pageType !== XPLORE && (
            <div className="pax-fare-selection-popover--special-fares">
              <h5 className="title" aria-label={additional.specialFareLabel}>
                {additional.specialFareLabel}
              </h5>
              <div className="pax-fare-selection-popover--special-fares__list">
                {specialFares.map((fare) => {
                  return (
                    <Chip
                      color={(selectedSpecialFare?.specialfarecode === fare?.specialfarecode) ||
                         fare.checked ? 'secondary-light' : 'white'}
                      key={fare.specialFareCode}
                      variant="filled"
                      size="md"
                      border={
                        fare.checked ? 'secondary-main' : 'secondary-deep'
                      }
                      txtcol="text-primary"
                      onClick={() => {
                        onSelectSpecialFare(fare);
                      }}
                      containerClass={
                        promocode.success ||
                        fare.disabled ||
                        (isLoyaltyEnabled &&
                          payWith !== PayWithModes.CASH &&
                          fare.specialFareCode !== specialFareCodes.UMNR)
                          ? 'disabled'
                          : `chip-special-fare ${fare.checked ? 'checked' : ''}`
                      }
                      tabIndex={0}
                      aria-label={fare.specialFareLabel}
                    >
                      {fare.specialFareLabel}
                    </Chip>
                  );
                })}
              </div>
            </div>
          )}
          {isLoyaltyEnabled && payWith !== PayWithModes.CASH ? (
            <>
              <div
                className="pax-fare-selection-popover--special-fares-6e-loyalty-message
                body-small-regular p-2 bg-secondary-medium px-8 py-3 py-md-6 text-secondary"
              >
                <p>{additional?.loyaltyPermittedMembersInfo}</p>
              </div>
              <div className="pax-fare-selection-popover--special-fares-bottom-line w-100 mt-6" />
            </>
          ) : (
            <HtmlBlock
              className="error mx-8 mt-2 mb-4 body-small-regular error6e"
              html={specialFareError || sixEExclusiveError}
            />
          )}
          {isLoyaltyEnabled &&
            authUserCookie?.loyaltyMemberInfo?.FFN &&
            payWith !== PayWithModes.CASH &&
            showNomineeMessage && (
              <div
                className={`d-flex mt-6 px-8 ${
                  nomineeDetails?.length <= additional.maximumLoyaltyNominees
                    ? 'justify-content-between'
                    : 'justify-content-end'
                }`}
              >
                <p className="error body-small-regular">
                  {selectedSpecialFare?.specialfarecode ===
                  specialFareCodes.UMNR
                    ? `You have ${LOYALTY_NOMINEE_COUNT.CHD_COUNT} Children Nominee`
                    : nomineeMessage}
                </p>
                <a
                  href={additional?.addNomineeCtaPath}
                  className={`add-nominee-btn-6e-loyalty tags-medium text-capitalize
                    text-decoration-underline text-primary-main`}
                >
                  {additional.addNomineeCta}
                </a>
              </div>
            )}
          <div className="pax-fare-selection-popover--login">
            <div className="pax-fare-selection-popover--login__left" />
            <div className="pax-fare-selection-popover--login__right" />
          </div>
          {payWith === PayWithModes.CASH ? (
            <HtmlBlock
              html={additional.extraAssistanceLabels.html}
              className="pax-fare-selection-popover--group-booking"
            />
          ) : (
            ''
          )}
          <PaxSelection setShowNomineeMessage={setShowNomineeMessage} />
          <MobileBottom
            middleLabel={middleLabel}
            selectedSpecialFare={selectedSpecialFare}
            doubleSeat={extra}
            extraSeatsLabel={additional.extraSeatsLabel}
            continueCtaLabel={additional.continueCtaLabel}
          />
        </div>
      )}
      containerClass={`search-widget-form-body__pax-fare-selection ${
        isModificationFlow ? 'disabled' : ''
      }`}
    />
  );
};

PaxFareSelection.propTypes = {};

export default PaxFareSelection;
