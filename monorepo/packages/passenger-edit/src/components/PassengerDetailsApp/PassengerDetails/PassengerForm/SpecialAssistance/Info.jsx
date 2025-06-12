import React, { useContext, useEffect } from 'react';
import sanitizeHtml from 'skyplus-design-system-app/dist/des-system/sanitizeHtml';
import DragSlider from 'skyplus-design-system-app/src/components/DragSlider/DragSlider';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import FormCheckBox from 'skyplus-design-system-app/src/components/FormCheckBox/FormCheckBox';
import { AppContext } from '../../../../../context/appContext';

const Info = ({ consentName, descriptionHTML, note }) => {
  const { register, setValue } = useFormContext();

  const {
    state: {
      aemMainData: {
        specialAssistanceDetails: { wheelchairInfoList, termsAndConditions },
      },
    },
  } = useContext(AppContext);

  const wheelchairInfoHtml = sanitizeHtml(descriptionHTML.html);
  const termsAndConditionsHtml = sanitizeHtml(termsAndConditions.html);

  useEffect(() => {
    setValue(consentName, false);
  }, [setValue, consentName]);

  return (
    <button
      type="button"
      className="special-assistance__note border-0 w-100 d-flex flex-column  gap-6 rounded p-6"
    >
      <div
        className="special-assistance__note-header text-start d-flex
          flex-column gap-6 rounded body-small-light"
        dangerouslySetInnerHTML={{
          __html: wheelchairInfoHtml,
        }}
      />
      <DragSlider containerClass="d-flex gap-8">
        {wheelchairInfoList.map((info) => (
          <li
            key={info?.note}
            className="special-assistance__info body-extra-small-regular
                d-flex flex-column gap-8 rounded
                bg-white px-6 py-8 align-items-center"
          >
            <img
              alt={info?.note}
              src={info?.image?._publishUrl}
              className="special-assistance__info-img"
            />
            <div className="special-assistance__info-text text-primary text-center">
              {info?.note}
            </div>
          </li>
        ))}
      </DragSlider>
      <div className="special-assistance__sub-note body-extra-small-regular">
        {note}
      </div>
      <FormCheckBox
        id={consentName}
        containerClass="d-flex gap-4 align-items-center mb-6"
        register={register}
        registerKey={consentName}
      >
        <div className="special-assistance__options-label body-small-regular text-primary">
          <div
            dangerouslySetInnerHTML={{
              __html: termsAndConditionsHtml,
            }}
          />
        </div>
      </FormCheckBox>
    </button>
  );
};

Info.propTypes = {
  consentName: PropTypes.string,
  descriptionHTML: PropTypes.string,
  note: PropTypes.string,
};

export default Info;
