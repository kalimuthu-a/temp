import React from 'react';
import PropTypes from 'prop-types';
import Text from 'skyplus-design-system-app/dist/des-system/Text';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const UpdateContactNote = ({ aemData }) => {
  return (
    (aemData?.loginHeading || aemData?.loginSubHeading) ? (
      <div className="update-contact-note">
        <HtmlBlock html={aemData?.loginHeading} className="text-text-primary text-capitalize heading" />
        <div className="d-flex flex-column link-container align-content-center">
          <Text
            variation="body-medium-regular"
            containerClass="text-text-secondary text-capitalize desc"
          >
            {aemData?.loginSubHeading}
          </Text>
        </div>
      </div>
    ) : null
  );
};

UpdateContactNote.propTypes = {
  aemData: PropTypes.any,
};

export default UpdateContactNote;
