import React, { useState, useContext } from 'react';
import SavedGstDetailsSlider from './SavedGstDetailsSlider';
// import SavedGstDetailsSideBar from './SavedGstDetailsSideBar';
import { AppContext, passengerEditActions } from '../../../../context/appContext';
import { gstContextKeys } from '../../../../context/contextKeys';

function SavedGstDetails(props) {
  const {
    state: {
      isAuthenticated,
      savedGstDetails,
    },
    dispatch,
  } = useContext(AppContext);

  const { setSelectedSavedGst, selectedSavedGst, gstFieldValidation, setToggle } = props;
  const { companyName, companyEmail, companyGstNum } = gstContextKeys;

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const clickIt = (gstNumber, gstEmail, gstName) => {
    const gstFields = {
      [companyName]: {
        name: gstName,
        type: '',
      },
      [companyEmail]: {
        name: gstEmail,
        type: 'email',
      },
      [companyGstNum]: {
        name: gstNumber,
        type: 'gstNum',
      },
    };

    for (const field in gstFields) {
      if (gstFields.hasOwnProperty(field)) {
        dispatch({
          type: passengerEditActions.SET_GST_DETAILS,
          payload: {
            key: field,
            value: gstFields[field].name,
            error: gstFieldValidation(gstFields[field].type, gstFields[field].name),
          },
        });
      }
    }
  };

  const onClickHandler = (index, gstNumber, gstEmail, gstName) => {
    if (index === selectedSavedGst) {
      setSelectedSavedGst(null);
      clickIt('', '', '');
    } else {
      setSelectedSavedGst(index);
      setToggle(true);
      clickIt(gstNumber, gstEmail, gstName);
    }
  };

  return isAuthenticated && savedGstDetails?.length > 0 ? (
    <div className="saved-passengers mb-12">
      <SavedGstDetailsSlider
        onClickShow={() => setIsSideBarOpen(true)}
        onClickHandler={onClickHandler}
        {...props}
      />
      {/* {isSideBarOpen && (
            <SavedGstDetailsSideBar
              onCloseClick={() => setIsSideBarOpen(false)}
              clickIt={clickIt}
            />
          )} */}
    </div>
  ) : null;
}

export default React.memo(SavedGstDetails);
