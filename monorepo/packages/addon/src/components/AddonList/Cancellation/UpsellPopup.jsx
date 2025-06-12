import UpsellPopup from 'skyplus-design-system-app/dist/des-system/UpsellPopup';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import React, { useMemo, useContext, useEffect } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { addonActions } from '../../../context/addonReducer';
import { AppContext } from '../../../context/appContext';
import { formatCurrencyFunc } from '../../../functions/utils';

/**
 * @type {React.FC<import("../../../../types/AddOnList").UpSellPopupProps>}
 * @returns {React.FunctionComponentElement}
 */
const UpSellPopUp = ({ addonData, setOpenSlider }) => {
  const {
    state: { upSellPopup },
    dispatch,
  } = useContext(AppContext);
  const defaultPayload = { showCIUpsellPopup: false, actionTakenCI: true };

  const upsellInformation = {
    placeholder: '',
    heading: '',
    description: '',
    ctaLabel: '',
    secondaryCtaLabel: '',
    highlightLabel: '',
    idPlaceholderLabel: '',
    checkboxContentLabels: [],
    multilineLabels: [],
    tncLabel: '',
    additionalLabel: '',
    additionalLabelPlaceholder: '',
    image: '',
    ...addonData?.upsellInformation,
  };

  useEffect(() => {
    if (addonData?.isUpsellCategory === 'true') {
      dispatch({
        type: addonActions.SET_UPSELL_POPUP_DATA,
        payload: { ...defaultPayload, actionTakenCI: false },
      });
    }
  }, []);

  const onCloseHandler = () => {
    dispatch({
      type: addonActions.SET_UPSELL_POPUP_DATA,
      payload: defaultPayload,
    });
  };

  const price = useMemo(() => {
    const item = get(addonData, 'availableSSR[0].ssrs[0]', null);

    if (!item) {
      return null;
    }
    return formatCurrencyFunc(item);
  }, []);

  const upsellPopupProps = {
    highlightLabel: upsellInformation?.highlightLabel,
    heading: upsellInformation?.heading,
    description: upsellInformation?.description.replace('{}', price),
    ctaLabel: upsellInformation?.ctaLabel,
    secondaryCtaLabel: upsellInformation?.secondaryCtaLabel,
    multilineLabels: upsellInformation?.multilineLabels?.map((v) => v.replace('{}', price)),
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

  return upSellPopup.showTAUpsellPopup ? (
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
  addonData: PropTypes.any,
  setOpenSlider: PropTypes.func,
};

export default UpSellPopUp;
