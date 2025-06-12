import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';

const ModalContent = ({ onSaveHandler, onCancelHandler, labels }) => {
  return (
    <div>
      <p className="sh-7 mb-6">{labels?.heading}</p>
      <p className="body-medium-regular mb-12">{labels?.description}</p>
      <div className="d-flex gap-8">
        <Button onClick={onCancelHandler} variant="variant" block containerClass="w-50 mt-0">
          {labels?.ctaLabel}
        </Button>
        <Button onClick={onSaveHandler} block containerClass="w-50 mt-0">
          {labels?.secondaryCtaLabel}
        </Button>
      </div>
    </div>
  );
};

ModalContent.propTypes = {
  onSaveHandler: PropTypes.func,
  onCancelHandler: PropTypes.func,
  labels: PropTypes.shape({
    heading: PropTypes.string,
    description: PropTypes.string,
    ctaLabel: PropTypes.string,
    secondaryCtaLabel: PropTypes.string,
  }),
};

export default ModalContent;
