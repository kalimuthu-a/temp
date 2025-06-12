import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'skyplus-design-system-app/dist/des-system/Accordion';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { getPassengerName } from '../../../functions';
import CardContainer from '../CardContainer/CardContainer';
import { genderType, paxCodes, paxTrevelType } from '../../../constants';

const DisplayPassenger = ({
  passengerDetails,
  containerConfigData,
  isModifyFlow,
  isChangeFlow,
  isNextFare,
  setCheckAmenities,
  onChangeHandler,
  checkAmenities,
  isChecked,
  setIsChecked,
  fareCategory,
}) => {
  const {
    state: {
      getTrips,
      getTokenAddon,
      tripIndex,
      getJourneyKey,
      paxIndex,
      setGetSelectedAddon,
      getAddonData,
      ...state
    },
    dispatch,
  } = React.useContext(AppContext);

  const mfData = containerConfigData?.mfData?.data?.addOnsMainByPath?.item;

  const [paxProp, setPaxProp] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOnload, setIsOnload] = useState(true);

  // Old Code:
  // const passengerIndex = paxIndex ? paxIndex[tripIndex]?.paxIndex : 0;

  const setPaxIndex = (index) => {
    const paxIndexNew = [];
    if (!paxIndexNew[tripIndex]) {
      paxIndexNew[tripIndex] = { paxIndex: 0 };
    }
    paxIndexNew[tripIndex].paxIndex = index;
    dispatch({
      type: addonActions.SET_GET_PAX_INDEX,
      payload: paxIndexNew,
    });
  };

  const updateSelectedAddonName = (passengerKey) => {
    let addonList = [];
    setGetSelectedAddon?.[tripIndex]?.selectedAddone.forEach((addonItem) => {
      if (addonItem.passengerKey === passengerKey) {
        addonList.push(addonItem.addonName);
      }
    });
    // Check for complimentary / select on board meals
    if (
      state.mlstBundleFare[tripIndex]?.isSelected || state.primBundleFare[tripIndex]?.isSelected
    ) {
      // Old Code:
      // const seatAndEatBundleLabel = mfData?.seatAndEatBundleLabel;
      // const primeBundleLabel = mfData?.primeBundleLabel;

      const seatAndEatBundleLabel = state.mlstBundleFare[tripIndex]?.title;
      const primeBundleLabel = state.primBundleFare[tripIndex]?.title;

      const bundleSelectionData = addonList.find(
        (item) => item === seatAndEatBundleLabel || item === primeBundleLabel,
      );

      if (
        (!bundleSelectionData || bundleSelectionData?.length === 0) && state.mlstBundleFare[tripIndex]?.isSelected
      ) {
        addonList.push(seatAndEatBundleLabel);
      }
      if (
        (!bundleSelectionData || bundleSelectionData?.length === 0) && state.primBundleFare[tripIndex]?.isSelected
      ) {
        addonList.push(primeBundleLabel);
      }

      addonList = addonList.map((addon) => ((addon === seatAndEatBundleLabel || addon === primeBundleLabel)
        ? containerConfigData?.configJson?.data?.addonAdditionalByPath?.item?.curatedComboLabel : addon));
    }

    addonList = [...new Set(addonList)];
    return addonList.join(' | ');
    // Old Code:
    // return addonList.length > 1
    //   ? `${addonList[0]
    //   }, ${
    //     addonList[1].substring(0, 2)
    //   }... +${
    //     addonList.length - 1
    //   } ` +
    //   'more'
    //   : addonList[0] ?? null;
  };

  const getPaxType = (passenger) => {
    switch (passenger?.passengerTypeCode) {
      case paxCodes.adult.code: {
        if (passenger?.discountCode === paxCodes.seniorCitizen.discountCode) {
          return paxCodes.seniorCitizen.label;
        }
        return paxCodes.adult.label;
      }

      case paxCodes.children.code: {
        return paxCodes.children.label;
      }

      case paxCodes.infant.code: {
        return paxCodes.infant.label;
      }

      default:
        return '';
    }
  };

  const getIsNominee = (passeger) => {
    const documentNumber = passeger?.travelDocuments?.[0]?.number || '';
    return documentNumber.split('|')?.[0].trim() === paxTrevelType.nominee;
  };

  const setProps = () => {
    const newPaxProp = [];
    passengerDetails?.forEach((passenger, index) => {
      const { name = '', passengerKey } = passenger;
      const fullName = name ? getPassengerName(passenger) : passengerKey;
      const addedAddonLabel = updateSelectedAddonName(passengerKey);
      const paxInfo = [];
      if (getIsNominee(passenger)) {
        paxInfo.push('Nominee');
      }
      paxInfo.push(getPaxType(passenger));
      paxInfo.push(genderType[passenger?.info?.gender]);

      const data = {
        title: fullName,
        subTitle: paxInfo.join(' | '),
        age: '28 years old',
        addedAddons: addedAddonLabel,
        renderAccordionContent: <CardContainer
          getAddonData={getAddonData}
          sliderPaneConfigData={containerConfigData?.configJson?.data?.addonAdditionalByPath?.item}
          addonsContainer={containerConfigData?.mfData?.data?.addOnsMainByPath?.item}
          passengerDetails={passengerDetails}
          key={passenger.passengerKey}
          passengerKey={passenger.passengerKey}
          passenger={passenger}
          tripId={tripIndex}
          isModifyFlow={isModifyFlow}
          activeAccordionIndex={index}
          fareCategory={fareCategory}
        />,
      };
      newPaxProp.push(data);
      /* Old Code: return (
        <li
          className={`passenger-container__paxlist__paxInfo ${
          passengerIndex === index ? 'active' : ''
          }`}
          key={passengerKey}
          onClick={() => setPaxIndex(index)}
        >
          <p className="psg-label">{`Passenger ${index + 1}`}</p>
          <p className="psg-name">{fullName}</p>
          {addedAddonLabel ? (
            <p className="psg-label opted" key={`key-${passengerKey}`}>
              {addedAddonLabel}
            </p>
          ) : (
            <p className="psg-label" key={`key-${passengerKey}`}>
              {mfData.noserviceaddedlabel}
            </p>
          )}
        </li>
      ); */
    });
    setPaxProp(newPaxProp);
  };

  const isFirstPaxHasData = (paxList, selectedAddonList) => {
    const paxHasData = [];
    let firstPaxHasData = false;
    paxList?.forEach((pax, index) => {
      paxHasData[index] = [];
      selectedAddonList?.forEach((addon) => {
        if (pax.passengerKey === addon.passengerKey) {
          paxHasData[index].push(addon);
        }
      });
    });

    paxHasData?.forEach((paxAddon, index) => {
      if (index === 0 && paxAddon?.length > 0) {
        firstPaxHasData = true;
      } else if (index !== 0 && paxAddon?.length > 0) {
        firstPaxHasData = false;
      }
    });
    return firstPaxHasData;
  };

  useEffect(() => {
    setProps();
    if (passengerDetails?.length > 1 &&
      isFirstPaxHasData(passengerDetails, setGetSelectedAddon[tripIndex]?.selectedAddone) &&
      !isChangeFlow && !isModifyFlow && !isNextFare) {
      // Uncomment the below code for WEB-2673
      setCheckAmenities(true);
    } else {
      setCheckAmenities(false);
      setIsChecked(false);
    }
  }, [passengerDetails, setGetSelectedAddon, setGetSelectedAddon[tripIndex]?.selectedAddone, tripIndex, fareCategory]);

  useEffect(() => {
    setPaxIndex(activeIndex);
    if (!isOnload) {
      setTimeout(() => {
        const activeAccordionEle = document.querySelector('.skyplus-accordion__header--active');
        activeAccordionEle?.scrollIntoView(true);
      });
    } else {
      setIsOnload(false);
    }
  }, [activeIndex]);

  const props = {
    accordionData: paxProp,
    activeIndex,
    setActiveIndex,
    isChecked,
    onChangeHandler,
    checkAmenities,
    mfData,
  };

  return paxProp.length > 0 && (<Accordion {...props} />);
};

DisplayPassenger.propTypes = {
  passengerDetails: PropTypes.array,
  containerConfigData: PropTypes.any,
  isModifyFlow: PropTypes.string,
  isChangeFlow: PropTypes.bool,
  isNextFare: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  checkAmenities: PropTypes.bool,
  isChecked: PropTypes.bool,
  setCheckAmenities: PropTypes.func,
  setIsChecked: PropTypes.func,
  fareCategory: PropTypes.object,
};

export default DisplayPassenger;
