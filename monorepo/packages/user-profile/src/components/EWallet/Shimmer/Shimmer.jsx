import React from 'react';
import { uniq } from 'skyplus-design-system-app/dist/des-system/utils';
import PropTypes from 'prop-types';

const Shimmer = () => {
  return (
    <div className="ew-shimmer">
      <div className="ew-shimmer__title" />
      <div className="ew-shimmer__text" />
    </div>
  );
};

const ShimmerList = ({ transBalanceLoading }) => {
  return (
    <>
      {transBalanceLoading && (
        <>
          <div className="ew-shimmer__balance-strip" />
          <div className="ew-shimmer__heading w-100" />
          <div className="ew-shimmer__heading" />
        </>
      )}
      {Array.from({ length: 2 }).map(() => (
        <Shimmer key={uniq()} />
      ))}
    </>
  );
};
ShimmerList.propTypes = {
  transBalanceLoading: PropTypes.any,
};
export default ShimmerList;
