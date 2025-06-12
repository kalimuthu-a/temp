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
import ExcessBaggageTab from './ExcessBaggageTab';
import {
  createEventForAddonModification,
  getPassengerName,
} from '../../../functions';
import { emptyFn } from '../../../functions/utils';
import { disableBaggageRemoveButton } from './ExcessBaggageUtils';
import eventService from '../../../services/event.service';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

/**
 *
 * @type {React.FC<import("../../../../types/AddOnList").ExcessBaggageSlidePaneProps>}
 * @returns {React.FunctionComponentElement}
 */
const ExcessBaggageSlidePane = ({
  isOpen,
  onClose,
  addonData,
  configData,
  passengerDetails,
  ssrCategory,
  onSubmit,
  brbCategory,
  segmentData,
  isMainCard,
  sliderPaneConfigData,
  loyaltyData,
}) => {
  const {
    state: {
      tripIndex,
      paxIndex,
      excessBaggageData,
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
  const excessBaggageConfig = addonData?.availableSSR[0];
  const [delayLostProtection, setDelayLostProtection] = useState(
    delayLostBaggageProtection,
  );
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [excessBaggageFormData, setExcessBaggageFormData] = useState([]);
  // Old Code:
  // const [selectedPrice, setSelectedPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    setExcessBaggageFormData(excessBaggageData?.data || []);
  }, []);

  const excessBaggageSlideProps = {
    overlayCustomClass: '',
    modalCustomClass: 'excess-baggage-slide-pane',
    title: `${AEMData?.sliderTitle}`,
    onClose: () => onClose(false),
    containerClassName: 'skyplus-offcanvas__addon-mf',
  };

  const onClickReset = (tabKey) => {
    const _excessBaggageFormData = [...excessBaggageFormData];
    setTotalPrice(0);
    // Old Code:
    // setSelectedPrice(0);
    _excessBaggageFormData[tripIndex] = _excessBaggageFormData[tripIndex].map(
      (row) => ({
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
      }),
    );
    setExcessBaggageFormData(_excessBaggageFormData);
    setDelayLostProtection(false);
    setCheckBoxChecked(false);
    setIsSubmit(true);
  };

  const showReset = useMemo(() => {
    if (delayLostProtection) {
      return true;
    }

    return excessBaggageFormData?.[tripIndex]?.some((row) => {
      const { additionalBag, domestic, international } = row;
      return additionalBag !== 0 || domestic !== null || international !== null;
    });
  }, [delayLostProtection, excessBaggageFormData, tripIndex]);

  const onChangeTabUserData = (tabIndex, key, value, extra) => {
    const data = cloneDeep(excessBaggageFormData);
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

    setExcessBaggageFormData([
      ...excessBaggageFormData.slice(0, tripIndex),
      tripIndexRow,
      ...excessBaggageFormData.slice(tripIndex + 1),
    ]);
  };

  const submitDetails = () => {
    const newState = excessBaggageData?.data || [];
    const ssrObjToRemove = [];
    if (!newState[tripIndex]) {
      newState[tripIndex] = [];
    }
    newState[tripIndex] = excessBaggageFormData[tripIndex].map((row, index) => {
      const { domesticE, internationalE, passengerKey, baggageE } =
        newState[tripIndex][index] ?? {};
      // Old Code:
      // const baggageSSRData = {
      //   ...domesticE,
      //   ...internationalE,
      // };

      if (domesticE) {
        ssrObjToRemove.push({
          ssrCode: domesticE?.ssrCode,
          passengerKey,
          journeyKey: segmentData.journeyKey,
          action: 'remove',
        });
      }

      if (internationalE) {
        ssrObjToRemove.push({
          ssrCode: internationalE?.ssrCode,
          passengerKey,
          journeyKey: segmentData.journeyKey,
          action: 'remove',
        });
      }

      if (baggageE) {
        ssrObjToRemove.push({
          journeyKey: segmentData.journeyKey,
          passengerKey,
          ssrCode: baggageE?.ssrCode,
          action: 'remove',
        });
      }
      return disableBaggageRemoveButton(row);
    });

    eventService.update([], ssrObjToRemove, false);

    const _excessBaggageData = {
      ...excessBaggageData,
      data: newState,
      delayLostProtection,
    };

    dispatch({
      type: addonActions.UPDATE_EXCESS_BAGGAGE_FORM_DATA,
      payload: {
        tripIndex,
        delayLostProtection,
        excessBaggageData: _excessBaggageData,
      },
    });

    onSubmit(ssrObjToRemove);
  };

  const getParentTabData = () => {
    const passengers = cloneDeep(passengerDetails);

    const tabData = [];
    const contentData = [];

    passengers.forEach((passenger, index) => {
      const passengerName = getPassengerName(passenger);
      const { passengerKey } = passenger;

      const ssrList = excessBaggageConfig?.ssrs?.map((ssrItem) => {
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
        //   get(excessBaggageFormData, [tripIndex, index, 'checked'], false) ||
        //   delayLostProtection,
        checked: excessBaggageFormData?.[tripIndex]?.[index]?.additionalBag > 0,
      };

      tabData.push(tabItem);

      contentData.push(
        <ExcessBaggageTab
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
          excessBaggageFormData={excessBaggageFormData}
          // setSelectedPrice={setSelectedPrice}
          setTotalPrice={setTotalPrice}
          totalPrice={totalPrice}
          onClickReset={onClickReset}
          showReset={showReset}
          isMainCard={isMainCard}
          submitDetails={submitDetails}
          setIsSubmit={setIsSubmit}
          sliderPaneConfigData={sliderPaneConfigData}
          loyaltyData={loyaltyData}
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
    excessBaggageFormData,
    delayLostProtection,
    checkBoxChecked,
  ]);

  useEffect(() => {
    if (isSubmit) {
      setIsSubmit(false);
      submitDetails();
    }
  }, [isSubmit]);

  /* Old Code:
  const onClickReset = () => {
    const _excessBaggageFormData = [...excessBaggageFormData];
    setTotalPrice(0);
    setAdditionalPrice(0);
    setSelectedPrice(0);
    _excessBaggageFormData[tripIndex] = _excessBaggageFormData[tripIndex].map(
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
    setExcessBaggageFormData(_excessBaggageFormData);
    setDelayLostProtection(false);
    setCheckBoxChecked(false);
  }; */

  /* Old Code:
  const buttonNotDisabled = useMemo(() => {
    return excessBaggageData.data?.[tripIndex]?.some((row) => {
      const { additionalBag, domestic, international } = row;
      return additionalBag !== 0 || domestic !== null || international !== null;
    });
  }, [excessBaggageData, tripIndex, delayLostProtection]); */

  const buttonDisabled = useMemo(() => {
    let isDisabled = true;
    excessBaggageFormData?.[tripIndex]?.forEach((row) => {
      const { additionalBag } = row;
      if (additionalBag > 0) {
        isDisabled = false;
      }
    });
    return isDisabled;
  }, [excessBaggageFormData, tripIndex]);

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'medium',
    disabled: false,
  };

  const sliderContent = () => {
    return (
      <>
        {/* TD: Clear All {showReset && (
            <button
              className="quick-board__clear"
              type="button"
              onClick={onClickReset}
            >
              {configData?.clearAllLabel}
            </button>
          )} */}
        <div className="skyplus-excess-baggage">
          {/* TD:for showing single passanger name in excess Baggege addon-mf: {passengerTabProps.tabs.length === 1 && (
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
          <TabsContainer
            {...passengerTabProps}
            onChangeTab={emptyFn}
            isMainCard={isMainCard}
          />
          {!isMainCard && (
            <OffCanvasFooter
              titleData={totalPrice}
              subTitleData={totalPrice}
              title={sliderPaneConfigData?.totalPriceLabel}
              subTitle={sliderPaneConfigData.saveRecommendationLabel}
              buttonTitle={AEMData.sliderButtonLabel}
              btnProps={btnProps}
              buttonIcon={false}
              postButtonIcon="icon-accordion-left-24"
              onSubmit={submitDetails}
              // disabled={
              //       !buttonNotDisabled &&
              //       !showReset &&
              //       (!excessBaggageData.delayLostProtection ||
              //         delayLostProtection) &&
              //       !delayLostBaggageProtection
              //     }
              disabled={buttonDisabled}
            />
          )}
        </div>
      </>
    );
  };

  if (isMainCard) {
    return sliderContent();
  }
  return (
    <div>
      {isOpen && (
        <OffCanvas {...excessBaggageSlideProps}>{sliderContent()}</OffCanvas>
      )}
    </div>
  );
};

ExcessBaggageSlidePane.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.any,
  addonData: PropTypes.any,
  configData: PropTypes.any,
  passengerDetails: PropTypes.any,
  ssrCategory: PropTypes.any,
  onSubmit: PropTypes.any,
  isMainCard: PropTypes.bool,
  sliderPaneConfigData: PropTypes.object,
  loyaltyData: PropTypes.object,
  brbCategory: PropTypes.object,
  segmentData: PropTypes.object,
};

export default ExcessBaggageSlidePane;
