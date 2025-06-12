/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import useIsMobile from 'skyplus-design-system-app/dist/des-system/useIsMobile';
import Imagecarousel from '../Imagecarousel/Imagecarousel';
import "./PopupModalWithContent.scss";

const PopupModalWithContent = ({
  children = null,
  onCloseHandler = () => {},
  overlayClickClose = false,
  closeButtonIconClass = '',
  className = '',
  modalTitle,
  modalTitleDisplay = true,
  onOutsideClickClose,
  customPopupContentClassName,
  hideHead = false,
  hideBannerImage = false,
  id,
  mfLabels,
  carouselImages = false,
}) => {
  const reactComponentAsChildren = children?.type
    ?.toString()
    ?.includes('react');

  useEffect(() => {
    document.body.classList.add('no-scroll-on-popup');
    return () => {
      document.body.classList.remove('no-scroll-on-popup');
    };
  }, []);
  const [isMobile] = useIsMobile();

  const [zoomLevel, setZoomLevel] = useState('normal');

  useEffect(() => {
    // Check if the browser is Chromium-based
    const isChromium = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    const handleResize = () => {
      const newZoom = !isMobile
        ? window.innerHeight / 770
        : 'normal';
      setZoomLevel(newZoom);
    };
    if (isChromium) {
      window.addEventListener('resize', handleResize);

      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const imageJSX = (
    <div className="login-sso-image-V2">
      {isMobile ? (
        <img
          src={
            mfLabels?.bannerImageMobile?._publishUrl
            || mfLabels?.bannerImage?._publishUrl
          }
          alt={mfLabels?.bannerMessage?.html}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = mfLabels?.bannerImage?._publishUrl;
          }}
        />
      ) : (
        <img
          src={mfLabels?.bannerImage?._publishUrl}
          alt={mfLabels?.bannerMessage?.html}
        />
      )}
      <div
        className="login-sso-image-V2-p whereliketoIndiGo d-sm-none d-md-block"
        dangerouslySetInnerHTML={{
          __html: mfLabels?.bannerMessage?.html,
        }}
      />
    </div>
  );
  return (
    <div
      className={`popup-modal-with-content ${className}`}
      onClick={onOutsideClickClose}
    >
      <div
        className="popup-modal-with-content__bg-overlay"
        onClick={overlayClickClose ? onCloseHandler : null}
      >
        <div
          id={id}
          className={`popup-modal-with-content__content ${customPopupContentClassName}`}
          style={{
            zoom: zoomLevel,
          }}
        >
          {carouselImages
            && (!isMobile ? (
              <Imagecarousel mfLabels={mfLabels} className="" />
            ) : (
              imageJSX
            ))}

          {!hideBannerImage && imageJSX}
          <div className="login-sso-form-V2">
            <div
              className="login-sso-image-V2-p whereliketoIndiGo d-sm-block d-md-none"
              dangerouslySetInnerHTML={{
                __html: mfLabels?.bannerMessage?.html,
              }}
            />
            <div className="login-sso-form-V2__upper">
              {!hideHead && (
                <div className="popup-modal-with-content__header">
                  <button
                    type="button"
                    aria-label="Close login-sso Popup"
                    onClick={onCloseHandler}
                    className={`popup-modal-with-content__close-overlay-button ${
                      closeButtonIconClass || ''
                    }`}
                  >
                    <Icon className="icon-close-simple" />
                  </button>
                  <h3
                    className={`popup-modal-with-content__header__title ${
                      modalTitleDisplay ? '' : 'visibility-hidden'
                    }`}
                    dangerouslySetInnerHTML={{ __html: modalTitle }}
                  />
                </div>
              )}
              {reactComponentAsChildren
                ? React.cloneElement(children, { onCloseHandler })
                : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PopupModalWithContent.propTypes = {
  onCloseHandler: PropTypes.func.isRequired,
  overlayClickClose: PropTypes.bool,
  hideHead: PropTypes.bool,
  children: PropTypes.any.isRequired,
  closeButtonIconClass: PropTypes.any,
  className: PropTypes.any,
  modalTitle: PropTypes.any,
  modalTitleDisplay: PropTypes.any,
  onOutsideClickClose: PropTypes.any,
  customPopupContentClassName: PropTypes.any,
  hideBannerImage: PropTypes.bool,
  id: PropTypes.any,
  mfLabels: PropTypes.object.isRequired,
  carouselImages: PropTypes.bool,
};

export default PopupModalWithContent;
