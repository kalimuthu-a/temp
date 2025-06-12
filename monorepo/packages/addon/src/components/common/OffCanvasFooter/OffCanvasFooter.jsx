import React from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import formatCurrency from 'skyplus-design-system-app/dist/des-system/formatCurrency';
import PropTypes from 'prop-types';
import AnalyticHelper from '../../../helpers/analyticHelper';

function OffCanvasFooter(props) {
  const {
    title,
    // subTitle,
    titleData,
    // subTitleData,
    btnProps,
    onSubmit,
    buttonTitle,
    disabled,
    currencycode,
    postButtonIcon,
    preButtonIcon,
    couponSelected,
    isMealSsr,
    page,
  } = props;

  const onBtnClick = () => {
    if (!disabled) {
      onSubmit();
      buttonTitle==='Continue'? AnalyticHelper.addConfirmClick(page):AnalyticHelper.add6eEatClick(page)
    }
  };

  const formatCurrencyModifyer = (price, code) => {
    return (
      typeof price === 'string' ? price :
        formatCurrency(price, code || 'INR', {
          minimumFractionDigits: 0,
        })
    );
  };
  return (
    <div>
      <footer className="skyplus-slider__footer-container box-shadow-bottom-sticky">
        <div className="skyplus-slider__footer-content-container">
          <div className="skyplus-slider__footer-details-container">
            <div className="skyplus-slider__footer-title sh7">
              {title}
              {/* TD: After strick out price added:  {subTitle && (
              <div className="skyplus-slider__footer-sub-title body-extra-small-regular">
                {subTitle}
              </div>
              )} */}
            </div>
            <div className="skyplus-slider__footer-title skyplus-slider__footer-title--green sh3">
              {isMealSsr ? couponSelected : formatCurrencyModifyer(titleData, currencycode)}
              <div className="skyplus-slider__footer-sub-title
              skyplus-slider__footer-sub-title--line-through body-extra-small-regular"
              >
                {/* TD: After strick out price added: {formatCurrencyModifyer(titleData, currencycode)} */}
              </div>
            </div>
          </div>

          <div className="skyplus-slider__button-container">
            <Button onClick={onBtnClick} {...btnProps} disabled={disabled} size="sm">
              <div className="skyplus-slider__button-container-wrapper">
                {preButtonIcon && <i className={`${preButtonIcon} me-3`} />}
                {buttonTitle}
                {postButtonIcon && <i className={`${postButtonIcon} ms-6`} />}
              </div>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

OffCanvasFooter.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  titleData: PropTypes.string,
  subTitleData: PropTypes.string,
  btnProps: PropTypes.any,
  onSubmit: PropTypes.func,
  buttonTitle: PropTypes.string,
  disabled: PropTypes.bool,
  currencycode: PropTypes.string,
  postButtonIcon: PropTypes.string,
  preButtonIcon: PropTypes.string,
  couponSelected: PropTypes.number,
  isMealSsr: PropTypes.bool,
};

export default OffCanvasFooter;
