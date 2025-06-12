import PropTypes from 'prop-types';

function FreeMealButton(
  {
    btnText,
    infoIconClass,
    onSelect,
  },
) {
  return (
    <div className="button-container">
      <span className="button-text">{btnText}</span>
      <button type="button" className="button-icon" onClick={onSelect} aria-label="xl-with-free-meal">
        <i className={infoIconClass} />
      </button>
    </div>
  );
}
FreeMealButton.propTypes = {
  btnText: PropTypes.string.isRequired,
  infoIconClass: PropTypes.string,
  onSelect: PropTypes.func,
};

export default FreeMealButton;
