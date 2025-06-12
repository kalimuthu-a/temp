import PropTypes from 'prop-types';
import React, { useContext, useMemo, useEffect } from 'react';
// Old Code:
// import { UncontrolledTooltip } from "reactstrap";
// import { formatCurrencyFunc } from '../../../functions/utils';
// import ShowMore from '../../ShowMore/ShowMore';
// import map from 'lodash/map';
import get from 'lodash/get';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import { AppContext } from '../../../context/AppContext';
import StepperInput from './StepperInput';
import { categoryCodes } from '../../../constants/index';
import {
  // getBaggageSSRCodeName,
  defaultAddtionalBaggageRow,
} from './AdditionalBaggageUtils';

/**
 *
 * @type {React.FC<*>}
 * @returns
 */
const AdditionalBaggageTab = ({
  addonData,
  // ssrList,
  onChangeTabUserData,
  tabIndex,
  tripIndex,
  // setDelayLostProtection,
  // delayLostProtection,
  // checkBoxChecked,
  // setCheckBoxChecked,
  // brbCategory,
  passengerKey,
  // configData,
  segmentData,
  additionalBaggageFormData,
  // setSelectedPrice,
  // onClickReset,
  // showReset,
  // submitDetails,
  // setIsSubmit,
  setTotalPrice,
  totalPrice,
}) => {
  const AEMData = addonData?.availableSlidePaneData[0];
  const {
    state: { categories },
  } = useContext(AppContext);

  const abhfCategory = useMemo(() => {
    let abhf = segmentData.journeySSRs.find(
      (row) => row.category === categoryCodes.abhf,
    );
    if (abhf && (abhf.ssrs.length > 0 || abhf.takenssr?.length > 0)) {
      const cat = Reflect.get(categories, categoryCodes.abhf);

      abhf = { ...abhf, ...abhf.ssrs.at(0) };
      return { ...cat, ...abhf };
    }

    return null;
  }, []);

  const tabValue = get(
    additionalBaggageFormData,
    [tripIndex, tabIndex],
    defaultAddtionalBaggageRow,
  );

  useEffect(() => {
    let additionalBagCount = 0;
    // eslint-disable-next-line array-callback-return
    additionalBaggageFormData[tripIndex]?.map((pasSsrArray) => {
      additionalBagCount += pasSsrArray.additionalBag;
    });
    if (additionalBagCount > 0) {
      const selectPacsPrice = additionalBagCount * (abhfCategory.price);
      setTotalPrice(selectPacsPrice);
    }
  }, [tabValue]);

  const getSsrKey = () => {
    const passengerSrr = abhfCategory.passengersSSRKey.find(
      (row) => row.passengerKey === passengerKey,
    );

    if (passengerSrr) {
      return passengerSrr.ssrKey;
    }
    return null;
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
  };

  /**
   *@param {string} key
   *@param {string} value
   *@param {string} price
   *@param {string} name
   */
  /* TD: First listner
  const onChangeRadioOption = (
    key,
    value,
    price,
    name,
    currencycode,
    ssrCode,
  ) => {
    if (tabValue.allowBaggageChange) {
      setSelectedPrice(price);
      onChangeTabUserData(tabIndex, key, value, {
        currencycode,
        price,
        name: `${name} ${addonData.title}`,
        ssrCode,
      });
      setIsSubmit(true);
    }
  }; */

  /**
   * Only flight with group ["Domestic", "International"] are allowed to show
   */
  /* Old Code:
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
      if (Object.hasOwnProperty.call(order, key)) {
        if (order[key].length === 0) {
          delete order[key];
        }
      }
    }

    return order;
  }, [ssrList]);
  const [radioSelected, setRadioSelected] = useState(false);
  const onChangeHandler = () => {
    setRadioSelected(true);
    onClickReset(passengerKey);
  }; */

  return (
    <div className="d-flex flex-column" key={passengerKey}>
      <div className="skyplus-excess-baggage__title h0">{AEMData?.sliderTitle}</div>
      {/* TD Update Heading typography */}
      <Heading heading="h5" mobileHeading="h5" containerClass="mt-6">
        <div
          dangerouslySetInnerHTML={{
            __html: AEMData?.sliderDescription.html,
          }}
        />
      </Heading>
      {AEMData?.additionalBaggageNote?.plaintext && (
        <div className="body-small-regular text-secondary">
          {AEMData?.additionalBaggageNote?.plaintext}
        </div>
      )}
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
                  value={tabValue?.additionalBag}
                  maxInfantCount={
                    tabValue?.allowABHFChange ? abhfCategory?.limitPerPassenger : tabValue?.additionalBag
                  }
                  minPaxCount={
                    tabValue?.allowABHFChange ? abhfCategory?.limitPerPassenger : 0
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
      {/* Old Code:- {brbCategory && (
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
      )} */}

      {/* Old Code:- <div className="excess-baggage__departure">
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

AdditionalBaggageTab.propTypes = {
  addonData: PropTypes.shape({
    availableSlidePaneData: PropTypes.any,
    categoryTitle: PropTypes.any,
  }),
  configData: PropTypes.shape({
    readLessLabel: PropTypes.any,
    readMoreLabel: PropTypes.any,
  }),
  additionalBaggageFormData: PropTypes.any,
  onChangeTabUserData: PropTypes.func,
  passengerKey: PropTypes.any,
  segmentData: PropTypes.array,
  tabIndex: PropTypes.any,
  tripIndex: PropTypes.any,
  setTotalPrice: PropTypes.func,
  totalPrice: PropTypes.number,
};

export default AdditionalBaggageTab;
