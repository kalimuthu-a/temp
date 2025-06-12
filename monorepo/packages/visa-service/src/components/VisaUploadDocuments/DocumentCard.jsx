/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import FileUpload from './FileUpload';
import { fileFormatName, fileFormats, IconNames } from '../../utils';
import { MAX_FILE_SIZE } from '../../constants';
import { encryptText, uploadVisaDocuments } from '../../services';
import { AppContext } from '../../context/AppContext';
import DocumentInformation from './DocumentInformation';
import DeleteDocConfirmationPopup from './DeleteDocConfirmationPopup';

const DocumentCard = ({
  documents,
  uploadCount,
  setUploadCount,
  uploadedDocs,
  setUploadedDocs,
  travelerId,
  visaBookingId,
  passenger,
  maxUploadDocLength,
  updateUploadedDocuments,
  removeUploadedDocuments,
  fileUploading,
  setFileUploading,
}) => {
  const {
    state: {
      visaUploadDocumentsByPath,
      getItineraryDetails,
    },
  } = React.useContext(AppContext);
  const aemData = visaUploadDocumentsByPath || {};
  const [errors, setErrors] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const { uploadLabel, uploadingLabel } = visaUploadDocumentsByPath || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ message: '', state: '' });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const uploadedFile = uploadedDocs?.find(
    (docItem) => docItem.docType === documents?.docName,
  );

  const convertedFileFormats = `${documents?.formats?.map(
    (files) => fileFormats(files),
  )} smaller than ${documents?.maxSize || '7MB'}`;
  const iconName = <Icon className={IconNames(documents?.fieldName)} />;

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event, document) => {
    setToastMessage({
      message: '',
      state: '',
    });

    setErrors((prev) => ({ ...prev, [documents?.docName]: null }));

    if (uploadCount >= maxUploadDocLength) return;

    const file = event.target.files?.[0];
    if (!file) {
      setFileUploading(false);
      setErrors((prev) => ({ ...prev, [document?.docName]: 'Error! No file selected' }));
      return;
    }

    const requiredFileSize = Number(document?.maxSize?.match(/(\d+)/)?.[0]) || 7;
    if (file.size > requiredFileSize * MAX_FILE_SIZE) {
      setFileUploading(false);
      setErrors((prev) => ({
        ...prev,
        [document?.docName]: `Error! File size is more than ${document?.maxSize || '7MB'}`,
      }));
      return;
    }

    const { bookingDetails } = getItineraryDetails;
    const base64String = await convertToBase64(file);
    const requestPayload = {
      bookingId: await encryptText(visaBookingId || ''),
      travelerId: await encryptText(passenger?.travelerId || ''),
      pnr: await encryptText(bookingDetails?.recordLocator),
      document: {
        documentName: document?.docName,
        sameAsPrimary: false,
        format: file?.type,
        data: base64String,
      },
    };

    const uploadDocumentRequestCalling = async () => {
      try {
        setUploadingDoc(true);
        setFileUploading(true);
        const response = await uploadVisaDocuments(requestPayload);

        if (response?.message) {
          setToastMessage({
            message: response.message,
            state: 'notifi-variation--Success',
          });
          setTimeout(() => {
            updateUploadedDocuments(travelerId, { document, file });
            setUploadingDoc(false);
            setUploadedDocs((prev) => [
              ...prev,
              {
                filename: file.name,
                docType: document?.docName,
                icon: <Icon className="icon-close-simple" />,
              },
            ]);
            setUploadCount(uploadedDocs.length + 1, travelerId);
            setFileUploading(false);
          }, 500);
        } else {
          setFileUploading(false);
          throw new Error(response?.msg || 'Upload failed');
        }
      } catch (error) {
        const apiMessage = error?.response?.data?.message
          || error?.response?.data?.msg
          || error?.message
          || 'Something went wrong during upload.';

        setErrors((prev) => ({
          ...prev,
          [document?.docName]: apiMessage,
        }));
        setUploadingDoc(false);
        setFileUploading(false);
        setToastMessage({
          message: apiMessage,
          state: 'notifi-variation--Error',
        });
      }
    };

    uploadDocumentRequestCalling();
  };

  const handleMouseEnter = () => {
    setIsModalOpen(true);
  };

  /* Remove individual uploaded document */
  const handleRemoveFile = (docType, fieldName) => {
    setUploadedDocs((prev) => prev.filter((doc) => doc.docType !== docType));
    setUploadCount(uploadedDocs.length - 1, travelerId);
    removeUploadedDocuments(travelerId, fieldName);
  };

  // Clear toast message after timeout
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (toastMessage?.message) {
      const timer = setTimeout(() => {
        setToastMessage({
          message: '',
          state: '',
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage?.message]);
  return (
    <div className={`visa-upload-documents__document-card
     ${uploadedFile ? 'visa-upload-documents__document-card--file-uploaded' : ''}
     ${fileUploading ? 'visa-upload-documents__document-card--file-uploading' : ''}
     `}
    >
      <div className="visa-upload-documents__document-card-document-info">
        <span className="visa-upload-documents__document-card-document-info-icon">{iconName}</span>
        <div className="visa-upload-documents__document-card-document-info-details">
          <h4 className="visa-upload-documents__document-card-document-info-header">
            {documents?.docName}
            <span
              onClick={() => handleMouseEnter()}
              className="document-info-icon"
              aria-hidden="true"
            >
              <Icon className="icon-info " />
            </span>
          </h4>
          <DocumentInformation
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            modalData={documents?.docName}
            title={documents?.docName}
            note={documents?.sample}
            sampleType={documents?.sampleType}
            pointsList={aemData?.alertsInfo?.[3]?.pointsList}
          />
          <p className="visa-upload-documents__document-card-document-info-details-file">
            {convertedFileFormats}
          </p>

          {uploadedFile && (
            <div className="visa-upload-documents__document-card-uploaded-file">
              <span className="visa-upload-documents__document-card-uploaded-file-file-icon">
                <Icon className={fileFormatName(uploadedFile?.filename)} />
              </span>
              <span className="visa-upload-documents__document-card-uploaded-file-file-name">
                {uploadedFile?.filename}
              </span>
              <span
                onClick={() => setShowDeleteConfirmModal(documents)}
                className="document-info-icon"
                aria-hidden="true"
              >
                <Icon className="icon-close-simple" />
              </span>
            </div>
          )}

          <DeleteDocConfirmationPopup
            isOpen={showDeleteConfirmModal !== false}
            onClose={() => setShowDeleteConfirmModal(false)}
            onConfirm={() => {
              handleRemoveFile(documents?.docName, documents?.fieldName);
              setShowDeleteConfirmModal(false);
            }}
            title={aemData?.deleteConfirmationPopup?.title?.html}
            ctaLabel={aemData?.deleteConfirmationPopup?.ctaLabel}
            secondaryCtaLabel={aemData?.deleteConfirmationPopup?.secondaryCtaLabel}
          />

          {errors?.[documents?.docName] && (
            <p className="visa-upload-documents__document-card-error-message-documents">
              {errors[documents?.docName]}
            </p>
          )}
        </div>
      </div>

      {uploadingDoc ? (
        <FileUpload
          doc={documents}
          uploadedFile={uploadedFile}
          uploadingDoc={uploadingDoc}
          travelerId={travelerId}
          uploadLabel={uploadLabel}
          uploadingLabel={uploadingLabel}
        />
      ) : null}

      {uploadedFile ? (
        <Icon className="icon-tick-filled" />
      ) : (
        !uploadingDoc && (
          <FileUpload
            doc={documents}
            handleFileUpload={(event) => handleFileUpload(event, documents)}
            uploadedFile={uploadedFile}
            travelerId={travelerId}
            uploadLabel={uploadLabel}
            uploadingLabel={uploadingLabel}
          />
        )
      )}

      {toastMessage.message && (
        <Toast
          mainToastWrapperClass="skyplus-design-toast_documents-toast"
          variation={toastMessage.state}
          description={toastMessage.message}
          infoIconClass={
            toastMessage.state === 'notifi-variation--Error'
              ? 'icon-close-solid'
              : 'icon-tick-outlined'
          }
          containerClass="skyplus-design-toast_documents-toast"
          autoDismissTimeer={8000}
        />
      )}
    </div>
  );
};

export default DocumentCard;
