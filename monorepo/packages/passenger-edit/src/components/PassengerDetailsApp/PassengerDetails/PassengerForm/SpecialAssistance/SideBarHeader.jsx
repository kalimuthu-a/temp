import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import { AppContext } from '../../../../../context/appContext';

const SideBarHeader = ({ onClose }) => {
  const {
    state: {
      aemMainData: {
        specialAssistanceDetails: {
          seamlessJourneyTitle,
          specialAssistanceRequiredLabel,
        },
      },
    },
  } = useContext(AppContext);

  const seamlessJourneyTitleHtml = seamlessJourneyTitle?.html && sanitizeHtml(seamlessJourneyTitle.html);

  return (
    <div className="header px-10">
      <span
        aria-hidden="true"
        onClick={onClose}
        className="special-assistance__close-icon
  icon-close-simple icon-size-lg
  bg-white border-0 d-inline-block pt-6 pt-md-12"
      />
      <h3 className="special-assistance__heading mt-6 text-uppercase mt-md-12 h0">
        {specialAssistanceRequiredLabel}
      </h3>
      <div
        dangerouslySetInnerHTML={{ __html: seamlessJourneyTitleHtml }}
        className="special-assistance__subheading mt-4 mt-md-8 h4"
      />
    </div>
  );
};

SideBarHeader.propTypes = {
  onClose: PropTypes.func,
};

export default SideBarHeader;
