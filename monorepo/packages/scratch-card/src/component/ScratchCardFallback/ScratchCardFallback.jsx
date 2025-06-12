import React from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';

const ScratchCardFallback = ({ noScratchCardText, noScratchCardButtonText, noScratchCardButtonLink }) => {
  const redirectToButtonLink = (link) => {
    window.location.href = link;
  };
  return (
    <div className="scfallback">
      <div dangerouslySetInnerHTML={{ __html: noScratchCardText?.html }} />
      <Button
        color="primary"
        onClick={() => redirectToButtonLink(noScratchCardButtonLink)}
      >
        {noScratchCardButtonText}
      </Button>

    </div>
  );
};
ScratchCardFallback.propTypes = {
  noScratchCardText: PropTypes.shape({
    html: PropTypes.string.isRequired,
  }),
  noScratchCardButtonText: PropTypes.string,
  noScratchCardButtonLink: PropTypes.string.isRequired,
};

export default ScratchCardFallback;
