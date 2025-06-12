import React, { useContext } from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import { AppContext } from '../../../context/AppContext';
import { categoryCodes } from '../../../constants/index';

function AddonCard(props) {
  const {
    title,
    discription,
    addLabel,
    addedLabel,
    removeLable,
    addInfoLable,
    addonType,
    addonSelected,
    selfSelectedAddobe,
    setAddonSelected,
    setRemoveSelected,
    setOpenSlider,
    image,
    disableCTA,
    hideRemoveCTA,
    imageText,
    imageSubText,
    variation = 'withImage', // withImage or withoutImage
    categoryCode,
    selectedItem,
    offLabel,
    discountPer,
    isTakenSSRInModifyFlow = false,
  } = props;

  const {
    state: {
      isAddonNextFare,
      loggedInLoyaltyUser,
    },
  } = useContext(AppContext);

  const removeAddon = (event) => {
    event.stopPropagation();
    setRemoveSelected();
  };

  const onClickCTA = () => {
    if (!disableCTA) {
      return !selfSelectedAddobe ? setOpenSlider() : setAddonSelected();
    }
    return false;
  };

  const getLabel = () => {
    if (!addonSelected) {
      return addLabel;
    }
    if (isAddonNextFare) {
      return `${addedLabel}!`;
    }
    return addedLabel;
  };

  const isImageVariation = variation === 'withImage';

  const chipPropsLoyalty = {
    size: 'sm',
    variant: 'filled',
    color: 'secondary-light',
    txtcol: 'system-information',
  };

  return (
    <div
      className={`skyplus-addon-card ${addonSelected && 'skyplus-addon-card--active'
      } ${addonSelected && !isImageVariation && 'skyplus-addon-card--active-white'
      }
      `}
      onClick={onClickCTA}
      data-addon-type={addonType}
      role="button"
      aria-label="select-addon"
      aria-hidden="true"
      tabIndex={0}
    >
      {isImageVariation ? (
        <div className="skyplus-addon-card__image-variation">
          <div className="skyplus-addon-card__image-container">
            <img src={image} alt={title || image} />
            <div className="skyplus-addon-card__image-header m-4 ">
              {loggedInLoyaltyUser && (
              <Chip {...chipPropsLoyalty}>
                {offLabel?.replace('{number}', discountPer || 0)}
              </Chip>
              )}
              {addonSelected && (
                <Chip color="system-success" size="sm">
                  {getLabel()}
                </Chip>
              )}
              {addonSelected && !hideRemoveCTA && !isTakenSSRInModifyFlow && (
                <div
                  className="skyplus-addon-card__image-container-close-icon"
                  onClick={removeAddon}
                  role="button"
                  tabIndex={0}
                  aria-hidden="true"
                  aria-label="Close"
                >
                  <i className="icon-close-solid" />
                </div>
              )}
            </div>
            {(imageText || imageSubText) && (
              <div className="skyplus-addon-card__image-footer">
                {imageText && (
                  <div className="skyplus-addon-card__image-footer-title sh-3">
                    {imageText}
                  </div>
                )}
                {imageSubText && (
                  <div className="skyplus-addon-card__image-footer-subtitle body-small-regular ms-2">
                    {imageSubText}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="skyplus-addon-card__footer-text sh-5 mt-4">
            {title}
          </div>
          {addInfoLable && <div>{addInfoLable}</div>}
        </div>
      ) : (
        <div className="skyplus-addon-card__raw">
          <div>
            <div className="skyplus-addon-card__raw-title body-large-medium mb-4">
              {title}
            </div>
            {
              !selectedItem
              && (
                <div
                  className="skyplus-addon-card__raw-subtitle"
                  dangerouslySetInnerHTML={{ __html: discription }}
                />
              )
            }
            {
              selectedItem && (
                <div className="skyplus-addon-card__selected-item-container">
                  <div className="skyplus-addon-card__selected-item sh-6">{selectedItem}</div>
                  {addonSelected && !hideRemoveCTA && (<i className="icon-edit" />)}
                </div>
              )
            }
          </div>
          {addonSelected && !hideRemoveCTA && (
            <div className="skyplus-addon-card__button-wrapper">
              <Button onClick={removeAddon} size="small" variant="outline" block>
                {removeLable}
              </Button>
            </div>
          )}
          {!addonSelected && (
            <div className="skyplus-addon-card__button-wrapper">
              {categoryCodes?.brb !== categoryCode ? (
                <Button onClick={onClickCTA} size="small" block>
                  {addLabel}
                </Button>
              ) : (
                <div className="skyplus-addon-card__rounded-button">
                  <i className="icon-arrow-top-right sm" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

AddonCard.propTypes = {
  title: PropTypes.string,
  discription: PropTypes.string,
  addLabel: PropTypes.string,
  addedLabel: PropTypes.string,
  removeLable: PropTypes.string,
  addInfoLable: PropTypes.string,
  addonType: PropTypes.string,
  addonSelected: PropTypes.bool,
  selfSelectedAddobe: PropTypes.bool,
  setAddonSelected: PropTypes.func,
  setRemoveSelected: PropTypes.func,
  setOpenSlider: PropTypes.func,
  image: PropTypes.string,
  disableCTA: PropTypes.bool,
  hideRemoveCTA: PropTypes.bool,
  imageText: PropTypes.string,
  imageSubText: PropTypes.string,
  variation: PropTypes.string,
  categoryCode: PropTypes.string,
  selectedItem: PropTypes.object,
  offLabel: PropTypes.string,
  discountPer: PropTypes.number,
  isTakenSSRInModifyFlow: PropTypes.bool,
};

export default AddonCard;
