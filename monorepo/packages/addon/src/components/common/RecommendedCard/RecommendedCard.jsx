import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import { formatCurrencyFunc } from '../../../functions/utils';
import { categoryCodes } from '../../../constants';
import { BUTTON_LABELS } from '../../../constants/analytic';

function RecommendedCard(props) {
  const {
    setRemoveSelected,
    subTitle,
    offeredPrice,
    // TD: update when slashedPriceValue available
    slashedPrice,
    disableCTA,
    selfSelectedAddobe,
    setOpenSlider,
    setAddonSelected,
    currencyCode,
    addonSelected,
    addedLabel,
    recomendedData,
    removeConfirmationPopup,
    addInfoLable,
    hideRemoveCTA = false,
    isTakenSSRInModifyFlow = false,
    eachLabel,
  } = props;

  const { recommendedImage, title: recommendedTitle } = recomendedData || {};
  const [showRemoveConfirmation, setRemoveConfirmation] = useState(false);

  const { secondaryCtaLabel, description, ctaLabel, heading } = removeConfirmationPopup || {};

  const offeredPriceValue = formatCurrencyFunc({
    price: offeredPrice,
    currencycode: currencyCode,
  });

  // TD: update when slashedPriceValue available
  const slashedPriceValue = formatCurrencyFunc({
    price: slashedPrice,
    currencycode: currencyCode,
  });

  const onClickCTA = () => {
    if (!disableCTA) {
      return !selfSelectedAddobe ? setOpenSlider() : setAddonSelected();
    }
    return false;
  };

  const removeAddon = (event) => {
    event.stopPropagation();
    setRemoveSelected();
    setRemoveConfirmation(false);
  };

  const checkRemoveConfirmation = (event) => {
    event.stopPropagation();
    if (categoryCodes.prim ===
      recomendedData?.categoryBundleCode || categoryCodes.mlst === recomendedData?.categoryBundleCode) {
      setRemoveConfirmation(true);
    } else {
      removeAddon(event);
    }
  };

  if (showRemoveConfirmation) {
    return createPortal(
      <PopupModalWithContent
        onCloseHandler={() => {
          setRemoveConfirmation(false);
        }}
        closeButtonIconClass="d-none"
      >
        <div className="sh7">
          {heading}
        </div>
        <div
          className="body-small-regular skyplus-addon-mf__modal-content mt-4"
          dangerouslySetInnerHTML={{
            __html: description?.html,
          }}
        />
        <div className="skyplus-recommended__dialog-btn mt-12">
          <Button
            variant="outline"
            color="primary"
            size="small"
            onClick={() => setRemoveConfirmation(false)}
            containerClass="me-8"
          >
            {ctaLabel}
          </Button>
          <Button
            onClick={removeAddon}
            color="primary"
            size="small"
          >
            {secondaryCtaLabel}
          </Button>
        </div>
      </PopupModalWithContent>,
      document.body,
    );
  }

  return (
    <div className="skyplus-recommended">
      <img
        src={recommendedImage?._publishUrl}
        alt="broken"
      />
      <div className="skyplus-recommended__blur-container">
        <div>

          {addonSelected && (
            <div className="skyplus-recommended__added-container">
              <Chip variant="filled" color="system-success" size="sm" containerClass="mb-4">
                {addedLabel}
              </Chip>
              {categoryCodes.ffwd !==
              recomendedData?.categoryBundleCode &&
              categoryCodes.prot !== recomendedData?.categoryBundleCode &&
              categoryCodes.brb !== recomendedData?.categoryBundleCode && !hideRemoveCTA && (
                <i
                  className={`icon-edit skyplus-recommended__added-container--edit-button
                  ${isTakenSSRInModifyFlow ? 'disabled' : ''}`}
                  onClick={onClickCTA}
                  aria-hidden
                />
              )}
            </div>
          )}
          <div className="skyplus-recommended__blur-container-title">{recommendedTitle}</div>
          <div
            className="skyplus-recommended__blur-container-sub-title body-small-regular"
            dangerouslySetInnerHTML={{
              __html: subTitle,
            }}
          />
          <div className="skyplus-recommended__blur-container-footer">
            <div>
              <div>
                {/* TD: slashed price */}
                {slashedPrice > 0 && (
                <span className="skyplus-recommended__slashed-price price-medium-stroked">
                  {slashedPriceValue}
                </span>
                )}
                <span className="skyplus-recommended__offered-price">
                  {(addonSelected && addInfoLable) ?
                    formatCurrencyFunc({ price: 0, currencycode: currencyCode }) : offeredPriceValue}
                </span>
              </div>
              <div className="skyplus-recommended__each-label px-1">{eachLabel}</div>
            </div>
            {(addonSelected && !addInfoLable) && !hideRemoveCTA && (
              <Button
                onClick={checkRemoveConfirmation}
                variant="outline"
                aria-label={`Remove ${recommendedTitle}`}
                size="sm"
                disabled={isTakenSSRInModifyFlow}
              >
                {BUTTON_LABELS.REMOVE}
              </Button>
            )}
            {!addonSelected && !addInfoLable && (
              <Button
                onClick={onClickCTA}
                size="sm"
                aria-label={`Add ${recommendedTitle} ${subTitle} ${offeredPriceValue}`}
              >
                {BUTTON_LABELS.ADD}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

RecommendedCard.propTypes = {
  setRemoveSelected: PropTypes.func,
  subTitle: PropTypes.string,
  offeredPrice: PropTypes.number,
  // TD: update when slashedPriceValue available
  slashedPrice: PropTypes.number,
  disableCTA: PropTypes.bool,
  selfSelectedAddobe: PropTypes.bool,
  setOpenSlider: PropTypes.func,
  setAddonSelected: PropTypes.func,
  currencyCode: PropTypes.string,
  addonSelected: PropTypes.string,
  addedLabel: PropTypes.string,
  recomendedData: PropTypes.object,
  removeConfirmationPopup: PropTypes.object,
  addInfoLable: PropTypes.string,
  hideRemoveCTA: PropTypes.bool,
  isTakenSSRInModifyFlow: PropTypes.bool,
  eachLabel: PropTypes.string,
};

export default RecommendedCard;
