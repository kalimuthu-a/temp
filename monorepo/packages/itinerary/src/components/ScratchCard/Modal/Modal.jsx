/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { encryptAESForLogin } from 'skyplus-design-system-app/src/functions/loginEncryption';
import ScratchCard from '../ScratchCard/ScratchCard';
import ScratchCardShimmer from '../ShimmerEffect/ScratchCardShimmer';
import { hideConfetti, getSessionUser } from '../../../utils';
import { cardScratched } from '../../../services';
import { pushAnalytic } from '../../../utils/analyticEvents';
import { ANALTYTICS } from '../../../constants/scratchcardanalytic';
import { CONSTANTS } from '../../../constants';
const Modal = ({ isOpen, onClose, dataProp, isExpired, expiredStyle, isShimmer, showCouponCode, noScratched }) => {
  const [isScratched, setIsScratched] = useState(noScratched || false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [updateCardStatus, setUpdateCardStatus] = useState({});
  const itineraryApiData = useSelector((state) => state?.itinerary?.apiData) || {};
  const bookingDetails = (itineraryApiData && itineraryApiData?.bookingDetails) || {};
  useEffect(() => {
    if (
      dataProp?.coupon_status === CONSTANTS.SCRATCHED
        || dataProp?.coupon_status === CONSTANTS.LOCKED
        || dataProp?.coupon_status === CONSTANTS.CONSUMED
        || dataProp?.coupon_status === CONSTANTS.NOCARD
        || noScratched
    ) {
      setIsScratched(true);
    } else {
      setIsScratched(false);
    }
  }, [dataProp?.coupon_status, noScratched]);

  useEffect(() => {
    if (isScratched) {
      pushAnalytic({
        data: {
          _event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCHING_CLICK,
          _eventInfoName: dataProp?.brand_name,
          _customerid: encryptAESForLogin(getSessionUser()),
          _scratches: '1',
        },
        event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCHING_CLICK,
        error: {},
      });
    }
  }, [isScratched]);
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
      await cardScratched(payload);

      setUpdateCardStatus({
        ...updateCardStatus,
      });
    } catch (error) {
      console.error(error, '8299500600');
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) {
        return ;
       }
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
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
      // eslint-disable-next-line sonarjs/no-duplicate-string
      document.body.classList.add('overflow-hidden');
      pushAnalytic({
        data: {
          _event: ANALTYTICS.DATA_CAPTURE_EVENTS.SCRATCH_CARD_POPUPLOAD,
          _eventInfoName: dataProp?.brand_name,
          // eslint-disable-next-line no-restricted-globals
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

  if (!isOpen) return false;
  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} aria-hidden="true" style={expiredStyle}>
        <i className="icon-close-simple modal-content__close" onClick={onClose} aria-hidden="true" />
        <div className="scc">
          {isScratched ? (
            <div className="scc__img-container">
              <img src={dataProp?.image?._publishUrl} alt="Scratch Card" className="scc__img" />
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
          {!isScratched || isShimmer ? (
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
             <ScratchCardShimmer />
            </div>
          ) : (
            <div className="scc__details">
              <div>
              {showCouponCode && (
                <div className="scc__details--code" id="code" onClick={copyToClipboard} aria-hidden="true">
                  {dataProp?.coupon_code}
                  <i className="icon-copy" />
                </div>
               )}
              </div>
              <p className="scc__details--expiry">
                {dataProp?.expiryText} {formatDate(dataProp?.validity)}
              </p>
              <p className="scc__details--title">{dataProp?.text}</p>
              <div className="scc__details--conditions-list">
                   <p
                    className="scc__details--conditions-list_item"
                   style={{ height: dataProp?.offerDescription ? 'auto' : 'initial' }}
                   dangerouslySetInnerHTML={{
                    __html: dataProp?.offerDescription?.html || '',
                  }}
                />

              </div>
            </div>
          )}
          <a
            target="blank"
            href={dataProp?.redemptionLink}
            onClick={handleAvailClick}
            className={`scc__btn-avail ${!isScratched && !isExpired ? '' : 'disabled'}`}>
            {!isScratched ? 'Loading...' : dataProp?.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dataProp: PropTypes.object.isRequired,
  isExpired: PropTypes.bool.isRequired,
  expiredStyle: PropTypes.string.isRequired,
  isShimmer: PropTypes.bool.isRequired,
  showCouponCode: PropTypes.string.isRequired,

};

export default Modal;
