import PropTypes from 'prop-types';
import React from 'react';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';

const TableRow = ({ html }) => {
  return <HtmlBlock html={html} className="table-body-row-data" />;
};

TableRow.propTypes = {
  html: PropTypes.string,
};

export default TableRow;
