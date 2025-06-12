import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
// Old Code:
// import { AppContext } from '../../../context/appContext';
// import GoodNightKitSlidePopOver from './GoodNightKitSlidePopOver';
import { addonActions } from '../../../store/addonActions';
import { AppContext } from '../../../context/AppContext';
import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

const GoodNightKitSlidePaneData = ({
  onSubmit,
  configData,
  segmentData,
  gnKitConfig,
  gnKitList,
  paxLength,
  gnKitData,
  isModifyFlow,
  takenSsr,
  sliderPaneConfigData,
  addonData,
}) => {
  const {
    state: {
      setGetGoodNight,
      selectedGoodNight,
      tripIndex,
      setSellGoodNight,
      removedGoodNight,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [selectedGnKitList, setSelectedGnKitList] = useState([]);
  const [finalSsrkeyList, setFinalSsrkeyList] = useState([]);
  const passengerKey = gnKitList[0]?.passengerKey;

  const goodNightApiObj = addonData?.availableSSR[0]?.ssrs[0];

  useEffect(() => {
    const finalSsrkeyList = [];
    finalSsrkeyList[tripIndex] = [];
    setFinalSsrkeyList(finalSsrkeyList);
  }, []);

  useEffect(() => {
    if (
      selectedGoodNight &&
      selectedGoodNight[tripIndex] &&
      selectedGoodNight[tripIndex][segmentData]
    ) {
      const finalSelectedList = { ...setSellGoodNight };
      finalSelectedList[tripIndex] = [];
      Object.keys(selectedGoodNight[tripIndex]).forEach((segment) => {
        Object.keys(selectedGoodNight[tripIndex][segment]).forEach(
          (paxItem) => {
            if (selectedGoodNight[tripIndex][segment][paxItem].length > 0) {
              selectedGoodNight[tripIndex][segment][paxItem].forEach(
                (ssrKeyItem) => {
                  const sellAddonItem = {
                    ssrKey: ssrKeyItem,
                    count: 1,
                    note: '',
                    passengerKey: paxItem,
                  };
                  finalSelectedList[tripIndex].push(sellAddonItem);
                },
              );
            }
          },
        );
      });
      setFinalSsrkeyList(finalSelectedList);
    }
  }, [selectedGoodNight]);

  const getTotalPrice = () => {
    let totalPrice = 0;
    if (selectedGoodNight[tripIndex]) {
      for (const item in selectedGoodNight[tripIndex]) {
        for (const pasSsrArray in selectedGoodNight[tripIndex][item]) {
          const ssrArray = selectedGoodNight[tripIndex][item][pasSsrArray];
          for (const ssr of ssrArray) {
            for (const kit of gnKitData.flat()) {
              if (ssr === kit.ssrKey) {
                totalPrice += +kit.price.replace(/\D/g, '');
              }
            }
          }
        }
      }
    }
    return totalPrice;
  };

  const removeGoodNightData = (item, isRemove) => {
    let removedGoodNightSsrData = [...removedGoodNight];
    removedGoodNightSsrData = removedGoodNightSsrData.filter(
      (existingSsr) => existingSsr.ssrKey !== item,
    );
    if (isRemove) {
      const removalData = { ssrKey: item };
      removedGoodNightSsrData.push(removalData);
    }

    dispatch({
      type: addonActions.REMOVED_GOODNIGHT_ADDON_DATA,
      payload: removedGoodNightSsrData,
    });
  };

  useEffect(() => {
    gnKitList.forEach((item) => {
      if (document.getElementById(item.ssrKey)) {
        document.getElementById(item.ssrKey).checked = false;
      }
    });
    if (
      selectedGoodNight &&
      selectedGoodNight[tripIndex] &&
      selectedGoodNight[tripIndex][segmentData] &&
      selectedGoodNight[tripIndex][segmentData][passengerKey]
    ) {
      setSelectedGnKitList(
        selectedGoodNight[tripIndex][segmentData][passengerKey],
      );
      selectedGoodNight[tripIndex][segmentData][passengerKey].forEach(
        (item) => {
          if (document.getElementById(item)) {
            document.getElementById(item).checked = true;
          }
          if (isModifyFlow) {
            const availableTakenSsr = takenSsr?.filter(
              (takenSsrItem) => takenSsrItem.originalSsrKey === item,
            );

            if (availableTakenSsr?.length > 0) {
              if (document.getElementById(item)) {
                document.getElementById(item).disabled = true;
                document
                  .getElementById(item)
                  ?.closest('.button.skyplus-button--small')
                  ?.classList?.add('skyplus-button--disabled');
              }
            }
          }
        },
      );
    } else {
      setSelectedGnKitList([]);
    }
  }, [gnKitList]);

  // not needed anymore
  // const submitBtnProps = {
  //   label: configData?.doneCtaLabel,
  //   variation: '',
  //   className: 'btn-submit',
  // };

  const submitDetails = () => {
    if (finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length > 0) {
      const segmentList = { ...setGetGoodNight };
      if (selectedGoodNight) {
        Object.keys(selectedGoodNight[tripIndex]).forEach((segment) => {
          Object.keys(selectedGoodNight[tripIndex][segment]).forEach(
            (paxItem) => {
              if (selectedGoodNight[tripIndex][segment][paxItem]) {
                if (!segmentList[tripIndex]) {
                  segmentList[tripIndex] = [];
                }
                if (!segmentList[tripIndex][segment]) {
                  segmentList[tripIndex][segment] = {};
                }
                segmentList[tripIndex][segment][paxItem] =
                  selectedGoodNight[tripIndex][segment][paxItem];
              }
            },
          );
        });
      }

      dispatch({
        type: addonActions.SET_GET_GOODNIGHT_ADDON_DATA,
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
        type: addonActions.SET_SELL_GOODNIGHT_ADDON_DATA,
        payload: ssrKeyList,
      });
      onSubmit();
      setSelectedGnKitList([]);
    }
  };

  const toggleGnKit = (e, item) => {
    if (e.target.checked) {
      const newList = cloneDeep(selectedGnKitList);
      if (newList.indexOf(item) === -1) {
        newList.push(item);
        const segmentList = { ...selectedGoodNight };
        if (!segmentList[tripIndex]) {
          segmentList[tripIndex] = [];
        }
        if (!segmentList[tripIndex][segmentData]) {
          segmentList[tripIndex][segmentData] = {};
        }
        segmentList[tripIndex][segmentData][passengerKey] = newList;
        setSelectedGnKitList(newList);
        dispatch({
          type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
          payload: segmentList,
        });

        removeGoodNightData(item, false);
      }
    } else {
      const newList = selectedGnKitList.filter((element) => {
        return element !== item;
      });
      const segmentList = { ...selectedGoodNight };
      if (!segmentList[tripIndex]) {
        segmentList[tripIndex] = [];
      }
      if (!segmentList[tripIndex][segmentData]) {
        segmentList[tripIndex][segmentData] = {};
      }
      segmentList[tripIndex][segmentData][passengerKey] = newList;
      setSelectedGnKitList(newList);
      dispatch({
        type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
        payload: segmentList,
      });
      removeGoodNightData(item, true);
    }
  };

  /* Old Code:
  const resetSelection = (e) => {
    e.preventDefault();
    gnKitList.forEach((item) => {
      if (document.getElementById(item.ssrKey)) {
        document.getElementById(item.ssrKey).checked = false;
      }
    });

    const removeList = [];

    gnKitData.forEach((ssrList) => {
      ssrList.forEach((item) => {
        const removalData = { ssrKey: item.ssrKey };
        removeList.push(removalData);
      });
    });

    dispatch({
      type: addonActions.REMOVED_GOODNIGHT_ADDON_DATA,
      payload: removeList,
    });

    setSelectedGnKitList([]);
    const segmentList = { ...selectedGoodNight };
    segmentList[tripIndex] = [];
    const ssrKeyList = cloneDeep(finalSsrkeyList);
    ssrKeyList[tripIndex] = [];
    setFinalSsrkeyList(ssrKeyList);
    dispatch({
      type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
      payload: segmentList,
    });
  }; */

  return (
    <section className="sp-gn-kit-pane__wrapper">
      {/* Old Code: {finalSsrkeyList[tripIndex] &&
        finalSsrkeyList[tripIndex].length > 0 &&
        !isModifyFlow && (
          <a
            href="javascript:void(0);"
            role="button"
            onClick={(e) => resetSelection(e)}
            className="sp-gn-kit-pane__clear"
          >
            {configData?.clearAllLabel}
          </a>
        )}
      {paxLength < 2 && (
        <p className="sp-gn-kit-pane__details">
          <p
            dangerouslySetInnerHTML={{
              __html: gnKitConfig?.sliderDescription?.html.replace(
                '{}',
                `<span class="sp-gn-kit-pane__pax-name">${gnKitList[0]?.passengerName}</span>`,
              ),
            }}
          />
        </p>
      )} */}

      <div className="sp-gn-kit-pane__title h0">{gnKitConfig.sliderTitle}</div>
      {/* Old Code: {paxLength < 2 && ( */}
      <div
        className="skyplus-heading sp-gn-kit-pane__description h4"
        dangerouslySetInnerHTML={{
          __html: gnKitConfig?.sliderDescription?.html.replace(
            '{name}',
            `<span>${gnKitList[0]?.passengerName}</span>`,
          ),
        }}
      />
      {/* Old Code: )} */}

      <div className="sp-gn-kit-pane__list">
        <div className="sp-gn-kit-pane__item">
          <div className="sp-gn-kit-pane__item__title sh7">
            {gnKitConfig.sliderTitle}
          </div>
          {gnKitList.map((item, index) => {
            return (
              /* Old Code:
              <div className="sp-gn-kit-pane__item" key={item.ssrKey}>
                <label
                  className="sp-gn-kit-pane__item-label"
                  htmlFor={item.ssrKey}
                >
                  <span className="sp-gn-kit-pane__item-checkbox">
                    <input
                      className="sp-gn-kit-pane__item-checkbox-input"
                      type="checkbox"
                      id={item.ssrKey}
                      name="kitOption"
                      onChange={(e) => toggleGnKit(e, item.ssrKey)}
                    />
                    <div className="sp-gn-kit-pane__item-checkbox-toggle" />
                    <img
                      // src={item.ssrImage._path}
                      src='https://dummyimage.com/600x300/f12/000'
                      alt={item.ssrName}
                      className="sp-gn-kit-pane__item-image"
                    />
                  </span>
                </label>
                <div className="sp-gn-kit-pane__item-data">
                  <p className="sp-gn-kit-pane__item-name">
                    {item.ssrName}
                    <GoodNightKitSlidePopOver ssrData={item} />
                  </p>
                  <p className="sp-gn-kit-pane__item-price">{item.price}</p>
                </div>
              </div> */
              <div className="sp-gn-kit-pane__item-btn" key={item?.ssrKey}>
                <div className="sp-gn-kit-pane__card__container">
                  <div className="sp-gn-kit-pane__card__left-section">
                    <div>
                      <div className="sp-gn-kit-pane__card__left-section-header">
                        <span className="sp-gn-kit-pane__card__left-section-header__title tags-small">
                          {item.name}
                        </span>
                      </div>
                      <div
                        className="sp-gn-kit-pane__card__left-section__description body-small-regular"
                        dangerouslySetInnerHTML={{
                          __html: item?.description?.html,
                        }}
                      />
                      <div className="sp-gn-kit-pane__card__price-container">
                        <div className="sp-gn-kit-pane__card__price sh7">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sp-gn-kit-pane__card__right-section">
                    <div className="sp-gn-kit-pane__card__image-container">
                      <img src={item?.image?._publishUrl} alt={item.name} />
                    </div>
                    <div className="sp-gn-kit-pane__card__add-container">
                      <div className="skyplus-button sp-gn-kit-pane__card__btn-add ">
                        <label
                          className="sp-gn-kit-pane__card__item-label"
                          htmlFor={item.ssrKey}
                        >
                          <input
                            className="sp-gn-kit-pane__card__item-checkbox-input"
                            type="checkbox"
                            id={item.ssrKey}
                            name="kitOption"
                            onChange={(e) => toggleGnKit(e, item.ssrKey)}
                          />
                          <span
                            className={`button skyplus-button--small ${selectedGnKitList.indexOf(item.ssrKey) > -1
                              ? 'skyplus-button--outline skyplus-button--outline-primary'
                              : 'skyplus-button--filled skyplus-button--filled-primary'
                            }`}
                          >
                            {selectedGnKitList.indexOf(item.ssrKey) === -1
                              ? sliderPaneConfigData.addLabel
                              : sliderPaneConfigData.removeLabel}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Old Code: <div className="sp-gn-kit-pane__btn-wrapper">
        <Button
          {...submitBtnProps}
          key="add-on-gnKit"
          onClickHandler={submitDetails}
          disabled={
						finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length < 1
					}
        />
      </div> */}
      <OffCanvasFooter
        titleData={getTotalPrice()}
        // TD::- need to add when striked out price is available
        // subTitleData={sliderPaneConfigData.subTitleData}
        title={sliderPaneConfigData.totalPriceLabel}
        // TD::- need to add when striked out price is available
        // subTitle={sliderPaneConfigData.saveRecommendationLabel}
        buttonTitle={gnKitConfig.sliderButtonLabel}
        isFooterVisible
        // btnProps={btnProps}
        buttonIcon={false}
        onSubmit={submitDetails}
        disabled={
          finalSsrkeyList[tripIndex] && finalSsrkeyList[tripIndex].length < 1
        }
        currencycode={goodNightApiObj.currencycode}
      />
    </section>
  );
};

GoodNightKitSlidePaneData.propTypes = {
  gnKitList: PropTypes.array,
  onSubmit: PropTypes.func,
  configData: PropTypes.object,
  segmentData: PropTypes.any,
  gnKitConfig: PropTypes.any,
  paxLength: PropTypes.any,
  gnKitData: PropTypes.any,
  isModifyFlow: PropTypes.string,
  takenSsr: PropTypes.array,
  sliderPaneConfigData: PropTypes.object,
  addonData: PropTypes.object,
};

export default GoodNightKitSlidePaneData;
