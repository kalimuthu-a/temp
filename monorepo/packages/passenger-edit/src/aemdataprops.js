/* eslint-disable max-len */
const aemdataprops = {
  backLinkLabel: 'back to search results page',
  journeys: [{ source: 'del', destination: 'blr' }],
  savedPassengersLabels: {
    bannerTitle: 'Access your ',
    bannerTitleGreen: 'saved passengers',
    bannerSubHeading: 'Sign in to book using your',
    bannerHeading: 'Saved passenger and payment details',
    bannerBtnLabel: 'Sign in now',
    sidebarHeading: 'All Passengers',
    sidebarSubheading: 'Select passenger details from your ',
    sidebarSubheadingGreen: 'saved list',
    infoHeading: 'Selected',
    btnLabel: 'Done',
    sliderHeading: 'Choose from saved list',
    sliderBtnLabel: 'View all',
  },
  contactFormLabels: {
    headings: {
      headingTitle: 'Contact details',
      headingSubTitle: 'Booking details will be sent to this contact details.',
    },
    phoneLabels: {
      phonePlaceholder: 'Primary Contact Number',
      invalidPhoneMsg: 'Enter valid Mobile number!',
    },
    emailLabels: {
      emailPlaceholder: 'Email Id',
      invalidEmailMsg: 'Enter valid Email address!',
    },
    altEmailLabels: {
      emailPlaceholder: 'Email Id (optional)',
      invalidEmailMsg: 'Enter valid Email address!',
    },
    altContactLabels: {
      addAltContactLabel: 'ADD ANOTHER CONTACT',
      removeAltContactLabel: 'REMOVE CONTACT',
      altContactHeading:
        'Booking details and trip updates will be sent to this contact as well.',
      invalidAltPhoneMsg: 'Please enter another mobile number than above.',
    },
    removeContactModalLabels: {
      removeContactModalHeading: 'Are you sure you want to remove contact?',
      removeContactModalSubHeading:
        'Please confirm if you want to remove the contact.',
      dismissButtonLabel: 'Dismiss',
      removeButtonLabel: 'Remove',
    },
  },
  MedicalBannerContent:
    'Note: Please carry the original certificate bearing the number mentioned above which is mandatory to show at the time of check-in. Passengers who fail to provide the same will be denied boarding.'
    + '*A valid Medical Council of India (MCI) or State Medical Council registration number for Doctors'
    + '*A valid Indian Nursing Council (INC) registration number or Degree or Diploma certificate number for nurses.',
  UnaccompaniedMinorBannerContent: `Note:
  In case an unaccompanied minor customer is traveling with IndiGo, 4 copies of the Unaccompanied Minor form must be completed by the parent/guardian.`,
  specialAssistanceLabels: {
    sidebarHeading: 'Wheelchair',
    sidebarSubheading: 'Ensuring a ',
    sidebarSubheadingGreen: 'Seamless Journey',
    specialAssistance: 'Special Assistance',
    selectOptionForSpecialAssistance:
      'Please select option for special assistance',
    specialAssistanceOptions: {
      speechImpaired: 'Speech Impaired',
      visuallyImpaired: 'Visually Impaired',
      hearingImpaired: 'Hearing Impaired',
      personWithIntellectualOrDevelopmentDisabilityNeedingAssistance:
        'Person with intellectual or development disability needing assistance',
      electronicWheelchairPersonalWheelchairUser:
        'Electronic wheelchair/personal wheelchair user',
      wheelchair: 'Wheelchair',
    },
    edit: 'Edit',
  },
  wheelchairAssistanceDetails: {
    label: 'Wheelchair Assistance',
    selectYourJourneyLabel: 'Please select journey',
    allLabel: 'All',
    selectReasonRequestLabel: 'Please select the reason for wheelchair request',
    wheelChairReason: {
      medicalReasonTitle: 'Medical Reasons',
      selectCategory: 'Select Category',
      selectSubCategory: 'Select Sub-category',
      anySpecialRequests: 'Any Special Request',
      medicalReason: [
        {
          categoryName: 'Cardiovascular And Other Circulatory Disorders',
          subCategoryName: [
            'Myocardial Infraction/Heart Attack',
            'Cardiac Failure',
            'Cardiac Surgery(Heart, Lungs)',
            'Angina',
            'Angiography (Heart – Coronary Artery X Rays)',
            'Angioplasty',
            'Heart Transplant',
            'Pacemaker or Defibrillator Implantation',
          ],
        },
        {
          categoryName: 'Blood Disorder',
          subCategoryName: ['Anaemia', 'Sickle Cell Disease'],
        },
        {
          categoryName: 'Communicable/Infectious  Disease',
          subCategoryName: [
            'Chicken Pox',
            'Measles',
            'Mumps',
            'Rubella',
            'H1N1/Swine Flu',
          ],
        },
        {
          categoryName: 'Gastro Intestinal',
          subCategoryName: [
            'Major Abdominal Surgery',
            'Kidney Surgery',
            'Abdominal Operations Like Appendix',
            'Appendectomy /Laparoscopic Surgery(KEYHOLE)',
            'Investigative Laparoscopy',
            'Liver/Kidney Transplant',
          ],
        },
        {
          categoryName: 'Respiratory Disorders',
          subCategoryName: [
            'Pneumothorax(Air in the cavity around a lung due to puncture wound or spontaneous)',
            'Chest Surgery',
            'Pneumonia',
            'Tuberculosis',
            'Respiratory Disease Asthma Or Chronic Lung Disease',
            'Cancer Patients',
            'Bronchiectasis',
            'Neuromuscular Disease',
          ],
        },
        {
          categoryName: 'Central Nervous System',
          subCategoryName: [
            'Stroke',
            'Cranial Surgery Neuro Surgery',
            'Spinal Surgeries',
          ],
        },
        {
          categoryName: 'Psychiatric Illness/Development Disability',
          subCategoryName: [
            'Acute And Chronic Psychiatric Or Emotional  Or Mental Disorders Or Epilepsy',
            'Intellectual Or Developmental Disability (Autism or Celebral Palsy)',
          ],
        },
        {
          categoryName: 'Ent Disorder (Ear, Nose And Throat)',
          subCategoryName: [
            'Otitis Media And Sinusitis',
            'Middle Ear Surgery',
            'Tonsillectomy',
          ],
        },
        {
          categoryName: 'Eyes Disorders',
          subCategoryName: [
            'Penetrating Eye Injury',
            'Intra-Ocular Surgery',
            'Cataract Surgery',
            'Corneal Laser Surgery',
          ],
        },
        {
          categoryName: 'Pregnancy',
          subCategoryName: [
            'Miscarriage(Threatened Or Complete)',
            'Single Uncomplicated Pregnancy',
            'Multiple/Complicated Pregnancy',
          ],
        },
        { categoryName: 'Infants', subCategoryName: ['Infants'] },
        {
          categoryName: 'Trauma',
          subCategoryName: ['Full Plaster', 'Burns'],
        },
        {
          categoryName: 'Miscellaneous',
          subCategoryName: [
            'Jaundice',
            'Arthritis',
            'High Blood Pressure',
            'Artificial Limbs',
            'Diabetic',
            'Visual Impairment',
            'Hearing Impairment',
            'Speech Or Language Impairment',
            'Visual, Hearing And Speech Impairment',
            'Hearing And Speech Impairment',
            'Polio',
          ],
        },
      ],
      seniorCitizensTitle: 'Senior Citizens',
      wheelchairUserTitle: 'Wheelchair User',
      wheelChairUserCategoryList: ['Paraplegic', 'Hemiplegic', 'Quadraplegic'],
      othersTitle: 'Others',
      othersDescription: 'Request Call Back for special assistance:',
      othersDetails: [
        { title: '+91', requiredFieldMessage: 'Enter country code' },
        {
          title: 'Type here... (Optional)',
          requiredFieldMessage: null,
        },
        {
          title: 'How may we assist you at the airport?',
          requiredFieldMessage: 'This field is required',
        },
      ],
    },
    wheelchairInfo: {
      html: '<p>Note:</p>\n<p>A wheel chair user travelling alone should be able to carry out the following safety procedures unaided.</p>\n',
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Note:' }],
        },
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value:
                'A wheel chair user travelling alone should be able to carry out the following safety procedures unaided.',
            },
          ],
        },
      ],
    },
    wheelchairInfoSubNote: {
      html: '<p>*this does not necessarily need to be by walking</p>\n',
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: '*this does not necessarily need to be by walking',
            },
          ],
        },
      ],
    },
    termsAndConditions: {
      html: '<p>I agree with the terms &amp; conditions.</p>\n',
      json: [
        {
          nodeType: 'paragraph',
          content: [
            {
              nodeType: 'text',
              value: 'I agree with the terms & conditions.',
            },
          ],
        },
      ],
    },
    wheelchairInfoList: [
      {
        note: 'Fasten &unfastenseat belt',
        image: {
          _path:
            '/content/dam/s6app/in/en/assets/wheel-chair-info-icons/seat-belt.png',
        },
      },
      {
        note: 'Take out &put on thelife jacket',
        image: {
          _path:
            '/content/dam/s6app/in/en/assets/wheel-chair-info-icons/life-jacket.png',
        },
      },
      {
        note: 'Leave their seats and reach emergency exits*',
        image: {
          _path:
            '/content/dam/s6app/in/en/assets/wheel-chair-info-icons/emergency-exit.png',
        },
      },
    ],
  },
};

export default aemdataprops;
