/* eslint-disable max-len */
/* eslint-disable sonarjs/no-duplicate-string */
const configJson = {
  data: {
    component: 'mf-addon',
    mfId: 'mf-addon',
    mfData: {
      placeholder: '',
      stepLabel: 'Step',
      addonstitle: '6E ADD-ONS',
      changeLabel: 'Change',
      noserviceaddedlabel: 'No Service',
      serviceSuccessfullyAddedPopupLabel: 'Successfully added',
      addAddonCtaLabel: 'Add',
      addonAddedCtaLabel: 'Added',
      removeAddonCtaLabel: 'Remove',
      includedLabel: 'Included',
      doneCtaLabel: 'Done',
      clearAllLabel: 'Clear All',
      selectAllPassengersLabel: 'Select All Passengers',
      readMoreLabel: 'Read More',
      readLessLabel: 'Read Less',
      selectOnBoardHeading: 'Select On Board Heading',
      selectOnBoardLabel: 'Select On Board',
      continueCtaLabel: 'Continue to Seat Select',
      continueToPaymentCtaLabel: 'Continue to Payment',
      modificationContinueCtaLabel: 'Continue',
      modificationContinueCtaPath: '/content/skyplus6e/in/en/bookings/itinerary.html',
      seatSelectionContinueCtaPath: '/content/skyplus6e/in/en/bookings/seat-selection-modification.html',
      checkinContinueCtaLabel: 'Continue',
      domesticCheckinContinueCtaPath: '/content/skyplus6e/in/en/check-ins/dangerous-goods.html',
      internationalCheckinContinueCtaPath: '/content/skyplus6e/in/en/check-ins/passport-visa-details.html',
      noAddonFoundLabel: 'No Add-ons are available for the selected flight.',
      noAddonFoundImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/No-Add-ons.png',
      includedWithFareLabel: 'Included with {} fare',
      seatAndEatBundleLabel: '6E Seat & Eat',
      primeBundleLabel: '6E Prime',
      includedAsPartOfBundleLabel: 'Included as part of {}',
      categoriesList: [
        {
          categorybundlecode: '6EBar',
          categoryTitle: 'One for the skies',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/6E-bar.jpg',
          categoryDescription: '<p>Now pre-book your favourite alcoholic beverage.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'PRIM',
          categoryTitle: '6E Prime',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/6E-Prime.jpg',
          categoryDescription: '<p>Get a seat, snack combo, priority check-in and baggage handling services.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          categoriesInformationCf: {
            servicesInformation: [
              {
                key: '6E Eats (Snack and Beverage *)',
                value: 'Pre-book & enjoy your favourite snack combo on-board.',
                description: '',
              },
              {
                key: 'Fast Forward',
                value: 'Get priority check-in & baggage handling services to save time.',
                description: '',
              },
              {
                key: 'Seat',
                value: 'Choose a window, middle or aisle seat.',
                description: '',
              },
            ],
            pricePerPassengerLabel: 'per passenger per segment',
          },
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'PRBG',
          categoryTitle: '6E QuickBoard',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/6E-Quickboard.jpg',
          categoryDescription: '<p>Board anytime without waiting in a queue</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'MLST',
          categoryTitle: '6E Seat & Eat',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/6E-Seat-and-Eat.jpg',
          categoryDescription: '<p>Pick a seat and snack combo for your next flight.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'Goodnight',
          categoryTitle: 'Blanket, Pillow & Eye shade',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Sleeping-Kit.jpg',
          categoryDescription: '<p>Get a blanket, pillow, eyeshade, and dental kit when flying international.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '<p>Get a cosy blanket, neck pillow, eye mask and dental kit.</p>\n',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'BRB',
          categoryTitle: 'Delayed and Lost Baggage Protection',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Lost-and-Delayed-baggage.jpg',
          categoryDescription: '<p>Get compensated for delayed or lost check-in baggage. Powered by Blue Ribbon Bags.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'true',
          upsellInformation: {
            placeholder: '',
            disablePopUp: '',
            popupId: '',
            heading: 'Delayed & Lost Baggage Protection',
            description: '<p>Only @ {} per passenger per booking</p>\n',
            ctaLabel: 'Yes, I wish to secure my bags',
            ctaPath: '',
            secondaryCtaLabel: "I'm not Interested",
            secondaryCtaPath: '',
            highlightLabel: 'Recommended',
            idPlaceholderLabel: '',
            checkboxContentLabels: [],
            multilineLabels: [
              '<p>Compensation up to {}</p>\n',
              '<p>Per passenger per baggage (up to 2 checked pieces)</p>\n',
              '<p>Powered by Blue Ribbon Bags</p>\n',
            ],
            tncLabel: '<p>Helps you in case your baggage is delayed or declared lost within 96 hr from arrival.</p>\n<p><a href="https://www.blueribbonbags.com/ServiceAgreement?d=nwb078RD01A%2flMA%2f23Hj4SzhzJRrN85AFmPjeeleyUk%3d" target="_blank">T&amp;C apply</a>.</p>\n',
            additionalLabel: '',
            additionalLabelPlaceholder: '',
            image: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Blue-ribbon-bag.png',
          },
        },
        {
          categorybundlecode: 'baggage',
          categoryTitle: 'Excess Baggage',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Excess-Baggage.jpg',
          categoryDescription: '<p>Save up to 20% when you pre-book excess baggage.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'FFWD',
          categoryTitle: 'Fast Forward',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Fast-Forward.jpg',
          categoryDescription: '<p>Get priority check-in &amp; baggage handling services to save time.</p>\n',
          categoryDetails: '<p>Group Offer {} Per Person<br>\n</p>\n',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'SPEQ',
          categoryTitle: 'Sports Equipment',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Sports-Kit.jpg',
          categoryDescription: '<p>Pre-book your sports equipment for a hassle-free journey.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'PROT',
          categoryTitle: 'Travel Assistance',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Travel-Assistance.jpg',
          categoryDescription: '<p>Get travel &amp; medical insurance along with roadside assistance.&nbsp;Powered by Segura Services Pvt. Ltd.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '<p><b>Disclaimer</b>:&nbsp;“Segura Services Pvt Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Travel Insurance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – ICICI Lombard General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.”</p>\n',
          placeholder: '',
          isUpsellCategory: 'false',
          upsellInformation: {
            placeholder: '',
            disablePopUp: '',
            popupId: '',
            heading: 'Secure your trip',
            description: '<p>Travel Assistance Domestic Plan @ {} per passenger</p>\n',
            ctaLabel: 'Continue',
            ctaPath: '',
            secondaryCtaLabel: '',
            secondaryCtaPath: '',
            highlightLabel: 'Recommended',
            idPlaceholderLabel: '',
            checkboxContentLabels: [
              '<p>Yes, | wish to secure my trip.</p>\n',
              '<p>No, | don’t wish to secure my trip.</p>\n',
            ],
            multilineLabels: [
              '<p>Domestic Roadside Assistance</p>\n',
              '<p>Domestic Medical Assistance</p>\n',
              '<p>Lifestyle Assistance</p>\n',
              '<p>Complimentary travel insurance will be provided by Cover-More India(underwritten by Bharti AXA General Insurance Co. Ltd). Click here to view complimentary travel insurance details</p>\n',
            ],
            tncLabel: '',
            additionalLabel: '',
            additionalLabelPlaceholder: '',
            image: '',
          },
        },
        {
          categorybundlecode: 'IFNR',
          categoryTitle: 'Cancellation Insurance',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/cancellation-Assistance.jpg',
          categoryDescription: '<ul>\n<li>Lifestyle Assistance</li>\n<li>Cancellation Assistance</li>\n<li>Complimentary Trip Cancellation Insurance</li>\n</ul>\n',
          categoryDetails: '<p>By Karvat Cover-More Assist Pvt Ltd (underwritten by Liberty General Insurance Co. Ltd).&nbsp;<a href="https://email.trawelltagindia.com/ftpdata/ftpmanager/Cancellation_Protection_Product_Details.pdf">Click Here</a>&nbsp;to view complimentary trip cancellation insurance details</p>\n',
          categoryInformationRte: '<p>Disclaimer:&nbsp;Segura Services Pvt. Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Cancellation Insurance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – Liberty General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.</p>\n',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'Lounge',
          categoryTitle: 'Lounge',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Lounge.jpg',
          categoryDescription: '<p>Relax and unwind at our partner lounges.&nbsp;</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
        {
          categorybundlecode: 'Meal',
          categoryTitle: '6E Eats',
          categoryImage: '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/6etiffin.jpg',
          categoryDescription: '<p>Pre-book your favourite meal from our exclusive menu.</p>\n',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
          addonRemovePopup: {
            placeholder: '',
            disablePopUp: '',
            popupId: '',
            heading: 'Remove 6E Eats Service',
            description: '<p>Select the fight below from which you want to remove the 6E Eats Service<br>\n</p>\n',
            ctaLabel: 'Remove',
            ctaPath: '',
            secondaryCtaLabel: 'Cancel',
            secondaryCtaPath: '',
            highlightLabel: 'For {}',
            idPlaceholderLabel: '',
            checkboxContentLabels: [],
            multilineLabels: [
              '',
            ],
            tncLabel: '',
            additionalLabel: '',
            additionalLabelPlaceholder: '',
            image: '',
          },
        },
        {
          categorybundlecode: 'ABHF',
          categoryTitle: 'Additional Baggage',
          categoryImage: '',
          categoryDescription: '',
          categoryDetails: '',
          categoryInformationRte: '',
          placeholder: '',
          isUpsellCategory: 'false',
        },
      ],
      selectIncludedSsrInFareDescription: '<p>Information</p>\n<p>Your meal is included with {} Fare, kindly select your preferred meal option.</p>\n',
      keyValues: {
        ADT: 'Adult',
        SRCT: 'Senior Citizen',
        CHD: 'Children',
        INFT: 'Infant',
      },
      fareTypesConfiguration: {
        fareTypesList: [
          {
            productClass: 'R',
            fareBadge: 'SAVER FARE',
            fareLabel: 'Saver',
            farePriceLabel: 'Regular Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 2750',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'INR 4500',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 3000',
            internationalCancellationCharges1: 'INR 6500',
            internationalCancellationCharges2: 'INR 6000',
          },
          {
            productClass: 'J',
            fareBadge: 'FLEXI PLUS FARE',
            fareLabel: 'Flexi Plus',
            farePriceLabel: 'Flexible Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG) +\nFree meal + Free seat and more...',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'NIL',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'NIL',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 500',
            internationalCancellationCharges1: 'INR 6000',
            internationalCancellationCharges2: 'INR 1000',
          },
          {
            productClass: 'M',
            fareBadge: 'CORP CONNECT FARE',
            fareLabel: 'Corp Connect',
            farePriceLabel: 'Corp connect Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG) + Free seat and more...',
            domesticChangeCharges1: 'INR 249',
            domesticChangeCharges2: 'INR 499',
            internationalChangeCharges1: 'INR 499',
            internationalChangeCharges2: 'INR 999',
            domesticCancellationCharges1: 'INR 499',
            domesticCancellationCharges2: 'INR 999',
            internationalCancellationCharges1: 'INR 999',
            internationalCancellationCharges2: 'INR 1999',
          },
          {
            productClass: 'F',
            fareBadge: 'CORPORATE FARE',
            fareLabel: 'Corporate',
            farePriceLabel: 'Corporate Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG) + Standard seat + Meal + Low Cancellation fee + No Change fee (Till 4days before departure)',
            domesticChangeCharges1: 'No Fees',
            domesticChangeCharges2: 'INR 499',
            internationalChangeCharges1: 'No Fees',
            internationalChangeCharges2: 'INR 2000',
            domesticCancellationCharges1: 'No Fees',
            domesticCancellationCharges2: 'INR 2000',
            internationalCancellationCharges1: 'No Fees',
            internationalCancellationCharges2: 'INR 5000',
          },
          {
            productClass: 'B',
            fareBadge: 'ZERO BAG FARE',
            fareLabel: 'ZERO BAG FARE',
            farePriceLabel: 'ZERO BAG FARE',
            fareDescription: 'Hand baggage only ({handBaggageValue}Kg)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 2750',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'INR 4500',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 3000',
            internationalCancellationCharges1: 'INR 6500',
            internationalCancellationCharges2: 'INR 6000',
          },
          {
            productClass: 'C',
            fareBadge: 'PROMOTIONAL FARE',
            fareLabel: 'Promo',
            farePriceLabel: 'Promotional Fare',
            fareDescription: 'Hand baagage({handBaggageValue}Kg) + Check-in bag ({checkInBaggageValue}KG) + Standard seat + Meal + Low Cancellation feee + No Change fee (Till 4days before departure)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 499',
            internationalChangeCharges1: 'No Fees',
            internationalChangeCharges2: 'INR 1499',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 500',
            internationalCancellationCharges1: 'No Fees',
            internationalCancellationCharges2: 'INR 2999',
          },
          {
            productClass: 'O',
            fareBadge: 'SUPER 6E FARE',
            fareLabel: 'Super 6E',
            farePriceLabel: 'Super 6E Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)\nFree meal, Free seat, Fast forward, Airport services, Travel protection and more...\n',
            domesticChangeCharges1: 'INR 500',
            domesticChangeCharges2: 'No Fees',
            internationalChangeCharges1: 'INR 900',
            internationalChangeCharges2: 'INR 500',
            domesticCancellationCharges1: 'INR 500',
            domesticCancellationCharges2: 'No Fees',
            internationalCancellationCharges1: 'INR 1500',
            internationalCancellationCharges2: 'No Fees',
          },
          {
            productClass: 'T',
            fareBadge: 'TACTICAL FARE',
            fareLabel: 'Tactical',
            farePriceLabel: 'Promotion Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)',
            domesticChangeCharges1: 'No Fees',
            domesticChangeCharges2: 'INR 499',
            internationalChangeCharges1: 'No Fees',
            internationalChangeCharges2: 'INR 1499',
            domesticCancellationCharges1: 'No Fees',
            domesticCancellationCharges2: 'INR 2000',
            internationalCancellationCharges1: 'No Fees',
            internationalCancellationCharges2: 'INR 4000',
          },
          {
            productClass: 'N',
            fareBadge: 'SAVER FARE',
            fareLabel: 'Saver',
            farePriceLabel: 'Return fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 2750',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'INR 4500',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 3000',
            internationalCancellationCharges1: 'INR 6500',
            internationalCancellationCharges2: 'INR 6000',
          },
          {
            productClass: 'A',
            fareBadge: 'SAVER FARE',
            fareLabel: 'Saver',
            farePriceLabel: 'Family Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 2750',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'INR 4500',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 3000',
            internationalCancellationCharges1: 'INR 6500',
            internationalCancellationCharges2: 'INR 6000',
          },
          {
            productClass: 'S',
            fareBadge: 'SALE FARE',
            fareLabel: 'Saver',
            farePriceLabel: 'Sale Fare',
            fareDescription: 'Hand baggage ({handBaggageValue}Kg) +  Check-In baggage ({checkInBaggageValue}KG)',
            domesticChangeCharges1: 'INR 3250',
            domesticChangeCharges2: 'INR 2750',
            internationalChangeCharges1: 'INR 5000',
            internationalChangeCharges2: 'INR 4500',
            domesticCancellationCharges1: 'INR 3500',
            domesticCancellationCharges2: 'INR 3000',
            internationalCancellationCharges1: 'INR 6500',
            internationalCancellationCharges2: 'INR 6000',
          },
        ],
      },
    },
    persona: 'member',
    configJson: {
      data: {
        mainAddonsAdditionalList: {
          items: [
            {
              sliderConfiguration: [
                {
                  categoryBundleCode: '6EBar',
                  sliderTitle: 'One for the skies',
                  sliderDescription: {
                    html: '<p>Please select the preferred drink for {}</p>\n',
                  },
                  doneCtaLabel: 'Done',
                  ssrList: [
                    {
                      ssrCode: 'BEER',
                      ssrName: null,
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'RDWI',
                      ssrName: null,
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'VDKA',
                      ssrName: null,
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'WHSK',
                      ssrName: null,
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'WHWI',
                      ssrName: null,
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                  ],
                  termsAndConditions: {
                    html: '<ul>\n<li>The brand will be served is subject to availability.</li>\n<li>IndiGo reserves the right to deny alcohol to any guest affected by it to the extent of losing control of one\'s faculties or behaviour.</li>\n<li>Consumption of duty-free liquor in the aircraft is strictly prohibited.</li>\n<li>Duty-free liquor will be handed just before landing.</li>\n<li>For detailed terms and conditions&nbsp;<a href="/content/indigo/in/en/add-on-services/6e-bar.html" target="_blank">click here</a>.</li>\n</ul>\n',
                  },
                },
                {
                  categoryBundleCode: 'PRIM',
                  sliderTitle: '6E Prime',
                  sliderDescription: {
                    html: '<p>Get a seat, snack combo, priority check-in, and anytime boarding.</p>\n<p>Premium (XL) seats can be selected at attractive discounted rates</p>\n',
                  },
                  banner: {
                    servicesInformation: [
                      {
                        key: '6E Tiffin (Snack and Beverage *)',
                        value:
                          'Pre-book & enjoy your favourite snack combo on-board.',
                      },
                      {
                        key: 'Fast Forward',
                        value: 'Priority check-in and anytime boarding',
                      },
                      {
                        key: 'Seat',
                        value: 'Choose a window, middle or aisle seat.',
                      },
                    ],
                    pricePerPassengerLabel: 'per passenger per segment',
                  },
                  indigoLogo: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/icIndigoLogoBlueR-new.png',
                  },
                  upgradedToBundleLabel: 'You have upgraded to 6E Prime.',
                  pleaseSelectIncludedSsrLabel:
                    'Please select your 6E Eats meals.',
                  selectMealLabel: 'Select Meal',
                  complimentaryLabel: 'Complimentary',
                  pleaseSelectIncludedSsrDescription: {
                    html: '<p>Information</p>\n<p>By selecting 6E Prime, you are entitled to choose a snack combo, please make your selection to proceed.</p>\n',
                  },
                },
                {
                  categoryBundleCode: 'PRBG',
                  sliderTitle: '6E QuickBoard',
                  sliderDescription: {
                    html: null,
                  },
                  banner: {
                    html: '<p>6E QuickBoard add-on will be selected for all passengers.</p>\n<p>{}&nbsp;per passenger per journey</p>\n',
                  },
                  benefits: {
                    html: '<h2>Benefits</h2>\n<p><span class="icon-tick-green"></span>Skip the long queue at the boarding gate and travel hassle-free.</p>\n<p><span class="icon-tick-green"></span>Be among the first to board the flight.</p>\n',
                  },
                },
                {
                  categoryBundleCode: 'MLST',
                  sliderTitle: '6E Seat & Eat',
                  sliderDescription: {
                    html: '<p>Get 6E Eats(Snacks) + Free standard seat.</p>\n',
                  },
                  banner: {
                    servicesInformation: [
                      {
                        key: '6E Tiffin (Snack and Beverage *)',
                        value:
                          'Pre-book & enjoy your favourite snack combo on-board.',
                      },
                      {
                        key: 'Seat',
                        value: 'Choose a window, middle or aisle seat.',
                      },
                    ],
                    pricePerPassengerLabel: 'per passenger per segment',
                  },
                  indigoLogo: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/icIndigoLogoBlueR-new.png',
                  },
                  upgradedToBundleLabel: 'You have upgraded to 6E Seat & Eat.',
                  pleaseSelectIncludedSsrLabel:
                    'Please select your 6E Eats meals.',
                  selectMealLabel: 'Select Meal',
                  complimentaryLabel: 'Complimentary',
                  pleaseSelectIncludedSsrDescription: {
                    html: '<p>Information</p>\n<p>By selecting 6E Seat &amp; Eat, you are entitled to choose a snack combo, please make your selection to proceed.</p>\n',
                  },
                },
                {
                  categoryBundleCode: 'Meal',
                  sliderTitle: '6E Eats (Snack and Beverage *)',
                  sliderDescription: {
                    html: '<p>Now, add up to {mealLimit} meals per passenger per sector, with {fareType} Fare</p>\n',
                  },
                  veg: 'Veg',
                  nonVeg: 'Non Veg',
                  filterLabel: 'Filter',
                  filtersSliderLabel: 'Filters',
                  cuisinesLabel: 'Cuisines',
                  foodPreferencesLabel: 'Food Preferences',
                  continueCtaLabel: 'Continue',
                  menuLabel: 'MENU',
                  resetCtaLabel: 'Reset',
                  applyCtaLabel: 'Apply',
                  nutritionalFactsLabel:
                    'Nutritional facts (Approximate values)',
                  rdaValueLabel: '% RDA value',
                  searchResultsLabel: 'Search Results',
                  comboAlertMessage:
                    'All combos include one meal and one beverage.',
                  noMatchFoundImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                  },
                  noMatchFoundLabel: 'No match found.',
                  selectMealLabel: 'Select Meal',
                  addAddonCtaLabel: 'Add',
                  addonAddedCtaLabel: 'Added',
                  removeAddonCtaLabel: 'Remove',
                  itemLabel: 'Item',
                  backToPrimeLabel: 'Back to prime ',
                  backToMlstLabel: 'Back to MLST',
                  mealList: [
                    {
                      ssrCode: 'TCSW',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['IndiGo Classics'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>A classic combination of cheese, cucumbers, and tomatoes, topped with mayonnaise on white, or brown bread.&nbsp; &nbsp;(No onion, or garlic. Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|322kcal|16.10%',
                        'Protein|13.2g|26.40%',
                        'Total Carbohydrates|37.5g|13.62%',
                        'Total sugar|8.5g|17.08%',
                        'Total Fat|13.2g|16.97%',
                        'Saturated Fat|7.2g|35.80%',
                        'Monounsaturated Fatty Acids|3.1g|..',
                        'Polyunsaturated Fatty Acids|3.0g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|932.2mg|40.53%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 200g (dry wt)',
                    },
                    {
                      ssrCode: 'CJSW',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['IndiGo Classics'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Chicken_Junglee_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Chicken_Junglee_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>Roast chicken, shredded and seasoned with fresh herbs, topped with mayonnaise and served on marble bread.&nbsp; (Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|436kcal|22.00%',
                        'Protein|23.8g|48.00%',
                        'Total Carbohydrates|51.9g|19.00%',
                        'Total sugar|0g|0.00%',
                        'Total Fat|14.8g|19.00%',
                        'Saturated Fat|2.9g|14.00%',
                        'Monounsaturated Fatty Acids|4.2g|..',
                        'Polyunsaturated Fatty Acids|7.8g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|845.8mg|37.00%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 200g (dry wt)',
                    },
                    {
                      ssrCode: 'VCSW',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['6E Choice of the day'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - veg SW.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - veg SW.png',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'NUSW',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['6E Choice of the day'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - Non-veg SW.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - Non-veg SW.png',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'AGSW',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['#IndiaByIndiGo'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2023/AGSW-Meal.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2023/AGSW-Meal.jpg',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'UPMA',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Ready-to-eat'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Rava_Upma.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Rava_Upma.jpg',
                      },
                      mealDescription: {
                        html: '<p>A wholesome bowl of semolina pilaf made with ginger, chillies, curry leaves, and cashew nuts.</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|364kcal|18%',
                        'Protein|9.2g|..',
                        'Total Carbohydrate|56.2g|20%*',
                        'Total Sugar|1.8g|..',
                        'Added Sugar|0g|0%',
                        'Dietary Fiber|6.3g|23%*',
                        'Total Fat|11.4g|17%',
                        'Saturated Fat|5.4g|25%',
                        'Trans Fat|0g|0%',
                        'Cholesterol|2.9mg|1%*',
                        'Sodium|1094mg|55%',
                        'Calcium 39.8mg|3%*|..',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Dry Weight 88g',
                    },
                    {
                      ssrCode: 'JNML',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - veg SW.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/6E Choice - veg SW.png',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'DBVG',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal- Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal- Veg.png',
                      },
                      mealDescription: {
                        html: '<p>Vegetable salad loaded with paneer cubes marinated in spices, served with a side of mint chutney and a multigrain bread roll.&nbsp; (Contains milk).&nbsp;Flour, edible vegetable oil, milk solids, yeast, salt and class II preservative</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|231.7kcal|11.59%',
                        'Protein|13.4g|26.75%',
                        'Total Carbohydrates|5.6g|2.04%',
                        'Total sugar|1.5g|3.05%',
                        'Total Fat|17.3g|22.19%',
                        'Saturated Fat|12.0g|59.84%',
                        'Monounsaturated Fatty Acids|4.1g|..',
                        'Polyunsaturated Fatty Acids|1.3g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|349.4mg|15.19%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 128g (dry wt)',
                    },
                    {
                      ssrCode: 'LCVG',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal- Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Paneer_Bhatti_Salad_with_Mint_Chutney.jpg',
                      },
                      mealDescription: {
                        html: '<p>Vegetable salad loaded with paneer cubes marinated in spices, served with a side of mint chutney and a multigrain bread roll.&nbsp; (Contains milk)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|231.7kcal|11.59%',
                        'Protein|13.4g|26.75%',
                        'Total Carbohydrates|5.6g|2.04%',
                        'Total sugar|1.5g|3.05%',
                        'Total Fat|17.3g|22.19%',
                        'Saturated Fat|12.0g|59.84%',
                        'Monounsaturated Fatty Acids|4.1g|..',
                        'Polyunsaturated Fatty Acids|1.3g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|349.4mg|15.19%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 128g (dry wt)',
                    },
                    {
                      ssrCode: 'VLML',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/vlml.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/vlml.png',
                      },
                      mealDescription: {
                        html: '<p>Paneer marinated in tikka masala, seasoned with peri peri, and served with lettuce and fresh mint on marble bread.&nbsp; (Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|539.3kcal|27.00%',
                        'Protein|19.2g|38.00%',
                        'Total Carbohydrates|66.6g|24.00%',
                        'Total sugar|0g|0.00%',
                        'Total Fat|21.8g|28.00%',
                        'Saturated Fat|10.0g|50.00%',
                        'Monounsaturated Fatty Acids|5.0g|..',
                        'Polyunsaturated Fatty Acids|6.8g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|1044.5mg|45.00%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 128g (dry wt)',
                    },
                    {
                      ssrCode: 'VGAN',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal- Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Two_Dips_with_Baked_Pita.jpg',
                      },
                      mealDescription: {
                        html: '<p>A combination of muhammera dip and hummus, served with pita bread. (Contains refined flour. This is a strictly vegetarian, non-dairy meal).</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|350.1kcal|17.51%',
                        'Protein|10.2g|20.30%',
                        'Total Carbohydrates|52.1g|18.94%',
                        'Total sugar|4.9g|9.72%',
                        'Total Fat|11.2g|14.40%',
                        'Saturated Fat|2.3g|11.34%',
                        'Monounsaturated Fatty Acids|3.5g|..',
                        'Polyunsaturated Fatty Acids|5.5g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|666.5mg|28.98%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 180g (dry wt)',
                    },
                    {
                      ssrCode: 'CHVM',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal- Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Kiddie_Delight_Veg.jpg',
                      },
                      mealDescription: {
                        html: '<p>An assortment of cheese, Nutella and jam sandwiches, along with crispy potato smiles, and a chocolate cookie. (Contains milk, refined flour and nuts)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|348.8kcal|17.44%',
                        'Protein|5.5g|11.07%',
                        'Total Carbohydrates|50g|18.19%',
                        'Total sugar|19g|37.93%',
                        'Total Fat|14.10g|18.02%',
                        'Saturated Fat|5.5g|27.50%',
                        'Monounsaturated Fatty Acids|4.2g|..',
                        'Polyunsaturated Fatty Acids|4.3g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|428.0mg|18.61%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 110g (Dry wt)',
                    },
                    {
                      ssrCode: 'GFNV',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDescription: {
                        html: '<p>Tandoori chicken chunks mixed with fresh vegetables and herbs, served with mango chutney. (Contains milk)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|164.73kcal|8.24%',
                        'Protein|25.2g|50.49%',
                        'Total Carbohydrates|8.9g|3.24%',
                        'Total sugar|0g|0',
                        'Total Fat|3.1g|4.00%',
                        'Saturated Fat|0.8g|4.20%',
                        'Monounsaturated Fatty Acids|1.4g|..',
                        'Polyunsaturated Fatty Acids|0.9g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|363.45mg|18.80%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 150g (dry wt)',
                    },
                    {
                      ssrCode: 'DBNV',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDescription: {
                        html: '<p>Tandoori chicken chunks mixed with fresh vegetables and herbs, served with mango chutney. (Contains milk)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|164.73kcal|8.24%',
                        'Protein|25.2g|50.49%',
                        'Total Carbohydrates|8.9g|3.24%',
                        'Total sugar|0g|0',
                        'Total Fat|3.1g|4.00%',
                        'Saturated Fat|0.8g|4.20%',
                        'Monounsaturated Fatty Acids|1.4g|..',
                        'Polyunsaturated Fatty Acids|0.9g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|363.45mg|18.80%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 150g (dry wt)',
                    },
                    {
                      ssrCode: 'CHNM',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Special dietary meal'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Special Meal - Non Veg.png',
                      },
                      mealDescription: {
                        html: '<p>An assortment of cheese, Nutella and chicken Junglee sandwiches, along with potato smiles, and a chocolate cookie. (Contains milk, refined flour and nuts)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|339.7kcal|16.99%',
                        'Protein|6.1g|12.17%',
                        'Total Carbohydrates|47.9g|17.43%',
                        'Total sugar|11.8g|23.52%',
                        'Total Fat|13.70g|17.61%',
                        'Saturated Fat|5.30g|26.46%',
                        'Monounsaturated Fatty Acids|4.2g|..',
                        'Polyunsaturated Fatty Acids|4.2g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|520.80mg|18.61%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 110g (Dry wt)',
                    },
                    {
                      ssrCode: 'CPML',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['6E Refreshments'],
                      dietaryPreference: null,
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2023/CPML-Meal.jpg',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'HMVJ',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'ECNG',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: '<p>Tomato Cheese Omelette, Veg Cutlet, Potato Wedges</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'HOVG',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: '<p>Poori with Aloo Rasmissa and Veg Cutlet</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'HMNI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Chicken_Tikka_Masala_with_Zafrani_Pulao_and_Urad_Dal.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Chicken_Tikka_Masala_with_Zafrani_Pulao_and_Urad_Dal.jpg',
                      },
                      mealDescription: {
                        html: '<p>Clay-oven roasted chicken cooked in a mildly spiced tomato gravy, served with aromatic saffron-flavoured rice and a side of black lentils</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|414.7Kcal/100g|20.74%',
                        'Protein|14.3g/100g|28.61%',
                        'Total Carbohydrates|41.1g/100g|14.93%',
                        'Fat|21.5g/100g|27.54%',
                        'Sodium (asNa)|1047.5mg/100g|45.54%',
                        'Saturated Fatty Acids|3.7g/100g|18.48%',
                        'Mono UnSaturated Fatty Acids|6.1g/100g',
                        'Poly UnSaturated Fatty Acids|11.7g/100g',
                        'Trans Fatty Acids|0|0.00%',
                        'Sugar|0g/100g|0.00%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 240g [Dry wt]',
                    },
                    {
                      ssrCode: 'HMVI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Shahi_Paneer_with_Basmati_Pulao_and_Aloo_Jeera.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Shahi_Paneer_with_Basmati_Pulao_and_Aloo_Jeera.jpg',
                      },
                      mealDescription: {
                        html: '<p>Fresh cottage cheese cubes cooked in an onion-tomato gravy, served with steamed basmati rice and a side of cumin-tempered savoury potatoes</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|340.4Kcal/100g|17.02%',
                        'Protein|9.7g/100g|19.36%',
                        'Total Carbohydrates|42.4g/100g|15.43%',
                        'Fat|14.7g/100g|18.79%',
                        'Sodium (asNa)|766.3mg/100g|33.32%',
                        'Saturated Fatty Acids|3.1g/100g|15.40%',
                        'Mono UnSaturated Fatty Acids|4.4g/100g',
                        'Poly UnSaturated Fatty Acids|7.1g/100g',
                        'Trans Fatty Acids|0g/100g|0.00%',
                        'Sugar|0g/100g|0.00%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 200g [Dry wt]',
                    },
                    {
                      ssrCode: 'HVGJ',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Hot Meals'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Moong_Dal_with_Basmati_Pulao_and_Vegetables.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2022/Moong_Dal_with_Basmati_Pulao_and_Vegetables.jpg',
                      },
                      mealDescription: {
                        html: '<p>Whole green lentils served with aromatic basmati rice, accompanied by a side of steamed and buttered broccoli and cherry tomatoes. This is a no-root vegetable preparation</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|325.8Kcal/100g|16.29%',
                        'Protein|10.3g/100g|20.55%',
                        'Total Carbohydrates|46.6g/100g|16.95%',
                        'Fat|10.9g/100g|13.97%',
                        'Sodium (asNa)|1096.3mg/100g|47.66%',
                        'Saturated Fatty Acids|1.6g/100g|8.00%',
                        'Mono UnSaturated Fatty Acids|3.4g/100g',
                        'Poly UnSaturated Fatty Acids|5.9g/100g',
                        'Trans Fatty Acids|0|0.00%',
                        'Sugar|0g/100g|0.00%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 250g [Dry wt]',
                    },
                    {
                      ssrCode: 'VSUI',
                      mealName: null,
                      mealCuisines: ['Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/Cucumber Tomato cheese and lettuce sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>A classic combination of cheese, cucumbers, and tomatoes, topped with mayonnaise on white, or brown bread.&nbsp; &nbsp;(No onion, or garlic. Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Protein|13.2g|26.40%',
                        'Total Carbohydrates|37.5g|13.62%',
                        'Total sugar|8.5g|17.08%',
                        'Total Fat|13.2g|16.97%',
                        'Saturated Fat|7.2g|35.80%',
                        'Monounsaturated Fatty Acids|3.1g|..',
                        'Polyunsaturated Fatty Acids|3.0g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|932.2mg|40.53%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 200g (dry wt)',
                    },
                    {
                      ssrCode: 'VGTI',
                      mealName: null,
                      mealCuisines: ['Indian', 'Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Veg_Trio_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Veg_Trio_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>Veg Junglee, Grilled Cottage Cheese, and Tomato Cucumber Cheese Lettuce sandwiches, all in one, served with dried apricots, prunes, cheese, and cherry tomatoes. (Contains Milk, Refined Flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|312.83kcal|15.64%',
                        'Protein|10.6g|21.11%',
                        'Total Carbohydrates|43.6g|15.86%',
                        'Total sugar|12.5g|25.09%',
                        'Total Fat|10.7g|13.68%',
                        'Saturated Fat|6.40g|31.78%',
                        'Monounsaturated Fatty Acids|1.9g|..',
                        'Polyunsaturated Fatty Acids|2.4g|..',
                        'Trans Fat|0g|0',
                        'Sodium|484.04mg|21.05%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 140g (dry wt)',
                    },
                    {
                      ssrCode: 'CHSI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/indigov2/6e-website/booking-flow/food-menu/2019/Chicken_Supreme_Salad.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/indigov2/6e-website/booking-flow/food-menu/2019/Chicken_Supreme_Salad.jpg',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'NVTI',
                      mealName: null,
                      mealCuisines: ['Indian', 'Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Non_Veg_Trio_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Non_Veg_Trio_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>An assortment of chicken Junglee, Chicken Tikka, and Chicken Haryali sandwiches, served with dried apricots, prunes, cheese, and cherry tomatoes.&nbsp; (Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|312.83kcal|15.64%',
                        'Protein|10.6g|21.11%',
                        'Total Carbohydrates|43.6g|15.86%',
                        'Total sugar|12.5g|25.09%',
                        'Total Fat|10.7g|13.68%',
                        'Saturated Fat|6.40g|31.78%',
                        'Monounsaturated Fatty Acids|1.9g|..',
                        'Polyunsaturated Fatty Acids|2.4g|..',
                        'Trans Fat|0g|0',
                        'Sodium|484.05mg|21.05%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 140g (dry wt)',
                    },
                    {
                      ssrCode: 'TCSI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>A classic combination of cheese, cucumbers, and tomatoes, topped with mayonnaise on white, or brown bread.&nbsp; &nbsp;(No onion, or garlic. Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'CHCI',
                      mealName: null,
                      mealCuisines: ['Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Chicken-cucumber-tomato-sandwich538-673-min.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Chicken-cucumber-tomato-sandwich502-612-min.jpg',
                      },
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'CHTS',
                      mealName: null,
                      mealCuisines: ['Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Tomato_Cucumber_Cheese_and_Lettuce_Sandwich.jpg',
                      },
                      mealDescription: {
                        html: '<p>A classic combination of cheese, cucumbers, and tomatoes, topped with mayonnaise on white, or brown bread.&nbsp; &nbsp;(No onion, or garlic. Contains milk and refined flour)</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|322kcal|16.10%',
                        'Protein|13.2g|26.40%',
                        'Total Carbohydrates|37.5g|13.62%',
                        'Total sugar|8.5g|17.08%',
                        'Total Fat|13.2g|16.97%',
                        'Saturated Fat|7.2g|35.80%',
                        'Monounsaturated Fatty Acids|3.1g|..',
                        'Polyunsaturated Fatty Acids|3.0g|..',
                        'Trans Fat|0g|0%',
                        'Sodium|932.2mg|40.53%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving size: 200g (dry wt)',
                    },
                    {
                      ssrCode: 'CHSC',
                      mealName: null,
                      mealCuisines: ['Continental'],
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/Smoken-Chicken-SW538-673-min.jpg',
                      },
                      mealDetailedImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/pdp/Smoken-Chicken-SW502-612-min.jpg',
                      },
                      mealDescription: {
                        html: '<p>White bread filling with Smoked chicken shaved with mayo Cucumber slice Green coral lettuce</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'APWR',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/food-menu/2019/APWR-Meal.jpg',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: null,
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: null,
                      nutritionalInfo: null,
                    },
                    {
                      ssrCode: 'TBNI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: '<p>Fresh&nbsp; cooked in an onion-tomato, served</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|312.83kcal|15.64%',
                        'Protein|10.6g|21.11%',
                        'Total Carbohydrates|43.6g|15.86%',
                        'Total sugar|12.5g|25.09%',
                        'Total Fat|10.7g|13.68%',
                        'Saturated Fat|6.40g|31.78%',
                        'Monounsaturated Fatty Acids|1.9g|..',
                        'Polyunsaturated Fatty Acids|2.4g|..',
                        'Trans Fat|0g|0',
                        'Sodium|484.04mg|21.05%',
                      ],
                      nutritionalInfo:
                        'Serving Per Container: 1|Serving Size: 140g [Dry wt]',
                    },
                    {
                      ssrCode: 'NBNI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: '<p>Fresh&nbsp; cooked in an onion-tomato, served</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|312.83kcal|15.64%',
                        'Protein|10.6g|21.11%',
                        'Total Carbohydrates|43.6g|15.86%',
                        'Total sugar|12.5g|25.09%',
                        'Total Fat|10.7g|13.68%',
                        'Saturated Fat|6.40g|31.78%',
                        'Monounsaturated Fatty Acids|1.9g|..',
                        'Polyunsaturated Fatty Acids|2.4g|..',
                        'Trans Fat|0g|0',
                        'Sodium|484.04mg|21.05%',
                      ],
                      nutritionalInfo:
                        ' Serving Per Container: 1|Serving Size: 140g [Dry wt]',
                    },
                    {
                      ssrCode: 'GYNI',
                      mealName: null,
                      mealCuisines: null,
                      mealCategories: ['Sandwiches'],
                      dietaryPreference: 'Non Veg',
                      mealImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/NoSearchResultIndiCombo.png',
                      },
                      mealDetailedImage: null,
                      mealDescription: {
                        html: '<p>Fresh&nbsp; cooked in an onion-tomato, served</p>\n',
                      },
                      mealStartDate: null,
                      mealEndDate: null,
                      nutritionalFacts: [
                        'Energy|312.83kcal|15.64%',
                        'Protein|10.6g|21.11%',
                        'Total Carbohydrates|43.6g|15.86%',
                        'Total sugar|12.5g|25.09%',
                        'Total Fat|10.7g|13.68%',
                        'Saturated Fat|6.40g|31.78%',
                        'Monounsaturated Fatty Acids|1.9g|..',
                        'Polyunsaturated Fatty Acids|2.4g|..',
                        'Trans Fat|0g|0',
                        'Sodium|484.04mg|21.05%',
                      ],
                      nutritionalInfo:
                        ' Serving Per Container: 1|Serving Size: 140g [Dry wt]',
                    },
                  ],
                  termsAndConditions: {
                    html: '<h5>Terms &amp; Conditions</h5>\n<ul>\n<li><p>Every pre-book snacks combo contains a beverage (Except Cornflakes and Muesli which are served with milk and yogurt respectively). Customers will be able to select their beverage onboard, subject to availability.</p>\n</li>\n<li><p>Allergen warning: Food may contain nuts, gluten, dairy products and/or eggs.</p>\n</li>\n<li><p>By selecting any of the snack options, the passenger agrees that in the event any pre-book snack item cannot be made available on board for any reason, IndiGo may, at its discretion, either offer an alternate snack item (as per availability), or a full refund (by way of a voucher of the value equivalent to the amount paid by the passenger for the meal) to the passenger, with no further liability.</p>\n</li>\n<li><p>The taste, quality, quantity or ingredients of any product (as applicable) herein is not guaranteed or assured by IndiGo. To the extent any information is provided in respect of any product, such information is on an ‘as is where is basis’, as provided to IndiGo by the supplier/manufacturer of such product. Actual products may differ in appearance from the images displayed here. Prices are inclusive of all applicable taxes.</p>\n</li>\n<li><p>Hot snacks &amp; hot beverages are available only on flights above 61 minutes. All items are served at cabin temperature, except beverages and items that are marked as Served Hot. The F&amp;B service shall be done row wise and as per service flow. We appreciate your patience.</p>\n</li>\n</ul>\n',
                  },
                },
                {
                  categoryBundleCode: 'Goodnight',
                  sliderTitle: 'Blanket, Pillow & Eye shade',
                  sliderDescription: {
                    html: '<p>Please select the preferred&nbsp;Blanket, Pillow &amp; Eye shade&nbsp;for {}</p>\n',
                  },
                  doneCtaLabel: 'Done',
                  ssrList: [
                    {
                      ssrCode: 'EMDK',
                      ssrName: 'Eye Mask and Dental Kit',
                      ssrImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/imgeyemaskdentalkitnew.png',
                      },
                      ssrInformation: {
                        html: '<p><b>Blanket, Pillow &amp; Eye shade</b></p>\n<p>Shuteye bubby, Plus, a toothbrush and toothpaste</p>\n',
                      },
                    },
                    {
                      ssrCode: 'BLKT',
                      ssrName: 'Blanket',
                      ssrImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/img_blanket.png',
                      },
                      ssrInformation: {
                        html: '<p><b>Blanket</b></p>\n<p>The comfiest lightweight blanket in the skies.</p>\n',
                      },
                    },
                    {
                      ssrCode: 'NPLW',
                      ssrName: 'Neck pillow',
                      ssrImage: {
                        _path:
                          '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/img_neckpillow.png',
                      },
                      ssrInformation: {
                        html: '<p><b>Neck pillow</b></p>\n<p>An inflatable pillow, to counter any pain in the neck.</p>\n',
                      },
                    },
                  ],
                  termsAndConditions: {
                    html: null,
                  },
                },
                {
                  categoryBundleCode: 'IFNR',
                  sliderTitle: 'Cancellation Assistance',
                  domesticSliderDescription: {
                    html: '<p>Domestic Plan @ {} per passenger (Inclusive of 18% GST)</p>\n',
                  },
                  internationalSliderDescription: {
                    html: '<p>International Plan @ {} per passenger (Inclusive of 18% GST)</p>\n',
                  },
                  viewBenefitsCtaLabel: 'View Benefits',
                  benefitsLabel: 'Benefits',
                  poweredByLabel: 'CANCELLATION ASSISTANCE PROVIDED BY',
                  poweredByImage: null,
                  poweredByCompanyInformation: {
                    html: '<p>Segura Services Pvt. Ltd. provides with you with comprehensive Cancellation Assistance &amp; ancillary services</p>\n<ul>\n<li>Lifestyle Assistance</li>\n<li>Cancellation Assistance</li>\n<li>Complimentary Trip&nbsp;Cancellation Assistance</li>\n</ul>\n<p>Complimentary Trip&nbsp;Cancellation Assistance will be provided by Segura Services Assist pvt Ltd. (underwritten by Liberty General Insurance Co. Ltd.)&nbsp;<a href="http://asego.co/asegotravel/Indigo-Cancellation-product-Details.pdf" target="_blank">Click here to view</a>&nbsp;complementary trip Cancellation Insurance details.</p>\n',
                  },
                  poweredByCompanyName: 'INSURANCE UNDERWRITER',
                  poweredByCompanyImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Yellow-Patch-Logo-01.jpg',
                  },
                  poweredByDisclaimer: {
                    html: '<p>Disclaimer: Segura Services Pvt. Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Cancellation Assistance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – Liberty General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.</p>\n',
                  },
                  pleaseSelectCountryLabel: 'Please select the country',
                  mandatoryFieldsLabel: '*All fields below are mandatory',
                  addDetailsForLabel: 'Please add the details for {}',
                  dateOfBirthLabel: 'Date of Birth*',
                  dateLabel: 'Date',
                  monthLabel: 'Month',
                  yearLabel: 'Year',
                  invalidDateLabel: 'Invalid Date',
                  alphanumericNotAllowedLabel: null,
                  requiredFieldLabel: null,
                  passportDetailsLabel: 'Passport Details',
                  passportDateOfExpiryLabel: 'Passport Date of expiry',
                  passportNumberLabel: 'Passport Number',
                  visaDetailsLabel: 'VISA details',
                  visaDateOfExpiryLabel: 'VISA Date of expiry',
                  visaNumberLabel: 'VISA Date of expiry',
                  termsAndConditionsList: [
                    {
                      key: null,
                      required: true,
                      requiredLabel: 'Please accept terms and conditions',
                      privacyPolicyDescription: {
                        html: '<p>I agree to purchase Cancellation Assistance and agree to all <a href="https://asego.co/asegotravel/goindigo/Cancellation_Protection_Detailed_TermsAndCondition.pdf" target="_blank"><b>T&amp;Cs</b></a> I confirm that I am an Indian citizen up to the age of 70 years.</p>\n',
                      },
                    },
                    {
                      key: null,
                      required: true,
                      requiredLabel: 'Please accept terms and conditions',
                      privacyPolicyDescription: {
                        html: '<p>I agree to avail complimentary Trip Cancellation Assistance provided by&nbsp;Segura Services Pvt Ltd (underwritten by Liberty General Insurance Co. Ltd).</p>\n',
                      },
                    },
                  ],
                  disclaimer: {
                    html: '<p>Disclaimer: Segura Services Pvt. Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Cancellation Assistance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – Liberty General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.</p>\n',
                  },
                  datePlaceholder: 'DD',
                  monthPlaceholder: 'MM',
                  yearPlaceholder: 'YYYY',
                  monthFormat: 'short',
                },
                {
                  categoryBundleCode: 'BRB',
                  sliderTitle: 'Delayed and Lost Baggage Protection',
                  sliderDescription: {
                    html: '<p>It tracks and expedites the return of the delayed baggage. You get compensation of {} per passenger per baggage (maximum of two (2) checked-in bags) if your baggage is declared lost or is not returned within 96 hrs from the time your flight lands. This product is powered by Blue Ribbon Bags.&nbsp;</p>\n',
                  },
                  bannerImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/Blue-trolly-bag.svg',
                  },
                  bannerDescription: {
                    html: '<p>Only {} per passenger per booking</p>\n',
                  },
                  poweredByLabel: 'POWERED BY BLUE RIBBON BAGS',
                  poweredByImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/brblogo.svg',
                  },
                  poweredByDescription: {
                    html: '<p>I agree to purchase Delayed and Lost Baggage Protection service powered by Blue Ribbon Bags, LLC and also to all&nbsp;<a href="https://www.blueribbonbags.com/ServiceAgreement?d=nwb078RD01A%2flMA%2f23Hj4SzhzJRrN85AFmPjeeleyUk%3d" target="_blank">T&amp;Cs</a>&nbsp;of the service agreement.</p>\n',
                  },
                  poweredByDisclaimer: {
                    html: '<p><b>Disclaimer</b>:&nbsp;“Terms and conditions of Blue Ribbon Bags baggage tracking services are set out at:&nbsp;<a href="https://www.blueribbonbags.com/ServiceAgreement?d=nwb078RD01A%2flMA%2f23Hj4SzhzJRrN85AFmPjeeleyUk%3d" target="_blank">ServiceAgreement (blueribbonbags.com)</a>. IndiGo is not endorsing or making any representation in relation to such services.”</p>\n',
                  },
                  addToTripCtaLabel: 'Add To Trip',
                  removeCtaLabel: 'Remove',
                  addedToTripCtaLabel: 'Added To Trip',
                  benefits: {
                    html: '<p><b>Benefits</b></p>\n<p><span class="icon-tick-black"></span>Get a compensation of {} if your baggage is declared lost or is not returned within 96 hrs from the time your flight lands.</p>\n<p><span class="icon-tick-black"></span>Compensation applies to per passenger per baggage (maximum of two (2) checked-in bags)</p>\n<p><span class="icon-tick-black"></span>It gives you real-time status updates via SMS and e-mail.</p>\n',
                  },
                  acceptTermsError:
                    'Please accept the term and conditions to proceed',
                  domesticPrice: '₹19,000',
                  internationalPrice: '₹66,000',
                },
                {
                  categoryBundleCode: 'baggage',
                  sliderTitle: 'Excess Baggage',
                  sliderDescription: {
                    html: '<p>Please select Baggage for {}</p>\n',
                  },
                  domesticFlightsLabel: 'Domestic Flights*',
                  ssrList: [
                    {
                      ssrCode: 'XBPE',
                      ssrName: '3 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPA',
                      ssrName: '5 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPB',
                      ssrName: '10 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPC',
                      ssrName: '15 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPJ',
                      ssrName: '20 kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPD',
                      ssrName: '30 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'IXBA',
                      ssrName: '8 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'IXBB',
                      ssrName: '15 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'IXBC',
                      ssrName: '30 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                    {
                      ssrCode: 'XBPK',
                      ssrName: '23 Kg',
                      ssrImage: null,
                      ssrInformation: {
                        html: null,
                      },
                    },
                  ],
                  internationalFlightsLabel:
                    'International Connecting Flights**',
                  preBookBaggageLabel:
                    'Pre-book Additional Piece(s) of Baggage',
                  preBookBaggageDescription: {
                    html: '<p>Only&nbsp;one piece of check-in baggage are allowed per passenger. Additional charges apply for excess baggage. Additional pieces of Baggage will be subject to additional charges in addition to the excess Baggage charges. Additional pieces of baggage may be pre-booked below.</p>\n',
                  },
                  preBookBaggageInternationalDescription: {
                    html: '<p>Only&nbsp;two piece(s) of check-in baggage are allowed per passenger. Additional charges apply for excess baggage. Additional pieces of Baggage will be subject to additional charges in addition to the excess Baggage charges. Additional pieces of baggage may be pre-booked below.</p>\n',
                  },
                  preBookBaggageImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/ABHF Slider image.png',
                  },
                  editExcessBaggageLabel: 'Non Editable',
                  addAdditionalPieceLabel: 'Add Additional piece',
                  additionalBaggageLabel: '{price} Additional Bag',
                  lostBaggageProtectionLabel:
                    'Delayed and Lost Baggage Protection',
                  lostBaggageProtectionDescription: {
                    html: '<p>It tracks and expedites the return of the delayed baggage. You get compensation of {} per passenger per baggage (maximum of two (2) checked-in bags) if your baggage is declared lost or is not returned within 96 hrs from the time your flight lands. This product is powered by Blue Ribbon Bags.&nbsp;</p>\n',
                  },
                  poweredByImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/brblogo.svg',
                  },
                  perPassengerPriceLabel: '{price} per passenger per booking',
                  poweredByTermsAndConditions: {
                    html: '<p>I agree to purchase Delayed and Lost Baggage Protection service powered by Blue Ribbon Bags, LLC and also to all&nbsp;<a href="https://www.blueribbonbags.com/ServiceAgreement?d=nwb078RD01A%2flMA%2f23Hj4SzhzJRrN85AFmPjeeleyUk%3d" target="_blank">T&amp;Cs</a>&nbsp;of the service agreement.</p>\n',
                  },
                  poweredByDisclaimer: {
                    html: '<p><b>Disclaimer</b>:&nbsp;“Terms and conditions of Blue Ribbon Bags baggage tracking services are set out at:&nbsp;<a href="https://www.blueribbonbags.com/ServiceAgreement?d=nwb078RD01A%2flMA%2f23Hj4SzhzJRrN85AFmPjeeleyUk%3d" target="_blank">ServiceAgreement (blueribbonbags.com)</a>. IndiGo is not endorsing or making any representation in relation to such services.”</p>\n',
                  },
                  addToTripCtaLabel: 'Add To Trip',
                  addedToTripCtaLabel: 'Added To Trip',
                  removeCtaLabel: 'Remove',
                  termsAndConditions: {
                    html: '<p>*Can be added atleast 60 minutes prior to schedule departure of flight.</p>\n<p>**Can be added at least 6 hours prior to schedule departure of flight.</p>\n<p>*Only&nbsp;one check-in baggage allowed per passenger.&nbsp;Additional charges will apply for excess baggage.&nbsp;&nbsp;<a href="/content/indigo/in/en/add-on-services/excess-baggage.html?linkNav=excess-baggage_header" target="_blank">Know more.</a></p>\n',
                  },
                  termsAndConditionsInternational: {
                    html: '<p>*Can be added atleast 60 minutes prior to schedule departure of flight.</p>\n<p>**Can be added at least 6 hours prior to schedule departure of flight.</p>\n<p>*Only two check-in baggage allowed per passenger.&nbsp;Additional charges will apply for excess baggage.&nbsp;&nbsp;<a href="/content/indigo/in/en/add-on-services/excess-baggage.html?linkNav=excess-baggage_header">Know more.</a></p>\n',
                  },
                  acceptTermsError:
                    'Please accept the term and conditions to proceed',
                },
                {
                  categoryBundleCode: 'Lounge',
                  sliderTitle: 'Lounge',
                  sliderDescription: {
                    html: '<p>Lounge service at {} per Passenger&nbsp;</p>\n',
                  },
                  doneCtaLabel: 'Done',
                  ssrList: [],
                  termsAndConditions: {
                    html: null,
                  },
                },
                {
                  categoryBundleCode: 'SPEQ',
                  sliderTitle: 'Sports Equipment',
                  sliderDescription: {
                    html: '<p>Please select Sports for {}</p>\n',
                  },
                  selectQuantityLabel: 'Select quantity',
                  itemLabel: 'Item',
                  sportsDescription: {
                    html: '<p>Dimensions Allowed</p>\n<table>\n<tbody><tr><td>Width (In)</td>\n<td>Height (In)</td>\n<td>Length (In)</td>\n</tr><tr><td>10</td>\n<td>10</td>\n<td>209</td>\n</tr><tr><td>20</td>\n<td>20</td>\n<td>202.5</td>\n</tr><tr><td>30</td>\n<td>30</td>\n<td>193.5</td>\n</tr></tbody></table>\n<p>For detailed terms and conditions&nbsp;<a href="/content/indigo/in/en/add-on-services/sports-equipment-handling-fees.html">click here</a>.</p>\n<p>Note: Sports equipment cannot be accepted if they are larger than the above dimensions.</p>\n',
                  },
                },
                {
                  categoryBundleCode: 'PROT',
                  sliderTitle: 'Travel Assistance',
                  domesticSliderDescription: {
                    html: '<p>Domestic Plan @ {} per passenger (Inclusive of 18% GST)</p>\n',
                  },
                  internationalSliderDescription: {
                    html: '<p>International Plan @ {} per passenger (Inclusive of 18% GST)</p>\n',
                  },
                  viewBenefitsCtaLabel: 'View Benefits',
                  benefitsLabel: 'Travel Assistance',
                  poweredByLabel: 'TRAVEL ASSISTANCE PROVIDED BY',
                  poweredByImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/bhartiInsuurenceImage.png',
                  },
                  poweredByCompanyInformation: {
                    html: '<p>Segura Services Pvt Ltd provides with you with comprehensive Travel Assistance &amp; ancillary services</p>\n<p>Get travel &amp; medical insurance along with roadside assistance.&nbsp;Powered by Segura Services Pvt. Ltd.</p>\n',
                  },
                  poweredByCompanyName: 'INSURANCE UNDERWRITER',
                  poweredByCompanyImage: {
                    _path:
                      '/content/dam/skyplus6e/in/en/assets/booking/add-ons/images/bhartiInsuurenceImage.png',
                  },
                  poweredByDisclaimer: {
                    html: '<p>Disclaimer: “Segura Services Pvt Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Travel Insurance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – ICICI Lombard General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.”</p>\n',
                  },
                  pleaseSelectCountryLabel: 'Please select country',
                  mandatoryFieldsLabel: '*Mandatory Fields',
                  addDetailsForLabel: 'Please add details for {}',
                  dateOfBirthLabel: 'Date of birth',
                  dateLabel: 'Date',
                  monthLabel: 'Month',
                  yearLabel: 'Year',
                  invalidDateLabel: 'Invalid Date',
                  alphanumericNotAllowedLabel:
                    'Only alphanumeric characters are allowed',
                  requiredFieldLabel: null,
                  passportDetailsLabel: 'Passport Details',
                  passportDateOfExpiryLabel: 'Passport Date of expiry',
                  passportNumberLabel: 'Passport Number',
                  visaDetailsLabel: 'VISA Details',
                  visaDateOfExpiryLabel: 'VISA Date of expiry',
                  visaNumberLabel: 'VISA number',
                  termsAndConditionsList: [
                    {
                      key: null,
                      required: true,
                      requiredLabel: 'Please accept terms and conditions',
                      privacyPolicyDescription: {
                        html: '<p>I agree to avail complimentary Travel Insurance provided by Segura Services Pvt Ltd (Underwritten by ICICI Lombard General Insurance Co. Ltd).</p>\n',
                      },
                    },
                    {
                      key: null,
                      required: true,
                      requiredLabel: 'Please accept terms and conditions',
                      privacyPolicyDescription: {
                        html: '<p>I agree to purchase Travel Assistance and agree to all&nbsp;<a href="https://asego.co/new/Group-Domestic-Traveller-lnsurance-Policy-Policy-Wordings.pdf" target="_blank">T&amp;Cs</a>. I confirm that I am an Indian citizen upto the age of 70 years.</p>\n',
                      },
                    },
                  ],
                  disclaimer: {
                    html: '<p>Disclaimer:“Segura Services Pvt Ltd., the company (a corporate agent licensed by IRDAI) is providing global assistance services and ancillary products including Travel Insurance as a complimentary benefit (cover underwritten by an IRDAI authorized underwriter – ICICI Lombard General Insurance Company Ltd). For details on risk factors and terms and conditions, please read the terms and conditions carefully before concluding a transaction.”</p>\n',
                  },
                  datePlaceholder: null,
                  monthPlaceholder: null,
                  yearPlaceholder: null,
                  monthFormat: null,
                },
                {
                  categoryBundleCode: 'ABHF',
                  sliderTitle: 'Additional Baggage',
                  sliderDescription: {
                    html: null,
                  },
                  domesticFlightsLabel: null,
                  ssrList: [],
                  internationalFlightsLabel: null,
                  preBookBaggageLabel: null,
                  preBookBaggageDescription: {
                    html: null,
                  },
                  preBookBaggageInternationalDescription: {
                    html: null,
                  },
                  preBookBaggageImage: null,
                  editExcessBaggageLabel: null,
                  addAdditionalPieceLabel: null,
                  additionalBaggageLabel: null,
                  lostBaggageProtectionLabel: null,
                  lostBaggageProtectionDescription: {
                    html: null,
                  },
                  poweredByImage: null,
                  perPassengerPriceLabel: null,
                  poweredByTermsAndConditions: {
                    html: null,
                  },
                  poweredByDisclaimer: {
                    html: null,
                  },
                  addToTripCtaLabel: null,
                  addedToTripCtaLabel: null,
                  removeCtaLabel: null,
                  termsAndConditions: {
                    html: null,
                  },
                  termsAndConditionsInternational: {
                    html: null,
                  },
                  acceptTermsError: null,
                },
                {
                  categoryBundleCode: 'FFWD',
                  sliderTitle: 'Fast Forward',
                  sliderDescription: {
                    html: null,
                  },
                  doneCtaLabel: null,
                  ssrList: [],
                  termsAndConditions: {
                    html: null,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export default configJson;
