import React from 'react';
import PropTypes from 'prop-types';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const classNameText = 'split-pnr-conditions';
function SplitPnrConditions({ title, conditions, errMsg }) {
  return (
    (title || conditions || errMsg) && (
      <div className={`${classNameText}-wrapper`}>
        {errMsg && (
          <div className={`${classNameText}-error`}>
            <i className="icon-close-solid" />
            <HtmlBlock html={errMsg} className="err-msg" />
          </div>
        )}

        <div className={`${classNameText}`}>
          {title && (
            <HtmlBlock html={title} className={`${classNameText}-title`} />
          )}

          {conditions && (
            <ul>
              {conditions.map?.(({ key, value, icon }) => (
                <li key={key}>
                  <i className={icon} />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  );
}

SplitPnrConditions.propTypes = {
  title: PropTypes.string,
  conditions: PropTypes.array,
  errMsg: PropTypes.string,
};

export default SplitPnrConditions;
