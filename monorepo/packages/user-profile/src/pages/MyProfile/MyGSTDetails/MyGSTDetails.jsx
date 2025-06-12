/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import Button from 'skyplus-design-system-app/dist/des-system/Button';
import ModalComponent from 'skyplus-design-system-app/dist/des-system/ModalComponent';
import Toast from 'skyplus-design-system-app/dist/des-system/Toast';
import { uniq } from 'skyplus-design-system-app/src/functions/utils';
import { myGSTDetailsActions } from './MyGSTDetailsReducer';
import {
  getMyProfileApi,
  updateMyProfileApi,
} from '../../../services/myProfile.service';
import { getMyGSTDetailsAemData } from '../../../services/myGSTDetails.service';
import MyGSTDetailsContext from './MyGSTDetailsContext';
import EditGSTDetails from './EditGSTDetails';
import regexConstant from '../../../constants/regex';
import Loader from '../../../components/common/Loader/Loader';
import profileBtnClickAnalytics from '../../../functions/profileBtnClickAnalytics';

export const MyGSTDetails = () => {
  const { state, dispatch } = useContext(MyGSTDetailsContext);
  const {
    mode,
    userType,
    profileData,
    isOpenedSidebar,
    isRemoveGSTModalOpened,
    selectedCard,
    formData,
    toast,
    myGSTDetailsAemData,
  } = state;
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const validateField = (field, value) => {
    let errorText = '';

    switch (field) {
      case 'GSTNumber':
        if (value && value.length < 15) {
          errorText = `${myGSTDetailsAemData?.invalidGSTNumber}`;
        } else if (value && !value.match(regexConstant.ALPHA_NUMERIC)) {
          errorText = `${field} ${myGSTDetailsAemData?.alphanumericText}`;
        }
        break;
      case 'GSTEmail':
        if (value && !value.match(regexConstant.EMAIL)) {
          errorText = myGSTDetailsAemData?.gstEmailValidationMessage;
        }
        break;
      default:
        break;
    }
    dispatch({
      type: myGSTDetailsActions.SET_ERRORS,
      payload: { [field]: errorText },
    });
    return errorText;
  };

  const getMygstApiRequest = async () => {
    const data = await getMyProfileApi();
    dispatch({ type: myGSTDetailsActions.SET_PROFILE_DATA, payload: data?.data });
    dispatch({ type: myGSTDetailsActions.SET_ORIGINAL_PROFILE_DATA, payload: data?.data });
  };

  const fetchProfileData = async () => {
    setLoader(true);
    await getMygstApiRequest();
    const myGSTDetailsAemlabels = await getMyGSTDetailsAemData(userType);
    dispatch({
      type: myGSTDetailsActions.SET_MY_GST_DETAILS_AEM_DATA,
      payload: myGSTDetailsAemlabels,
    });
    setLoader(false);
  };
  useEffect(() => {
    fetchProfileData();
  }, []);

  const onCloseHandler = () => {
    dispatch({
      type: myGSTDetailsActions.SET_IS_OPENED_SIDEBAR,
      payload: false,
    });
  };

  const handleAddGSTDetail = () => {
    // Initialize a new GST form object with default/empty values
    profileBtnClickAnalytics(myGSTDetailsAemData?.addGstDetailsLabel, 'My GST Details');
    const newGSTFormData = {
      GSTNumber: '',
      GSTEmail: '',
      GSTName: '',
      oldGstNumber: '',
    };
    dispatch({
      type: myGSTDetailsActions.SET_FORM_STATE,
      payload: newGSTFormData,
    });
    dispatch({ type: myGSTDetailsActions.SET_SELECTED_CARD, payload: null });
    dispatch({ type: myGSTDetailsActions.SET_MODE, payload: 'add' }); // Set mode to "add"
    dispatch({
      type: myGSTDetailsActions.SET_IS_OPENED_SIDEBAR,
      payload: true,
    });
  };

  const handleCardClick = (card, index) => {
    const data = { ...card, index };
    dispatch({ type: myGSTDetailsActions.SET_SELECTED_CARD, payload: data });
    dispatch({
      type: myGSTDetailsActions.SET_IS_OPENED_SIDEBAR,
      payload: true,
    });
    dispatch({ type: myGSTDetailsActions.SET_MODE, payload: 'edit' }); // set mode to "edit"
    dispatch({ type: myGSTDetailsActions.SET_FORM_STATE, payload: card }); // Set form state to selected card
  };

  const addGSTDetail = async () => {
    // Handle Add Passenger
    const newGSTDetail = state.formData;
    const checkDetails = profileData?.gstDetails?.find((item) => item?.GSTNumber === newGSTDetail.GSTNumber);
    if (checkDetails) {
      dispatch({
        type: myGSTDetailsActions.SET_TOAST,
        payload: {
          show: true,
          description: myGSTDetailsAemData?.gstAlreadyExist,
          variation: 'Error',
        },
      });
      return;
    }
    if (newGSTDetail && Object.keys(newGSTDetail).length > 0) {
      // Prepare the updated GST Details array
      const updatedgstDetails = {
        gstEmail: newGSTDetail?.GSTEmail,
        gstName: newGSTDetail?.GSTName,
        gstNumber: newGSTDetail.GSTNumber,
        oldGstNumber: newGSTDetail.oldGstNumber,
      };
      const updatedGSTDetails = [
        ...(profileData?.gstDetails || []),
        updatedgstDetails,
      ];
      // Prepare the payload for the API
      const payload = {
        gstDetails: updatedGSTDetails,
      };

      try {
        const response = await updateMyProfileApi(payload);
        if (response?.data?.success) {
          await getMygstApiRequest();
          dispatch({ type: myGSTDetailsActions.SET_IS_OPENED_SIDEBAR, payload: false });
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: myGSTDetailsAemData?.gstDetailsAdded,
              variation: 'Success',
            },
          });
        } else if (!response?.data?.success && response?.data?.status === 400) {
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: response?.data?.message,
              variation: 'Error',
            },
          });
        } else {
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: myGSTDetailsAemData?.gstDetailsNotAdded,
              variation: 'Error',
            },
          });
        }
      } catch (error) {
        dispatch({
          type: myGSTDetailsActions.SET_TOAST,
          payload: {
            show: true,
            description: myGSTDetailsAemData?.gstDetailsNotAdded,
            variation: 'Error',
          },
        });
      }
    } else {
      dispatch({
        type: myGSTDetailsActions.SET_TOAST,
        payload: {
          show: true,
          description: myGSTDetailsAemData?.noChangesInForm,
          variation: 'Error',
        },
      });
    }
  };

  const editGSTDetail = async () => {
    // Handle Edit GST Detail
    const updatedGSTDetail = state.formData;
    if (updatedGSTDetail && Object.keys(updatedGSTDetail).length > 0) {
      // Prepare the updated GST details array with field-level replacement
      const updatedGSTDetails = (profileData?.gstDetails || []).map(
        (gstDetail, index) => {
          if (index === selectedCard.index) {
            // Check if GSTNumber has changed
            if (gstDetail.GSTNumber !== updatedGSTDetail.GSTNumber) {
              return {
                gstEmail: updatedGSTDetail?.GSTEmail,
                gstName: updatedGSTDetail?.GSTName,
                oldGstNumber: gstDetail.GSTNumber,
                gstNumber: updatedGSTDetail.GSTNumber,
              };
            }
            return {
              gstEmail: updatedGSTDetail?.GSTEmail,
              gstName: updatedGSTDetail?.GSTName,
              gstNumber: updatedGSTDetail.GSTNumber,
              oldGstNumber: updatedGSTDetail.GSTNumber,
            };
          }
          return gstDetail; // Keep other GST details intact
        },
      );

      // Prepare the payload for the API
      const payload = {
        gstDetails: updatedGSTDetails,
      };

      try {
        const response = await updateMyProfileApi(payload);
        if (response?.data?.success) {
          await getMygstApiRequest();
          dispatch({ type: myGSTDetailsActions.SET_IS_OPENED_SIDEBAR, payload: false });
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: myGSTDetailsAemData?.gstDetailsUpdated,
              variation: 'Success',
            },
          });
        } else if (!response?.data?.success && response?.data?.status === 400) {
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: response?.data?.message,
              variation: 'Error',
            },
          });
        } else {
          dispatch({
            type: myGSTDetailsActions.SET_TOAST,
            payload: {
              show: true,
              description: myGSTDetailsAemData?.gstDetailsNotUpdated,
              variation: 'Error',
            },
          });
        }
      } catch (error) {
        dispatch({
          type: myGSTDetailsActions.SET_TOAST,
          payload: {
            show: true,
            description: myGSTDetailsAemData?.gstDetailsNotUpdated,
            variation: 'Error',
          },
        });
      }
    } else {
      dispatch({
        type: myGSTDetailsActions.SET_TOAST,
        payload: {
          show: true,
          description: myGSTDetailsAemData?.noChangesInForm,
          variation: 'Error',
        },
      });
    }
  };

  const handleFormSubmit = async () => {
    setButtonLoader(true);
    if (mode === 'add') {
      profileBtnClickAnalytics(myGSTDetailsAemData?.addGstDetailsLabel, 'My GST Details');
      await addGSTDetail();
    } else {
      profileBtnClickAnalytics(myGSTDetailsAemData?.editGSTDetail, 'My GST Details');
      await editGSTDetail();
    }
    setButtonLoader(false);
  };
  const onCloseRemoveHandler = () => {
    dispatch({
      type: myGSTDetailsActions.SET_IS_OPENED_REMOVE_GST_MODAL,
      payload: false,
    });
    dispatch({ type: myGSTDetailsActions.SET_SELECTED_CARD, payload: null });
  };

  const handleRemoveCardClick = (card, index) => {
    const data = { ...card, index };
    dispatch({ type: myGSTDetailsActions.SET_SELECTED_CARD, payload: data });
    dispatch({
      type: myGSTDetailsActions.SET_IS_OPENED_REMOVE_GST_MODAL,
      payload: true,
    });
  };

  const handleRemoveGSTDetail = async (selectedIndex) => {
    // Set the "isDelete" property of the selected GST detail
    const updatedGSTDetails = profileData?.gstDetails?.map((gstDetail, index) => {
      if (index === selectedIndex) {
        return {
          gstNumber: gstDetail?.GSTNumber,
          gstEmail: gstDetail?.GSTEmail,
          gstName: gstDetail?.GSTName,
          oldGstNumber: gstDetail?.oldGstNumber,
          isDelete: true, // Set isDelete to true
        };
      }
      return gstDetail; // Keep other GST details unchanged
    });

    // Prepare the payload for the API
    const updatedData = { gstDetails: updatedGSTDetails };

    try {
      const response = await updateMyProfileApi(updatedData);
      if (response?.data?.success) {
        await getMygstApiRequest();
        dispatch({
          type: myGSTDetailsActions.SET_TOAST,
          payload: {
            show: true,
            description: myGSTDetailsAemData?.gstDetailsRemoved,
            variation: 'Success',
          },
        });
        onCloseRemoveHandler();
      } else if (!response?.data?.success && response?.data?.status === 400) {
        dispatch({
          type: myGSTDetailsActions.SET_TOAST,
          payload: {
            show: true,
            description: response?.data?.message,
            variation: 'Error',
          },
        });
      } else {
        dispatch({
          type: myGSTDetailsActions.SET_TOAST,
          payload: {
            show: true,
            description: myGSTDetailsAemData?.gstDetailsNotRemoved,
            variation: 'Error',
          },
        });
      }
    } catch (error) {
      dispatch({
        type: myGSTDetailsActions.SET_TOAST,
        payload: {
          show: true,
          description: myGSTDetailsAemData?.gstDetailsNotRemoved,
          variation: 'Error',
        },
      });
    }
  };

  const removeGstConfirmRender = () => {
    return (
      <div className="modify-reset-confirmation-content-main">
        <div className="remove-gst-popup-content-header">
          {' '}
          {myGSTDetailsAemData?.removeDetailsPopup?.heading}{' '}
        </div>
        <div
          className="remove-gst-popup-content-sub-header body-medium-regular pt-5"
          dangerouslySetInnerHTML={{
            __html: myGSTDetailsAemData?.removeDetailsPopup?.description?.html,
          }}
        />

        <div className="remove-gst-popup-content-buttongrp gap-4">
          <Button
            variant="outline"
            color="primary"
            size="small"
            classNames=""
            onClick={() => onCloseRemoveHandler()}
          >
            {myGSTDetailsAemData?.removeDetailsPopup?.ctaLabel}
          </Button>
          <Button
            color="primary"
            size="small"
            classNames=""
            onClick={() => handleRemoveGSTDetail(selectedCard?.index)}
          >
            {myGSTDetailsAemData?.removeDetailsPopup?.secondaryCtaLabel}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="gst-details mb-md-20">
      {loader ? <Loader /> : null}
      <div className="header">
        <h4 className="h4 title d-none d-md-block">{myGSTDetailsAemData?.title}</h4>
        <div className="d-flex-column align-items-center gap-4 m-view">
          <Button {...{ block: true }} onClick={handleAddGSTDetail}>{myGSTDetailsAemData?.addGstDetailsLabel}</Button>
          {/* commented because need to confirm with shreya  */}
          {/* <p>
            {myGSTDetailsAemData?.addGstDetailsMessage}
          </p> */}
        </div>
      </div>
      <div className="rounded m-9 mt-12 p-6 p-md-8 bg-white m-view-card">
        <div className="table-container">
          <table className="gst-table">
            <thead>
              <tr>
                <th className=" text-start body-small-medium col-sno">
                  {myGSTDetailsAemData?.snoLabel}
                </th>
                <th className=" text-start body-small-medium col-gst-number">
                  {myGSTDetailsAemData?.gstNumberLabel}
                </th>
                <th className=" text-start body-small-medium col-gst-email">
                  {myGSTDetailsAemData?.gstEmailLabel}
                </th>
                <th className=" text-start body-small-medium col-gst-company">
                  {myGSTDetailsAemData?.gstCompanyNameLabel}
                </th>
                <th className=" text-start body-small-medium col-actions" />
              </tr>
            </thead>
            <tbody>
              {profileData?.gstDetails?.length > 0
                && profileData?.gstDetails?.map((gstDetail, index) => {
                  return (
                    <tr key={uniq()}>
                      <td className="body-small-light text-start">
                        {index + 1}
                      </td>
                      <td className="body-small-light text-start actions-col">
                        {gstDetail?.GSTNumber}
                      </td>
                      <td className="body-small-light text-start">
                        {gstDetail?.GSTEmail}
                      </td>
                      <td className="body-small-light text-start">
                        {gstDetail?.GSTName}
                      </td>
                      <td className="body-small-light actions-col">
                        <a
                          href="#"
                          className="link-button me-12"
                          onClick={(e) => {
                            e.preventDefault();
                            handleCardClick(gstDetail, index);
                          }}
                        >
                          {myGSTDetailsAemData?.editLabel}
                        </a>
                        <a
                          href="#"
                          className="link-button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveCardClick(gstDetail, index);
                          }}
                        >
                          {myGSTDetailsAemData?.removeLabel}
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {isRemoveGSTModalOpened && (
        <ModalComponent
          modalContent={() => removeGstConfirmRender()}
          modalContentClass="remove-gst-popup-content"
          modalWrapperClass="remove-gst-popup-wrapper"
          onCloseHandler={() => onCloseRemoveHandler()}
        />
      )}

      {isOpenedSidebar && (
        <EditGSTDetails
          data={formData}
          onSubmit={handleFormSubmit}
          onCloseHandler={onCloseHandler}
          validateField={validateField}
          buttonLoader={buttonLoader}
        />
      )}

      {toast.show && (
        <Toast
          infoIconClass="icon-info"
          variation={`notifi-variation--${toast.variation}`}
          description={toast.description}
          containerClass="toast-example"
          autoDismissTimeer={5000}
          onClose={() => {
            dispatch({
              type: myGSTDetailsActions.SET_TOAST,
              payload: { show: false, description: '', variation: null },
            });
          }}
        />
      )}
    </div>
  );
};

MyGSTDetails.propTypes = {};

export default MyGSTDetails;
