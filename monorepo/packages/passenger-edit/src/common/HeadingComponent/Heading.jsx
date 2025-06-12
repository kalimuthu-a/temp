/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import './Heading.scss';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';

const Heading = (props) => {
  const {
    headingTitle,
    headingSubTitle,
    subHeadingClass = '',
    headingClass = '',
  } = props;

  const subHeadingHtml = headingSubTitle?.html ? sanitizeHtml(headingSubTitle.html) : headingSubTitle;

  return headingTitle || headingSubTitle ? (
    <div className="passenger-details-header-wrap">
      {headingTitle ? <div className={`passenger-details-heading h5 ${headingClass}`}>{headingTitle}</div> : null}
      {headingSubTitle
        ? (headingSubTitle?.html
          ? (
            <div
              className={`passenger-details-sub-heading mb-8 ${subHeadingClass}`}
              dangerouslySetInnerHTML={{
                __html: subHeadingHtml,
              }}
            />
          ) : (
            <div className={`passenger-details-sub-heading body-small-medium mb-8 ${subHeadingClass}`}>
              {headingSubTitle}
            </div>
          )
        )
        : null}
    </div>
  ) : null;
};

Heading.propTypes = {
  headingTitle: PropTypes.any,
  headingSubTitle: PropTypes.any,
  subHeadingClass: PropTypes.string,
  headingClass: PropTypes.string,

};

export default Heading;
