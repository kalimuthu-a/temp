import React, { Fragment, useState } from 'react';
import Accordion from './Accordion';

export default {
  title: 'Skyplus/Accordion',
  component: Accordion,
};

export const PrimaryAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderAccordionContent = () => {
    return <div>Accordion Body</div>;
  };

  const renderAccordionHeader = () => {
    return <div>Add Custom Header</div>;
  };

  const accordionData = [
    {
      title: 'Aman Pal',
      subTitle: 'Information',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      // addServices: {
      //   text: 'Add your 6E Services',
      //   icon: 'fa-icon',
      // },
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
    {
      title: 'Aman Pal',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      renderAccordionContent: renderAccordionContent(),
    },
    {
      title: 'Aman Pal',
      subTitle: 'Information',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
  ];

  const props = {
    accordionData,
    activeIndex,
    setActiveIndex,
  };

  return <Accordion {...props} />;
};

export const MultiselectAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderAccordionContent = () => {
    return <div>Accordion Body</div>;
  };

  const renderAccordionHeader = () => {
    return <div>Add Custom Header</div>;
  };

  const accordionData = [
    {
      title: 'Aman Pal',
      subTitle: 'Information',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      // addServices: {
      //   text: 'Add your 6E Services',
      //   icon: 'fa-icon',
      // },
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
    {
      title: 'Aman Pal',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      renderAccordionContent: renderAccordionContent(),
    },
    {
      title: 'Aman Pal',
      subTitle: 'Information',
      gender: 'male',
      ageGroup: 'adult',
      age: '28 years old',
      renderAccordionHeader: renderAccordionHeader(),
      renderAccordionContent: renderAccordionContent(),
    },
  ];

  const props = {
    accordionData,
    activeIndex,
    setActiveIndex,
    isMultiOpen: true,
    initalActiveIndexes: [0],
  };

  return <Accordion {...props} />;
};
