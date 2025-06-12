import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import DoubleTabsContainer from 'skyplus-design-system-app/dist/des-system/DoubleTabsContainer';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import cloneDeep from 'lodash/cloneDeep';
import GoodNightKitSlidePaneData from './GoodNightKitSlidePaneData';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';

const GoodNightKitSlidePane = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  segmentData,
  passengerDetails,
  addonData,
  configData,
  ssrCategory,
  isModifyFlow,
  takenSsr,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      setGetGoodNight,
      selectedGoodNight,
      tripIndex,
      paxIndex,
      removedAddonSsr,
      removedGoodNight,
    },
    dispatch,
  } = React.useContext(AppContext);

  const [segmentTabData, setSegmentTabData] = useState([]);
  const [paxData, setPaxData] = useState([]);

  const gnKitProps = {
    overlayCustomClass: '',
    modalCustomClass: 'sp-gn-kit-pane__modal',
    containerClassName: 'skyplus-offcanvas__addon-mf',
    title,
    onClose: (e) => {
      const selectedList = { ...selectedGoodNight };
      if (setGetGoodNight && setGetGoodNight[tripIndex]) {
        Object.keys(setGetGoodNight[tripIndex]).forEach((segment) => {
          Object.keys(setGetGoodNight[tripIndex][segment]).forEach(
            (paxItem) => {
              if (setGetGoodNight[tripIndex][segment][paxItem].length > 0) {
                if (!selectedList[tripIndex]) {
                  selectedList[tripIndex] = [];
                }
                if (!selectedList[tripIndex][segment]) {
                  selectedList[tripIndex][segment] = {};
                }
                selectedList[tripIndex][segment][paxItem] =
									setGetGoodNight[tripIndex][segment][paxItem];
              }
            },
          );
        });
      }

      dispatch({
        type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
        payload: selectedList,
      });

      const removedGoodNightSsrData = [];

      dispatch({
        type: addonActions.REMOVED_GOODNIGHT_ADDON_DATA,
        payload: removedGoodNightSsrData,
      });

      onClose(false);
    },
  };

  const gnKitConfig = addonData?.availableSlidePaneData[0];

  const gnKitPaneProps = {
    configData,
    isModifyFlow,
    takenSsr,
    onSubmit: () => {
      onSubmit();
    },
    gnKitConfig,
    sliderPaneConfigData,
  };

  useEffect(() => {
    if (paxData && paxData.length > 0) {
      const newPaxData = cloneDeep(paxData);
      newPaxData.forEach((paxItem) => {
        paxItem.defaultActiveTab = paxIndex[tripIndex]?.paxIndex || 0;
      });
      setPaxData(newPaxData);
    }
  }, [paxIndex]);

  const getSegmentTabData = () => {
    const segmentList = cloneDeep(segmentData);
    const segmentTabData = [];
    const paxData = [];
    segmentList.forEach((segment) => {
      const paxList = cloneDeep(passengerDetails);

      const segmentSSRItem = segment.segmentSSRs.filter(
        (ssr) => ssr.category === ssrCategory,
      );

      if (segmentSSRItem[0]?.ssrs.length > 0) {
        const segmentItem = {
          title: `${segment?.segmentDetails.origin} - ${segment?.segmentDetails.destination}`,
          disabled: false,
        };
        segmentTabData.push(segmentItem);

        const gnKitData = [];
        const paxTabData = [];
        paxList.forEach((paxDetails) => {
          const ssrList = cloneDeep(gnKitConfig?.ssrList);
          ssrList.forEach((ssrItem) => {
            segmentSSRItem[0]?.ssrs.forEach((ssr) => {
              ssr.passengersSSRKey.forEach((paxKey) => {
                if (
                  ssrItem.ssrCode === ssr.ssrCode &&
									paxDetails.passengerKey === paxKey.passengerKey
                ) {
                  ssrItem.price = formatCurrency(
                    ssr.price,
                    ssr.currencycode,
                    {
                      minimumFractionDigits: 0,
                    },
                  );
                  ssrItem.ssrKey = paxKey.ssrKey;
                  ssrItem.passengerName = `${
                    paxDetails?.name?.first || ''
                  } ${paxDetails?.name?.middle || ''} ${
                    paxDetails?.name?.last || ''
                  }`;
                  ssrItem.passengerKey = paxDetails.passengerKey;
                }
              });
            });
          });
          gnKitData.push(ssrList);

          const paxTabItem = {
            title: `${paxDetails?.name?.first || ''} ${
              paxDetails?.name?.middle || ''
            } ${paxDetails?.name?.last || ''}`,
            passengerKey: paxDetails.passengerKey,
            checked: false,
          };

          if (selectedGoodNight && selectedGoodNight[tripIndex]) {
            Object.keys(selectedGoodNight[tripIndex]).forEach((segmentData) => {
              if (
                segmentData ===
								`${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`
              ) {
                Object.keys(selectedGoodNight[tripIndex][segmentData]).forEach(
                  (paxKey) => {
                    if (
                      selectedGoodNight[tripIndex][segmentData][paxKey].length >
												0 &&
											paxKey === paxTabItem.passengerKey
                    ) {
                      paxTabItem.checked = true;
                    }
                  },
                );
              }
            });
          }

          paxTabData.push(paxTabItem);
        });

        const contentData = [];
        gnKitData.forEach((ssrList) => {
          contentData.push(
            <GoodNightKitSlidePaneData
              {...gnKitPaneProps}
              segmentData={`${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`}
              gnKitList={ssrList}
              paxLength={paxTabData.length}
              isOpen={isOpen}
              gnKitData={gnKitData}
              addonData={addonData}
            />,
          );
        });

        const paxItem = {
          tabs: paxTabData,
          content: contentData,
          defaultActiveTab: paxIndex[tripIndex]?.paxIndex || 0,
          showSingleTabBtn: false,
        };

        paxData.push(paxItem);
      } else {
        const segmentItem = {
          title: `${segment?.segmentDetails.origin} - ${segment?.segmentDetails.destination}`,
          disabled: true,
        };
        segmentTabData.push(segmentItem);

        const paxItem = {
          tabs: [],
          content: [],
          defaultActiveTab: 0,
          showSingleTabBtn: false,
        };

        paxData.push(paxItem);
      }

      segmentSSRItem[0]?.takenssr?.forEach((takenSsrItem) => {
        let isDeleted = false;
        removedAddonSsr?.forEach((removedAddonItem) => {
          if (takenSsrItem.originalSsrKey === removedAddonItem.ssrKey) {
            isDeleted = true;
          }
        });
        removedGoodNight?.forEach((removedItem) => {
          if (takenSsrItem.originalSsrKey === removedItem.ssrKey) {
            isDeleted = true;
          }
        });
        const item = takenSsrItem.originalSsrKey;
        const segmentData = `${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`;
        const { passengerKey } = takenSsrItem;

        if (!isDeleted) {
          let newList = [];
          if (
            selectedGoodNight &&
						selectedGoodNight[tripIndex] &&
						selectedGoodNight[tripIndex][segmentData] &&
						selectedGoodNight[tripIndex][segmentData][passengerKey]
          ) {
            newList = cloneDeep(
              selectedGoodNight[tripIndex][segmentData][passengerKey],
            );
          }

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
            dispatch({
              type: addonActions.SELECTED_GOODNIGHT_ADDON_DATA,
              payload: segmentList,
            });
          }
        }
      });
    });

    setSegmentTabData(segmentTabData);
    setPaxData(paxData);
  };

  useEffect(() => {
    getSegmentTabData();
  }, [selectedGoodNight, tripIndex, isOpen]);

  let parentTabIndex = 0;

  segmentTabData.every((item, index) => {
    if (!item.disabled) {
      parentTabIndex = index;
      return false;
    }
    return true;
  });

  const tabProps = {
    parentTab: {
      tabs: segmentTabData,
      defaultActiveTab: parentTabIndex,
      showSingleTabBtn: false,
    },
    childTab: paxData,
  };

  return (
    isOpen && (
    <AddonSlider {...gnKitProps}>
      <div className="skyplus-gn-kit">
        <DoubleTabsContainer {...tabProps} />
      </div>
    </AddonSlider>
    )
  );
};

GoodNightKitSlidePane.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  isModifyFlow: PropTypes.string,
  takenSsr: PropTypes.array,
  sliderPaneConfigData: PropTypes.object,
};

export default GoodNightKitSlidePane;
