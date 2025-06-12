import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import FormMultiRadio from 'skyplus-design-system-app/src/components/FormMultiRadio/FormMultiRadio';
import PropTypes from 'prop-types';
import { AppContext } from '../../../../../context/appContext';
import ALL_JOURNEYS from './constants';

const Journey = ({ journeyName, journey }) => {
  const [selectedJourney, setSelectedJourney] = useState([ALL_JOURNEYS]);
  const { register, setValue, watch } = useFormContext();
  // const journeyValue = watch('journey');

  const {
    state: {
      paxData: { ssr },
      aemMainData: {
        specialAssistanceDetails: { allLabel, selectYourJourneyLabel },
      },
    },
  } = useContext(AppContext);

  useEffect(() => {
    if (journey.length) setSelectedJourney(journey);
  }, []);

  const initJournyeKeys = ssr.map(({ journeyKey }) => journeyKey);

  const journeyItems = ssr?.map(
    ({ journeydetail: { origin, destination }, journeyKey }) => {
      return {
        value: journeyKey,
        label: `${origin} - ${destination}`,
      };
    },
  );

  journeyItems?.unshift({ value: allLabel.toLowerCase(), label: allLabel });

  const onChangeHandler = (e) => {
    const val = e.target.value;
    const isChecked = e.target.checked;
    if (val === ALL_JOURNEYS) {
      if (!isChecked) setSelectedJourney([]);
      else setSelectedJourney([ALL_JOURNEYS]);
    } else {
      let journeys = [...selectedJourney];
      const allIndex = journeys.indexOf(ALL_JOURNEYS);
      if (allIndex >= 0) journeys.splice(allIndex, 1);
      if (isChecked && !journeys.includes(val)) {
        journeys.push(val);
      }
      if (!isChecked) {
        const journeyIndex = journeys.indexOf(val);
        if (journeyIndex >= 0) {
          journeys.splice(journeyIndex, 1);
        } else {
          const journeyKeys = [...initJournyeKeys];
          const keyIndex = journeyKeys.indexOf(val);
          journeyKeys.splice(keyIndex, 1);
          journeys = journeyKeys;
        }
      }
      if (journeyItems.length === journeys.length + 1) {
        journeys.length = 0;
        journeys.push(ALL_JOURNEYS);
      }
      setSelectedJourney(journeys);
    }
  };

  return (
    <div className="special-assistance__card bg-white p-8 d-flex flex-column gap-8">
      <div className="body-medium-large">{selectYourJourneyLabel}</div>
      <div
        className="special-assistance__dashed-card d-flex flex-column gap-4
 rounded flex-md-row gap-md-12 p-4 body-small-regular"
      >
        {journeyItems.map(({ label, value }) => (
          <FormMultiRadio
            key={value}
            containerClass="d-flex gap-3 text-capitalize"
            id={value}
            value={value}
            register={register}
            registerKey={journeyName}
            defaultChecked={selectedJourney.includes(value) || selectedJourney[0] === ALL_JOURNEYS}
            registerOptions={{ required: true, onChange: (e) => onChangeHandler(e) }}
          >
            {label}
          </FormMultiRadio>
        ))}
      </div>
    </div>
  );
};

Journey.propTypes = {
  journeyName: PropTypes.string,
};

export default Journey;
