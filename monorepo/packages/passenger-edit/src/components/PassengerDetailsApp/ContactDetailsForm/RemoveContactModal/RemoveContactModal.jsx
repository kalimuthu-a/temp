import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import './RemoveContactModal.scss';
import { AppContext } from '../../../../context/appContext';

const RemoveContactModal = (props) => {
  const {
    removeContactHandler,
    onToggleModal,
  } = props;

  const { state: {
    aemMainData,
  } } = useContext(AppContext);
  const {
    removeContactPopup,
  } = aemMainData;

  const {
    heading,
    secondaryCtaLabel,
    ctaLabel,
    description,
  } = removeContactPopup;

  return (
    <div className="remove-contact-modal-wrapper">
      <h3 className="main-heading sh8 mb-8">
        {heading}
      </h3>
      <div className="sub-heading body-small-medium mb-16">{parse(description?.html)}</div>
      <div className="d-flex justify-content-center">
        <button
          onClick={() => onToggleModal(false)}
          type="button"
          className="btn dismiss-btn me-8"
        >{secondaryCtaLabel}
        </button>
        <button
          type="button"
          onClick={() => removeContactHandler()}
          className="btn remove-btn"
        >{ctaLabel}
        </button>
      </div>

    </div>
  );
};

RemoveContactModal.propTypes = {
  removeContactHandler: PropTypes.func,
  onToggleModal: PropTypes.func,
};

export default RemoveContactModal;
