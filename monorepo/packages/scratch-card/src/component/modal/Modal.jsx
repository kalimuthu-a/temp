/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import ScratchCard from '../scratchCard/ScratchCard';
// eslint-disable-next-line import/no-unresolved
import Shimmer from '../shimmerEffect/Shimmer';
import { cardScratched } from '../../services';
import { getSessionUser, hideConfetti } from '../../utils';
import { pushAnalytic } from '../../utils/analyticEvents';
import { CONSTANT, ANALTYTICS } from '../../constants';

const Modal = ({ isOpen, onClose, dataProp, isExpired, expiredStyle, status, setCouponStatus }) => {
  const [isScratched, setIsScratched] = useState(status === CONSTANT.SCRATCHED || status === CONSTANT.LOCKED || status === CONSTANT.CONSUMED);
  const [showConfetti, setShowConfetti] = useState(false);
  const [updateCardStatus, setUpdateCardStatus] = useState({});

  const handleScratchComplete = async () => {
    try {
      setIsScratched(true);
      setShowConfetti(true);
      const payloadEnc = {
        coupon_code: dataProp?.coupon_code,
        transaction_id: null,
        status: 'SCRATCHED',
        coupon_type: dataProp?.coupon_type,
      };
      const payload = encryptAESForLogin(JSON.stringify(payloadEnc));
      await cardScratched(payload).then(() => setCouponStatus('SCRATCHED'));

      setUpdateCardStatus({
        ...updateCardStatus,
        coupon_status: dataProp.coupon_status,
      });
    } catch (error) {
      // Error block
    }
  };
  hideConfetti(setShowConfetti);

  const copyToClipboard = () => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.COPY_CLICK,
        _eventInfoName: dataProp?.brand_name,
        _customerid: encryptAESForLogin(getSessionUser()),

      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.COPY_CLICK,
      error: {},
    });
    const offerCode = dataProp?.coupon_code;
    navigator.clipboard.writeText(offerCode);
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      pushAnalytic({
        data: {
          _event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD_POPUPLOAD,
          _eventInfoName: dataProp?.brand_name,
          _cardposition: status,

        },
        event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD_POPUPLOAD,
        error: {},
      });
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleAvailClick = (e) => {
    pushAnalytic({
      data: {
        _event: ANALTYTICS.DATA_CAPTURE_EVENTS.AVAIL_NOW_CLICK,
        _eventInfoName: dataProp?.brand_name,
        _customerid: encryptAESForLogin(getSessionUser()),
        _couponAvaild: '1',

      },
      event: ANALTYTICS.DATA_CAPTURE_EVENTS.AVAIL_NOW_CLICK,
      error: {},
    });
    if (!isScratched || isExpired) {
      e.preventDefault();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  if (!isOpen) return false;
  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} aria-hidden="true">
        <i className="icon-close-simple modal-content__close" onClick={onClose} aria-hidden="true" />

        <div className="scc">
          {isScratched ? (
            <div className="scc__img-container">
              <img src={dataProp?.image?._publishUrl} alt="Scratch Card" className="scc__img" style={expiredStyle} />
              <div className="scc__text-overlay">

                <p className="scc__text">{dataProp?.title}</p>
              </div>
            </div>
          ) : (
            <ScratchCard
              srcimg={dataProp?.unscratchedImage}
              onScratchComplete={handleScratchComplete}
            />
          )}

          {showConfetti && (
            <img src={dataProp?.confettiPath?._publishUrl} alt="Confetti" className="scc__confetti" />
          )}

          {!isScratched ? (
            <div className="scc__details">
              <p
                className="scc__details--msgtitle"
              >{dataProp?.unscratchedTitle}
              </p>
              <p
                className="scc__details--msg"
                dangerouslySetInnerHTML={{
                  __html: dataProp?.unscratchedDescription?.html || '',
                }}
              />
              <Shimmer />
            </div>
          ) : (
            <div className="scc__details" style={expiredStyle}>
              {!isExpired && (
              <div className="scc__details--code" id="code" onClick={copyToClipboard} aria-hidden="true">
                {dataProp?.coupon_code}
                <i className="icon-copy" />
              </div>
              )}
              <i className="icon-close-copy" />
              <p className="scc__details--expiry">
                {dataProp?.expiryText} {formatDate(dataProp?.validity)}
              </p>
              <p className="scc__details--title">{dataProp?.text}</p>
              <div className="scc__details--conditions-list">
                <p
                  className="scc__details--conditions-list_item"
                  dangerouslySetInnerHTML={{
                    __html: dataProp?.offerDescription?.html || '',
                  }}
                />
              </div>
            </div>
          )}

          <a
            target="blank"
            style={expiredStyle}
            href={dataProp?.redemptionLink}
            onClick={handleAvailClick}
            className={`scc__btn-avail ${!isScratched && !isExpired ? '' : 'disabled'}`}
          >
            {!isScratched ? 'Loading...' : dataProp?.buttonText}
          </a>

        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.any,
  onClose: PropTypes.func,
  dataProp: PropTypes.any,
  isExpired: PropTypes.bool,
  expiredStyle: PropTypes.any,
  status: PropTypes.any,
  setCouponStatus: PropTypes.any,
};

export default Modal;
