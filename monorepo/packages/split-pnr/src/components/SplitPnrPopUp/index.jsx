import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import PopupModalWithContent from 'skyplus-design-system-app/dist/des-system/PopupModalWithContent';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

import useAppContext from '../../hooks/useAppContext';

import { splitPnrActions } from '../../context/reducer';

function SplitPnrPopUp({ data, onClick }) {
  const {
    dispatch,
  } = useAppContext();

  const handleClose = useCallback(() => {
    dispatch({
      type: splitPnrActions.SET_POPUP,
      payload: {
        show: false,
        data: null,
      },
    });
  }, []);

  return (
    <PopupModalWithContent
      className="split-pnr--popup"
      onCloseHandler={handleClose}
      modalTitle={data?.heading}
      customPopupContentClassName="split-pnr-popup-content"
      closeButtonIconClass="d-none"
    >
      <div className="split-pnr-button-container">
        <Button
          containerClass="split-pnr-button-wrapper"
          onClick={handleClose}
          variant="outline"
        >
          {data?.ctaLabel}
        </Button>
        <Button
          containerClass="split-pnr-button-wrapper"
          onClick={onClick}
        >
          {data?.secondaryCtaLabel}
        </Button>
      </div>
    </PopupModalWithContent>
  );
}

SplitPnrPopUp.propTypes = {
  data: PropTypes.shape({
    heading: PropTypes.shape({
      html: PropTypes.string,
    }),
    description: PropTypes.shape({
      html: PropTypes.string,
    }),
    ctaLabel: PropTypes.string,
    secondaryCtaLabel: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

export default SplitPnrPopUp;
