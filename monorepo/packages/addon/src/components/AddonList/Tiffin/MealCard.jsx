import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { dietTypeCodes } from '../../../constants/aemAuthoring';
import { categoryCodes } from '../../../constants';
import { formatCurrencyFunc } from '../../../functions/utils';
import { getPassengerName } from '../../../functions';
import NutritionalInfo from './NutritionalInfo';

const MealCard = (props) => {
  const {
    preference,
    mealName,
    name,
    categoryBundleCode,
    price,
    currencycode,
    passengerDetails,
    passengerIndex,
    added,
    canBeRemoved,
    slidePaneData,
    image,
    reachedLimitForEachMealSelection,
    onAdd,
    onRemove,
    isMainCard,
    showDivider,
    nutritionalInfoData,
  } = props;

  // TD: - functionality for extra addon slider
  // const [isOpenSlider, setOpenSlider] = useState(false);
  // const handleToggleDetailSlider = (nutriFact) => {
  //   if (nutriFact.length < 1) {
  //     return;
  //   }
  //   toggleDetailSlider();
  // };
  // const toggleDetailSlider = () => {
  //   setOpenSlider(!isOpenSlider);
  // };

  const [expanded, setExpanded] = useState(false);

  const handleOnAdd = () => {
    if (reachedLimitForEachMealSelection) {
      return;
    }

    onAdd();
  };

  let dietPreferenceLogo = 'icon-non-veg';

  if (preference === dietTypeCodes.veg) {
    dietPreferenceLogo = 'icon-veg';
  } else if (preference === dietTypeCodes.bestseller) {
    dietPreferenceLogo = 'icon-bestsellar-solid';
  }

  const passenger = passengerDetails[passengerIndex];

  const fullName = passenger?.name
    ? getPassengerName(passenger)
    : passenger?.passengerKey;

  const onClickNutritionalInfo = () => {
    setExpanded((pre) => !pre);
  };

  return (
    <>
      <div
        className={`${
          isMainCard ? 'skyplus-main-meal-card p-8' : 'skyplus-meal-card'
        }`}
      >
        <div
          className={`${
            !isMainCard && showDivider
              ? 'skyplus-meal-card__container pb-12'
              : 'pb-5'
          }`}
        >
          <div className="skyplus-meal-card__container__main-info">
            <div className="skyplus-meal-card__left-section">
              <div>
                <div className="skyplus-meal-card__left-section-header">
                  {!!preference && (
                    <i
                      className={`skyplus-meal-card__icon 
                    ${dietPreferenceLogo}
                    `}
                    >
                      <span className="path1" />
                      <span className="path2" />
                    </i>
                  )}
                  <span className="skyplus-meal-card__title tags-small">
                    {preference}
                  </span>
                </div>
                <div className="skyplus-meal-card__meal-name body-small-regular mt-3">
                  {mealName || name}
                </div>
              </div>
              <div className="skyplus-meal-card__price-container">
                <div className="skyplus-meal-card__price sh7">
                  {categoryBundleCode !== categoryCodes.mlst &&
                    categoryBundleCode !== categoryCodes.prim &&
                    formatCurrencyFunc({
                      price,
                      currencycode,
                    })}
                </div>
                {/* TD: Strike out price
              <div className="body-small-regular skyplus-meal-card__price2">
                {categoryBundleCode !== categoryCodes.mlst &&
                  categoryBundleCode !== categoryCodes.prim &&
                  formatCurrencyFunc({
                    price: disabledPrice,
                    currencycode,
                  })}
              </div> */}
              </div>
            </div>
            <div className="skyplus-meal-card__right-section">
              <div className="skyplus-meal-card__image-container">
                <img src={image?._publishUrl} alt={mealName} />
              </div>
              <div className="skyplus-meal-card__add-container">
                {added && canBeRemoved && (
                  <Button
                    containerClass="skyplus-meal-card__btn-remove"
                    variant="outline"
                    color="primary"
                    onClick={onRemove}
                    size="small"
                    aria-label={`Remove ${preference || ''} ${
                      mealName || name
                    } at ${price} for ${fullName}`}
                  >
                    {slidePaneData.removeLabel}
                  </Button>
                )}

                {added && canBeRemoved === false && (
                  <Button
                    containerClass="skyplus-meal-card__btn-added"
                    variant="filled"
                    size="small"
                    color="success"
                    aria-label={`Added ${preference || ''} ${
                      mealName || name
                    } at ${price} for ${fullName}`}
                  >
                    {slidePaneData?.addedLabel || 'Added'}
                  </Button>
                )}

                {!added && (
                  <Button
                    containerClass="skyplus-meal-card__btn-add"
                    variant="filled"
                    color="primary"
                    disabled={!!reachedLimitForEachMealSelection}
                    onClick={handleOnAdd}
                    size="small"
                    aria-label={`Add ${preference || ''} ${
                      mealName || name
                    } at ${price} for ${fullName}`}
                  >
                    {slidePaneData.addLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
          {nutritionalInfoData?.nutritionalInfoLabel?.html && (
            <button
              className="skyplus-meal-card__nutritional-info"
              type="button"
              onClick={onClickNutritionalInfo}
              aria-label="Nutritional info"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: nutritionalInfoData?.nutritionalInfoLabel?.html,
                }}
              />
              <Icon
                className={`icon-accordion-${expanded ? 'up' : 'down'}-simple`}
              />
            </button>
          )}
          {expanded && (
            <NutritionalInfo nutritionalInfoData={nutritionalInfoData} />
          )}
        </div>
      </div>
      {/* Old Code: {isOpenSlider && (
      <AddonSlider
        overlayCustomClass=""
        modalCustomClass="meal-detail-slide-pane"
        title={props.ssrName ? props.ssrName : props.name}
        onClose={() => setOpenSlider(false)}
      >
        <MealDetail {...props} slidePaneData={props.slidePaneData} />
      </AddonSlider>
      )} */}
    </>
  );
};

MealCard.propTypes = {
  added: PropTypes.bool,
  canBeRemoved: PropTypes.bool,
  categoryBundleCode: PropTypes.any,
  currencycode: PropTypes.any,
  preference: PropTypes.string,
  image: PropTypes.object,
  mealName: PropTypes.any,
  name: PropTypes.any,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  price: PropTypes.number,
  reachedLimitForEachMealSelection: PropTypes.any,
  slidePaneData: PropTypes.object,
  isMainCard: PropTypes.bool,
  passengerDetails: PropTypes.any,
  passengerIndex: PropTypes.number,
  showDivider: PropTypes.number,
  nutritionalInfoData: PropTypes.any,
};

export default MealCard;
