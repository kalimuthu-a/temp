const configJson = {
  data: {
    component: 'mf-itinerary',
    mfId: 'mf-itinerary',
    mfData: '',
    persona: 'member',
    configJson: {
      data: {
        itineraryMainByPath: {
          item: {
            bookingTitle: 'Booking',
            itineraryTitle: 'Itinerary',
            itineraryDetailsTitle: 'Your Itinerary Details',
            itineraryDetailsDescription: {
              html: "<p>Hey! {{}}</p><p>Your flight is in 2 days <a href='#'>Web Check-in</a></p>",
            },
            webCheckInTitle: 'Web Check-In',
            saveOrShareLabel: 'Save / Share',
            modifyLabel: 'Modify',
            modifyOptions: [
              {
                buttonCode: "Edit Add-On's",
                buttonValue: 'editAdd-Ons.html',
                icon: 'icon-editAdd-Ons',
              },
              {
                buttonCode: 'Change Seat',
                buttonValue: 'changeSeat.html',
                icon: 'icon-changeSeat',
              },
              {
                buttonCode: 'Split PNR',
                buttonValue: 'splitPNR.html',
                icon: 'icon-splitPNR',
              },
              {
                buttonCode: 'Update Contact',
                buttonValue: 'updateContact.html',
                icon: 'icon-updateContact',
              },
              {
                buttonCode: 'Change Flight',
                buttonValue: 'changeFlight.html',
                icon: 'icon-changeFlight',
              },
              {
                buttonCode: 'cancel Flight',
                buttonValue: 'cancelFlight.html',
                icon: 'icon-cancelFlight',
              },
              {
                buttonCode: 'Special Assistance',
                buttonValue: 'specialAssistance.html',
                icon: 'icon-specialAssistance',
              },
            ],
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
            earnedPtsLabel: 'Earned {{points}} pts',
            bookingStatus: [
              {
                key: 'Confirmed',
                title: 'Booking Confirmed',
                description: {},
                html: "<p>Your Booking Confirmed and have been emailed to you on <a href='#'>test@gmail.com</a></p>",
              },
              {
                key: 'BookingHoldPayLater',
                title: 'Your booking has been put on hold!',
                description: {},
                html: '<p>Your reservation will remain on hold until <b>30 oct 2023, 10:30 PM </b></p>',
              },
              {
                key: 'BookingFailed',
                title: 'Your booking has failed!',
                description: {},
                html: '<p><b>Your booking couldn’t be confirmed as the booking gateway failed.</b>The',
              },
              {
                key: 'PaymentFailed',
                title: 'Your payment has failed!',
                description: {},
                html: '<p>Your Transection Was Declined By The Bank Due to Insufficient Fund.</b>The',
              },
              {
                key: 'BookingHold',
                title: 'Your booking has been put on hold!',
                description: {},
                html: '<p>We are continuously checking the status of your payment. We request you to',
              },
              {
                key: 'BookingDeclinedDueToSeatUnavailability',
                title: 'Your booking has failed!',
                description: {},
                html: '<p><b>Your booking couldn’t be confirmed because of unavailability of seats.</b></p>',
              },
            ],
            quickActionsTitle: {
              html: '<p>Quick <span class="green">Actions</span></p>',
            },
            quickActions: [
              {
                buttonCode: 'Download',
                buttonValue: 'download.html',
                icon: 'icon-download',
              },
              {
                buttonCode: 'Share',
                buttonValue: 'share.html',
                icon: 'icon-share',
              },
              {
                buttonCode: 'Email',
                buttonValue: 'email.html',
                icon: 'icon-email',
              },
              {
                buttonCode: 'Wallet',
                buttonValue: 'wallet.html',
                icon: 'icon-wallet',
              },
            ],
            paymentDetailsLabel: 'Payment Details',
            paymentStatusLabels: {
              complete: 'Complete',
              pending: 'Pending!',
              failed: 'Failed',
            },
            retryPayment: 'retryPaymentLabel',
            exploreLabel: 'Explore',
            readyToExploreLabel: 'Ready to Explore',
            checkAgain: 'Check Again',
            retryBooking: 'Retry Booking',
            transactionidLabel: 'Transaction Id: {{transactionId}}',
            copyLabel: 'copy',
            paymentDetailsDescription:
              'You can check the status of the payment with your bank in case of',
            flightDetailsLabel: 'Flight Details',
            checkFlightStatus: ' Check flight status ',
            flightLabel: {
              departing: 'Departure Flight',
              returning: 'Return Flight',
            },
            flightType: {
              NonStop: 'Nonstop',
              Connecting: 'Connect',
              Via: 'Through',
            },
            travelTimeLabel: 'Travel Time',
            hourLabel: 'Hour',
            minuteLabel: 'Min',
            layoverLabel: 'layover',
            changeOfAirCraftLabel: 'Change of aircraft',
            baggageInfoLabel: 'Baggage Per Adult and Child',
            checkInBagInfo: '{{checkInBaggage}} Check-in',
            handBagInfo: '{{cabinBaggage}} Cabin',
            pnrLabel: 'PNR: {{pnr}}',
            paxLabel: 'Pax',
            pnrStatus: {
              confirmed: 'Confirmed',
              notGenerated: 'Not generated',
            },
            notGenerated: 'Not generated',
            passengersAndAddonsLabel: 'Passengers and Add-ons',
            yearLabel: 'Year',
            wheelchairLabel: 'Wheelchair',
            feedbackTitle: 'Feedback',
            feedbackLabel: {
              html: '<p>Give us <span class="green">Feedback</span></p>',
            },
            travelTipsAndRemindersLabel: {
              html: '<p>Travel tips and <span class="green">Reminders</span></p>',
            },
            travelTips: [
              {
                title: 'First time flying?',
                image: {
                  _path: '/content/dam/image1.jpg',
                },
              },
              {
                title: 'Documents to carry',
                image: {
                  _path: '/content/dam/image2.jpg',
                },
              },
              {
                title: 'Medical Assistant',
                image: {
                  _path: '/content/dam/image3.jpg',
                },
              },
            ],
            smartWebCheckInTitle: 'Smart web checkin',
            viewLabel: {
              html: "<p><a href='#'>VIEW</a><p>",
            },
            smartWebCheckInSubtext: {
              html: "<p>Get your <span class='green'>Boarding Pass</span> automatically</p>",
            },
            smartWebCheckInImage: {
              _path: '/content/dam/checkin.jpg',
            },
            smartWebCheckInOptions: {
              html: 'Schedule your web check-in beforehand.Receive your Boarding Pass on whatsApp.',
            },
            checkoutOtherAddonsLabel: {
              html: '<p>Check out other <span class="green">Add - ons</span></p>',
            },
            addOnOptions: [
              {
                categoryBundleCode: '6EPrime',
                title: '6E Prime',
                label: 'New',
              },
              {
                categoryBundleCode: '6EPrime',
                title: '6E Prime',
                label: 'New',
              },
            ],
            bookingHelpTitle: {
              html: '<p>Need help with <span class="green">Your Booking?</span></p>',
            },
            bookingHelpOptions: [
              {
                title: 'Chat with us',
                icon: 'chat-wiht-us.png',
                ' description ': {
                  ' html ':
                    ' < p > About any issue related to your booking < / p > ',
                },
              },
              {
                ' title ': ' Manage booking ',
                ' icon ': ' ',
                ' description ': {
                  ' html ':
                    ' < p > Go to ‘my trips’ and manage your bookings < / p > ',
                },
              },
            ],
            ' bookReturnFlightTitle ': ' Book your Return Flight ',
            ' bookReturnFlightSubText ': {
              ' html ': ' < p > Get rid of Last Minute Rush < / p > ',
            },
            ' bookReturnFlightDiscount ':
              ' Save up to 10 % on your return journey ',
            ' bookReturnFlightPrice ':
              ' {{city}} flight starting from {{price}}',
            ' bookReturnFlightBgImage ': {
              ' _path ': ' / content / dam / returnFlightbg.jpg ',
            },
            ' paymentDetails ': {
              ' totalFareLabel ': ' Total Fare ',
              ' convenienceFeeLabel ': ' Zero Convenience Fee ',
              ' fareDetailsLabel ': ' Fare Details ',
              ' airFareChargeLabel ': ' AirFare Charge ',
              ' fuelChargeLabel ': ' Fuel Charge ',
              ' userDevelopmentFeeLabel ': ' User Development fee ',
              ' gstLabel ': ' GST ',
              ' airportSecurityFeesLabel ': ' Airport security fees ',
              ' addOnsSummaryLabel ': ' Add - ons Summary ',
              ' cuteChargeLabel ': ' CUTE charge ',
              ' rcsProvisionLabel ': ' RCS provision ',
              ' seatFeeLabel ': ' Seat fee ',
              ' returnFlightLabel ': ' Return Flight ',
            },
            ' gstDetailsLabel ': ' GST Details ',
            ' getNumberLabel ': ' GST Number: ',
            ' contactEmailLabel ': ' E - mail: ',
            ' gstCompany ': ' GST Company: ',
            ' contactDetailsLabel ': ' Contact Details ',
            ' numberLabel ': ' Number: ',
            ' gstEmailLabel ': ' E - mail: ',
            ' moreInfoLabel ': {
              ' html ':
                " < p > More < span class = 'green' > Information < / span > < / p > ",
            },
            ' moreInfoOptions ': [
              {
                ' title ': ' Note ',
                ' icon ': ' ',
                ' description ': {
                  ' html ':
                    ' < p > If your flight is cancelled or rescheduled from our end,\n',
                },
              },
              {
                ' title ': ' Baggage Allowance: Flexible Fare ',
                ' icon ': ' ',
                ' description ': {
                  ' html ': ' < p > < / p > ',
                },
              },
              {
                ' title ': ' Terminal Information ',
                ' icon ': ' ',
                ' description ': {
                  ' html ': ' < p > < / p > ',
                },
              },
              {
                ' title ': ' Terms & Conditions ',
                ' icon ': ' ',
                ' description ': {
                  ' html ': ' < p > < / p > ',
                },
              },
              {
                ' title ': ' Flight Delay or Cancellation ',
                ' icon ': ' ',
                ' description ': {
                  ' html ': ' < p > < / p > ',
                },
              },
            ],
            ' retrieveAnotherItineraryLabel ': ' Retrieve Another Itinerary ',
          },
        },
        itineraryAdditionalByPath: {
          items: [
            {
              feedbackTitleSubtext: 'Please select one or more issue',
              feedbackOptions: [
                'Bad app experience',
                'Payment issues',
                'offer issues',
                'Communication issues',
              ],
              moreIssuesLabel: {
                html: "<p> <a href='#'>MORE ISSUES</a></p>",
              },
              submitLabel: 'Submit',
              proceed: 'Proceed',
              changeFlightDetails: {
                heading: 'CHANGE FLIGHT / BOOKING',
                description: {
                  html: 'Before proceeding, please select if you want to change flight or booking',
                },
                ctaLabel: 'Change Flight',
                SecondaryCtaLabel: 'Change Booking',
              },
              cancelFlightDetails: {
                heading: 'CANCEL FLIGHT / BOOKING',
                description: {
                  html: 'Before proceeding, please select if you want to cancel flight or booking',
                },
                ctaLabel: 'Cancel Flight',
                secondaryCtaLabel: 'Cancel Booking',
              },
              changeBookingText: {
                html: 'Change instead of cancel and get 15% off',
              },
              totalBookingLabel: 'Total Booking',
              totalBookingAmount: '1000',
              cancelChargesLabel: 'Cancel Charges (Including Tax)',
              cancelChargesAmount: '900',
              refundAmountLabel: 'Refund Amount',
              refundAmount: '900',
              selectRefundText: 'Select where you want to recieve the refund',
              refundDetails: [
                {
                  title: 'Back to source',
                  description:
                    'Note: if you booked through third party platforms, then please check their refund',
                },
                {
                  title: 'Credit shell',
                  description:
                    'Instantly get refund amount in credit shell and use it for future bookings thorug',
                },
              ],
              proceedLabel: 'Proceed',
              otpDetails: {
                otpTitle: 'OTP Confirmation',
                optMessage:
                  'Enter OTP sent to registered {{mobileNumber}} mapped with {{PNR}} PNR ',
                verifyOtp: 'Verify OTP',
                otpErrorMessage: 'Didn’t receive OPT ?',
                resendLabel: 'Resend',
                otpSubtext: 'OTP will expire in the next {{time}} sec',
              },
              successMessage: [
                {
                  key: 'adddonSuccess',
                  title: 'Add ons added!',
                  description: 'Your add ons are successfully added',
                },
                {
                  key: 'specialAssisstanceSuccess',
                  title: 'Special Assistance Added',
                  description:
                    'Wheel Chair has been has been added to special assistance successfully.',
                },
              ],
              discardChangesPopUp: {
                heading:
                  'Are you sure do you want to discard all the changes ?',
                ctaLabel: 'Yes',
                secondaryCtaLabel: 'No',
              },
              updateContactDetails: {
                title: 'CONTACT DETAILS',
                description: {
                  html: 'Your booking details will sent to the contact details below.',
                },
                addAnotherContact: 'Add another contact ',
                whatsappInfo: {
                  title: 'Get updates on ',
                  description: {
                    html: 'By subscribing to this, you agree to the terms and condition of Whatsapp and to the In',
                  },
                  image: '',
                },
                ctaLabel: 'Done',
              },
              submitPassengerDetails: {
                title: {
                  html: 'Submit International Passenger Details',
                },
                description:
                  'As per government regulations, details of all passengers arriving into India must b',
                mandatoryLabel: 'Error ! This field is mandatory',
                contactDetailsLabel: 'Contact Details',
                numberLabel: 'Number',
                emailLabel: 'Email',
                submitLabel: 'Submit',
                yearLabel: 'Year',
                wheelChairLabel: 'Wheelchair -',
                ageLabel: 'Age*',
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
                passportNumber: 'Passport Number*',
                issuingCountryCode: 'Issuing Country Code*',
                passportExpiry: 'Passport Expiry*',
                profession: 'Profession*',
                domicile: 'Domicile in India State/UT*',
                fullAddressInIndia: 'Full Address in India*',
                covidTest: 'Covid test done*',
                covidTestOptions: {
                  yes: 'Yes',
                  no: 'No',
                },
                saveDetails: 'Save Details',
              },
              contactDetailsStatus: 'Contact details updated',
              passangerDetailsStatus:
                'Passenger details submitted successfully ',
              resetChangesLabel: 'Reset Changes',
            },
          ],
        },
      },
    },
  },
};

export default configJson;
