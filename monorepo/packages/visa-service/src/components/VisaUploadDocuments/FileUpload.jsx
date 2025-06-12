import React from 'react';
import PropTypes from 'prop-types';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';

const FileUpload = ({
  doc,
  handleFileUpload,
  uploadedFile,
  uploadingDoc,
  travelerId,
  uploadLabel,
  uploadingLabel,
}) => {
  const uploadFileHandler = (idx) => {
    document.getElementById(idx)?.click();
  };
  const inputId = `file-upload-${travelerId}-${doc?.fieldName}`;

  let buttonText = uploadLabel;
  if (uploadingDoc) {
    buttonText = uploadingLabel;
  } else if (uploadedFile) {
    buttonText = 'Uploaded';
  }

  return (
    <>
      <input
        type="file"
        id={inputId}
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, doc?.docName)}
      />
      <div className="visa-upload-documents__upload-btn-wrapper">
        <Button
          className={`upload-btn ${uploadedFile ? 'uploaded' : ''}`}
          color="secondary"
          size="small"
          onClick={() => uploadFileHandler(inputId)}
        >
          {!uploadingDoc && <Icon className="icon-add-simple" />}
          {uploadingDoc && <span className="uploading-loader" />}
          {buttonText}
        </Button>
      </div>
    </>
  );
};

// Prop-Types Validation
FileUpload.propTypes = {
  doc: PropTypes.object,
  handleFileUpload: PropTypes.func,
  uploadedFile: PropTypes.bool,
  uploadingDoc: PropTypes.bool,
  travelerId: PropTypes.number,
  uploadLabel: PropTypes.string,
  uploadingLabel: PropTypes.string,
};

export default FileUpload;
