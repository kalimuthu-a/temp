import PropTypes from 'prop-types';

function TooltipPopover(
  {
    position,
    description,
    infoIconClass,
    positionCssLeft,
    positionCssTop,
    showHideArrow,
  },
) {
  return (
    <div
      className={`tooltip-message-container ${showHideArrow ? 'arrow-shadow' : ' '} ${position}`}
      style={{ left: `${positionCssLeft}px`, top: `${positionCssTop}px` }}
    >
      {showHideArrow && <div className="tooltip-arrow" />}
      <div className="tooltip-header">
        <i className={infoIconClass} />
        <p>{description}</p>
      </div>
    </div>
  );
}
TooltipPopover.propTypes = {
  description: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  infoIconClass: PropTypes.string,
  positionCss: PropTypes.shape({
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  }),
  positionCssLeft: PropTypes.number,
  positionCssTop: PropTypes.number,
  showHideArrow: PropTypes.bool,
};

TooltipPopover.defaultProps = {
  position: 'bottom',
};
export default TooltipPopover;
