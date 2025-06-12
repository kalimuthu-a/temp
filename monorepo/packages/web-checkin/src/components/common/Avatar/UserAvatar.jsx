import PropTypes from 'prop-types';
import React from 'react';

const UserAvatar = ({ av }) => {
  return <div className="wc_avtar">{av}</div>;
};

UserAvatar.propTypes = {
  av: PropTypes.string,
};

export default UserAvatar;
