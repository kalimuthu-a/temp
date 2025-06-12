import React, { useState, useEffect } from 'react';
// Old Code:
// import Button from 'skyplus-design-system-app/dist/des-system/Button';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

const SportsSelection = ({
  AEMData,
  sportsEquipmentList,
  paxLength,
  onSubmit,
  configData,
  isOpen,
  sportsEquipmentData,
  isModifyFlow,
  takenSsrList,
  sliderPaneConfigData,
  sportsEquipmentApiObject,
}) => {
  const {
    state: {
      setGetSportsEquipment,
      selectedSportsEquipment,
      tripIndex,
      setSellSportsEquipment,
      removedSportsEquipment,
    },
    dispatch,
  } = React.useContext(AppContext);
  const [selectedSportsEquipmentList, setSelectedSportsEquipmentList] =
    useState([]);
  const [finalSsrkeyList, setFinalSsrkeyList] = useState([]);

  const passengerKey = sportsEquipmentList[0]?.passengerKey;
  const takenSsr = takenSsrList[tripIndex] || [];

  const checkTakenSsr = () => {
    if (takenSsr?.length > 0) {
      let isTaken = false;
      takenSsr?.forEach((takenSsrItem) => {
        if (takenSsrItem.passengerKey === passengerKey) {
          isTaken = true;
        }
      });
      return isTaken;
    }
    return false;
  };

  const [isTakenSsrData, setTakenSsrData] = useState(checkTakenSsr());

  useEffect(() => {
    const finalSsrkeyListData = [];
    finalSsrkeyListData[tripIndex] = [];
    setFinalSsrkeyList(finalSsrkeyListData);
  }, []);

  useEffect(() => {
    if (selectedSportsEquipment && selectedSportsEquipment[tripIndex]) {
      const finalSelectedList = { ...setSellSportsEquipment };
      finalSelectedList[tripIndex] = [];
      Object.keys(selectedSportsEquipment[tripIndex]).forEach((paxItem) => {
        if (selectedSportsEquipment[tripIndex][paxItem].length > 0) {
          selectedSportsEquipment[tripIndex][paxItem].forEach((ssrKeyItem) => {
            const newKey = ssrKeyItem.split('@@');
            const sellAddonItem = {
              ssrKey: newKey[0],
              count: newKey[1],
              note: '',
              passengerKey: paxItem,
            };
            finalSelectedList[tripIndex].push(sellAddonItem);
          });
        }
      });
      setFinalSsrkeyList(finalSelectedList);
    }
  }, [selectedSportsEquipment]);

  const removeSportsEquipment = (item, isRemove) => {
    let removedSportsEquipmentSsrData = [...removedSportsEquipment];
    removedSportsEquipmentSsrData = removedSportsEquipmentSsrData.filter(
      (existingSsr) => existingSsr.ssrKey !== item,
    );
    if (isRemove) {
      const removalData = { ssrKey: item };
      removedSportsEquipmentSsrData.push(removalData);
    }

    dispatch({
      type: addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: removedSportsEquipmentSsrData,
    });
  };

  useEffect(() => {
    const isTakenSsr = checkTakenSsr();
    setTakenSsrData(checkTakenSsr());

    sportsEquipmentList.forEach((item) => {
      if (document.getElementById(item.itemSsrKey)) {
        document.getElementById(item.itemSsrKey).checked = false;
        document.getElementById(item.itemSsrKey).disabled = false;
      }

      if (isTakenSsr && isModifyFlow && item.passengerKey === passengerKey) {
        if (document.getElementById(item.itemSsrKey)) {
          document.getElementById(item.itemSsrKey).disabled = true;
        }
      }
    });
    if (
      selectedSportsEquipment &&
      selectedSportsEquipment[tripIndex] &&
      selectedSportsEquipment[tripIndex][passengerKey]
    ) {
      setSelectedSportsEquipmentList(
        selectedSportsEquipment[tripIndex][passengerKey],
      );
      selectedSportsEquipment[tripIndex][passengerKey].forEach((item) => {
        if (document.getElementById(item)) {
          document.getElementById(item).checked = true;
        }
      });
    } else {
      setSelectedSportsEquipmentList([]);
    }
  }, [sportsEquipmentList, isOpen]);

  const btnProps = {
    label: configData?.doneCtaLabel,
    color: 'primary',
    variant: 'filled',
    size: 'small',
    disabled: false,
  };

  const submitDetails = () => {
    if (finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length > 0) {
      const segmentList = { ...setGetSportsEquipment };
      if (selectedSportsEquipment) {
        Object.keys(selectedSportsEquipment[tripIndex]).forEach((pax) => {
          if (selectedSportsEquipment[tripIndex][pax]) {
            if (!segmentList[tripIndex]) {
              segmentList[tripIndex] = [];
            }
            segmentList[tripIndex][pax] =
              selectedSportsEquipment[tripIndex][pax];
          }
        });
      }

      dispatch({
        type: addonActions.SET_GET_SPORTSEQUIPMENT_ADDON_DATA,
        payload: segmentList,
      });

      dispatch({
        type: addonActions.SET_SELL_SPORTSEQUIPMENT_ADDON_DATA,
        payload: finalSsrkeyList,
      });
      onSubmit();
      setSelectedSportsEquipmentList([]);
    }
  };

  const toggleSeItem = (e, item) => {
    if (e.target.checked) {
      let newList = cloneDeep(selectedSportsEquipmentList);
      if (newList.indexOf(item) === -1) {
        if (newList?.length === 1) {
          removeSportsEquipment(newList[0], true);
        }
        newList = [];
        newList.push(item);
        const segmentList = { ...selectedSportsEquipment };
        if (!segmentList[tripIndex]) {
          segmentList[tripIndex] = [];
        }
        segmentList[tripIndex][passengerKey] = newList;
        setSelectedSportsEquipmentList(newList);
        dispatch({
          type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
          payload: segmentList,
        });
      }
    } else {
      const newList = selectedSportsEquipmentList.filter((element) => {
        return element !== item;
      });
      const segmentList = { ...selectedSportsEquipment };
      if (!segmentList[tripIndex]) {
        segmentList[tripIndex] = [];
      }
      segmentList[tripIndex][passengerKey] = newList;
      setSelectedSportsEquipmentList(newList);
      dispatch({
        type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
        payload: segmentList,
      });

      removeSportsEquipment(item, true);
    }
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    if (selectedSportsEquipment[tripIndex]) {
      for (const item in selectedSportsEquipment[tripIndex]) {
        for (const pasSsrArray in selectedSportsEquipment[tripIndex][item]) {
          sportsEquipmentData.forEach((sportsItem) => {
            sportsItem.forEach((singleItem) => {
              const packsKey = selectedSportsEquipment[tripIndex][item][pasSsrArray];
              if (singleItem?.itemSsrKey === packsKey) {
                totalPrice += singleItem.price;
              }
            });
          });
        }
      }
    }
    return totalPrice;
  };

  /* Old Code:
  const resetSelection = (e) => {
    e.preventDefault();
    sportsEquipmentList.forEach((item) => {
      if (document.getElementById(item.itemSsrKey)) {
        document.getElementById(item.itemSsrKey).checked = false;
      }
    });

    const removeList = [];

    sportsEquipmentData.forEach((ssrList) => {
      ssrList.forEach((item) => {
        const removalData = { ssrKey: item.itemSsrKey };
        removeList.push(removalData);
      });
    });

    dispatch({
      type: addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: removeList,
    });

    setSelectedSportsEquipmentList([]);
    const segmentList = { ...selectedSportsEquipment };
    segmentList[tripIndex] = [];
    dispatch({
      type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
      payload: segmentList,
    });
  }; */

  return (
    <>
      {/* Old Code: {finalSsrkeyList[tripIndex] &&
        finalSsrkeyList[tripIndex].length > 0 &&
        !isModifyFlow && (
          <a
            href="javascript:void(0);"
            role="button"
            onClick={(e) => resetSelection(e)}
            className="sports__clear"
          >
            {configData?.clearAllLabel}
          </a>
      )}
      {paxLength < 2 && (
      <div
        className="sports__description"
        dangerouslySetInnerHTML={{
          __html: AEMData?.sliderDescription.html.replace(
            '{}',
            `<span class="sports__description-name">${sportsEquipmentList[0]?.passengerName}</span>`,
          ),
        }}
      />
      )} */}
      <div className="skyplus-sports__footer-margin">
        <span className="skyplus-sports__heading h0">
          {AEMData?.sliderTitle}
        </span>
        <div className="skyplus-sports__card">
          <span className="sh8 skyplus-sports__sub-heading">
            {AEMData?.selectQuantityLabel}
          </span>
          <div className="skyplus-sports__radio-container">
            {sportsEquipmentList.map((item, index) => {
              return (
                <div
                  className="skyplus-sports__radio-single-container"
                  key={item.itemSsrKey}
                >
                  <label
                    htmlFor={item.itemSsrKey}
                    className="skyplus-sports__ratio-title-container"
                  >
                    <div className="skyplus-sports__radio-input-wrapper">
                      <input
                        readOnly
                        aria-hidden
                        type="radio"
                        id={item.itemSsrKey}
                        name={item.passengerKey}
                        className="radio-input"
                        onChange={(e) => (!(isTakenSsrData && isModifyFlow)
                          ? toggleSeItem(e, item.itemSsrKey)
                          : '')}
                      />
                      <span
                        className="custom-radio"
                      />
                      <div>
                        <span className="skyplus-sports__ratio-title body-small-regular">
                          {formatCurrency(item.price, item.currencycode, {
                            minimumFractionDigits: 0,
                          })}
                        </span>
                        <div className="skyplus-sports__ratio-title body-small-light">
                          {`${item?.itemCount} ${index < 1 ? 'Item' : 'Items'}`}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="skyplus-sports__card-description">
          <div dangerouslySetInnerHTML={{
            __html: AEMData?.sportsDescription.html,
          }}
          />
          <div className="skyplus-sports__note-title">Note:</div>
          <div
            className="skyplus-sports__note-description"
            dangerouslySetInnerHTML={{
              __html: AEMData?.noteDescription.html,
            }}
          />
        </div>
      </div>
      <OffCanvasFooter
        titleData={getTotalPrice()}
        subTitleData={getTotalPrice()}
        title={sliderPaneConfigData?.totalPriceLabel}
        subTitle={sliderPaneConfigData.saveRecommendationLabel}
        buttonTitle={AEMData.sliderButtonLabel}
        isFooterVisible={false}
        btnProps={btnProps}
        buttonIcon={false}
        postButtonIcon="icon-accordion-left-24"
        onSubmit={submitDetails}
        disabled={
          finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length < 1
        }
        currencycode={sportsEquipmentApiObject?.currencycode}
      />
    </>
  );
};

SportsSelection.propTypes = {
  AEMData: PropTypes.any,
  sportsEquipmentList: PropTypes.array,
  paxLength: PropTypes.any,
  onSubmit: PropTypes.func,
  configData: PropTypes.object,
  isOpen: PropTypes.bool,
  sportsEquipmentData: PropTypes.any,
  isModifyFlow: PropTypes.string,
  takenSsrList: PropTypes.array,
  sliderPaneConfigData: PropTypes.object,
  sportsEquipmentApiObject: PropTypes.object,
};

export default SportsSelection;
