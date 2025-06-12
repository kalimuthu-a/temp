import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import RadioBox from 'skyplus-design-system-app/dist/des-system/RadioBox';
import { formatCurrencyFunc } from '../../utils';
import { AppContext } from '../../context/AppContext';

const SearchResult = ({
  title,
  adultPrice,
  childPrice,
  currency,
  processing,
  stayPeriod,
  terms,
  quote,
  index,
  selectedQuoteIndex,
  selectedIndexQuote,
  validity,
}) => {
  const [showModal, setShowModal] = useState(false);
  const {
    state: {
      visaSrpByPath,
    },
  } = React.useContext(AppContext);
  const aemLabel = visaSrpByPath || {};
  const handleRedeemClick = () => {
    setShowModal(true);
  };
  const onCloseHandler = () => {
    setShowModal(false);
  };

  const changeRadioButton = (_index, quoteValue) => {
    selectedQuoteIndex(_index, quoteValue);
  };

  useEffect(() => {
    if (selectedIndexQuote === index) {
      selectedQuoteIndex(index, quote);
    }
  }, []);

  return (
    <div className={`visa-srp-wrapper ${selectedIndexQuote === index ? 'active' : ''}`}>
      <div className="visa-srp-wrapper-left">
        <span className="left-radio">
          <RadioBox
            type="radio"
            value={index}
            checked={selectedIndexQuote === index}
            onChange={() => {
              changeRadioButton(index, quote);
            }}
          />
        </span>
        <div className="visa-srp-wrapper-left-title">
          <div className="visa-srp-wrapper-left-title-radio">
            <span className="radio">
              <RadioBox
                type="radio"
                value={index}
                checked={selectedIndexQuote === index}
                onChange={() => {
                  changeRadioButton(index, quote);
                }}
              />
            </span>
            <p className="visa-srp-wrapper-left-title__text title-text">{stayPeriod} {title}</p>
          </div>

          <div className="visa-srp-wrapper-left-title-chips">
            <Chip variant="system-warning" color="system-warning" size="xs" containerClass="chips-bg">
              <span className="chips-text">
                {aemLabel?.visaList?.[1]?.note?.match(/\bValidity\b/)?.[0]} {validity}
              </span>
            </Chip>
            <div className="visa-srp-wrapper-left-title-chips-prices">
              <div className="adult-price">
                <span className="text">{aemLabel?.perAdultLabel}</span>
                <p className="curr">
                  {formatCurrencyFunc({
                    price: adultPrice || 0,
                    currencycode: currency,
                  })}

                </p>

              </div>
              <div className="child-price">
                <span className="text">{aemLabel?.perChildLabel}</span>
                <p className="curr">
                  {formatCurrencyFunc({
                    price: childPrice || 0,
                    currencycode: currency,
                  })}
                </p>
              </div>
            </div>

          </div>
          <p className="visa-srp-wrapper-left-title-service">
            <span
              className="text"
              dangerouslySetInnerHTML={{
                __html: aemLabel?.visaList?.[0]?.description?.html || '',
              }}
            />
          </p>
          <p
            className="visa-srp-wrapper-left-title-view"
            onClick={handleRedeemClick}
            aria-hidden="true"
          >
            {aemLabel?.viewMoreLabel}
          </p>
          {showModal && (
            <PopupModalWithContent
              className="visa-service-popup"
              onCloseHandler={onCloseHandler}
              modalTitle={aemLabel?.serviceTermsLabel}
            >
              <div className="visa-srp-wrapper__info-popup">
                <ul className="visa-srp-wrapper__info-popup-test">
                  {terms?.map((term) => (
                    <li key={uniq()}>
                      <Icon className="icon-Flight flight-srp-icon" size="sm" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
                <Button classNames="visa-srp-wrapper__info-popup-btn" onClick={onCloseHandler}>
                  {aemLabel?.viewMorePopupInfo?.ctaLabel}
                </Button>
              </div>
            </PopupModalWithContent>
          )}
        </div>

        <div className="chip-footer">
          <span className="visa-srp-99">{aemLabel?.getYourVisaByLabel} {processing}</span>
        </div>
      </div>
      <div className="visa-srp-wrapper-right">
        <div className="visa-srp-wrapper-right-prices">
          <div className="adult-price">
            <span className="text">{aemLabel?.perAdultLabel}</span>
            <p className="curr">
              {formatCurrencyFunc({
                price: adultPrice || 0,
                currencycode: currency,
              })}
            </p>
            <span className="tax">{aemLabel?.exclTaxesLabel}</span>
          </div>
          <div className="child-price">
            <span className="text">{aemLabel?.perChildLabel}</span>
            <p className="curr">
              {formatCurrencyFunc({
                price: childPrice || 0,
                currencycode: currency,
              })}
            </p>
            <span className="tax">{aemLabel?.exclTaxesLabel}</span>
          </div>
        </div>
        <div className="visa-srp-wrapper-right-chips">
          <Chip variant="outlined" color="secondary-light" size="sm" containerClass="chips-bg">
            <span className="chips-text">
              {aemLabel?.getYourVisaByLabel} {processing}
            </span>
          </Chip>
        </div>

      </div>

    </div>

  );
};

SearchResult.propTypes = {
  title: PropTypes.string,
  adultPrice: PropTypes.number,
  childPrice: PropTypes.number,
  processing: PropTypes.string,
  stayPeriod: PropTypes.string,
  currency: PropTypes.string,
  validity: PropTypes.string,
  terms: PropTypes.any,
  quote: PropTypes.object,
  index: PropTypes.number,
  selectedQuoteIndex: PropTypes.func,
  selectedIndexQuote: PropTypes.number,
};
export default SearchResult;
