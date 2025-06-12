/* eslint-disable max-len */
export const MFDATA_MOCK_MAIN_BY_PATH = {
  itineraryMainByPath: {
    item: {
      bookingTitle: 'Booking',
      itineraryTitle: 'Itinerary',
      itineraryDetailsTitle: { html: '<p>Your <span class="green">Itinerary Details</span></p>\n' },
      itineraryDetailsDescription: {
        html: '\u003Cp\u003EHey! {name}\u003C/p\u003E\n\u003Cp\u003EYour flight is in 2 days \u003Ca href="#"\u003EApp Check-in\u003C/a\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Hey! {name}',
              },
            ],
          },
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Your flight is in 2 days ',
              },
              {
                nodeType: 'link',
                data: {
                  href: '#',
                },
                value: 'App Check-in',
              },
            ],
          },
        ],
      },
      webCheckInTitle: 'App Check-In',
      saveOrShareLabel: 'Save / Share',
      modifyLabel: 'Modify',
      modifyOptions: [
        {
          buttonCode: 'editAddons',
          buttonValue: 'Edit Addons',
          path: 'editAddons.html',
          icon: 'icon-edit',
        },
        {
          buttonCode: 'changeSeat',
          buttonValue: 'Change Seat',
          path: 'changeSeat.html',
          icon: '/content/dam/s6app/in/en/assets/modify-options-icons/Change_seat.svg',
        },
        {
          buttonCode: 'splitPNR',
          buttonValue: 'Split PNR',
          path: 'splitPNR.html',
          icon: '/content/dam/s6app/in/en/assets/modify-options-icons/Split_fair.svg',
        },
        {
          buttonCode: 'updateContact',
          buttonValue: 'Update Contact',
          path: 'updateContact.html',
          icon: '/content/dam/s6app/in/en/assets/modify-options-icons/Update_account.svg',
        },
        {
          buttonCode: 'changeFlight',
          buttonValue: 'Change Flight',
          path: 'changeFlight.html',
          icon: '/content/dam/s6app/in/en/assets/modify-options-icons/Change_flight.svg',
        },
      ],
      journeyType: [
        {
          journeyTypeCode: 'OneWay',
          journeyTypeLabel: 'One Way',
        },
        {
          journeyTypeCode: 'MultiCity',
          journeyTypeLabel: 'Multi City',
        },
        {
          journeyTypeCode: 'RoundTrip',
          journeyTypeLabel: 'Round Trip',
        },
      ],
      earnedPtsLabel: 'Earned {points} pts', // eslint-disable-line sonarjs/no-duplicate-string
      bookingStatus: [
        {
          key: 'Confirmed',
          title: 'Booking Confirmed', // eslint-disable-line sonarjs/no-duplicate-string
          description: {
            html: '\u003Cp\u003EYour Booking Confirmed and have been emailed to you on {mail}\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your Booking Confirmed and have been emailed to you on {mail}',
                  },
                ],
              },
            ],
          },
        },
        {
          key: 'Hold',
          title: 'Your booking has been put on hold!', // eslint-disable-line sonarjs/no-duplicate-string
          description: {
            html: '\u003Cp\u003EYour reservation will remain on hold until \u003Cb\u003E{date}\u003C/b\u003E\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your reservation will remain on hold until ',
                  },
                  {
                    nodeType: 'text',
                    value: '{date}',
                    format: {
                      variants: [
                        'bold',
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          key: 'Cancelled',
          title: 'Your booking has failed!', // eslint-disable-line sonarjs/no-duplicate-string
          description: {
            html: '\u003Cp\u003E\u003Cb\u003EYour booking couldn’t be confirmed as the booking gateway failed.\u003C/b\u003EThe deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in \u003Ca href="#"\u003Emanage booking\u003C/a\u003E\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your booking couldn’t be confirmed as the booking gateway failed.',
                    format: {
                      variants: [
                        'bold',
                      ],
                    },
                  },
                  {
                    nodeType: 'text',
                    value: 'The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in ',
                  },
                  {
                    nodeType: 'link',
                    data: {
                      href: '#',
                    },
                    value: 'manage booking', // eslint-disable-line sonarjs/no-duplicate-string
                  },
                ],
              },
            ],
          },
        },
        {
          key: 'HoldCancelled',
          title: 'Your payment has failed!',
          description: {
            html: '\u003Cp\u003EYour Transection Was Declined By The Bank Due to Insufficient Fund.The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in \u003Ca href="#"\u003Emanage booking\u003C/a\u003E \u003Cb\u003E\u003C/b\u003E\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your Transection Was Declined By The Bank Due to Insufficient Fund.The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in ',
                  },
                  {
                    nodeType: 'link',
                    data: {
                      href: '#',
                    },
                    value: 'manage booking',
                  },
                ],
              },
            ],
          },
        },
        {
          key: 'bookingDeclinedDueToSeatUnavailability',
          title: 'Your booking has failed!',
          description: {
            html: '\u003Cp\u003E\u003Cb\u003EYour booking couldn’t be confirmed because of unavailability of seats.\u003C/b\u003EThe deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in \u003Ca href="#"\u003Emanage booking\u003C/a\u003E\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your booking couldn’t be confirmed because of unavailability of seats.',
                    format: {
                      variants: [
                        'bold',
                      ],
                    },
                  },
                  {
                    nodeType: 'text',
                    value: 'The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in ',
                  },
                  {
                    nodeType: 'link',
                    data: {
                      href: '#',
                    },
                    value: 'manage booking',
                  },
                ],
              },
            ],
          },
        },
      ],
      bookingConfirmBgImage: 'https://s3-alpha-sig.figma.com/img/edb0/a38e/a8c423db33efd8780e5ea54ab2c4e6ba?Expires=1713744000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MepnWVwFBAt9xTCjZ69-PDSzAJg8CgEeh6zvRKj2AmQ7ff11ekk-ZW5OoX6x1CRl11VrGXa6e0K9org5dq5cGSzcf6fCHYOSXwyRgmGevX80PHT~vf0RqdRSNwC3HQijV7Ohbf88qRDiE5yaL2d3-QEcphdMqz-ziupXa4d91IhWSR2rFS2apCV~FdajjmHQ5rT1k3kP1EwFAM4g916GnkXF~yPdNsbr8InDWARQEYDHde8X1N5R3vW-cp5O8G~RtE8CmLrgAJdpvSK0E9yYicgSXIkYIVgHhxTsgiguO8mQtUt8~1Jxzaq4Rk8WTCKX~euOTgs1o97xvwfxbS4g~Q__',
      bookingConfirmRedirectUrl: 'goindigo.in',
      quickActionsTitle: {
        html: '\u003Cp\u003EQuick \u003Cspan class="green"\u003EActions\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Quick ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Actions',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      quickActions: [
        {
          title: 'Note',
          icon: null,
          iconKey: 'Note',
          description: {
            html: '\u003Cp\u003EIf your flight is cancelled or rescheduled from our end, you can use Plan B to change the time and / or date of your flight or cancel and process refund, at no additional cost.\u003C/p\u003E\n', // eslint-disable-line sonarjs/no-duplicate-string
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'If your flight is cancelled or rescheduled from our end, you can use Plan B to change the time and / or date of your flight or cancel and process refund, at no additional cost.',
                  },
                ],
              },
            ],
          },
          image: {},
        },
        {
          title: 'Baggage Allowance: Flexible Fare', // eslint-disable-line sonarjs/no-duplicate-string
          icon: null,
          iconKey: 'BaggageAllowanceDomestic',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
        {
          title: 'Terminal Information', // eslint-disable-line sonarjs/no-duplicate-string
          icon: null,
          iconKey: 'TerminalInformation',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
        {
          title: 'Terms & Conditions', // eslint-disable-line sonarjs/no-duplicate-string
          icon: null,
          iconKey: 'TermsNConditions',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
        {
          title: 'Flight Delay or Cancellation', // eslint-disable-line sonarjs/no-duplicate-string
          icon: null,
          iconKey: 'CancelledFlightInfo',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
      ],
      paymentDetailsLabel: 'Payment Details',
      paymentStatusLabels: {
        complete: 'Complete',
        pending: 'Pending!',
        failed: 'Failed',
      },
      retryPayment: 'Retry Payment',
      exploreLabel: 'Explore',
      readyToExploreLabel: 'Ready to Explore',
      checkAgain: 'Check Again',
      retryBooking: 'Retry Booking',
      transactionIdLabel: 'Transaction ID : {transactionId}',
      copyLabel: 'Copy',
      paymentDetailsDescription: 'You can check the status of the payment with your bank in case of any issue',
      flightDetailsLabel: 'Flight Details',
      checkinCloses: null,
      checkFlightStatus: 'Check flight status',
      flightLabel: {
        departing: 'Departure Flight', // eslint-disable-line sonarjs/no-duplicate-string
        returning: 'Return Flight', // eslint-disable-line sonarjs/no-duplicate-string
      },
      flightType: {
        nonStop: 'Nonstop',
        connecting: 'Connect',
        via: 'Through',
      },
      travelTimeLabel: 'Travel Time',
      hourLabel: 'Hour',
      minuteLabel: 'min',
      layoverLabel: 'Layover',
      changeOfAirCraftLabel: 'Change of aircraft',
      baggageInfoLabel: 'Baggage Per Adult and Child',
      checkInBagInfo: '{checkInBaggage} Check-in',
      handBagInfo: '{cabinBaggage} Cabin',
      pnrLabel: 'PNR: {pnr}',
      paxLabel: 'Pax',
      pnrStatus: {
        confirmed: 'Confirmed',
        notGenerated: 'Not generated', // eslint-disable-line sonarjs/no-duplicate-string
      },
      notGenerated: 'Not generated',
      passengersAndAddonsLabel: 'Passengers and Add-ons',
      returnFlightLabel: 'Return Flight',
      yearLabel: 'Year',
      wheelChairLabel: 'Wheelchair',
      feedbackTitle: 'Feedback',
      feedbackLabel: {
        html: '\u003Cp\u003EGive us \u003Cspan class="green"\u003EFeedback\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Give us ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Feedback',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      travelTipsAndRemindersLabel: {
        html: '\u003Cp\u003ETravel tips and \u003Cspan class="green"\u003EReminders\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Travel tips and ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Reminders',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      travelTips: [
        {
          title: 'First time flying?',
          image: {
            _path: '/content/dam/s6app/in/en/assets/smart-web-checkin.jpg', // eslint-disable-line sonarjs/no-duplicate-string
          },
        },
        {
          title: 'Documents to carry',
          image: null,
        },
        {
          title: 'Medical Assistant',
          image: null,
        },
      ],
      smartWebCheckInTitle: 'Smart web checkin',
      viewLabel: {
        html: '\u003Cp\u003E\u003Ca href="#"\u003EVIEW\u003C/a\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'link',
                data: {
                  href: '#',
                },
                value: 'VIEW',
              },
            ],
          },
        ],
      },
      smartWebCheckInSubtext: {
        html: '\u003Cp\u003EGet your \u003Cspan class="green"\u003EBoarding Pass\u003C/span\u003E automatically\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Get your ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Boarding Pass',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
              {
                nodeType: 'text',
                value: ' automatically',
              },
            ],
          },
        ],
      },
      smartWebCheckInImage: {
        _path: '/content/dam/s6app/in/en/assets/smart-web-checkin.jpg',
      },
      smartWebCheckInOptions: {
        html: '\u003Cul\u003E\n\u003Cli\u003ESchedule your web check-in beforehand.\u003C/li\u003E\n\u003Cli\u003EReceive your Boarding Pass on whatsApp.\u003C/li\u003E\n\u003C/ul\u003E\n',
        json: [
          {
            nodeType: 'unordered-list',
            content: [
              {
                nodeType: 'list-item',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Schedule your web check-in beforehand.',
                  },
                ],
              },
              {
                nodeType: 'list-item',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Receive your Boarding Pass on whatsApp.',
                  },
                ],
              },
            ],
          },
        ],
      },
      checkoutOtherAddonsLabel: {
        html: '\u003Cp\u003ECheck out other \u003Cspan class="green"\u003EAdd - ons\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Check out other ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Add - ons',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      addonOptions: [
        {
          categoryBundleCode: '6EPrime',
          title: '6E Prime',
          tileLabel: null,
          tileImage: null,
          tileTitle: null,
          tileNote: null,
        },
        {
          categoryBundleCode: '6ESeatAndEat',
          title: '6E Seat And Eat',
          tileLabel: null,
          tileImage: null,
          tileTitle: null,
          tileNote: null,
        },
      ],
      bookingHelpTitle: {
        html: '\u003Cp\u003ENeed help with \u003Cspan class="green"\u003EYour Booking?\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Need help with ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Your Booking?',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      bookingHelpOptions: [
        {
          title: 'Chat with us',
          icon: null,
          description: {
            html: '\u003Cp\u003EAbout any issue related to your booking\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'About any issue related to your booking',
                  },
                ],
              },
            ],
          },
          image: {},
        },
        {
          title: 'Manage booking',
          icon: null,
          description: {
            html: '\u003Cp\u003EGo to ‘my trips’ and manage your bookings\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Go to ‘my trips’ and manage your bookings',
                  },
                ],
              },
            ],
          },
          image: {},
        },
      ],
      bookReturnFlightTitle: 'Book your Return Flight',
      bookAnotherFlightTitle: 'Book your Another Flight',
      bookReturnFlightSubtext: {
        html: '\u003Cp\u003EGet rid of \u003Cspan class="green"\u003ELast Minute Rush\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Get rid of ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Last Minute Rush',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      bookReturnFlightDiscount: 'Save up to {} % on your return journey',
      bookReturnFlightPrice: '{city} flight starting from {price}',
      bookReturnFlightBgImage: {
        _path: 'https://s3-alpha-sig.figma.com/img/1c6c/7e4c/ae6eca6154c0a48e6994ff9dc56c6aac?Expires=1713744000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SjPILEPhkTSu8ht-K6tDJvMAwQYuG4rkdycWGoHxuEDZM-hGSwedrIqE15OBpLLOoQhlg-~5Z1bVvsm0aBjQRdwVgpRdPMRftROzkWiv-rHYhffB2CDOsevTa2udHbYAU48XOlYHYc9RJzH3u1~09SaBhkEpK0FUe08l54UA2EOTQ83hDITk6bHXAiIvD73wVx9QCk4JHo5St-5SpJ~WDCW1EAU8tvwMjERjvpJ72rUfB49YF0Ckjui85vs3KU0OvZet1vujmSjkpJt~rOLFcB7yLqfc9zTHehUfPHURzcKYhE5lh-mQ0EgsHxYG9WpQVfQD-BLlOf1dvFX8S1vE2A__',
      },
      paymentDetails: {
        totalFareLabel: 'Total Fare',
        convenienceFeeLabel: 'Zero Convenience Fee',
        nextLabel: 'Next',
        fareDetailsLabel: 'Fare Details',
        flightLabel: {
          departing: 'Departure Flight',
          returning: 'Return Flight',
        },
        earnedPtsLabel: 'Earned {points} pts',
        airFareChargeLabel: 'AirFare Charge',
        fuelChargeLabel: 'Fuel Charge',
        userDevelopmentFeeLabel: 'User Development fee',
        gstLabel: 'GST',
        airportSecurityFeesLabel: 'Airport security fees',
        addOnsSummaryLabel: 'Add-ons Summary',
        addOnsList: [
          {
            categoryBundleCode: '6EBar',
            title: 'One for the skies',
          },
          {
            categoryBundleCode: 'ABHF',
            title: 'Add Additional Bags',
          },
          {
            categoryBundleCode: 'SEAT',
            title: 'Sleep Essentials', // eslint-disable-line sonarjs/no-duplicate-string
          },
          {
            categoryBundleCode: 'Goodnight',
            title: 'Sleep Essentials',
          },
          {
            categoryBundleCode: 'PROT',
            title: 'Travel Assistance',
          },
          {
            categoryBundleCode: 'FFWD',
            title: 'Fast Forward',
          },
          {
            categoryBundleCode: 'SPEQ',
            title: 'Add Sports Equipment',
          },
          {
            categoryBundleCode: 'PRBG',
            title: '6E QuickBoard',
          },
          {
            categoryBundleCode: 'baggage',
            title: 'Excess Baggage',
          },
          {
            categoryBundleCode: 'Meal',
            title: '6E Eat',
          },
          {
            categoryBundleCode: 'PRIM',
            title: '6E Prime',
          },
          {
            categoryBundleCode: 'MLST',
            title: '6E Seat And  Eat',
          },
          {
            categoryBundleCode: 'IFNR',
            title: 'Cancellation Assistance',
          },
        ],
        cuteChargeLabel: 'CUTE charge',
        rcsProvisionLabel: 'RCS provision',
        seatFeeLabel: 'Seat fee',
      },
      gstDetailsLabel: 'GST Details',
      gstNumberLabel: 'GST Number:',
      contactEmailLabel: 'E - mail:',
      gstCompany: 'GST Company:',
      contactDetailsLabel: 'Contact Details', // eslint-disable-line sonarjs/no-duplicate-string
      numberLabel: 'Number:',
      gstEmailLabel: 'E - mail:',
      moreInfoLabel: {
        html: '\u003Cp\u003EMore \u003Cspan class="green"\u003EInformation\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'More ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Information',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      moreInfoOptions: [
        {
          title: 'Note',
          icon: null,
          key: 'Note',
          description: {
            html: '\u003Cp\u003EIf your flight is cancelled or rescheduled from our end, you can use Plan B to change the time and / or date of your flight or cancel and process refund, at no additional cost.\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'If your flight is cancelled or rescheduled from our end, you can use Plan B to change the time and / or date of your flight or cancel and process refund, at no additional cost.',
                  },
                ],
              },
            ],
          },
          image: {},
        },
        {
          title: 'Baggage Allowance: Flexible Fare',
          icon: null,
          key: 'BaggageAllowanceDomestic',
          description: {
            html: '<p>{} - {}</p>\n',
            json: null,
          },
          image: {},
        },
        {
          title: 'Terminal Information',
          icon: null,
          key: 'TerminalInformation',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
        {
          title: 'Terms & Conditions',
          icon: null,
          key: 'TermsNConditions',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
        {
          title: 'Flight Delay or Cancellation',
          icon: null,
          key: 'CancelledFlightInfo',
          description: {
            html: null,
            json: null,
          },
          image: {},
        },
      ],
      retrieveAnotherItineraryLabel: 'Retrieve Another Itinerary',
    },
  },
};
export const MFDATA_MOCK_ADDITIONAL_BY_PATH = {
  itineraryAdditionalByPath: {
    item: {
      feedbackTitleSubtext: 'Please select one or more issue',
      feedbackOptions: [
        'Bad app experience',
        'Payment issues',
        'Offer issues',
        'Communication issues',
      ],
      moreIssuesLabel: {
        html: "\u003Cp\u003E&lt;a href='#'&gt;MORE ISSUES&lt;/a&gt;\u003C/p\u003E\n",
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: "\u003Ca href='#'\u003EMORE ISSUES\u003C/a\u003E",
              },
            ],
          },
        ],
      },
      submitLabel: 'Submit',
      changeFlightDetails: {
        heading: 'CHANGE FLIGHT / BOOKING',
        description: {
          html: '\u003Cp\u003EBefore proceeding, please select whether you want to change \u003Cspan class="green"\u003Eflight or booking\u003C/span\u003E\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Before proceeding, please select whether you want to change ',
                },
                {
                  nodeType: 'span',
                  content: [
                    {
                      nodeType: 'text',
                      value: 'flight or booking',
                    },
                  ],
                  data: {
                    class: 'green',
                  },
                },
              ],
            },
          ],
        },
        ctaLabel: 'Change Flight',
        secondaryCtaLabel: 'Change Booking',
      },
      cancelFlightDetails: {
        heading: 'CANCEL FLIGHT / BOOKING',
        description: {
          html: '\u003Cp\u003EBefore proceeding, please select whether you want to cancel \u003Cspan class="green"\u003Eflight or booking\u003C/span\u003E\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Before proceeding, please select whether you want to cancel ',
                },
                {
                  nodeType: 'span',
                  content: [
                    {
                      nodeType: 'text',
                      value: 'flight or booking',
                    },
                  ],
                  data: {
                    class: 'green',
                  },
                },
              ],
            },
          ],
        },
        ctaLabel: 'Cancel Flight',
        secondaryCtaLabel: 'Cancel Booking',
      },
      changeBookingText: {
        html: '\u003Cp\u003EChange instead of cancel and get \u003Cspan class="green"\u003E15% off\u003C/span\u003E\u003C/p\u003E\n',
        json: [
          {
            nodeType: 'paragraph',
            content: [
              {
                nodeType: 'text',
                value: 'Change instead of cancel and get ',
              },
              {
                nodeType: 'span',
                content: [
                  {
                    nodeType: 'text',
                    value: '15% off',
                  },
                ],
                data: {
                  class: 'green',
                },
              },
            ],
          },
        ],
      },
      totalBookingLabel: 'Total Booking',
      totalBookingAmount: '400',
      cancelChargesLabel: 'Cancel Charges (Including Tax)',
      cancelChargesAmount: '100',
      refundAmountLabel: 'Refund Amount',
      refundAmount: '300',
      selectRefundText: 'Select where you want to recieve the refund',
      refundDetails: [
        {
          title: 'Back to source',
          description: {
            html: '\u003Cp\u003ENote: if you booked through third party platforms, then please check their refund\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Note: if you booked through third party platforms, then please check their refund',
                  },
                ],
              },
            ],
          },
        },
        {
          title: 'Credit shell',
          description: {
            html: '\u003Cp\u003EInstantly get refund amount in credit shell and use it for future bookings thorugh\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Instantly get refund amount in credit shell and use it for future bookings thorugh',
                  },
                ],
              },
            ],
          },
        },
      ],
      proceedLabel: 'proceed',
      otpDetails: {
        otpTitle: 'OTP Confirmation',
        otpMessage: {
          html: '\u003Cp\u003EEnter OTP sent to registered {mobileNumber} mapped with {pnr} PNR&nbsp;\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Enter OTP sent to registered {mobileNumber} mapped with {pnr} PNR ',
                },
              ],
            },
          ],
        },
        verifyOtp: 'Verify OTP',
        otpErrorMessage: 'Didn’t receive OPT ?',
        resendLabel: 'Resend',
        otpSubtext: {
          html: '\u003Cp\u003EOTP will expire in the next {time} sec\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'OTP will expire in the next {time} sec',
                },
              ],
            },
          ],
        },
      },
      successMessage: [],
      discardChangesPopup: {
        heading: 'Are you sure do you want to discard all the changes ?',
        ctaLabel: 'Yes',
        secondaryCtaLabel: 'No',
      },
      updateContactDetails: {
        title: 'Update Health And Contact Detail',
        description: {
          html: '\u003Cp\u003EYour booking details will sent to the contact details below\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Your booking details will sent to the contact details below',
                },
              ],
            },
          ],
        },
        addAnotherContact: 'Add another contact',
        whatsappInfo: {
          title: 'Get updates on WhatsApp',
          description: {
            html: '\u003Cp\u003EBy subscribing to this, you agree to the terms and condition of Whatsapp and to the In\u003C/p\u003E\n',
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'By subscribing to this, you agree to the terms and condition of Whatsapp and to the In',
                  },
                ],
              },
            ],
          },
          image: null,
        },
        ctaLabel: 'Done',
        ctaUpdateLabel: 'Update Contact',
        mobileNo: 'Mobile Number',
        alternativeMobNo: 'Alternate Contact Number',
        emergencyMobNo: 'Emergency Contact Number',
        emergencyLabel: 'Emergency Relationship',
        emergencyRelationship: ['Friend', 'Family', 'Family Friend'],
      },
      submitPassengerDetails: {
        title: {
          html: '\u003Cp\u003ESubmit International Passenger Details\u003C/p\u003E\n',
          json: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: 'Submit International Passenger Details',
                },
              ],
            },
          ],
        },
        description: 'As per government regulations, details of all passengers arriving into India must be mandatorily shared with the state - government.',
        mandatoryLabel: 'Error ! This field is mandatory',
        contactDetailsLabel: 'Contact Details',
        numberLabel: 'Number',
        emailLabel: 'Email',
        submitLabel: 'Submit',
        yearLabel: 'year',
        wheelChairLabel: 'Wheel Chair',
        ageLabel: 'Age',
        dateOfBirth: 'Date of Birth*',
        compellingCaseReason: 'Compelling Case Reason',
        compellingCaseReasonSubText: 'Choose from the given options',
        compellingCaseReasonOptions: [
          'Medical Treatment',
          'Family Emergency',
          'Repatriation',
          'Tourist',
          'Visiting Friends & Relatives',
          'Business',
          'Migrant workers/Laborers who have been laid off',
          'Non-Permanent Residents/Short-Term Visa holder faced with expiry of visas',
          'Those Required to return to India due to the death of a family member',
          'Pregnant Women/Elderly',
          'Those facing deportation by foreign governments',
          'Tourists/Visitors stranded abroad',
          'Students if their education institutions/hostels are closed',
        ],
        contactNumber: 'Contact Number',
        passportNumber: 'Passport Number',
        issuingCountryCode: 'Issuing Country Code',
        passportExpiry: 'Passport Expiry',
        profession: 'Profession',
        domicile: 'Domicile in India State/UT*',
        fullAddressInIndia: 'Full Address In India',
        covidTest: 'Covid test done*',
        covidTestOptions: {
          yes: 'yes',
          no: 'no',
        },
        saveDetails: 'Save Details',
      },
      contactDetailsStatus: 'Contact details updated',
      passengerDetailsStatus: 'Passenger details submitted successfully',
      resetChangesLabel: 'Reset Changes',
      retrieveItinerarySection: {
        findYourBookingLabel: {
          html: '\u003Cp\u003EFind your \u003Cspan class="\\&quot;text-green\\&quot;"\u003Ebooking\u003C/span\u003E\u003C/p\u003E\n',
        },
        pnrBookingReferenceLabel: 'PNR/Booking Reference',
        emailLastNameLabel: 'Email/Last Name',
        retrieveItineraryCtaText: 'Retrieve Itinerary',
        retrieveItineraryCtaLink: '/content/api/s6web/retrieve-itinerary.html',
      },
    },
  },
};
export const MFDATA_MOCK_CONFIRMATION_ADDITIONAL_DATA_BY_PATH = {
  itineraryAdditionalByPath: {
    item: {
      feedbackTitleSubtext: 'Please select one or more issue',
      feedbackOptions: [
        'Bad app experience',
        'Payment issues',
        'Offer issues',
        'Communication issues',
      ],
      moreIssuesLabel: {
        html: '<p><a href="#">MORE ISSUES</a></p>\n',
      },
      submitLabel: 'Submit',
      retrieveItinerarySection: {
        findYourBookingLabel: {
          html: '<p>Find your <span class="\\&quot;text-green\\&quot;">booking</span></p>\n',
        },
        pnrBookingReferenceLabel: 'PNR/Booking Reference',
        emailLastNameLabel: 'Email/Last Name',
        retrieveItineraryCtaText: 'Retrieve Itinerary',
        retrieveItineraryCtaLink: '/content/api/s6web/retrieve-itinerary.html',
      },
    },
  },
};
export const MFDATA_MOCK_CONFIRMATION_DATA_BY_PATH = {
  itineraryMainByPath: {
    item: {
      bookingTitle: 'Booking Confirmed',
      webCheckInTitle: 'Web checkin',
      journeyType: [
        {
          journeyTypeCode: 'OneWay',
          journeyTypeLabel: 'One Way',
        },
        {
          journeyTypeCode: 'RoundTrip',
          journeyTypeLabel: 'Round Trip',
        },
        {
          journeyTypeCode: 'MultiCity',
          journeyTypeLabel: 'Multi City',
        },
      ],
      earnedPtsLabel: 'Earned {earnedPoints} pts',
      bookingStatus: [
        {
          key: 'confirmed',
          title: 'Booking Confirmed',
          description: {
            html: '<p>Your Booking Confirmed and have been emailed to you on {mail}</p>\n',
          },
        },
        {
          key: 'bookingDeclinedDueToSeatUnavailability',
          title: 'Your booking has failed!',
          description: {
            html: '<p><b>Your booking couldn’t be confirmed because of unavailability of seats.</b>The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in <a href="#">manage booking</a></p>\n',
          },
        },
        {
          key: 'bookingFailed',
          title: 'Your booking has failed!',
          description: {
            html: '<p><b>Your booking couldn’t be confirmed as the booking gateway failed.</b>The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in <a href="#">manage booking</a></p>\n',
          },
        },
        {
          key: 'BookingHold',
          title: 'Your booking has been put on hold!',
          description: {
            html: "<p>We are continuously checking the status of your payment. We request you to not make multiple payment and wait for few minutes till the status is updated.Don't worry, in case the payment fails your bank will automatically refund money to your account</p>\n",
          },
        },
        {
          key: 'bookingHoldPayLater',
          title: 'Your booking has been put on hold!',
          description: {
            html: '<p>Your reservation will remain on hold until <b>{date}</b></p>\n',
          },
        },
        {
          key: 'paymentFailed',
          title: 'Your payment has failed!',
          description: {
            html: '<p>Your Transection Was Declined By The Bank Due to Insufficient Fund.The deducted amount will be automatically refunded within 3-7 business days.Please check your refund status in <a href="#">manage booking</a> <b></b></p>\n',
          },
        },
      ],
      quickActionsTitle: {
        html: '<p>Quick <span class="text-green">Actions</span></p>\n',
      },
      quickActions: [
        {
          buttonCode: 'download',
          buttonValue: 'Download',
          path: 'download.html',
          icon: '/content/dam/s6app/in/en/assets/quick-actions-icons/download.svg',
        },
        {
          buttonCode: 'share',
          buttonValue: 'Share',
          path: 'share.html',
          icon: 'icon-share',
        },
        {
          buttonCode: 'email',
          buttonValue: 'Email',
          path: 'email.html',
          icon: null,
        },
        {
          buttonCode: 'wallet',
          buttonValue: 'Wallet',
          path: 'wallet.html',
          icon: '/content/dam/s6app/in/en/assets/quick-actions-icons/wallet.svg',
        },
      ],
      paymentDetailsLabel: 'Payment Details',
      paymentStatusLabels: {
        complete: 'Complete',
        pending: 'Pending!',
        failed: 'Failed',
      },
      retryPayment: 'Retry Payment',
      exploreLabel: 'Explore',
      readyToExploreLabel: 'Ready to Explore',
      checkAgain: 'Check Again',
      retryBooking: 'Retry Booking',
      transactionIdLabel: 'Transaction ID : {transactionId}',
      copyLabel: 'Copy',
      paymentDetailsDescription: 'You can check the status of the payment with your bank in case of any issue',
      flightDetailsLabel: 'Flight Details',
      checkinCloses: 'Checkin closes',
      stopLabel: 'Stop',
      kgLabel: 'KG',
      paxList: [
        {
          discountCode: null,
          typeCode: 'ADT',
          paxLabel: 'Adult',
          paxTitle: 'Adult',
        },
        {
          discountCode: null,
          typeCode: 'CHD',
          paxLabel: 'Children',
          paxTitle: 'Child',
        },
        {
          discountCode: null,
          typeCode: 'INFT',
          paxLabel: 'Infant',
          paxTitle: 'Infant',
        },
        {
          discountCode: 'SRCT',
          typeCode: 'ADT',
          paxLabel: 'Senior Citizen',
          paxTitle: 'Senior Citizen',
        },
      ],
      genderList: {
        0: 'Male',
        1: 'Female',
      },
      flightLabel: {
        departing: 'Departure Flight',
        returning: 'Return Flight',
      },
      flightType: {
        nonStop: 'Nonstop',
        connecting: 'Connect',
        via: 'Through',
      },
      travelTimeLabel: 'Travel Time',
      hourLabel: 'Hour',
      minuteLabel: 'Min',
      layoverLabel: 'layover',
      changeOfAirCraftLabel: 'Change of aircraft',
      baggageInfoLabel: 'Baggage Per Adult and Child',
      checkInBagInfo: '{checkInBaggage} Check-in',
      handBagInfo: '{cabinBaggage} Cabin',
      pnrLabel: 'PNR: {pnr}',
      paxLabel: 'Pax',
      pnrStatus: {
        confirmed: 'Confirmed',
        notGenerated: 'Not generated',
      },
      notGenerated: 'Not generated',
      passengersAndAddonsLabel: 'Passengers and Add-ons',
      returnFlightLabel: 'Return Flight',
      yearLabel: 'Year',
      wheelChairLabel: 'Wheelchair',
      feedbackTitle: 'Feedback',
      feedbackLabel: {
        html: '<p>Give us <span class="text-green">Feedback</span></p>\n',
      },
      travelTipsAndRemindersLabel: {
        html: '<p>Travel tips and <span class="text-green">Reminders</span></p>\n',
      },
      travelTips: [
        {
          title: 'First time flying?',
          image: {
            _path: '/content/dam/s6web/in/en/assets/itinerary/first-time-flying.png',
          },
          path: null,
        },
        {
          title: 'Documents to carry',
          image: {
            _path: '/content/dam/s6web/in/en/assets/itinerary/documents-to-carry.png',
          },
          path: null,
        },
        {
          title: 'Medical Assistant',
          image: {
            _path: '/content/dam/s6web/in/en/assets/itinerary/smart-web-checkin.jpg',
          },
          path: null,
        },
      ],
      smartWebCheckInTitle: 'Smart web checkin',
      viewLabel: {
        html: '<p><a href="/editor.html/content/dam/s6app/in/en/content-fragments/v1/global/itinerary-main.html#">VIEW</a></p>\n',
      },
      smartWebCheckInSubtext: {
        html: '<p>Check out other <span class="text-green">Add - ons</span></p>\n',
      },
      smartWebCheckInImage: {
        _path: '/content/dam/s6app/in/en/assets/smart-web-checkin.jpg',
      },
      smartWebCheckInOptions: {
        html: '<ul>\n<li>Schedule your web check-in beforehand.</li>\n<li>Receive your Boarding Pass on whatsApp.</li>\n</ul>\n',
      },
      checkoutOtherAddonsLabel: {
        html: '<p>Check out other <span class="text-green">Add - ons</span></p>\n',
      },
      addonOptions: [
        {
          categoryBundleCode: '6EPrime',
          title: '6E Prime',
          icon: null,
          tileLabel: null,
          tileImage: null,
          tileTitle: null,
          tileNote: null,
          ssrList: [],
        },
        {
          categoryBundleCode: '6ESeatAndEat',
          title: '6E Seat And Eat',
          icon: null,
          tileLabel: null,
          tileImage: null,
          tileTitle: null,
          tileNote: null,
          ssrList: [],
        },
      ],
      bookingHelpTitle: {
        html: '<p>Need help with <span class="text-green">Your Booking?</span></p>\n',
      },
      bookingHelpOptions: [
        {
          title: 'Chat with us',
          icon: null,
          description: {
            html: '<p>About any issue related to your booking</p>\n',
          },
          image: {},
          path: null,
        },
        {
          title: 'Manage booking',
          icon: null,
          description: {
            html: '<p>Go to ‘my trips’ and manage your bookings</p>\n',
          },
          image: {},
          path: null,
        },
      ],
      bookReturnFlightTitle: 'Book your Return Flight',
      bookReturnFlightSubtext: {
        html: '<p>Get rid of&nbsp;Last Minute Rush</p>\n',
      },
      bookReturnFlightDiscount: 'Save up to {} % on your return journey',
      bookReturnFlightPrice: '{city} flight starting from {price}',
      bookReturnFlightBgImage: {
        _path: '/content/dam/s6app/in/en/assets/offers1.jpg',
      },
      paymentDetails: {
        totalFareLabel: 'Total Fare',
        convenienceFeeLabel: 'Zero Convenience Fee',
        nextLabel: 'Next',
        fareDetailsLabel: 'Fare Details',
        flightLabel: {
          departing: 'Departure Flight',
          returning: 'Return Flight',
        },
        flightSummaryLabel: 'Flight Summary',
        earnedPtsLabel: 'Earned {points} pts',
        airFareChargeLabel: 'AirFare Charge',
        fuelChargeLabel: 'Fuel Charge',
        userDevelopmentFeeLabel: 'User Development fee',
        gstLabel: 'GST',
        airportSecurityFeesLabel: 'Airport security fees',
        addOnsSummaryLabel: 'Add-ons Summary',
        addOnsList: [
          {
            categoryBundleCode: '6EBar',
            title: 'One for the skies',
          },
          {
            categoryBundleCode: 'ABHF',
            title: 'Add Additional Bags',
          },
          {
            categoryBundleCode: 'SEAT',
            title: 'Sleep Essentials',
          },
          {
            categoryBundleCode: 'Goodnight',
            title: 'Sleep Essentials',
          },
          {
            categoryBundleCode: 'PROT',
            title: 'Travel Assistance',
          },
          {
            categoryBundleCode: 'FFWD',
            title: 'Fast Forward',
          },
          {
            categoryBundleCode: 'SPEQ',
            title: 'Add Sports Equipment',
          },
          {
            categoryBundleCode: 'PRBG',
            title: '6E QuickBoard',
          },
          {
            categoryBundleCode: 'baggage',
            title: 'Excess Baggage',
          },
          {
            categoryBundleCode: 'Meal',
            title: '6E Eat',
          },
          {
            categoryBundleCode: 'PRIM',
            title: '6E Prime',
          },
          {
            categoryBundleCode: 'MLST',
            title: '6E Seat And  Eat',
          },
          {
            categoryBundleCode: 'IFNR',
            title: 'Cancellation Assistance',
          },
        ],
        cuteChargeLabel: 'CUTE charge',
        rcsProvisionLabel: 'RCS provision',
        seatFeeLabel: 'Seat fee',
      },
      gstDetailsLabel: 'GST Details',
      gstNumberLabel: 'GST Number:',
      contactEmailLabel: 'E - mail:',
      gstCompany: 'GST Company:',
      contactDetailsLabel: 'Contact Details',
      numberLabel: 'Number:',
      gstEmailLabel: 'E - mail:',
      moreInfoLabel: {
        html: '<p>More <span class="text-green">Information</span></p>\n',
      },
      moreInfoOptions: [
        {
          title: 'Note',
          icon: null,
          description: {
            html: '<p>If your flight is cancelled or rescheduled from our end, you can use Plan B to change the time and / or date of your flight or cancel and process refund, at no additional cost.</p>\n',
          },
          image: {},
        },
        {
          title: 'Baggage Allowance: Flexible Fare',
          icon: null,
          description: {
            html: '<p>{} - {}</p>\n',
          },
          image: {},
        },
        {
          title: 'Terminal Information',
          icon: null,
          description: {
            html: null,
          },
          image: {},
        },
        {
          title: 'Terms & Conditions',
          icon: null,
          description: {
            html: null,
          },
          image: {},
        },
        {
          title: 'Flight Delay or Cancellation',
          icon: null,
          description: {
            html: null,
          },
          image: {},
        },
      ],
      retrieveAnotherItineraryLabel: 'Retrieve Another Itinerary',
    },
  },
};

export const MFDATA_CODE_SHARE = {
  codeShare: [
    {
      equipmentType: '320',
      carrierCode: '6E',
      equipmentTypeLabel: 'A320',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icDottedPlane.svg', // eslint-disable-line sonarjs/no-duplicate-string
      operatedByAirlinesLabel: 'Operated by Indigo Airlines', // eslint-disable-line sonarjs/no-duplicate-string
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icFlightStroke (1).svg', // eslint-disable-line sonarjs/no-duplicate-string
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/IndigoAirlines.png', // eslint-disable-line sonarjs/no-duplicate-string
    },
    {
      equipmentType: 'ATR',
      carrierCode: '6E',
      equipmentTypeLabel: 'ATR',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icATR (1).svg',
      operatedByAirlinesLabel: 'Operated by Indigo Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icATR (1).svg',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/IndigoAirlines.png',
    },
    {
      equipmentType: '321',
      carrierCode: '6E',
      equipmentTypeLabel: 'A321',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icDottedPlane.svg',
      operatedByAirlinesLabel: 'Operated by Indigo Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icFlightStroke (1).svg',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/IndigoAirlines.png',
    },
    {
      equipmentType: '77W',
      carrierCode: '6E',
      equipmentTypeLabel: 'B777',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icDottedPlane.svg',
      operatedByAirlinesLabel: 'Operated by Indigo Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icFlightStroke (1).svg',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/IndigoAirlines.png',
    },
    {
      equipmentType: '32B',
      carrierCode: '6E',
      equipmentTypeLabel: '32B',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icDottedPlane.svg',
      operatedByAirlinesLabel: 'Operated by Indigo Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/icFlightStroke (1).svg',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/IndigoAirlines.png',
    },
    {
      equipmentType: '321',
      carrierCode: 'TK',
      equipmentTypeLabel: 'A321',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png', // eslint-disable-line sonarjs/no-duplicate-string
      operatedByAirlinesLabel: 'Operated by Turkish Airlines', // eslint-disable-line sonarjs/no-duplicate-string
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png', // eslint-disable-line sonarjs/no-duplicate-string
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlines.png', // eslint-disable-line sonarjs/no-duplicate-string
    },
    {
      equipmentType: 'ATR',
      carrierCode: 'TK',
      equipmentTypeLabel: 'ATR',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      operatedByAirlinesLabel: 'Operated by Turkish Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlines.png',
    },
    {
      equipmentType: '320',
      carrierCode: 'TK',
      equipmentTypeLabel: 'A320',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      operatedByAirlinesLabel: 'Operated by Turkish Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlines.png',
    },
    {
      equipmentType: '77W',
      carrierCode: 'TK',
      equipmentTypeLabel: 'B777',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      operatedByAirlinesLabel: 'Operated by Turkish Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlines.png',
    },
    {
      equipmentType: '32B',
      carrierCode: 'TK',
      equipmentTypeLabel: '32B',
      carrierCodePopupIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      operatedByAirlinesLabel: 'Operated by Turkish Airlines',
      carrierCodeIcon: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlinesLogo.png',
      carrierCodeImage: '/content/dam/skyplus6e/in/en/assets/booking/srp/images/TurkishAirlines.png',
    },
  ],
  udaanLogoImage: '/content/dam/skyplus6e/in/en/assets/booking/itinerary/images/logo_udan updated.png',
  flightStatusLabel: {
    Departing: 'Departing Flight',
    Returning: 'Return Flight',
    CheckinCloses: 'Check-in closes',
    BagdropClose: 'Check-in/Bag Drop Closes',
  },
};
export const MFDATA_MOCKDATA_AEM_STRIP_DATA = {
  data: {
    scratchCardWidgetIcon: {
      _publishUrl: 'https://aem-s6web-dev-skyplus6e.goindigo.in/content/dam/s6web/in/en/assets/scratch-card/common/icon.gif',
    },
    scratchCardWidgetTextGuest: {
      html: '<p>Congratulations!<b> You have won a scratch card. Log in now to claim</b></p>\n',
    },
    scratchCardWidgetText: {
      html: '<p>Congratulations!<b> You have won a scratch card.</b></p>\n',
    },
    scratchCardWidgetButtonText: 'Redeem',
    scratchCardWidgetButtonTextGuest: 'Login',
    scratchCardWidgetBgColor: {
      color: 'Linear Gradient & Percentage',
      gradient: [
        {
          color: '#E0FED7',
          percentage: '0%',
        },
        {
          color: '#C1EDC1',
          percentage: '100%',
        },
      ],
    },
  },

};
