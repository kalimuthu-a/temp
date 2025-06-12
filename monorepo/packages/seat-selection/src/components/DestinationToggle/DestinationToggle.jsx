import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import './DestinationToggle.scss';
import { useSeatMapContext } from '../../store/seat-map-context';
import { CONSTANTS } from '../../constants';

const DestinationToggle = ({ segments }) => {
  const { selectedSegment, updateSelectedSegment, updateSelectedSeatMap } = useSeatMapContext();
  useEffect(() => {
    if (segments?.length > 0) {
      const [
        { segmentKey: firstSegmentKey, seatmapReference: fistSeatMapReference },
      ] = segments;
      updateSelectedSegment(firstSegmentKey, true);
      updateSelectedSeatMap(fistSeatMapReference);
    }
  }, [segments?.length]);

  const clearFreeMealHighlight = () => {
    const seatsWrapper = document.querySelectorAll(`.${CONSTANTS.SEAT_WRAPPER}`);
    const existingHighlights = seatsWrapper?.[1]?.querySelectorAll(`.${CONSTANTS.FREE_MEAL_HIGHLIGHTER_CLASS}`) || [];
    existingHighlights.forEach((highlight) => highlight.remove());
  };

  return (
    <div
      className={`destination-toggle destination-toggle--${segments?.length}`}
    >
      {segments?.map(({ segmentKey, seatmapReference, ...segment }) => (
        <Button
          block
          size="small"
          containerClass={`destination-segment-btn ${
            segmentKey !== selectedSegment ? 'not-selected' : ''
          }`}
          key={segmentKey}
          onClick={() => {
            updateSelectedSegment(segmentKey, true);
            updateSelectedSeatMap(seatmapReference);
            clearFreeMealHighlight();
          }}
        >
          <span className="source">{segment?.origin}</span>
          <span className="dots" />
          <span className="dest">{segment?.destination}</span>
        </Button>
      ))}
    </div>
  );
};

DestinationToggle.propTypes = {
  segments: PropTypes.array.isRequired,
};

export default DestinationToggle;
