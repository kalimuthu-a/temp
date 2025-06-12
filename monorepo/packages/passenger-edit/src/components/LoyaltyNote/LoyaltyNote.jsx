import React, { useContext } from 'react';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import PropTypes from 'prop-types';
import { AppContext } from '../../context/appContext';
import './LoyaltyNote.scss';

const LoyaltyNote = ({ description, note }) => {
  const {
    state: {
      disableLoyalty,
      isBurnFlow,
      isLoyaltyAuthenticated,
    } } = useContext(AppContext);

  if (disableLoyalty || !isLoyaltyAuthenticated || !isBurnFlow) {
    return null;
  }
  const descriptionHtml = description && sanitizeHtml(description?.html);
  return (
    <div className="p-6 mb-6 note">
      <div className="link-small text-primary mb-6">{note}</div>
      <div
        className="link-small text-secondary"
        dangerouslySetInnerHTML={{
          __html: descriptionHtml,
        }}
      />
    </div>
  );
};

LoyaltyNote.propTypes = {
  description: PropTypes.any,
  note: PropTypes.string,
};

export default LoyaltyNote;
