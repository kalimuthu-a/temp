import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const OneForSkiesCard = ({
  name,
  price,
  toggleDrinkHandler,
  selected = false,
  isTakenSsrData,
  isModifyFlow,
  imagePath,
  removeButtonLabel,
  addButtonLabel,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const nameString = name ? name.replace('–', '-') : '';
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  const handleChange = () => {
    toggleDrinkHandler(!isSelected);
  };

  return (
    <div className="skyplus-ofs-card__container">
      <div className="skyplus-ofs-card__left-section">
        <div>
          <div className="skyplus-ofs-card__left-section-header">
            <span className="skyplus-ofs-card__title tags-small">{nameString.split('-')[0]}</span>
          </div>
          <div className="skyplus-ofs-card__drink-quantity body-small-regular">{nameString.split('-')[1]}</div>
          <div className="skyplus-ofs-card__price-container">
            <div className="skyplus-ofs-card__price sh7">{price}</div>
          </div>
        </div>
      </div>
      <div className="skyplus-ofs-card__right-section">
        <div className="skyplus-ofs-card__image-container">
          <img
            src={imagePath}
            alt={nameString.split('-')[0]}
          />
        </div>
        <div className="skyplus-ofs-card__add-container">
          <div
            className="skyplus-button skyplus-ofs-card__btn-add "
          >
            <button
              onClick={handleChange}
              type="button"
              className={`skyplus-button--small ${(isTakenSsrData && isModifyFlow) ?
                'skyplus-button--disabled' : ''} ${(isSelected ?
                'skyplus-button--outline skyplus-button--outline-primary' :
                'skyplus-button--filled skyplus-button--filled-primary')}`}
            >{!isSelected ? addButtonLabel : removeButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OneForSkiesCard.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  selected: PropTypes.bool,
  toggleDrinkHandler: PropTypes.func,
  isTakenSsrData: PropTypes.bool,
  isModifyFlow: PropTypes.string,
  imagePath: PropTypes.string,
  removeButtonLabel: PropTypes.string,
  addButtonLabel: PropTypes.string,
};

export default OneForSkiesCard;
