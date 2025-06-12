import React, { useState, useEffect } from 'react';
import AddonSlider from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import DoubleTabsContainer from 'skyplus-design-system-app/dist/des-system/DoubleTabsContainer';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import BarData from './BarSlidePaneData';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';
import { paxCodes } from '../../../constants';
// Old Code:
// import OffCanvasFooter from '../../common/OffCanvasFooter/OffCanvasFooter';

const BarSlidePane = ({
  isOpen,
  onClose,
  onSubmit,
  segmentData,
  passengerDetails,
  addonData,
  configData,
  ssrCategory,
  takenSsrList,
  isModifyFlow,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      setGetBar,
      selectedBar,
      tripIndex,
      paxIndex,
      removedAddonSsr,
      removedBar,
    },
    dispatch,
  } = React.useContext(AppContext);
  const AEMData = addonData?.availableSlidePaneData[0];
  const [segmentTabData, setSegmentTabData] = useState([]);
  const [paxData, setPaxData] = useState([]);

  const barProps = {
    overlayCustomClass: '',
    modalCustomClass: 'bar-slide-pane',
    title: `${AEMData?.sliderTitle}`,
    containerClassName: 'skyplus-offcanvas__addon-mf',
    onClose: (e) => {
      const selectedList = { ...selectedBar };
      if (setGetBar && setGetBar[tripIndex]) {
        Object.keys(setGetBar[tripIndex]).forEach((segment) => {
          Object.keys(setGetBar[tripIndex][segment]).forEach((paxItem) => {
            if (setGetBar[tripIndex][segment][paxItem].length > 0) {
              if (!selectedList[tripIndex]) {
                selectedList[tripIndex] = [];
              }
              if (!selectedList[tripIndex][segment]) {
                selectedList[tripIndex][segment] = {};
              }
              selectedList[tripIndex][segment][paxItem] =
								setGetBar[tripIndex][segment][paxItem];
            }
          });
        });
      }

      dispatch({
        type: addonActions.SELECTED_BAR_ADDON_DATA,
        payload: selectedList,
      });

      const removedBarSsrData = [];

      dispatch({
        type: addonActions.REMOVED_BAR_ADDON_DATA,
        payload: removedBarSsrData,
      });

      onClose(false);
    },
  };

  const barPaneProps = {
    addonData,
    configData,
    isModifyFlow,
    takenSsrList,
    onSubmit: () => {
      onSubmit();
    },
    barConfig: AEMData,
    sliderPaneConfigData,
  };

  useEffect(() => {
    getSegmentTabData();
  }, [selectedBar, tripIndex, isOpen]);

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

        const barData = [];
        const paxTabData = [];
        paxList.forEach((paxDetails) => {
          if (
            paxDetails.passengerTypeCode !== paxCodes.children.code &&
						paxDetails.passengerTypeCode !== paxCodes.infant.code
          ) {
            const ssrList = cloneDeep(segmentSSRItem[0]?.ssrs);
            ssrList.forEach((ssrItem) => {
              ssrItem.passengersSSRKey.forEach((paxKey) => {
                if (paxDetails.passengerKey === paxKey.passengerKey) {
                  ssrItem.ssrKey = paxKey.ssrKey;
                  ssrItem.passengerName = `${
                    paxDetails?.name?.first || ''
                  } ${paxDetails?.name?.middle || ''} ${
                    paxDetails?.name?.last || ''
                  }`;
                  ssrItem.passengerKey = paxDetails.passengerKey;
                }
              });

              AEMData?.ssrList.forEach((aemItem) => {
                if (ssrItem.ssrCode === aemItem.ssrCode) {
                  ssrItem.image = aemItem.image;
                }
              });
            });
            barData.push(ssrList);

            const paxTabItem = {
              title: `${paxDetails?.name?.first || ''} ${
                paxDetails?.name?.middle || ''
              } ${paxDetails?.name?.last || ''}`,
              passengerKey: paxDetails.passengerKey,
              checked: false,
            };

            if (selectedBar && selectedBar[tripIndex]) {
              Object.keys(selectedBar[tripIndex]).forEach((segmentData) => {
                if (
                  segmentData ===
									`${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`
                ) {
                  Object.keys(selectedBar[tripIndex][segmentData]).forEach(
                    (paxKey) => {
                      if (
                        selectedBar[tripIndex][segmentData][paxKey].length >
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
          }
        });

        const contentData = [];
        barData.forEach((ssrList) => {
          contentData.push(
            <BarData
              {...barPaneProps}
              segmentData={`${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`}
              barList={ssrList}
              paxLength={paxTabData.length}
              isOpen={isOpen}
              barData={barData}
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

      takenSsrList[tripIndex]?.forEach((takenSsrItem) => {
        let isDeleted = false;
        removedAddonSsr?.forEach((removedAddonItem) => {
          if (takenSsrItem.originalSsrKey === removedAddonItem.ssrKey) {
            isDeleted = true;
          }
        });
        removedBar?.forEach((removedItem) => {
          if (takenSsrItem.originalSsrKey === removedItem.ssrKey) {
            isDeleted = true;
          }
        });
        const item = takenSsrItem.originalSsrKey;
        const segmentData = `${segment?.segmentDetails.origin}-${segment?.segmentDetails.destination}`;
        const { passengerKey } = takenSsrItem;

        if (!isDeleted && segmentData === takenSsrItem?.segmentData) {
          let newList = [];
          if (
            selectedBar &&
						selectedBar[tripIndex] &&
						selectedBar[tripIndex][segmentData] &&
						selectedBar[tripIndex][segmentData][passengerKey]
          ) {
            newList = cloneDeep(
              selectedBar[tripIndex][segmentData][passengerKey],
            );
          }

          if (newList.indexOf(item) === -1) {
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
            dispatch({
              type: addonActions.SELECTED_BAR_ADDON_DATA,
              payload: segmentList,
            });
          }
        }
      });
    });

    setSegmentTabData(segmentTabData);
    setPaxData(paxData);
  };

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
    <AddonSlider {...barProps}>
      <div className="skyplus-bar-addon">
        <DoubleTabsContainer {...tabProps} />
      </div>
    </AddonSlider>
    )
  );
};

BarSlidePane.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  segmentData: PropTypes.any,
  passengerDetails: PropTypes.any,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  takenSsrList: PropTypes.array,
  isModifyFlow: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
};

export default BarSlidePane;
