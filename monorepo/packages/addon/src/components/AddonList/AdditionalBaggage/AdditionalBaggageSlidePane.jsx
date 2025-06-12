import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
// Old Code:
// import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';

import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import AdditionalBaggageTab from './AdditionalBaggageTab';
import {
  createEventForAddonModification,
  getPassengerName,
} from '../../../functions';
import { emptyFn } from '../../../functions/utils';
import { disableBaggageRemoveButton } from './AdditionalBaggageUtils';
import eventService from '../../../services/event.service';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

/**
 *
 * @type {React.FC<import("../../../../types/AddOnList").AdditionalBaggageSlidePaneProps>}
 * @returns {React.FunctionComponentElement}
 */
const AdditionalBaggageSlidePane = ({
  isOpen,
  onClose,
  addonData,
  configData,
  passengerDetails,
  ssrCategory,
  onSubmit,
  brbCategory,
  segmentData,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      tripIndex,
      paxIndex,
      additionalBaggageData,
      delayLostBaggageProtection,
    },
    dispatch,
  } = useContext(AppContext);

  const [passengerTabProps, setPassengerTabProps] = useState({
    tabs: [],
    showSingleTabBtn: false,
    content: [],
    defaultActiveTab: 0,
  });
  const AEMData = addonData?.availableSlidePaneData[0];
  const additionalBaggageConfig = addonData?.availableSSR[0];
  const [delayLostProtection, setDelayLostProtection] = useState(
    delayLostBaggageProtection,
  );
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [additionalBaggageFormData, setAdditionalBaggageFormData] = useState(
    [],
  );
  // Old Code:
  // const [selectedPrice, setSelectedPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    setAdditionalBaggageFormData(additionalBaggageData?.data || []);
  }, []);

  const additionalBaggageSlideProps = {
    overlayCustomClass: '',
    modalCustomClass: 'excess-baggage-slide-pane',
    title: `${AEMData?.sliderTitle}`,
    onClose: () => onClose(false),
    containerClassName: 'skyplus-offcanvas__addon-mf',
  };
  const onChangeTabUserData = (tabIndex, key, value, extra) => {
    const data = cloneDeep(additionalBaggageFormData);
    const tripIndexRow = get(data, [tripIndex], {});
    const tabIndexItem = get(tripIndexRow, [tabIndex], {});
    tabIndexItem[key] = value;

    if (key === 'domestic') {
      tabIndexItem.international = null;
      tabIndexItem.domesticE = extra;
      tabIndexItem.checked = Boolean(value) || tabIndexItem.additionalBag > 0;
    } else if (key === 'international') {
      tabIndexItem.domestic = null;
      tabIndexItem.internationalE = extra;
      tabIndexItem.checked = Boolean(value) || tabIndexItem.additionalBag > 0;
    } else {
      tabIndexItem.baggageE = extra;
      tabIndexItem.checked =
        Boolean(value) ||
        Boolean(tabIndexItem.domestic) ||
        Boolean(tabIndexItem.international);
    }

    setAdditionalBaggageFormData([
      ...additionalBaggageFormData.slice(0, tripIndex),
      tripIndexRow,
      ...additionalBaggageFormData.slice(tripIndex + 1),
    ]);
  };

  const onClickReset = (tabKey) => {
    const _additionalBaggageFormData = [...additionalBaggageFormData];
    setTotalPrice(0);
    // Old Code:
    // setSelectedPrice(0);
    _additionalBaggageFormData[tripIndex] = _additionalBaggageFormData[
      tripIndex
    ].map((row) => ({
      ...row,
      ...(row.passengerKey === tabKey && {
        ...disableBaggageRemoveButton(row),
        checked: false,
        allowABHFChange: row.allowABHFChange,
        allowBRBChange: row.allowBRBChange,
        allowBaggageChange: row.allowBaggageChange,
        domestic: row.allowBaggageChange ? null : row.domestic,
        additionalBag: row.allowABHFChange ? 0 : row.additionalBag,
        international: row.allowBaggageChange ? null : row.international,
      }),
    }));
    setAdditionalBaggageFormData(_additionalBaggageFormData);
    setDelayLostProtection(false);
    setCheckBoxChecked(false);
    setIsSubmit(true);
  };

  const submitDetails = () => {
    const newState = additionalBaggageData?.data || [];
    const ssrObjToRemove = [];
    if (!newState[tripIndex]) {
      newState[tripIndex] = [];
    }
    newState[tripIndex] = additionalBaggageFormData[tripIndex].map(
      (row, index) => {
        const { domesticE, internationalE, passengerKey, baggageE } =
          newState[tripIndex][index] ?? {};
        const baggageSSRData = {
          ...domesticE,
          ...internationalE,
        };

        ssrObjToRemove.push({
          ssrCode: baggageSSRData.ssrCode,
          passengerKey,
          journeyKey: segmentData.journeyKey,
          action: 'remove',
        });

        ssrObjToRemove.push({
          journeyKey: segmentData.journeyKey,
          passengerKey,
          ssrCode: baggageE?.ssrCode,
          action: 'remove',
        });
        return disableBaggageRemoveButton(row);
      },
    );

    eventService.update([], ssrObjToRemove, false);

    createEventForAddonModification(ssrObjToRemove);

    const _additionalBaggageData = {
      ...additionalBaggageData,
      data: newState,
      delayLostProtection,
    };

    dispatch({
      type: addonActions.UPDATE_ADDITIONAL_BAGGAGE_FORM_DATA,
      payload: {
        tripIndex,
        delayLostProtection,
        additionalBaggageData: _additionalBaggageData,
      },
    });

    onSubmit();
  };

  const showReset = useMemo(() => {
    if (delayLostProtection) {
      return true;
    }

    return additionalBaggageFormData?.[tripIndex]?.some((row) => {
      const { additionalBag, domestic, international } = row;
      return additionalBag !== 0 || domestic !== null || international !== null;
    });
  }, [delayLostProtection, additionalBaggageFormData, tripIndex]);

  const getParentTabData = () => {
    const passengers = cloneDeep(passengerDetails);

    const tabData = [];
    const contentData = [];

    passengers.forEach((passenger, index) => {
      const passengerName = getPassengerName(passenger);
      const { passengerKey } = passenger;

      const ssrList = additionalBaggageConfig?.ssrs?.map((ssrItem) => {
        const passengersSSRKey = ssrItem.passengersSSRKey.find(
          (_item) => _item.passengerKey === passengerKey,
        );

        let ssrKey;

        if (passengersSSRKey) {
          ssrKey = passengersSSRKey.ssrKey;
        }

        return {
          ...ssrItem,
          ssrKey,
        };
      });

      const tabItem = {
        title: passengerName,
        passengerKey: passenger.passengerKey,
        // checked:
        //   get(additionalBaggageFormData, [tripIndex, index, 'checked'], false) ||
        //   delayLostProtection,
        checked:
          additionalBaggageFormData?.[tripIndex]?.[index]?.additionalBag > 0,
      };

      tabData.push(tabItem);

      contentData.push(
        <AdditionalBaggageTab
          ssrList={ssrList}
          addonData={addonData}
          configData={configData}
          ssrCategory={ssrCategory}
          onChangeTabUserData={onChangeTabUserData}
          tabIndex={index}
          tripIndex={tripIndex}
          setDelayLostProtection={setDelayLostProtection}
          delayLostProtection={delayLostProtection}
          passengerKey={passengerKey}
          checkBoxChecked={checkBoxChecked}
          setCheckBoxChecked={setCheckBoxChecked}
          key={passengerKey}
          brbCategory={brbCategory}
          segmentData={segmentData}
          additionalBaggageFormData={additionalBaggageFormData}
          // setSelectedPrice={setSelectedPrice}
          setTotalPrice={setTotalPrice}
          totalPrice={totalPrice}
          onClickReset={onClickReset}
          showReset={showReset}
          submitDetails={submitDetails}
          setIsSubmit={setIsSubmit}
          sliderPaneConfigData={sliderPaneConfigData}
        />,
      );
    });

    const props = {
      tabs: tabData,
      content: contentData,
      defaultActiveTab: paxIndex[tripIndex]?.paxIndex || 0,
      showSingleTabBtn: false,
    };

    setPassengerTabProps(props);
  };

  useEffect(() => {
    getParentTabData();
  }, [
    tripIndex,
    paxIndex,
    additionalBaggageFormData,
    delayLostProtection,
    checkBoxChecked,
  ]);

  useEffect(() => {
    if (isSubmit) {
      setIsSubmit(false);
      submitDetails();
    }
  }, [isSubmit]);

  /* Old Code: Clear all functionality
   const onClickReset = () => {
    const _additionalBaggageFormData = [...additionalBaggageFormData];
    setTotalPrice(0);
    setAdditionalPrice(0);
    setSelectedPrice(0);
    _additionalBaggageFormData[tripIndex] = _additionalBaggageFormData[tripIndex].map(
      (row) => ({
        ...row,
        ...disableBaggageRemoveButton(row),
        checked: false,
        allowABHFChange: row.allowABHFChange,
        allowBRBChange: row.allowBRBChange,
        allowBaggageChange: row.allowBaggageChange,
        domestic: row.allowBaggageChange ? null : row.domestic,
        additionalBag: row.allowABHFChange ? 0 : row.additionalBag,
        international: row.allowBaggageChange ? null : row.international,
      }),
    );
    setAdditionalBaggageFormData(_additionalBaggageFormData);
    setDelayLostProtection(false);
    setCheckBoxChecked(false);
  }; */

  // Old Code:
  // const buttonNotDisabled = useMemo(() => {
  //   return additionalBaggageData.data?.[tripIndex]?.some((row) => {
  //     const { additionalBag, domestic, international } = row;
  //     return additionalBag !== 0 || domestic !== null || international !== null;
  //   });
  // }, [additionalBaggageData, tripIndex, delayLostProtection]);

  const buttonDisabled = useMemo(() => {
    let isDisabled = true;
    additionalBaggageFormData?.[tripIndex]?.forEach((row) => {
      const { additionalBag } = row;
      if (additionalBag > 0) {
        isDisabled = false;
      }
    });
    return isDisabled;
  }, [additionalBaggageFormData, tripIndex]);

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'medium',
    disabled: false,
  };
  const additionalBagApiObj = addonData?.availableSSR[0]?.ssrs[0];
  return (
    <div>
      {isOpen && (
        <OffCanvas {...additionalBaggageSlideProps}>
          {/* TD Clear All */}
          {/* Old Code:- {showReset && (
            <button
              className="quick-board__clear"
              type="button"
              onClick={onClickReset}
            >
              {configData?.clearAllLabel}
            </button>
          )} */}
          <div className="skyplus-excess-baggage">
            {/* TD for showing single passanger name in excess Baggege addon-mf */}
            {/* Old Code:- {passengerTabProps.tabs.length === 1 && (
          <div
            className="skyplus-excess-baggage__description"
            dangerouslySetInnerHTML={{
              __html: AEMData?.sliderDescription.html?.replace(
                '{}',
                `<span class="skyplus-excess-baggage__description-name">
                    ${passengerTabProps?.tabs[0]?.title}</span>`,
              ),
            }}
          />
          )} */}
            <TabsContainer {...passengerTabProps} onChangeTab={emptyFn} />
            {
              <OffCanvasFooter
                titleData={totalPrice}
                subTitleData={totalPrice}
                title={sliderPaneConfigData?.totalPriceLabel}
                subTitle={sliderPaneConfigData.saveRecommendationLabel}
                buttonTitle={AEMData.sliderButtonLabel}
                btnProps={btnProps}
                postButtonIcon="icon-accordion-left-24"
                onSubmit={submitDetails}
                currencycode={additionalBagApiObj.currencycode}
                // disabled={
                //       !buttonNotDisabled &&
                //       !showReset &&
                //       (!additionalBaggageData.delayLostProtection ||
                //         delayLostProtection) &&
                //       !delayLostBaggageProtection
                //     }
                disabled={buttonDisabled}
              />
            }
          </div>
        </OffCanvas>
      )}
    </div>
  );
};

AdditionalBaggageSlidePane.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
  addonData: PropTypes.any,
  configData: PropTypes.any,
  passengerDetails: PropTypes.any,
  ssrCategory: PropTypes.any,
  onSubmit: PropTypes.any,
  sliderPaneConfigData: PropTypes.object,
  brbCategory: PropTypes.object,
  segmentData: PropTypes.object,
};

export default AdditionalBaggageSlidePane;
