import PropTypes from 'prop-types';
import React, { useState, useContext, useMemo, useEffect } from 'react';
// Old Code:
// import { UncontrolledTooltip } from "reactstrap";
// import map from 'lodash/map';
// import ShowMore from '../../ShowMore/ShowMore';
// import RadioButtonComponent from './RadioButtonComponent/RadioButtonComponent';
// import StepperInput from './StepperInput';
import get from 'lodash/get';

import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { AppContext } from '../../../context/AppContext';
import { formatCurrencyFunc } from '../../../functions/utils';
import { categoryCodes } from '../../../constants/index';
import {
  getBaggageSSRCodeName,
  defaultExcessBaggageRow,
} from './ExcessBaggageUtils';
import ExcessBaggageRadioContainer from './ExcessBaggageRadioContainer';

/**
 *
 * @type {React.FC<*>}
 * @returns
 */
const ExcessBaggageTab = ({
  addonData,
  ssrList,
  onChangeTabUserData,
  tabIndex,
  tripIndex,
  // setDelayLostProtection,
  // delayLostProtection,
  passengerKey,
  // checkBoxChecked,
  // setCheckBoxChecked,
  // configData,
  // brbCategory,
  segmentData,
  excessBaggageFormData,
  // setSelectedPrice,
  onClickReset,
  showReset,
  isMainCard,
  // submitDetails,
  setIsSubmit,
  setTotalPrice,
  // totalPrice,
  // loyaltyData,
}) => {
  const AEMData = addonData?.availableSlidePaneData[0];

  const {
    state: { isInternationalFlight, categories, loggedInLoyaltyUser },
  } = useContext(AppContext);

  const abhfCategory = useMemo(() => {
    let abhf = segmentData.journeySSRs.find(
      (row) => row.category === categoryCodes.abhf,
    );
    if (abhf && (abhf?.ssrs?.length > 0 || abhf?.takenssr?.length > 0)) {
      const cat = Reflect.get(categories, categoryCodes?.abhf);

      abhf = { ...abhf, ...abhf.ssrs.at(0) };
      return { ...cat, ...abhf };
    }

    return null;
  }, []);

  const tabValue = get(
    excessBaggageFormData,
    [tripIndex, tabIndex],
    defaultExcessBaggageRow,
  );

  useEffect(() => {
    let additionalBagCount = 0;
    excessBaggageFormData[tripIndex]?.forEach((pasSsrArray) => {
      additionalBagCount += pasSsrArray.additionalBag;
    });
    if (additionalBagCount > 0) {
      const selectPacsPrice = additionalBagCount * abhfCategory.price;
      setTotalPrice(selectPacsPrice);
    }
  }, [tabValue]);

  /* Old Code:
  const getSsrKey = () => {
    const passengerSrr = abhfCategory.passengersSSRKey.find(
      (row) => row.passengerKey === passengerKey,
    );

    if (passengerSrr) {
      return passengerSrr.ssrKey;
    }
  };

  const minusClickHandler = () => {
    const value = tabValue.additionalBag - 1;
    let additionalPiece = totalPrice - abhfCategory.price;
    if (tabValue.allowABHFChange) {
      if (additionalPiece < 0) {
        additionalPiece = 0;
      }
      setTotalPrice(additionalPiece);
      onChangeTabUserData(tabIndex, 'additionalBag', value, {
        currencycode: abhfCategory.currencycode,
        price: abhfCategory.price,
        name: `${value} ${abhfCategory.AEMData.title}`,
        analytxName: abhfCategory.AEMData.title,
        ssrKey: getSsrKey(),
        ssrCode: abhfCategory.ssrCode,
      });
    }
  };

  const plusClickHandler = () => {
    const value = tabValue.additionalBag + 1;
    const additionalPiece = totalPrice + abhfCategory.price;
    if (tabValue.allowABHFChange) {
      setTotalPrice(additionalPiece);
      onChangeTabUserData(tabIndex, 'additionalBag', value, {
        currencycode: abhfCategory.currencycode,
        price: abhfCategory.price,
        analytxName: abhfCategory.AEMData.title,
        name: `${value} ${abhfCategory.AEMData.title}`,
        ssrKey: getSsrKey(),
        ssrCode: abhfCategory.ssrCode,
      });
    }
  }; */

  /**
   *@param {string} key
   *@param {string} value
   *@param {string} price
   *@param {string} name
   */
  // TD: First listner
  const onChangeRadioOption = (
    key,
    value,
    price,
    name,
    currencycode,
    ssrCode,
    earnPoints,
    discountper,
    originalPrice,
  ) => {
    if (tabValue.allowBaggageChange) {
      // Old Code:
      // setSelectedPrice(price);
      onChangeTabUserData(tabIndex, key, value, {
        currencycode,
        price,
        name: `${name} ${addonData.title}`,
        ssrCode,
        earnPoints,
        discountper,
        originalPrice,
      });
      setIsSubmit(true);
    }
  };

  /**
   * Only flight with group ["Domestic", "International"] are allowed to show
   */
  const flights = useMemo(() => {
    const order = { Domestic: [], International: [] };

    const selectedValue = tabValue.domestic || tabValue.international;
    if (!tabValue.allowBaggageChange) {
      const preselectedSSr = ssrList.find(
        (ssr) => ssr.ssrKey === selectedValue,
      );
      order[preselectedSSr?.group]?.push(preselectedSSr);
    } else {
      ssrList.forEach(({ group, ...item }) => {
        if (Reflect.has(order, group)) {
          order[group]?.push(item);
        }
      });
    }

    for (const key in order) {
      if (Object.hasOwnProperty.call(order, key) && order[key]?.length === 0) {
        delete order[key];
      }
    }

    return order;
  }, [ssrList]);
  const [radioSelected, setRadioSelected] = useState(true);
  const onChangeHandler = () => {
    setRadioSelected(true);
    onClickReset(passengerKey);
  };

  const getDicountPercentage = (flight) => {
    return flight?.Domestic?.[0]?.discounterPer || flights?.International?.[0]?.discounterPer;
  };
  useEffect(() => {
    if (tabValue?.checked) {
      setRadioSelected(false);
    }
  }, [tabValue]);

  return (
    <div className="d-flex flex-column" key={passengerKey}>
      {!isMainCard && (
        <div className="skyplus-excess-baggage__title h0">
          {AEMData?.sliderTitle}
        </div>
      )}
      {/* TD: Update Heading typography */}
      {!isMainCard && (
        <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
          <div
            dangerouslySetInnerHTML={{
              __html: AEMData?.sliderDescription.html,
            }}
          />
        </Heading>
      )}

      {/* Radio Container comp */}
      {isMainCard && (
        <>
          <h3 className="skyplus-addon-mf__addon-group-title">
            {addonData?.title || 'Baggage'}
          </h3>
          {/* TD: Update after design update */}
          {loggedInLoyaltyUser && getDicountPercentage(flights) && (
            <div
              className="skyplus-excess-baggage__group-description"
              dangerouslySetInnerHTML={{
                __html: AEMData?.loyaltyDescription?.html?.replace(
                  '{number}',
                  getDicountPercentage(flights) || 0,
                ),
              }}
            />
          )}
          <ExcessBaggageRadioContainer
            flights={flights}
            isInternationalFlight={isInternationalFlight}
            AEMData={AEMData}
            getBaggageSSRCodeName={getBaggageSSRCodeName}
            formatCurrencyFunc={formatCurrencyFunc}
            onChangeRadioOption={onChangeRadioOption}
            tabValue={tabValue}
            onClickReset={onClickReset}
            passengerKey={passengerKey}
            showReset={showReset}
            onChangeHandler={onChangeHandler}
            setRadioSelected={setRadioSelected}
            radioSelected={radioSelected}
            loggedInLoyaltyUser={loggedInLoyaltyUser}
          />
        </>
      )}

      {/* TD: Remove and add in additional Baggage: {!isMainCard && (
      <div>
        {abhfCategory && (
        <div className="skyplus-excess-baggage__addition-baggage">
          <h2 className="skyplus-excess-baggage__addition-baggage-title sh6">
            {AEMData?.preBookTitle}
          </h2>
          <div className="skyplus-excess-baggage__addition-baggage-details">
            <div className="skyplus-excess-baggage__addition-baggage-pacs">
              <div className="body-medium-regular skyplus-excess-baggage__addition-label">
                {AEMData?.addAdditionalPiece}
              </div>
              <StepperInput
                value={tabValue.additionalBag}
                maxInfantCount={
                  tabValue.allowABHFChange ? abhfCategory?.limitPerPassenger : tabValue.additionalBag
                }
                minPaxCount={
                  tabValue.allowABHFChange ? abhfCategory?.limitPerPassenger : 0
                }
                minusClickHandler={minusClickHandler}
                plusClickHandler={plusClickHandler}
              />
            </div>
            <div className="body-small-light skyplus-excess-baggage__price-title">
              {`${abhfCategory?.priceToDisplay} ${AEMData.perPieceLabel}`}
            </div>
          </div>
        </div>
        )}
      </div>
      )} */}
      {/* Old Code: {brbCategory && (
        <ExcessBaggageLostProtection
          AEMData={AEMData}
          setDelayLostProtection={setDelayLostProtection}
          delayLostProtection={delayLostProtection}
          brbCategory={brbCategory}
          checkBoxChecked={checkBoxChecked}
          setCheckBoxChecked={setCheckBoxChecked}
          readMoreLabel={configData?.readMoreLabel}
          readLessLabel={configData?.readLessLabel}
        />
      )}

      <div className="excess-baggage__departure">
        <div
          className="excess-baggage__departure-condition"
          dangerouslySetInnerHTML={{
            __html: isInternationalFlight
              ? AEMData?.termsAndConditionsInternational?.html ?? ''
              : AEMData?.termsAndConditions?.html ?? '',
          }}
        />
      </div> */}
    </div>
  );
};

ExcessBaggageTab.propTypes = {
  addonData: PropTypes.shape({
    availableSlidePaneData: PropTypes.any,
    title: PropTypes.any,
  }),
  // brbCategory: PropTypes.any,
  // checkBoxChecked: PropTypes.any,
  configData: PropTypes.shape({
    readLessLabel: PropTypes.any,
    readMoreLabel: PropTypes.any,
  }),
  // delayLostProtection: PropTypes.any,
  excessBaggageFormData: PropTypes.any,
  onChangeTabUserData: PropTypes.func,
  passengerKey: PropTypes.any,
  segmentData: PropTypes.array,
  // setCheckBoxChecked: PropTypes.any,
  // setDelayLostProtection: PropTypes.any,
  ssrList: PropTypes.array,
  tabIndex: PropTypes.any,
  tripIndex: PropTypes.any,
  onClickReset: PropTypes.func,
  isMainCard: PropTypes.func,
  // submitDetails: PropTypes.func,
  setTotalPrice: PropTypes.func,
  // totalPrice: PropTypes.number,
  // loyaltyData: PropTypes.object,
  showReset: PropTypes.func,
  setIsSubmit: PropTypes.func,
};

export default ExcessBaggageTab;
