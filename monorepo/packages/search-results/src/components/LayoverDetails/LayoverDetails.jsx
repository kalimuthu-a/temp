import PropTypes from 'prop-types';
import React from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';

import { createPortal } from 'react-dom';
import Segment from './Segment';
import useAppContext from '../../hooks/useAppContext';

const LayoverDetails = ({ onClose, segments }) => {
  const {
    state: { additional },
  } = useAppContext();

  const onClickHandler = (e) => {
    onClose(e);
  };

  return createPortal(
    <div className="w-100 custom-margin h-100 background-cover position-fixed z-max overflow-auto top-0 d-block">
      <div className="popup m-auto FlightBreakdownModal-positions z-2 bg-white p-12 rounded-1">
        <div className="popup-content w-100">
          <div className="d-flex align-item-center justify-content-between">
            <div className="sh2">{additional.layoverLabel}</div>
            <div>
              <Icon
                className="icon-close-simple fw-bold c-pointer"
                size="lg"
                onClick={onClickHandler}
              />
            </div>
          </div>

          {segments.map((segment, key, items) => (
            <Segment {...segment} key={uniq()} nextSegment={items[key + 1]} />
          ))}

          <div className="line-bg-black mt-10 mb-4" />

          <div className="w-100 text-center mt-4 mb-5 d-flex justify-content-center">
            <Button onClick={onClickHandler}>{additional.okLabel}</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

LayoverDetails.propTypes = {
  onClose: PropTypes.func,
  segments: PropTypes.array,
};

export default LayoverDetails;
