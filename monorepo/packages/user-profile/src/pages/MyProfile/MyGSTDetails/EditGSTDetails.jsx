import React, { useContext } from 'react';
import OffCanvas from 'skyplus-design-system-app/dist/des-system/OffCanvas';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import Input from 'skyplus-design-system-app/dist/des-system/InputField';
import PropTypes from 'prop-types';
import Icon from 'skyplus-design-system-app/dist/des-system/Icon';
import MyGSTDetailsContext from './MyGSTDetailsContext';
import { myGSTDetailsActions } from './MyGSTDetailsReducer';

function EditGSTDetails({ data, onSubmit, validateField, onCloseHandler, buttonLoader }) {
  const { state, dispatch } = useContext(MyGSTDetailsContext);
  const { myGSTDetailsAemData, isButtonDisabled, error, mode } = state;

  // Function to handle form changes
  const handleChange = (field, val) => {
    let value = '';
    if (field === 'GSTNumber') {
      value = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    } else if (field === 'GSTName') {
      value = val.replace(/[^a-zA-Z0-9&\-. ]/g, '').replace(/\s{2,}/g, ' ');
    } else {
      value = val.trim();
    }
    if (typeof value === 'object' && value !== null) {
      // Batched update
      const updatedFormData = { ...state.formData, ...value };
      dispatch({ type: myGSTDetailsActions.SET_FORM_STATE, payload: updatedFormData });
    } else {
      // Single field update
      const updatedFormData = { ...state.formData, [field]: value };
      dispatch({ type: myGSTDetailsActions.SET_FORM_STATE, payload: updatedFormData });
    }

    // Call validateField for each field in batched updates
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        validateField(key, value[key]);
      });
    } else {
      validateField(field, value);
    }
  };

  return (
    <div className="edit-gst-details">
      <OffCanvas
        onClose={onCloseHandler}
        renderHeader={() => (
          <div className="skyplus-offcanvas__contents--header">
            <Icon
              className="icon-close-simple"
              role="button"
              tabIndex={0}
              onClick={onCloseHandler}
            />
            <div className="d-md-none edit-gst-details-sidebar-header ms-24 ps-24 h5">
              {mode === 'edit' ? myGSTDetailsAemData?.updateGstDetailsLabel : myGSTDetailsAemData?.addGstDetailsLabel}
            </div>
          </div>
        )}
        renderFooter={() => (
          <div className="px-4 edit-gst-details-add-gst-btn">
            <Button
              containerClass="w-100 mt-0"
              onClick={onSubmit}
              {...{ block: true }}
              disabled={!(data?.GSTNumber && !error?.GSTNumber && data?.GSTEmail
                && !error?.GSTEmail && data?.GSTName && !error?.GSTName && !isButtonDisabled)}
              loading={buttonLoader}
            >
              {mode === 'edit' ? myGSTDetailsAemData?.updateGstDetailsLabel : myGSTDetailsAemData?.addGstDetailsLabel}
            </Button>
          </div>
        )}
      >
        <div className="gst-fields">
          <div className="d-none d-md-block edit-gst-details-sidebar-header h4 pt-10 pb-8">
            {mode === 'edit' ? myGSTDetailsAemData?.updateGstDetailsLabel : myGSTDetailsAemData?.addGstDetailsLabel}
          </div>
          <div className="d-md-none body-medium-regular mb-2 mt-12 edit-gst-details-gst-instruction">
            {myGSTDetailsAemData?.addGstDetailsMessage}
          </div>
          <div className="rounded bg-white p-6 p-md-8">
            <span className="d-none d-md-block body-medium-regular edit-gst-details-gst-instruction">
              {myGSTDetailsAemData?.addGstDetailsMessage}
            </span>
            <div className="pt-md-6">
              <Input
                placeholder={myGSTDetailsAemData?.gstNumberLabel}
                className="body-small-light p-6"
                onChange={(e) => handleChange('GSTNumber', e.target.value)}
                value={data?.GSTNumber}
                maxLength={15}
                minLength={15}
                customErrorMsg={error && error?.GSTNumber}
              />
              <Input
                placeholder={myGSTDetailsAemData?.gstEmailLabel}
                className="body-small-light p-6"
                onChange={(e) => handleChange('GSTEmail', e.target.value)}
                value={data?.GSTEmail}
                customErrorMsg={error && error?.GSTEmail}
              />
              <Input
                placeholder={myGSTDetailsAemData?.gstCompanyNameLabel}
                className="body-small-light p-6"
                onChange={(e) => handleChange('GSTName', e.target.value)}
                value={data?.GSTName}
                maxLength={32}
                customErrorMsg={error && error?.GSTName}
              />
            </div>
          </div>
        </div>
      </OffCanvas>
    </div>
  );
}

EditGSTDetails.propTypes = {
  onCloseHandler: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  buttonLoader: PropTypes.bool,
};

export default EditGSTDetails;
