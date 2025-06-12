import UpsellPopup from 'skyplus-design-system-app/dist/des-system/UpsellPopup';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { categoryCodes } from '../../../constants/index';
import { AppContext } from '../../../context/AppContext';
import { addonActions } from '../../../store/addonActions';

/**
 *
 * @type {React.FC<{
 * addonData: {upsellInformation?: *, isUpsellCategory?: string, availableSSR?: *,},
 * setOpenSlider: Function,
 * isInternational: boolean,
 * }>}
 * @returns {React.FunctionComponentElement}
 */
const UpSellPopUp = ({ addonData, setOpenSlider, isInternational }) => {
  const {
    state: { upSellPopup, categories },
    dispatch,
  } = useContext(AppContext);

  const upsellInformation = { ...addonData?.upsellInformation };

  const defaultPayload = { showLBUpsellPopup: false, actionTakenLB: true };

  const onCloseHandler = () => {
    dispatch({
      type: addonActions.SET_UPSELL_POPUP_DATA,
      payload: defaultPayload,
    });
  };

  useEffect(() => {
    // Only for first customer and have trip segment 0 -- one time call
    const takenssr = get(addonData, 'availableSSR.0.takenssr', []);
    dispatch({
      type: addonActions.SET_UPSELL_POPUP_DATA,
      payload: {
        actionTakenLB:
          window?.showAddonsUpsellPopUp !== 'no'
            ? takenssr?.length > 0 || upSellPopup.actionTakenLB
            : true,
      },
    });
  }, []);

  const price = useMemo(() => {
    const item = get(categories, categoryCodes.brb, null);
    const data = { passenger: '', compenstation: '' };

    if (!item) {
      return data;
    }

    data.passenger = item.priceToDisplay;
    const { domesticPrice, internationalPrice } = get(
      addonData,
      'availableSlidePaneData.0',
      {
        domesticPrice: '',
        internationalPrice: '',
      },
    );

    data.compenstation = isInternational ? internationalPrice : domesticPrice;
    return data;
  }, []);

  const upsellPopupProps = {
    highlightLabel: upsellInformation?.highlightLabel,
    heading: upsellInformation?.heading,
    description: upsellInformation?.description.replace('{}', price.passenger),
    ctaLabel: upsellInformation?.ctaLabel,
    secondaryCtaLabel: upsellInformation?.secondaryCtaLabel,
    multilineLabels: upsellInformation?.multilineLabels?.map((v) => v.replace('{}', price.compenstation)),
    tncLabel: upsellInformation?.tncLabel,
    image: upsellInformation?.image,
    link: '',
    linkLabel: '',
    onCancelHandler: () => {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { ...defaultPayload, submitAddon: true },
      });
    },
    onProceedHandler: () => {
      setOpenSlider(true);
      onCloseHandler();
    },
  };

  return upSellPopup?.showLBUpsellPopup ? (
    <PopupModalWithContent
      className="upsell-default"
      onCloseHandler={onCloseHandler}
    >
      <UpsellPopup {...upsellPopupProps} />
    </PopupModalWithContent>
  ) : null;
};

UpSellPopUp.defaultProps = {};
UpSellPopUp.propTypes = {
  addonData: PropTypes.shape({
    upsellInformation: PropTypes.any,
    availableSSR: PropTypes.any,
    isUpsellCategory: PropTypes.string,
  }).isRequired,
  setOpenSlider: PropTypes.func,
  isInternational: PropTypes.bool,
};

export default UpSellPopUp;
