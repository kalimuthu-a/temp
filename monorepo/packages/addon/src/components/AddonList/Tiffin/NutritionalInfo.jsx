/* eslint-disable i18next/no-literal-string */
import React from 'react';
import PropTypes from 'prop-types';

const NutritionalInfo = (props) => {
  const {
    nutritionalInfoData: {
      nutritionalInformation,
      servingPerContainer,
      nutritionalFacts,
      dailyValueNote,
    },
  } = props;

  const servingData = servingPerContainer?.split('|');
  const tableData = nutritionalFacts?.map((item) => {
    const [name, value, percentage] = item?.split('|') || [];
    return { name, value, percentage };
  });

  return (
    <div className="nutritional-info-details">
      <div
        className="nutritional-info-details__title"
        dangerouslySetInnerHTML={{
          __html: nutritionalInformation?.html,
        }}
      />
      <div className="nutritional-info-details__serving">
        {servingData?.map((item) => {
          return (<span>{item}</span>);
        })}
      </div>

      <div className="nutritional-info-details__nutrition-table">
        <table>
          {tableData?.map(({ name, value, percentage }) => {
            return (
              <tr>
                <td>{name}</td>
                <td>{value}</td>
                <td>{percentage}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div
        className="nutritional-info-details__daily-value-note"
        dangerouslySetInnerHTML={{
          __html: dailyValueNote?.html,
        }}
      />
    </div>
  );
};

NutritionalInfo.propTypes = {
  nutritionalInfoData: PropTypes.any,
};

export default NutritionalInfo;
