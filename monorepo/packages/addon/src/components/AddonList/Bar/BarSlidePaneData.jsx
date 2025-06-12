import React, { useState, useEffect } from 'react';
// Old Code:
// import Button from 'skyplus-design-system-app/dist/des-system/Button';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import OneForSkiesCard from './OneForSkiesCard';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

const BarSlidePaneData = ({
  onSubmit,
  addonData,
  // configData,
  segmentData,
  barList,
  paxLength,
  barData,
  isModifyFlow,
  takenSsrList,
  sliderPaneConfigData,
}) => {
  const {
    state: { setGetBar, selectedBar, tripIndex, setSellBar, removedBar },
    dispatch,
  } = React.useContext(AppContext);

  const AEMData = addonData?.availableSlidePaneData[0];
  const [selectedBarList, setSelectedBarList] = useState([]);
  const [finalSsrkeyList, setFinalSsrkeyList] = useState([]);
  const passengerKey = barList[0]?.passengerKey;
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
    if (
      selectedBar &&
      selectedBar[tripIndex] &&
      selectedBar[tripIndex][segmentData]
    ) {
      const finalSelectedList = { ...setSellBar };
      finalSelectedList[tripIndex] = [];
      Object.keys(selectedBar[tripIndex]).forEach((segment) => {
        Object.keys(selectedBar[tripIndex][segment]).forEach((paxItem) => {
          if (selectedBar[tripIndex][segment][paxItem].length > 0) {
            selectedBar[tripIndex][segment][paxItem].forEach((ssrKeyItem) => {
              const sellAddonItem = {
                ssrKey: ssrKeyItem,
                count: 1,
                note: '',
                passengerKey: paxItem,
              };
              finalSelectedList[tripIndex].push(sellAddonItem);
            });
          }
        });
      });
      setFinalSsrkeyList(finalSelectedList);
    }
  }, [selectedBar]);

  const removeBarData = (item, isRemove) => {
    let removedBarSsrData = [...removedBar];
    removedBarSsrData = removedBarSsrData.filter(
      (existingSsr) => existingSsr.ssrKey !== item,
    );
    if (isRemove) {
      const removalData = { ssrKey: item };
      removedBarSsrData.push(removalData);
    }

    dispatch({
      type: addonActions.REMOVED_BAR_ADDON_DATA,
      payload: removedBarSsrData,
    });
  };

  // Old Code:
  // const submitBtnProps = {
  //   label: `${AEMData?.doneCtaLabel}`,
  //   variation: '',
  //   className: 'btn-submit',
  // };

  useEffect(() => {
    const isTakenSsr = checkTakenSsr();
    setTakenSsrData(checkTakenSsr());

    barList.forEach((item) => {
      if (document.getElementById(item.ssrKey)) {
        document.getElementById(item.ssrKey).checked = false;
        document.getElementById(item.ssrKey).disabled = false;
      }

      if (isTakenSsr && isModifyFlow && item.passengerKey === passengerKey) {
        if (document.getElementById(item.ssrKey)) {
          document.getElementById(item.ssrKey).disabled = true;
        }
      }
    });

    if (
      selectedBar &&
      selectedBar[tripIndex] &&
      selectedBar[tripIndex][segmentData] &&
      selectedBar[tripIndex][segmentData][passengerKey]
    ) {
      setSelectedBarList(selectedBar[tripIndex][segmentData][passengerKey]);
      selectedBar[tripIndex][segmentData][passengerKey].forEach((item) => {
        if (document.getElementById(item)) {
          document.getElementById(item).checked = true;
        }
      });
    } else {
      setSelectedBarList([]);
    }
  }, [barList]);

  const submitDetails = () => {
    if (finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length > 0) {
      const segmentList = { ...setGetBar };
      if (selectedBar) {
        Object.keys(selectedBar[tripIndex]).forEach((segment) => {
          Object.keys(selectedBar[tripIndex][segment]).forEach((paxItem) => {
            if (selectedBar[tripIndex][segment][paxItem]) {
              if (!segmentList[tripIndex]) {
                segmentList[tripIndex] = [];
              }
              if (!segmentList[tripIndex][segment]) {
                segmentList[tripIndex][segment] = {};
              }
              segmentList[tripIndex][segment][paxItem] =
                selectedBar[tripIndex][segment][paxItem];
            }
          });
        });
      }

      dispatch({
        type: addonActions.SET_GET_BAR_ADDON_DATA,
        payload: segmentList,
      });

      const ssrKeyList = {};
      if (finalSsrkeyList) {
        Object.keys(finalSsrkeyList).forEach((trip) => {
          finalSsrkeyList[trip].forEach((ssrItem) => {
            if (!ssrKeyList[trip]) {
              ssrKeyList[trip] = [];
            }
            ssrKeyList[trip].push(ssrItem);
          });
        });
      }

      dispatch({
        type: addonActions.SET_SELL_BAR_ADDON_DATA,
        payload: ssrKeyList,
      });
      onSubmit();
      setSelectedBarList([]);
    }
  };

  const toggleBarItem = (e, item) => {
    if (e) {
      let newList = cloneDeep(selectedBarList);
      if (newList.indexOf(item) === -1) {
        if (newList?.length === 1) {
          removeBarData(newList[0], true);
        }
        newList = [];
        newList.push(item);
        const segmentList = { ...selectedBar };
        if (!segmentList[tripIndex]) {
          segmentList[tripIndex] = [];
        }
        if (!segmentList[tripIndex][segmentData]) {
          segmentList[tripIndex][segmentData] = {};
        }
        segmentList[tripIndex][segmentData][passengerKey] = newList;
        setSelectedBarList(newList);
        dispatch({
          type: addonActions.SELECTED_BAR_ADDON_DATA,
          payload: segmentList,
        });
      }
    } else {
      const newList = selectedBarList.filter((element) => {
        return element !== item;
      });
      const segmentList = { ...selectedBar };
      if (!segmentList[tripIndex]) {
        segmentList[tripIndex] = [];
      }
      if (!segmentList[tripIndex][segmentData]) {
        segmentList[tripIndex][segmentData] = {};
      }
      segmentList[tripIndex][segmentData][passengerKey] = newList;
      setSelectedBarList(newList);
      dispatch({
        type: addonActions.SELECTED_BAR_ADDON_DATA,
        payload: segmentList,
      });

      removeBarData(item, true);
    }
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    if (!selectedBar[tripIndex]) {
      return totalPrice;
    }
    Object.values(selectedBar[tripIndex]).forEach((pasSsrArray) => {
      Object.values(pasSsrArray).forEach((ssrArray) => {
        ssrArray.forEach((ssr) => {
          barData.flat().forEach((bar) => {
            if (ssr === bar.ssrKey) {
              totalPrice += +bar.price;
            }
          });
        });
      });
    });

    return totalPrice;
  };
  const _6EBarApiObj = addonData?.availableSSR[0]?.ssrs[0];
  /* Old Code:
  const resetSelection = (e) => {
    e.preventDefault();
    barList.forEach((item, index) => {
      if (document.getElementById(item.ssrKey)) {
        document.getElementById(item.ssrKey).checked = false;
      }
    });

    const removeList = [];

    barData.forEach((ssrList) => {
      ssrList.forEach((item) => {
        const removalData = { ssrKey: item.ssrKey };
        removeList.push(removalData);
      });
    });

    dispatch({
      type: addonActions.REMOVED_BAR_ADDON_DATA,
      payload: removeList,
    });

    setSelectedBarList([]);
    const segmentList = { ...selectedBar };
    segmentList[tripIndex] = [];
    const ssrKeyList = cloneDeep(finalSsrkeyList);
    ssrKeyList[tripIndex] = [];
    setFinalSsrkeyList(ssrKeyList);
    dispatch({
      type: addonActions.SELECTED_BAR_ADDON_DATA,
      payload: segmentList,
    });
  }; */

  return (
    <section className="sp-bar-pane__wrapper">
      {/* Old Code: {/* {selectedBarList.length > 0 && ( */}
      {/* Old Code: {finalSsrkeyList[tripIndex] &&
        finalSsrkeyList[tripIndex].length > 0 &&
        !isModifyFlow && (
          <a
            href="javascript:void(0);"
            role="button"
            onClick={(e) => resetSelection(e)}
            className="sp-bar-pane__clear"
          >
            {configData?.clearAllLabel}
          </a>
        )}
      below p tag is now always be there on the page
      {paxLength < 2 && (
        <p
          className="sp-bar-pane__details"
          dangerouslySetInnerHTML={{
            __html: AEMData?.sliderDescription?.html.replace(
              '{name}',
              `<span class="sp-bar-pane__pax-name">${barList[0]?.passengerName}</span>`,
            ),
          }}
        />
      )} */}

      <div className="sp-bar-pane__title h0">{AEMData.sliderTitle}</div>
      {/* Old Code: {paxLength < 2 && ( */}
      <div
        className="skyplus-heading sp-bar-pane__description h4"
        dangerouslySetInnerHTML={{
          __html: AEMData?.sliderDescription?.html.replace(
            '{name}',
            `<span>${barList[0]?.passengerName}</span>`,
          ),
        }}
      />
      {/* Old Code: )} */}

      <div className="sp-bar-pane__list">
        <div className="sp-bar-pane__item">
          <div className="sp-bar-pane__item__title sh7">{AEMData?.label}</div>
          {barList.map((item, index) => {
            return (
              <div className="sp-bar-pane__item-btn" key={`OfsItem${index + item.name}`}>
                <OneForSkiesCard
                  key={`OfsCard${index + item.name}`}
                  name={item.name}
                  ssrKey={item.ssrKey}
                  imagePath={item?.image?._publishUrl}
                  passengerKey={item.passengerKey}
                  selected={selectedBarList.indexOf(item.ssrKey) > -1}
                  isTakenSsrData={isTakenSsrData}
                  isModifyFlow={isModifyFlow}
                  price={formatCurrency(item.price, item.currencycode, {
                    minimumFractionDigits: 0,
                  })}
                  toggleDrinkHandler={(e) => (!(isTakenSsrData && isModifyFlow)
                    ? toggleBarItem(e, item.ssrKey)
                    : '')}
                  addButtonLabel={sliderPaneConfigData.addLabel}
                  removeButtonLabel={sliderPaneConfigData.removeLabel}
                />
                {/* Old Code: Replaced Radio button with cards:
                <input
                  readOnly
                  aria-hidden
                  type="radio"
                  id={item.ssrKey}
                  name={item.passengerKey}
                  className="sp-bar-pane__item-btn-radiobtn"
                  onChange={(e) => (!(isTakenSsrData && isModifyFlow) ? toggleBarItem(e, item.ssrKey) : '')}
                />
                <label
                  htmlFor={item.ssrKey}
                  className="sp-bar-pane__item-btn-label"
                >
                  <span className="sp-bar-pane__item-btn-label-price">
                    {formatCurrency(item.price, item.currencycode, { minimumFractionDigits: 0 })}
                  </span>{' '}
                  <span className="sp-bar-pane__item-btn-label-name">
                    {item.name}
                  </span>
                </label> */}
              </div>
            );
          })}
        </div>
        <div className="sp-bar-pane__condition">
          <div className="sp-bar-pane__condition__label tags-small">
            {AEMData?.disclaimerLabel}
          </div>
          <p
            className="sp-bar-pane__condition-data"
            dangerouslySetInnerHTML={{
              __html: AEMData?.disclaimer?.html,
            }}
          />
        </div>
      </div>
      {/* Old Code: <div className="sp-bar-pane__btn-wrapper">
        <Button
          {...submitBtnProps}
          key="add-on-gnKit"
          onClickHandler={submitDetails}
          disabled={finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length < 1}
        />
      </div> */}
      <OffCanvasFooter
        titleData={getTotalPrice()}
        // TD::- need to add when striked out price is available
        // subTitleData={sliderPaneConfigData.subTitleData}
        title={sliderPaneConfigData.totalPriceLabel}
        // TD::- need to add when striked out price is available
        // subTitle={sliderPaneConfigData.saveRecommendationLabel}
        buttonTitle={AEMData.sliderButtonLabel}
        isFooterVisible
        // btnProps={btnProps}
        buttonIcon={false}
        onSubmit={submitDetails}
        disabled={
          finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length < 1
        }
        currencycode={_6EBarApiObj.currencycode}
      />
    </section>
  );
};

BarSlidePaneData.propTypes = {
  onSubmit: PropTypes.func,
  addonData: PropTypes.object,
  // configData: PropTypes.object,
  segmentData: PropTypes.any,
  barList: PropTypes.array,
  paxLength: PropTypes.any,
  barData: PropTypes.any,
  isModifyFlow: PropTypes.string,
  takenSsrList: PropTypes.array,
  sliderPaneConfigData: PropTypes.object,
};

export default BarSlidePaneData;
