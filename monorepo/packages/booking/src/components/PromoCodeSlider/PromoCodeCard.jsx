import PropTypes from 'prop-types';
import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const PromoCodeCard = ({
  applied,
  code,
  title,
  note,
  image,
  description,
  discountcashback,
  onClickAction,
  offerRemoveLabel,
  offerApplyLabel,
}) => {
  const onClickHandler = () => {
    onClickAction(code, !applied);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickHandler();
    }
  };
  return (
    <div className="promocodecard">
      <div className={`promocodecard--left ${applied ? 'success' : 'primary'}`}>
        <span>{discountcashback}</span>
      </div>
      <div className="promocodecard--right">
        <div className="promocodecard--right__top">
          <img
            className="promocodecard--right__top--img"
            src={image._path}
            alt="Promo Card"
          />
          <div className="promocodecard--right__top--info">
            <h5 className="promocodecard--right__top--info__title">{title}</h5>
            <h5 className="promocodecard--right__top--info__subtitle">
              {note}
            </h5>
          </div>
        </div>
        <div className="promocodecard--right__body">
          <HtmlBlock html={description.html} />
        </div>
        <div className="promocodecard--right__coupon">
          <span className="promocodecard--right__coupon-code">{code}</span>
          <div
            className="promocodecard--right__coupon-action"
            onKeyDown={handleKeyDown}
            onClick={onClickHandler}
            role="button"
            aria-label="apply this promo code"
            tabIndex={0}
          >
            {applied ? offerRemoveLabel : offerApplyLabel}
          </div>
        </div>
      </div>
    </div>
  );
};

PromoCodeCard.propTypes = {
  applied: PropTypes.any,
  code: PropTypes.any,
  description: PropTypes.shape({
    html: PropTypes.any,
  }),
  discountcashback: PropTypes.any,
  image: PropTypes.shape({
    _path: PropTypes.any,
  }),
  offerApplyLabel: PropTypes.any,
  offerRemoveLabel: PropTypes.any,
  onClickAction: PropTypes.func,
  note: PropTypes.string,
  title: PropTypes.any,
};

export default PromoCodeCard;
