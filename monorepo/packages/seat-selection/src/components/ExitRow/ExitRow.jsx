import PropTypes from 'prop-types';

import './ExitRow.scss';
import { CONSTANTS } from '../../constants';

const ExitRow = ({ style }) => {
  return (
    <>
      <span style={style} className="exit-row exit-row--top">
        {CONSTANTS.EXIT_ROW}
      </span>
      <span style={style} className="exit-row exit-row--bottom">
        {CONSTANTS.EXIT_ROW}
      </span>
    </>
  );
};

ExitRow.propTypes = {
  style: PropTypes.object.isRequired,
};

export default ExitRow;
