/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import { AppContext } from '../../context/AppContext';
import DocumentCard from './DocumentCard';

const VisaUploadDoc = ({
  requiredDocuementsList,
  passenger,
  visaBookingId,
  updateUploadedDocuments,
  uploadedDocumentsByPassenger,
  setUploadCount,
  uploadCount,
  removeUploadedDocuments,
}) => {
  const {
    state: {
      visaUploadDocumentsByPath,
    },
  } = React.useContext(AppContext);

  const [aemContent, setAemContent] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);
  const maxUploadDocLength = requiredDocuementsList?.length || 0;
  useEffect(() => {
    if (aemContent === null) {
      setAemContent(visaUploadDocumentsByPath);
    }
  }, [visaUploadDocumentsByPath]);

  useEffect(() => {
    if (uploadedDocumentsByPassenger && passenger) {
      requiredDocuementsList?.forEach((documents) => {
        let uploadedDoc = {};
        if (uploadedDocumentsByPassenger[passenger.travelerId]) {
          uploadedDocumentsByPassenger[passenger.travelerId]?.forEach((paxDoc) => {
            const docKey = Object.keys(paxDoc)[0];
            if (docKey === documents.fieldName) {
              uploadedDoc = {
                filename: paxDoc[docKey]?.name || '',
                docType: documents?.docName,
                fieldName: documents?.fieldName,
                icon: <Icon className="icon-close-simple" />,
              };
              // Update the uploadedDocs state after processing
              setUploadedDocs((prev) => [
                ...prev,
                uploadedDoc,
              ]);
            }
          });
        }
      });
    }
  }, [uploadedDocumentsByPassenger, passenger, requiredDocuementsList]);

  const uploadDocCount = uploadCount
   && Object.prototype.hasOwnProperty.call(uploadCount, passenger.travelerId) ? uploadCount[passenger.travelerId] : 0;

  const documentCardRenderer = () => {
    return requiredDocuementsList && requiredDocuementsList?.map((documents) => {
      return (
        <DocumentCard
          key={documents?.fieldName}
          documents={documents}
          uploadCount={uploadDocCount}
          setUploadCount={setUploadCount}
          uploadedDocs={uploadedDocs}
          setUploadedDocs={setUploadedDocs}
          travelerId={passenger?.travelerId}
          passenger={passenger}
          maxUploadDocLength={maxUploadDocLength}
          visaBookingId={visaBookingId}
          updateUploadedDocuments={updateUploadedDocuments}
          removeUploadedDocuments={removeUploadedDocuments}
          fileUploading={fileUploading}
          setFileUploading={setFileUploading}
        />
      );
    });
  };

  return (
    <div className="visa-upload-documents">
      <div className="visa-upload-documents__documents-upload">
        <div className="visa-upload-documents__documents-upload-header">
          <p>{`${aemContent?.documentsUploadLabel} ${uploadDocCount}/${maxUploadDocLength}`}</p>
        </div>
        <div className="visa-upload-documents__documents-upload-progress-bar">
          <div
            className={`visa-upload-documents__documents-upload-progress 
              ${uploadDocCount === maxUploadDocLength
              ? 'visa-upload-documents__documents-upload-progress--completed'
              : 'visa-upload-documents__documents-upload-progress--uploading'
              }`}
            style={{ width: `${(uploadDocCount / maxUploadDocLength) * 100}%` }}
          />
        </div>
      </div>
      {documentCardRenderer()}
    </div>
  );
};

export default VisaUploadDoc;
