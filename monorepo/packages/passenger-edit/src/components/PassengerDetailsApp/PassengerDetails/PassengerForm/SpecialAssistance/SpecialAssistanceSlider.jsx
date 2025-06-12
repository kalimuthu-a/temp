import React from 'react';
import PropTypes from 'prop-types';
import DragSlider from 'skyplus-design-system-app/src/components/DragSlider/DragSlider';

const SpecialAssistanceSlider = ({
  categories,
  containerClass,
  onClick,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="overflow-hidden me-auto"
      role="list"
    >
      <DragSlider
        containerClass={`special-assistance__label-slider flex-wrap
       gap-6 mw-100 flex-md-row 
       flex-md-nowrap mh-100 ${containerClass}`}
      >
        {categories?.map((o) => {
          const { title, key, AlreadyOpt } = o || {};
          return (
            <div
              key={title}
              className={`special-assistance__label-card bg-white d-flex align-items-center gap-2 px-6 py-4 ${
                AlreadyOpt ? 'special-assistance-disableWheelChair' : ''
              }`}
            >
              <span className="special-assistance__label-icon" />
              <div className="text text-truncate">{title}</div>
              <span
                onClick={(e) => !AlreadyOpt && onClick(e, key)}
                className="special-assistance__label-icon
               d-flex justify-content-center align-items-center  special-assistance__label-icon--cta
              icon-close-circle"
                aria-hidden="true"
              />
            </div>
          );
        })}
      </DragSlider>
    </div>
  );
};

SpecialAssistanceSlider.propTypes = {
  categories: PropTypes.array,
  containerClass: PropTypes.string,
  onClick: PropTypes.func,
};

export default SpecialAssistanceSlider;
