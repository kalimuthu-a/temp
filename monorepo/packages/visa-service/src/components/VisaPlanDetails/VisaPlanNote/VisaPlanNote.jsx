import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import PropTypes from 'prop-types';

const VisaPlanNote = ({ noteTypeClass, title, iconClass, message }) => {
  return (
    <div className={`${noteTypeClass}`}>
      <Icon className={iconClass} size="sm" />
      <div>
        <p className="title">{title}</p>
        <p className="msg">{message}</p>
      </div>
    </div>
  );
};

VisaPlanNote.propTypes = {
  noteTypeClass: PropTypes.string,
  title: PropTypes.string,
  iconClass: PropTypes.string,
  message: PropTypes.string,
};
export default VisaPlanNote;
