import React from 'react';
import PropTypes from 'prop-types';

function SplitPnrNote({ noteLabel, noteDescription }) {
  return (
    (noteLabel || noteDescription) && (
      <div className="split-pnr-note">
        <h5>{noteLabel}</h5>
        <p>{noteDescription}</p>
      </div>
    )
  );
}

SplitPnrNote.propTypes = {
  noteLabel: PropTypes.string,
  noteDescription: PropTypes.string,
};

export default SplitPnrNote;
