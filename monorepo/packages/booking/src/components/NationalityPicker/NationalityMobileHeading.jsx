import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const NationalityMobileHeading = ({
  title,
  content,
  expanded,
  setExpanded,
}) => {
  const onClickIcon = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-4 justify-content-center f-bauhuas">
        {title}
        <Icon className="icon-accordion-down-circle" onClick={onClickIcon} />
      </div>
      {expanded && <HtmlBlock html={content} className="nationality-content" />}
    </div>
  );
};

NationalityMobileHeading.propTypes = {
  content: PropTypes.any,
  title: PropTypes.any,
  expanded: PropTypes.bool,
  setExpanded: PropTypes.func,
};

export default NationalityMobileHeading;
