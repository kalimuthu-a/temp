import React from 'react';
import PropTypes from 'prop-types';

const ImportantInfo = ({ data }) => {
  return (
    <div className="important-info-contain">
      <ul>
        {Array.isArray(data) && data?.length > 0 ? (
          data?.map((item) => <li key={item}>{item }</li>)
        ) : null}
      </ul>
    </div>
  );
};

ImportantInfo.propTypes = {
  data: PropTypes.array,
};

export default ImportantInfo;
