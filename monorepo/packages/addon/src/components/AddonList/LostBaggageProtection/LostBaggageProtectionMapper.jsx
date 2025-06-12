import React, { useEffect, useState } from 'react';
// Old Code:
// import SuccessPopup from 'skyplus-design-system-app/dist/des-system/SuccessPopup';

import PropTypes from 'prop-types';
import LostBaggageProtection from './LostBaggageProtection';
import { categoryCodes } from '../../../constants/index';
import { addonCanRemove } from '../../../functions/utils';

const { brb } = categoryCodes;

const ComponentMapper = {
  [brb]: {
    Component: LostBaggageProtection,
    className: 'delay-lost-baggage-addon',
  },
};

const LostBaggageProtectionMapper = (props) => {
  const [isAddonSelect, setAddonSelect] = useState(false);
  const [isOpenSlider, setOpenSlider] = useState(false);
  const [popupProps, setPopupProps] = useState({
    show: false,
    data: { message: '', location: [] },
  });

  useEffect(() => {
    if (popupProps.show) {
      setTimeout(() => {
        setPopupProps({ show: false, data: { message: '', location: [] } });
      }, 5000);
    }
  }, [popupProps.show]);

  const { ssrCategory, addonData, configData, passengerKey, segmentData } = props;

  const Mapper = Reflect.get(ComponentMapper, ssrCategory);
  const { addOnCanbeRemoved, isSuper6Efare } = addonCanRemove(
    passengerKey,
    addonData.title,
    segmentData.journeyKey,
  );

  const addonCardProps = {
    title: addonData?.title,
    discription: addonData?.description?.html,
    addLabel: configData.addLabel,
    addedLabel: configData?.addedLabel,
    removeLable: configData?.removeLabel,
    addInfoLable: false,
    addonType: ssrCategory,
    selectedAddonName: '',
    selectedAddonPrice: 0,
    isInformationIcon: true,
    isCheckboxLabel: addonData?.categoryDetails,
    selfSelectedAddobe: false,
    setAddonSelected: () => setAddonSelect(true),
    setOpenSlider: () => setOpenSlider(true),
    image: addonData?.image,
    addonSelected: addOnCanbeRemoved || isAddonSelect || isSuper6Efare,
    disableCTA: isSuper6Efare && !addOnCanbeRemoved,
    hideRemoveCTA: isSuper6Efare && !addOnCanbeRemoved,
    uptoLabel: addonData.categoryDetails,
  };

  const { Component, className } = Mapper;
  return (
    <div
      className={`skyplus-addon-mf__addon-item ${className}`}
    >
      <Component
        {...props}
        addonCardProps={addonCardProps}
        setPopupProps={setPopupProps}
        setAddonSelect={setAddonSelect}
        setOpenSlider={setOpenSlider}
        isOpenSlider={isOpenSlider}
      />
      {/* Old Code: {popupProps.show && (
        <SuccessPopup
          title={configData?.serviceSuccessfullyAddedPopupLabel}
          {...popupProps.data}
        />
      )} */}
    </div>
  );
};

LostBaggageProtectionMapper.propTypes = {
  addonData: PropTypes.any,
  configData: PropTypes.object,
  ssrCategory: PropTypes.string,
  segmentData: PropTypes.object,
  passengerKey: PropTypes.string,
};

export default LostBaggageProtectionMapper;
