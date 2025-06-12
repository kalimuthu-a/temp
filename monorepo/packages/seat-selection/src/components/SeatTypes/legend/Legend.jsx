import PropTypes from 'prop-types';
import { useSeatMapContext } from '../../../store/seat-map-context';
import './Legend.scss';
import { NEXT_LEGEND_ARRAY } from '../../../constants/seatConfig';

const Legend = ({ isNext = false }) => {
  const { seatMainAemData, isModifyFlow, isCheckInFlow,isSoloFemalePassenger } = useSeatMapContext();
  let seatOptions = seatMainAemData?.seatOptions;
  if (isNext) {
    const newSeatOptions = {};
    Object.keys(seatOptions).forEach((option) => {
      if (NEXT_LEGEND_ARRAY.indexOf(option) > -1) {
        newSeatOptions[option] = seatOptions[option];
      }
    });

    seatOptions = newSeatOptions;
  }

  return (
    <div className="legend">
      {
        seatOptions
        && Object.keys(seatOptions).map((option) => {
          const femaleCheck = option === 'female';
          const isFemale = (isModifyFlow?.enable || isCheckInFlow.enable)? femaleCheck && !isSoloFemalePassenger: femaleCheck;

          if (!isFemale) {
            return (
              <div key={option} className={`sub-legend-${option.toLowerCase()}`}>
                <span>{seatOptions[option]}</span>
              </div>
            );
          }
          return null;
        })
      }
    </div>
  );
};
Legend.propTypes = {
  isNext: PropTypes.bool,
};

export default Legend;
