import React, { useEffect, useState } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import PropTypes from 'prop-types';
import Heading from 'skyplus-design-system-app/dist/des-system/Heading';
import HtmlBlock from 'skyplus-design-system-app/dist/des-system/HtmlBlock';
import Chip from 'skyplus-design-system-app/dist/des-system/Chip';
import './Filter.scss';

const Filters = ({ onClose, aemData, filtersArray, resetFilter, applyFilter, handleClick }) => {
  const [filters, setFilters] = useState();
  const TYPES = {
    'Voucher Type': 'voucherType',
    Partner: 'partner',
    'Date Range': 'date',
    'Transaction Type': 'transactionType',
  };

  function isBlankObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return Object.values(obj).every((value) => value === '' || value === null || value === undefined);
  }

  useEffect(() => {
    setFilters(aemData?.filtersList);
  }, [aemData?.filterList]);

  return (
    <OffCanvas
      containerClassName="skp-retrieve-pnr transaction-filtering filter-container"
      onClose={onClose}
      renderFooter={() => {
        return (
          <div className="transaction-filtering-footer">
            <Button
              containerClass="transaction-filtering-footer-secondary"
              onClick={resetFilter}
              tabIndex="0"
              variant="outline"
            >
              {aemData?.resetCtaLabel}
            </Button>
            <Button
              containerClass="transaction-filtering-footer-primary"
              onClick={applyFilter}
              disabled={isBlankObject(filtersArray)}
              tabIndex="0"
              variation="outline"
            >
              {aemData?.applyCtaLabel}
            </Button>
          </div>

        );
      }}
    >
      <div className="transaction-filtering-slider">
        <Heading heading="h4 transaction-filtering-slider-title">
          {aemData?.filtersLabel}
        </Heading>
        <div className="transaction-filtering-slider-common-block">
          {
            filters?.map((filter, i) => (
              <>
                <HtmlBlock
                  className="transaction-filtering-slider-common-block-label"
                  html={filter?.filterName}
                />
                <div className="transaction-filtering-slider-common-block-values">
                  {filter?.list?.map((item) => {
                    return (
                      <Chip
                        variant="filled"
                        color="info"
                        withBorder
                        size="sm"
                        key={item}
                        containerClass={`chip-default ${filtersArray[TYPES[filter?.filterName]] === item?.key ? 'chip-selected' : ''}`}
                        onClick={() => handleClick(filter?.filterName, item?.key)}
                      >
                        {item?.value}
                      </Chip>
                    );
                  })}
                </div>
                {
                  i !== filters.length - 1 ? (
                    <div className="divider" />
                  ) : null
                }
              </>
            ))
          }
        </div>
      </div>
    </OffCanvas>
  );
};
Filters.propTypes = {
  onClose: PropTypes.func,
};
export default Filters;
