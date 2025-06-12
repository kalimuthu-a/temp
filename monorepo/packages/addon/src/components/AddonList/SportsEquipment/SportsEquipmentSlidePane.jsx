import React, { useEffect, useState } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import TabsContainer from 'skyplus-design-system-app/dist/des-system/TabsContainer';
import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import SportsSelection from './SportsSelection';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';

const SportsEquipmentSlidePane = ({
  isOpen,
  onClose,
  addonData,
  configData,
  ssrCategory,
  passengerDetails,
  onSubmit,
  takenSsrList,
  isModifyFlow,
  sliderPaneConfigData,
}) => {
  const {
    state: {
      setGetSportsEquipment,
      selectedSportsEquipment,
      tripIndex,
      paxIndex,
      removedAddonSsr,
      removedSportsEquipment,
    },
    dispatch,
  } = React.useContext(AppContext);

  const AEMData = addonData?.availableSlidePaneData[0];
  const sportsEquipmentApiObject = addonData?.availableSSR[0]?.ssrs[0];

  const [passengerTabProps, setPassengerTabProps] = useState([]);
  useEffect(() => {
    if (passengerTabProps) {
      const props = cloneDeep(passengerTabProps);
      props.defaultActiveTab = paxIndex[tripIndex]?.paxIndex || 0;
      setPassengerTabProps(props);
    }
  }, [paxIndex]);

  const sportsSlideProps = {
    overlayCustomClass: '',
    modalCustomClass: 'sports-slide-pane',
    title: `${AEMData?.sliderTitle}`,
    containerClassName: 'skyplus-offcanvas__addon-mf',
    onClose: (e) => {
      const selectedList = { ...selectedSportsEquipment };
      if (setGetSportsEquipment && setGetSportsEquipment[tripIndex]) {
        Object.keys(setGetSportsEquipment[tripIndex]).forEach((pax) => {
          if (setGetSportsEquipment[tripIndex][pax].length > 0) {
            if (!selectedList[tripIndex]) {
              selectedList[tripIndex] = [];
            }
            selectedList[tripIndex][pax] =
              setGetSportsEquipment[tripIndex][pax];
          }
        });
      }

      dispatch({
        type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
        payload: selectedList,
      });

      const removedSportsEquipmentSsrData = [];

      dispatch({
        type: addonActions.REMOVED_SPORTSEQUIPMENT_ADDON_DATA,
        payload: removedSportsEquipmentSsrData,
      });

      onClose(false);
    },
  };

  const sportsSelectionProp = {
    configData,
    isModifyFlow,
    takenSsrList,
    onSubmit: () => {
      onSubmit();
    },
    AEMData: addonData?.availableSlidePaneData[0],
  };

  const sportsEquipmentConfig = addonData?.availableSSR[0];

  useEffect(() => {
    getParentTabData();
  }, [selectedSportsEquipment, tripIndex, isOpen]);

  const getParentTabData = () => {
    const paxList = cloneDeep(passengerDetails);

    const sportsEquipmentData = [];
    const paxTabData = [];
    paxList.forEach((paxDetails) => {
      const ssrList = cloneDeep(sportsEquipmentConfig?.ssrs);
      ssrList?.forEach((ssrItem) => {
        ssrItem.passengersSSRKey.forEach((paxKey) => {
          if (paxDetails.passengerKey === paxKey.passengerKey) {
            ssrItem.ssrKey = paxKey.ssrKey;
            ssrItem.passengerName = `${paxDetails?.name?.first || ''} ${
              paxDetails?.name?.middle || ''
            } ${paxDetails?.name?.last || ''}`;
            ssrItem.passengerKey = paxDetails.passengerKey;
          }
        });
      });
      const updatedSsrList = [];
      const ssrLimit = sportsEquipmentConfig?.limit;

      for (let i = 1; i <= ssrLimit; i++) {
        const newSsrList = cloneDeep(ssrList);
        newSsrList.forEach((ssrItem) => {
          ssrItem.price = ssrItem?.price * i;
          ssrItem.itemCount = i;
          ssrItem.itemSsrKey = `${ssrItem.ssrKey}@@${i}`;
          updatedSsrList.push(ssrItem);
        });
      }

      sportsEquipmentData.push(updatedSsrList);

      const paxTabItem = {
        title: `${paxDetails?.name?.first || ''} ${
          paxDetails?.name?.middle || ''
        } ${paxDetails?.name?.last || ''}`,
        passengerKey: paxDetails.passengerKey,
        checked: false,
      };

      if (selectedSportsEquipment && selectedSportsEquipment[tripIndex]) {
        Object.keys(selectedSportsEquipment[tripIndex]).forEach(
          (passengerItem) => {
            if (
              passengerItem === paxDetails.passengerKey &&
              selectedSportsEquipment[tripIndex][passengerItem] &&
              selectedSportsEquipment[tripIndex][passengerItem].length > 0
            ) {
              paxTabItem.checked = true;
            }
          },
        );
      }

      paxTabData.push(paxTabItem);
    });

    const contentData = [];
    sportsEquipmentData?.forEach((ssrList) => {
      contentData.push(
        <SportsSelection
          {...sportsSelectionProp}
          sportsEquipmentList={ssrList}
          paxLength={paxTabData.length}
          isOpen={isOpen}
          sportsEquipmentData={sportsEquipmentData}
          sliderPaneConfigData={sliderPaneConfigData}
          sportsEquipmentApiObject={sportsEquipmentApiObject}
        />,
      );
    });

    takenSsrList[tripIndex]?.forEach((takenSsrItem) => {
      let isDeleted = false;
      removedAddonSsr?.forEach((removedItem) => {
        if (takenSsrItem.originalSsrKey === removedItem.ssrKey) {
          isDeleted = true;
        }
      });
      const item = `${takenSsrItem.originalSsrKey}@@${takenSsrItem.takenCount}`;
      removedSportsEquipment?.forEach((removedItem) => {
        if (item === removedItem.ssrKey) {
          isDeleted = true;
        }
      });
      const { passengerKey } = takenSsrItem;

      if (!isDeleted) {
        let newList = [];
        if (
          selectedSportsEquipment &&
          selectedSportsEquipment[tripIndex] &&
          selectedSportsEquipment[tripIndex][passengerKey]
        ) {
          newList = cloneDeep(selectedSportsEquipment[tripIndex][passengerKey]);
        }

        if (newList.indexOf(item) === -1) {
          let isDataAvailable = false;
          if (newList?.length === 1) {
            const newKey = newList[0].split('@@');
            const ssrKey = newKey[0];

            if (ssrKey === takenSsrItem.originalSsrKey) {
              isDataAvailable = true;
            }
          }

          if (!isDataAvailable) {
            newList = [];
            newList.push(item);
            const segmentList = { ...selectedSportsEquipment };
            if (!segmentList[tripIndex]) {
              segmentList[tripIndex] = [];
            }
            segmentList[tripIndex][passengerKey] = newList;
            dispatch({
              type: addonActions.SELECTED_SPORTSEQUIPMENT_ADDON_DATA,
              payload: segmentList,
            });
          }
        }
      }
    });

    const props = {
      tabs: paxTabData,
      content: contentData,
      defaultActiveTab: paxIndex[tripIndex]?.paxIndex || 0,
      showSingleTabBtn: false,
    };
    setPassengerTabProps(props);
  };

  return (
    isOpen && (
      <div className="sports_slider">
        <OffCanvas {...sportsSlideProps}>
          <div className="skyplus-sports-equipment">
            <TabsContainer {...passengerTabProps} />
          </div>
        </OffCanvas>
      </div>
    )
  );
};

SportsEquipmentSlidePane.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  addonData: PropTypes.object,
  configData: PropTypes.object,
  ssrCategory: PropTypes.any,
  passengerDetails: PropTypes.any,
  onSubmit: PropTypes.func,
  takenSsrList: PropTypes.array,
  isModifyFlow: PropTypes.string,
  sliderPaneConfigData: PropTypes.object,
};

export default SportsEquipmentSlidePane;
