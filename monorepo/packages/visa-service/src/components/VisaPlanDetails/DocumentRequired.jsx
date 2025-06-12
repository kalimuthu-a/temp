import React from 'react';
import PropTypes from 'prop-types';
import VisaPlanNote from './VisaPlanNote/VisaPlanNote';

const DocumentRequired = ({ data, aemContent, announcement }) => {
  const { pleaseNoteLabel = {} } = aemContent;

  const { value, icon, key } = pleaseNoteLabel?.length > 1 && pleaseNoteLabel[1];
  return (
    <div>
      {announcement && (
        <VisaPlanNote
          noteTypeClass="doc-required-note"
          title={key}
          iconClass={icon}
          message={value}
        />
      )}
      {data?.tourist?.map((item, i) => (
        <div key={`${item?.fieldName}_${i + 1}`} className="document-require-contain">
          <div className="doc-file-name">{item?.fieldName}</div>
          {Array.isArray(item?.content) && item?.content?.length > 0 ? (
            <ul>
              {item?.content?.map((content, index) => (
                <li key={`${content}_${index + 1}`}>{content}</li>
              ))}
            </ul>
          ) : (
            <p>{item?.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

DocumentRequired.propTypes = {
  data: PropTypes.any,
  aemContent: PropTypes.object,
  announcement: PropTypes.bool,
};

export default DocumentRequired;
