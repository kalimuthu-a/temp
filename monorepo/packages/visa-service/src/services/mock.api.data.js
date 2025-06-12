/* eslint-disable */

export const mockCountryList = {
  response: {
    "code": "0",
    "data": {
      "countries": [
        "Dubai",
        "Vietnam",
        "UAE",
        "Ukraine",
        "Singapore",
        "Australia",
        "Thailand",
        "New Zealand",
        "Hong Kong",
        "Bangladesh",
        "Malaysia",
        "Azerbaijan",
        "Cambodia",
        "Russia",
        "Burma",
        "South Korea",
        "Indonesia",
        "Sudan",
        "Saudi Arabia"
      ],
      "countryImageUrl": {
        "Singapore": "https://static.visa2fly.com/country-background-v1/Singapore.jpg",
        "Hong Kong": "https://static.visa2fly.com/country-background-v1/Hong%20Kong.jpg",
        "Cambodia": "https://static.visa2fly.com/country-background-v1/Cambodia.jpg",
        "Ukraine": "https://static.visa2fly.com/country-background-v1/Ukraine.jpg",
        "Sudan": "https://static.visa2fly.com/country-background-v1/Sudan.jpg",
        "Malaysia": "https://static.visa2fly.com/country-background-v1/Malaysia.jpg",
        "Burma": "https://static.visa2fly.com/country-background-v1/Burma.jpg",
        "Thailand": "https://static.visa2fly.com/country-background-v1/Thailand.jpg",
        "Dubai": "https://static.visa2fly.com/country-background-v1/Dubai.jpg",
        "Russia": "https://static.visa2fly.com/country-background-v1/Russia.jpg",
        "New Zealand": "https://static.visa2fly.com/country-background-v1/New%20Zealand.jpg",
        "Saudi Arabia": "https://static.visa2fly.com/country-background-v1/Saudi%20Arabia.jpg",
        "Azerbaijan": "https://static.visa2fly.com/country-background-v1/Azerbaijan.jpg",
        "Vietnam": "https://static.visa2fly.com/country-background-v1/Vietnam.jpg",
        "Bangladesh": "https://static.visa2fly.com/country-background-v1/Bangladesh.jpg",
        "South Korea": "https://static.visa2fly.com/country-background-v1/South%20Korea.jpg",
        "UAE": "https://static.visa2fly.com/country-background-v1/UAE.jpg",
        "Australia": "https://static.visa2fly.com/country-background-v1/Australia.jpg",
        "Indonesia": "https://static.visa2fly.com/country-background-v1/Indonesia.jpg"
      },
      "countryIsoCode": {
        "Singapore": {
          "isoCodeA3": "SGP",
          "isoCodeA2": "SG"
        },
        "Hong Kong": {
          "isoCodeA3": "HKG",
          "isoCodeA2": "HK"
        },
        "Cambodia": {
          "isoCodeA3": "KHM",
          "isoCodeA2": "KH"
        },
        "Ukraine": {
          "isoCodeA3": "UKR",
          "isoCodeA2": "UA"
        },
        "Sudan": {
          "isoCodeA3": "SSD",
          "isoCodeA2": "SD"
        },
        "Malaysia": {
          "isoCodeA3": "MYS",
          "isoCodeA2": "MY"
        },
        "Burma": {
          "isoCodeA3": "MMR",
          "isoCodeA2": "MM"
        },
        "Thailand": {
          "isoCodeA3": "THA",
          "isoCodeA2": "TH"
        },
        "Dubai": {
          "isoCodeA3": "DUB",
          "isoCodeA2": "DU"
        },
        "Russia": {
          "isoCodeA3": "RUS",
          "isoCodeA2": "RU"
        },
        "New Zealand": {
          "isoCodeA3": "NZL",
          "isoCodeA2": "NZ"
        },
        "Saudi Arabia": {
          "isoCodeA3": "SAU",
          "isoCodeA2": "SA"
        },
        "Azerbaijan": {
          "isoCodeA3": "AZE",
          "isoCodeA2": "AZ"
        },
        "Vietnam": {
          "isoCodeA3": "VNM",
          "isoCodeA2": "VN"
        },
        "Bangladesh": {
          "isoCodeA3": "BGD",
          "isoCodeA2": "BD"
        },
        "South Korea": {
          "isoCodeA3": "PRK",
          "isoCodeA2": "KP"
        },
        "UAE": {
          "isoCodeA3": "ARE",
          "isoCodeA2": "AE"
        },
        "Australia": {
          "isoCodeA3": "AUS",
          "isoCodeA2": "AU"
        },
        "Indonesia": {
          "isoCodeA3": "IDN",
          "isoCodeA2": "ID"
        }
      }
    },
    "message": "Country list fetched successfully"
  },
};

export const mockGetCountryByName = {
  response: {
    message: 'Data Fetched Successfully',
    data: {
      country: 'Dubai',
      schengenCountry: false,
      onlineCategory: true,
      stickerWithBioMetrics: false,
      stickerWithoutBioMetrics: true,
      documentRequired: {
        TRANSIT: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'Upload scanned colour copy of your passport-sized photograph.',
              'Photo should be taken against a white background.',
              'Dimensions should be 45mm height x 35mm width.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too).',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
          {
            fieldName: 'Flight Ticket',
            display: true,
            content: [
              'Both arrival and departure flight tickets are required to apply for Dubai transit e-visa.',
            ],
            sequence: 4,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        BUSINESS: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'Upload scanned colour copy of your passport-sized photograph.',
              'Photo should be taken against a white backgroud.',
              'Dimensions should be 45mm height x 35mm width.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too)',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        TOURIST: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'You need to upload passport-size photos with white or grey background with the dimensions of 35X45.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Text',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too)',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        JOBSEEKER: [
          {
            fieldName: 'Photograph',
            display: true,
            content: ['Photgraph required.'],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: ['Passport required'],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
        ],
      },
      faqs: {
        'What if i stay beyond the mentioned stay duration as per evisa?':
          'If you exceed the stay duration on the e-Visa, you may be required to pay fines, be deported, or otherwise forbidden from future travel to UAE',
        'How many days before I can apply for Dubai Visa?':
          'Passenger can apply for UAE countries visa maximum 2 months before their travel date & not before that as maximum validity of UAE countries visa is 59 Days, ideally it is suggested to apply for visa 10 days before the departure as visa processing time is 2 to 4 Working Days',
        'Do i need to be fully vaccinated if i want travel to Dubai?':
          'Yes, you need to be fully vaccinated with covishield or any of the EMA approved vaccines (Pfizer,Moderna,AstraZeneca,covishield) at the time of departure from India. Note: You should be fully vaccinated 14 days prior to the Journey date',
        'Do i need a RTPCR report even if i am fully vaccinated?':
          'Yes, you need to have RTPCR report that must be done 72 hours prior to the Departure from India',
        'Whether Travel Insurance is required for travel to Dubai?':
          'For issuance of Visa, Travel Insurance is not required but while travelling it is must to carry Travel Insurance along.',
        'If I have been issued UAE visa but I did not travel on that visa, then is it necessary to cancel that visa?':
          'Yes, if any passenger has been issued Dubai visa but for any reason if he/she later on decides not to travel to UAE country then in such scenario existing UAE country visa needs to be cancelled from Agent from whom visa has been issued, Visa can be cancelled either within the validity of the visa OR after the visa validity is expired. Visa cancellation is very crucial, if any passenger wants to apply for his UAE visa in near future for next travel & if he /she has not cancelled his/her previous UAE visa then his /her current visa application will be rejected. Visa cancellation charges will be applicable for cancelling visa, you can check on this with our Visa2fly Expert Team before you apply for your visa.',
        'In the event of my application being rejected, will i get a refund of my visa fee?':
          'Currently, the UAE Immigration does not refund fees for rejected applications. However, security deposits will be refunded within four (international) working days of the application being returned.',
        'When UAE countries Immigration is closed?':
          'UAE countries Immigration is closed on Friday and Saturday',
        'What are quarantine rules for Dubai?':
          'Their are no quarantine rule in dubai right now.',
        'Can I apply for another visa simultaneously while my UAE visa is in progress?':
          'Yes, as UAE Visa is a E – Visa, you need not have to provide any physical documents, so while your UAE visa is in process, one can simultaneously apply for another visa & save on time.',
      },
      importantInfo: [
        'All Indian passport holders require a valid visa to enter Dubai. Testing',
        'You need to be fully vaccinated with covishield or any of the EMA approved vaccines (Pfizer,Moderna,AstraZeneca,covishield) to travel to Dubai',
        'Each applicant must have all the mandatory documents as mentioned in document requirement section.',
        'In addition to the documents mentioned, our visa experts or the concerned embassy may require you to furnish additional documents to process your visa.Your cooperation in furnishing any such additional documents is essential for a positive outcome.',
        'Fee may vary for country if rate of the embassy fluctuate.',
      ],
      displayQuotes: [
        {
          quoteId: 'Dubai-quote-10',
          countryName: 'Dubai',
          purpose: 'Business',
          entryType: 'Single Entry',
          stayPeriod: '29 Days',
          currency: 'INR',
          basePrice: 6000,
          fee: 508.47,
          serviceTax: 91.53,
          markup: null,
          validity: '65 Days',
          processingTime: '2 to 4 Business Days',
          minProcessingTime: 2,
          maxProcessingTime: 4,
          minProcessingTimeMatrix: 'Days',
          maxProcessingTimeMatrix: 'Days',
          embassyMinProcessingTime: 1,
          embassyMaxProcessingTime: 2,
          embassyMinProcessingTimeMatrix: 'Days',
          embassyMaxProcessingTimeMatrix: 'Days',
          category: 'e-visa',
          imageUpload: true,
          addressRequired: false,
          disclaimer: 'Insurance included. Price is inclusive of taxes.',
          disclaimers: ['Insurance included. Price is inclusive of taxes.'],
          processingType: 'Standard',
          minTravelDate: 2,
          priceDistribution: [
            {
              minAge: 18,
              maxAge: 120,
              basePrice: 12000,
              fee: 508.47,
              serviceTax: 91.53,
            },
            {
              minAge: 0,
              maxAge: 18,
              basePrice: 4000,
              fee: 338.98,
              serviceTax: 61.02,
            },
          ],
          withServices: 'I',
          popular: false,
          errorMsg: null,
          getVisaBy: null,
          expectationJourneyCategory: 'Evisa',
          journeyLabel: null,
          journeyTime: null,
          stayPeriodDaysCount: 0,
        },
        {
          quoteId: 'Dubai-quote-18',
          countryName: 'Dubai',
          purpose: 'Business',
          entryType: 'Multiple Entry',
          stayPeriod: '29 Days',
          currency: 'INR',
          basePrice: 14500,
          fee: 423.73,
          serviceTax: 76.27,
          markup: null,
          validity: '30 Days',
          processingTime: '2 to 4 Business Days',
          minProcessingTime: 2,
          maxProcessingTime: 4,
          minProcessingTimeMatrix: 'Days',
          maxProcessingTimeMatrix: 'Days',
          embassyMinProcessingTime: 1,
          embassyMaxProcessingTime: 2,
          embassyMinProcessingTimeMatrix: 'Days',
          embassyMaxProcessingTimeMatrix: 'Days',
          category: 'e-visa',
          imageUpload: true,
          addressRequired: false,
          disclaimer: 'Insurance included. Price is inclusive of taxes.',
          disclaimers: ['Insurance included. Price is inclusive of taxes.'],
          processingType: 'Standard',
          minTravelDate: 2,
          priceDistribution: [
            {
              minAge: 0,
              maxAge: 120,
              basePrice: 14500,
              fee: 423.73,
              serviceTax: 76.27,
            },
          ],
          withServices: null,
          popular: false,
          errorMsg: null,
          getVisaBy: null,
          expectationJourneyCategory: 'Evisa',
          journeyLabel: null,
          journeyTime: null,
          stayPeriodDaysCount: 0,
        },
      ],
      markup: 0,
      isoCodeA2: 'DU',
      isoCodeA3: 'DUB',
      announcement: null,
    },
  },
};

export const mockGetCountryByGroupedName = {
  response: {
    data: {
      country: 'Dubai',
      schengenCountry: false,
      onlineCategory: true,
      stickerWithBioMetrics: false,
      stickerWithoutBioMetrics: true,
      documentRequired: {
        transit: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'Upload scanned colour copy of your passport-sized photograph.',
              'Photo should be taken against a white background.',
              'Dimensions should be 45mm height x 35mm width.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too).',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
          {
            fieldName: 'Flight Ticket',
            display: true,
            content: [
              'Both arrival and departure flight tickets are required to apply for Dubai transit e-visa.',
            ],
            sequence: 4,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        business: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'Upload scanned colour copy of your passport-sized photograph.',
              'Photo should be taken against a white backgroud.',
              'Dimensions should be 45mm height x 35mm width.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too)',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        tourist: [
          {
            fieldName: 'Photograph',
            display: true,
            content: [
              'You need to upload passport-size photos with white or grey background with the dimensions of 35X45.',
            ],
            sequence: 1,
            samplelink: [
              {
                content: 'Text',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: [
              'Upload coloured copies of the front and last page of your passport.',
              'Ensure that passport should be valid for 6 months from the date of entry to the Dubai.',
            ],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
          {
            fieldName: 'Pan card',
            display: true,
            content: [
              'Applicants need to upload scanned copy of their pan card (If you are a student or a minor travelling with your parent/guardian, their Pan-Card is required too)',
            ],
            sequence: 3,
            samplelink: [
              {
                content: 'Text',
                link: 'Just for Testing',
              },
            ],
          },
        ],
        jobseeker: [
          {
            fieldName: 'Photograph',
            display: true,
            content: ['Photgraph required.'],
            sequence: 1,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              },
            ],
          },
          {
            fieldName: 'Passport',
            display: true,
            content: ['Passport required'],
            sequence: 2,
            samplelink: [
              {
                content: 'Link',
                link: 'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              },
            ],
          },
        ],
      },
      faqs: {
        'What if i stay beyond the mentioned stay duration as per evisa?':
          'If you exceed the stay duration on the e-Visa, you may be required to pay fines, be deported, or otherwise forbidden from future travel to UAE',
        'How many days before I can apply for Dubai Visa?':
          'Passenger can apply for UAE countries visa maximum 2 months before their travel date & not before that as maximum validity of UAE countries visa is 59 Days, ideally it is suggested to apply for visa 10 days before the departure as visa processing time is 2 to 4 Working Days',
        'Do i need to be fully vaccinated if i want travel to Dubai?':
          'Yes, you need to be fully vaccinated with covishield or any of the EMA approved vaccines (Pfizer,Moderna,AstraZeneca,covishield) at the time of departure from India. Note: You should be fully vaccinated 14 days prior to the Journey date',
        'Do i need a RTPCR report even if i am fully vaccinated?':
          'Yes, you need to have RTPCR report that must be done 72 hours prior to the Departure from India',
        'Whether Travel Insurance is required for travel to Dubai?':
          'For issuance of Visa, Travel Insurance is not required but while travelling it is must to carry Travel Insurance along.',
        'If I have been issued UAE visa but I did not travel on that visa, then is it necessary to cancel that visa?':
          'Yes, if any passenger has been issued Dubai visa but for any reason if he/she later on decides not to travel to UAE country then in such scenario existing UAE country visa needs to be cancelled from Agent from whom visa has been issued, Visa can be cancelled either within the validity of the visa OR after the visa validity is expired. Visa cancellation is very crucial, if any passenger wants to apply for his UAE visa in near future for next travel & if he /she has not cancelled his/her previous UAE visa then his /her current visa application will be rejected. Visa cancellation charges will be applicable for cancelling visa, you can check on this with our Visa2fly Expert Team before you apply for your visa.',
        'In the event of my application being rejected, will i get a refund of my visa fee?':
          'Currently, the UAE Immigration does not refund fees for rejected applications. However, security deposits will be refunded within four (international) working days of the application being returned.',
        'When UAE countries Immigration is closed?':
          'UAE countries Immigration is closed on Friday and Saturday',
        'What are quarantine rules for Dubai?':
          'Their are no quarantine rule in dubai right now.',
        'Can I apply for another visa simultaneously while my UAE visa is in progress?':
          'Yes, as UAE Visa is a E – Visa, you need not have to provide any physical documents, so while your UAE visa is in process, one can simultaneously apply for another visa & save on time.',
      },
      importantInfo: [
        'All Indian passport holders require a valid visa to enter Dubai. Testing',
        'You need to be fully vaccinated with covishield or any of the EMA approved vaccines (Pfizer,Moderna,AstraZeneca,covishield) to travel to Dubai',
        'Each applicant must have all the mandatory documents as mentioned in document requirement section.',
        'In addition to the documents mentioned, our visa experts or the concerned embassy may require you to furnish additional documents to process your visa.Your cooperation in furnishing any such additional documents is essential for a positive outcome.',
        'Fee may vary for country if rate of the embassy fluctuate.',
      ],
      displayQuotes: {
        standard: [
          {
            quoteId: 'Dubai-quote-10',
            countryName: 'Dubai',
            purpose: 'Business',
            entryType: 'Single Entry',
            stayPeriod: '29 Days',
            currency: 'INR',
            basePrice: 6000,
            fee: 508.47,
            serviceTax: 91.53,
            markup: null,
            validity: '65 Days',
            processingTime: '2 to 4 Business Days',
            minProcessingTime: 2,
            maxProcessingTime: 4,
            minProcessingTimeMatrix: 'Days',
            maxProcessingTimeMatrix: 'Days',
            embassyMinProcessingTime: 1,
            embassyMaxProcessingTime: 2,
            embassyMinProcessingTimeMatrix: 'Days',
            embassyMaxProcessingTimeMatrix: 'Days',
            category: 'e-visa',
            imageUpload: true,
            addressRequired: false,
            disclaimer: 'Insurance included. Price is inclusive of taxes.',
            disclaimers: ['Insurance included. Price is inclusive of taxes.'],
            processingType: 'Standard',
            minTravelDate: 2,
            priceDistribution: [
              {
                minAge: 18,
                maxAge: 120,
                basePrice: 12000,
                fee: 508.47,
                serviceTax: 91.53,
              },
              {
                minAge: 0,
                maxAge: 18,
                basePrice: 4000,
                fee: 338.98,
                serviceTax: 61.02,
              },
            ],
            withServices: 'I',
            popular: false,
            errorMsg: null,
            getVisaBy: null,
            expectationJourneyCategory: 'Evisa',
            journeyLabel: null,
            journeyTime: null,
            stayPeriodDaysCount: 0,
          },
          {
            quoteId: 'Dubai-quote-18',
            countryName: 'Dubai',
            purpose: 'Business',
            entryType: 'Multiple Entry',
            stayPeriod: '29 Days',
            currency: 'INR',
            basePrice: 14500,
            fee: 423.73,
            serviceTax: 76.27,
            markup: null,
            validity: '30 Days',
            processingTime: '2 to 4 Business Days',
            minProcessingTime: 2,
            maxProcessingTime: 4,
            minProcessingTimeMatrix: 'Days',
            maxProcessingTimeMatrix: 'Days',
            embassyMinProcessingTime: 1,
            embassyMaxProcessingTime: 2,
            embassyMinProcessingTimeMatrix: 'Days',
            embassyMaxProcessingTimeMatrix: 'Days',
            category: 'e-visa',
            imageUpload: true,
            addressRequired: false,
            disclaimer: 'Insurance included. Price is inclusive of taxes.',
            disclaimers: ['Insurance included. Price is inclusive of taxes.'],
            processingType: 'Standard',
            minTravelDate: 2,
            priceDistribution: [
              {
                minAge: 0,
                maxAge: 120,
                basePrice: 14500,
                fee: 423.73,
                serviceTax: 76.27,
              },
            ],
            withServices: null,
            popular: false,
            errorMsg: null,
            getVisaBy: null,
            expectationJourneyCategory: 'Evisa',
            journeyLabel: null,
            journeyTime: null,
            stayPeriodDaysCount: 0,
          },
          {
            quoteId: 'Dubai-quote-46',
            countryName: 'Dubai',
            purpose: 'Tourist',
            entryType: 'Single Entry',
            stayPeriod: '30 Days',
            currency: 'INR',
            basePrice: 8000,
            fee: 423.73,
            serviceTax: 76.27,
            markup: null,
            validity: '58 Days',
            processingTime: '2 to 3 Business Days',
            minProcessingTime: 2,
            maxProcessingTime: 3,
            minProcessingTimeMatrix: 'Days',
            maxProcessingTimeMatrix: 'Days',
            embassyMinProcessingTime: 1,
            embassyMaxProcessingTime: 2,
            embassyMinProcessingTimeMatrix: 'Days',
            embassyMaxProcessingTimeMatrix: 'Days',
            category: 'e-visa',
            imageUpload: true,
            addressRequired: false,
            disclaimer:
              'Business Days: Monday to Friday|For children(0-16 yrs): INR 4550|Price is inclusive of taxes.|Prices are subject to change without notice',
            disclaimers: [
              'Business Days: Monday to Friday',
              'For children(0-16 yrs): INR 4550',
              'Price is inclusive of taxes.',
              'Prices are subject to change without notice',
            ],
            processingType: 'Express',
            minTravelDate: 2,
            priceDistribution: [
              {
                minAge: 0,
                maxAge: 120,
                basePrice: 8000,
                fee: 423.73,
                serviceTax: 76.27,
              },
            ],
            withServices: null,
            popular: false,
            errorMsg: null,
            getVisaBy: null,
            expectationJourneyCategory: 'Evisa',
            journeyLabel: null,
            journeyTime: null,
            stayPeriodDaysCount: 0,
          },
        ],
        express: [
          {
            quoteId: 'Dubai-quote-46',
            countryName: 'Dubai',
            purpose: 'Tourist',
            entryType: 'Single Entry',
            stayPeriod: '30 Days',
            currency: 'INR',
            basePrice: 8000,
            fee: 423.73,
            serviceTax: 76.27,
            markup: null,
            validity: '58 Days',
            processingTime: '2 to 3 Business Days',
            minProcessingTime: 2,
            maxProcessingTime: 3,
            minProcessingTimeMatrix: 'Days',
            maxProcessingTimeMatrix: 'Days',
            embassyMinProcessingTime: 1,
            embassyMaxProcessingTime: 2,
            embassyMinProcessingTimeMatrix: 'Days',
            embassyMaxProcessingTimeMatrix: 'Days',
            category: 'e-visa',
            imageUpload: true,
            addressRequired: false,
            disclaimer:
              'Business Days: Monday to Friday|For children(0-16 yrs): INR 4550|Price is inclusive of taxes.|Prices are subject to change without notice',
            disclaimers: [
              'Business Days: Monday to Friday',
              'For children(0-16 yrs): INR 4550',
              'Price is inclusive of taxes.',
              'Prices are subject to change without notice',
            ],
            processingType: 'Express',
            minTravelDate: 2,
            priceDistribution: [
              {
                minAge: 0,
                maxAge: 120,
                basePrice: 8000,
                fee: 423.73,
                serviceTax: 76.27,
              },
            ],
            withServices: null,
            popular: false,
            errorMsg: null,
            getVisaBy: null,
            expectationJourneyCategory: 'Evisa',
            journeyLabel: null,
            journeyTime: null,
            stayPeriodDaysCount: 0,
          },
          {
            quoteId: 'Dubai-quote-47',
            countryName: 'Dubai',
            purpose: 'Tourist',
            entryType: 'Single Entry',
            stayPeriod: '60 Days',
            currency: 'INR',
            basePrice: 15000,
            fee: 508.47,
            serviceTax: 91.53,
            markup: null,
            validity: '58 Days',
            processingTime: '1 to 2 Business Days',
            minProcessingTime: 1,
            maxProcessingTime: 2,
            minProcessingTimeMatrix: 'Days',
            maxProcessingTimeMatrix: 'Days',
            embassyMinProcessingTime: 1,
            embassyMaxProcessingTime: 2,
            embassyMinProcessingTimeMatrix: 'Days',
            embassyMaxProcessingTimeMatrix: 'Days',
            category: 'e-visa',
            imageUpload: true,
            addressRequired: false,
            disclaimer:
              'Business Days: Monday to Friday|Price is inclusive of taxes.|Prices are subject to change without notice|For children(0-16 yrs): INR 6500',
            disclaimers: [
              'Business Days: Monday to Friday',
              'Price is inclusive of taxes.',
              'Prices are subject to change without notice',
              'For children(0-16 yrs): INR 6500',
            ],
            processingType: 'Express',
            minTravelDate: 1,
            priceDistribution: [
              {
                minAge: 0,
                maxAge: 120,
                basePrice: 15000,
                fee: 508.47,
                serviceTax: 91.53,
              },
            ],
            withServices: null,
            popular: false,
            errorMsg: null,
            getVisaBy: null,
            expectationJourneyCategory: 'Evisa',
            journeyLabel: null,
            journeyTime: null,
            stayPeriodDaysCount: 0,
          },
        ],
      },
      markup: 0,
      isoCodeA2: 'DU',
      isoCodeA3: 'DUB',
      announcement: null,
      staticImageUrl:
        'https://static.visa2fly.com/country-background-v1/Dubai.jpg',
    },
    message: 'Data Fetched Successfully',
  },
};

export const mockOccupationList = {
  response: {
    message: 'Occupation list fetched successfully',
    data: [
      {
        occupationId: 1,
        occupation: 'Self Employed',
      },
      {
        occupationId: 2,
        occupation: 'Employee',
      },
      {
        occupationId: 3,
        occupation: 'Student',
      },
      {
        occupationId: 4,
        occupation: 'Housewife',
      },
      {
        occupationId: 5,
        occupation: 'Retired',
      },
      {
        occupationId: 6,
        occupation: 'Other',
      },
    ],
  },
};

export const mockPostCreateBooking = {
  response: {
    message: 'Traveler details added successfully ',
    data: {
      bookingId: '1740140162593HZ0QZ',
      travelerCount: 2,
      dateOfTravel: '2025-08-29',
      showProcessingTimeWarning: false,
      totalAmount: 17000,
      bookingAmount: 17000,
      totalMarkup: 0,
      markupBreakdown: [
        {
          serviceType: 'Visa',
          markup: 10,
        },
      ],
      travelerDetails: [
        {
          travelerId: 6784,
          name: 'Jankilal Dhakad',
          price: {
            minAge: 18,
            maxAge: 120,
            basePrice: 12000,
            fee: null,
            serviceTax: 91.53,
          },
          categoryName: 'Adult',
          passortNumber: 'A0000025',
        },
        {
          travelerId: 6785,
          name: 'Aman Deep',
          price: {
            minAge: 0,
            maxAge: 18,
            basePrice: 4000,
            fee: null,
            serviceTax: 61.02,
          },
          categoryName: 'Child',
          passortNumber: 'A0000625',
        },
      ],
      priceDistributions: [
        {
          categoryName: 'Adult',
          ageRange: '18-120',
          amountPerPerson: 12600,
          subTotal: 12600,
          basePricing: {
            basePrice: 12000,
            fee: 508.47,
            tax: 91.53,
          },
          pax: 1,
        },
        {
          categoryName: 'Child',
          ageRange: '0-18',
          amountPerPerson: 4400,
          subTotal: 4400,
          basePricing: {
            basePrice: 4000,
            fee: 338.98,
            tax: 61.02,
          },
          pax: 1,
        },
      ],
      address: null,
      listOfDocuments: {
        collectAddress: false,
        travelerDocument: {
          travelerId: 6784,
          travelerName: 'Jankilal Dhakad',
          docDetails: [
            {
              docName: 'Photograph',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sequence: 1,
              fieldName: 'photograph',
              sampleType: 'Link',
              sample: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              sameAsPrimaryAllowed: false,
            },
            {
              docName: 'Passport front page',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sequence: 2,
              fieldName: 'passportFrontImage',
              sampleType: 'Link',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              sameAsPrimaryAllowed: false,
            },
            {
              docName: 'Passport bio page',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sequence: 3,
              fieldName: 'passportBioImage',
              sampleType: 'Link',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_BACK.jpg',
              sameAsPrimaryAllowed: false,
            },
            {
              docName: 'Pan card',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sequence: 4,
              fieldName: 'panCard',
              sampleType: 'Text',
              sample:
                'If you do not have pan card and traveling with family, you can upload pan card of other family member (traveling with you)',
              sameAsPrimaryAllowed: false,
            },
          ],
        },
        travelers: [
          {
            travelerId: 6784,
            name: 'Jankilal Dhakad',
            price: null,
            categoryName: null,
            passortNumber: null,
          },
          {
            travelerId: 6785,
            name: 'Aman Deep',
            price: null,
            categoryName: null,
            passortNumber: null,
          },
        ],
      },
      announcement: null,
      partnerUserId: null,
      partnerBookingId: null,
    },
  },
};

export const mockGetBookingStatus = {
  response: {
    code: '0',
    status: 'SUCCESS',
    message: 'Booking details fetched successfully',
    data: {
      totalAmount: 17000,
      crossSellAmount: null,
      couponCode: null,
      discount: null,
      bookingId: '1739765600609TT50A',
      travelerBasicDetails: [
        {
          travelerId: 6277,
          title: 'Mr',
          firstName: 'Jankilal',
          middleName: null,
          lastName: 'Dhakad',
          cell: '8871404247',
          emailId: 'jankilal.dhakad@visa2fly.com',
          dateOfBirth: '1996-07-31',
          occupation: 'Employee',
          designation: null,
          primaryTraveler: true,
          passportExpiry: '2027-08-30',
          passportNumber: 'A0000025',
          relation: null,
          bookingStatus: 'Visa application approved',
          success: false,
          complete: false,
          travelDetails: false,
          otherDetails: false,
          gender: null,
          evisaFileName: 'evisa_Jankilal_Dhakad_1739765600609TT50A.pdf',
          insuranceFileName: 'insurance_Jankilal_Dhakad_1739765600609TT50A.pdf',
          ecrPassport: false,
          documentId: '67b2b760c8653f0001599a71',
          anyRemarkExists: false,
          totalDocsCount: 0,
          uploadedDocsCount: 0,
        },
        {
          travelerId: 6278,
          title: 'Mr',
          firstName: 'Aman',
          middleName: null,
          lastName: 'Deep',
          cell: '8871404247',
          emailId: 'jankilal.dhakad@visa2fly.com',
          dateOfBirth: '2010-07-31',
          occupation: 'Student',
          designation: null,
          primaryTraveler: false,
          passportExpiry: '2027-08-30',
          passportNumber: 'A0000625',
          relation: null,
          bookingStatus: 'Visa application approved',
          success: false,
          complete: false,
          travelDetails: false,
          otherDetails: false,
          gender: null,
          evisaFileName: 'evisa_Aman_Deep_1739765600609TT50A.pdf',
          insuranceFileName: 'insurance_Aman_Deep_1739765600609TT50A.pdf',
          ecrPassport: false,
          documentId: '67b2b760c8653f0001599a72',
          anyRemarkExists: false,
          totalDocsCount: 0,
          uploadedDocsCount: 0,
        },
      ],
      showAddress: false,
      travelerDocs: [
        {
          travelerId: 6277,
          travelerName: 'Jankilal Dhakad',
          bookingStatus: null,
          docs: [
            {
              documentType: 'Photograph',
              documentDesc: null,
              fileName: 'Photograph_Jankilal_Dhakad_1739765600609TT50A.png',
              uploaded: true,
              docName: 'Photograph',
              fieldName: 'photograph',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              sampleType: 'Link',
              sequence: 1,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Passport front page',
              documentDesc: null,
              fileName: 'Passport front page_67b2b760c8653f0001599a71.jpeg',
              uploaded: true,
              docName: 'Passport front page',
              fieldName: 'passportFrontImage',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              sampleType: 'Link',
              sequence: 2,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Passport bio page',
              documentDesc: null,
              fileName: 'Passport bio page_67b2b760c8653f0001599a71.jpeg',
              uploaded: true,
              docName: 'Passport bio page',
              fieldName: 'passportBioImage',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_BACK.jpg',
              sampleType: 'Link',
              sequence: 3,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Pan card',
              documentDesc: null,
              fileName: null,
              uploaded: false,
              docName: 'Pan card',
              fieldName: 'panCard',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'If you do not have pan card and traveling with family, you can upload pan card of other family member (traveling with you)',
              sampleType: 'Text',
              sequence: 4,
              sameAsPrimaryAllowed: false,
            },
          ],
          totalDocsCount: 0,
          uploadedDocsCount: 0,
          passportExpiry: '2027-08-30',
          passportNumber: 'A0000025',
          anyRemarkExists: false,
        },
        {
          travelerId: 6278,
          travelerName: 'Aman Deep',
          bookingStatus: null,
          docs: [
            {
              documentType: 'Photograph',
              documentDesc: null,
              fileName: null,
              uploaded: false,
              docName: 'Photograph',
              fieldName: 'photograph',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
              sampleType: 'Link',
              sequence: 1,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Passport front page',
              documentDesc: null,
              fileName: 'Passport front page_67b2b760c8653f0001599a72.png',
              uploaded: true,
              docName: 'Passport front page',
              fieldName: 'passportFrontImage',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
              sampleType: 'Link',
              sequence: 2,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Passport bio page',
              documentDesc: null,
              fileName: 'Passport bio page_67b2b760c8653f0001599a72.jpeg',
              uploaded: true,
              docName: 'Passport bio page',
              fieldName: 'passportBioImage',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'https://static.visa2fly.com/sample/passport/PASSPORT_BACK.jpg',
              sampleType: 'Link',
              sequence: 3,
              sameAsPrimaryAllowed: false,
            },
            {
              documentType: 'Pan card',
              documentDesc: null,
              fileName: null,
              uploaded: false,
              docName: 'Pan card',
              fieldName: 'panCard',
              formats: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'application/pdf',
              ],
              maxSize: '2MB',
              sample:
                'If you do not have pan card and traveling with family, you can upload pan card of other family member (traveling with you)',
              sampleType: 'Text',
              sequence: 4,
              sameAsPrimaryAllowed: false,
            },
          ],
          totalDocsCount: 0,
          uploadedDocsCount: 0,
          passportExpiry: '2027-08-30',
          passportNumber: 'A0000625',
          anyRemarkExists: false,
        },
      ],
      address: {
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        pincode: null,
      },
      bookingDetails: {
        bookingId: '1739765600609TT50A',
        documentCollectionDate: null,
        internalId: null,
        groupName: null,
        dateOfTravel: '2025-08-29',
        dateOfReturn: null,
        totalTravelers: 2,
        bookingDate: '2025-02-17',
        bookingDateTime: '2025-02-17T09:46:27',
        gstNumber: null,
        bookingType: 'Visa',
        bookingStatus: 'Visa application approved',
        successful: true,
        totalBookingAmount: 17000,
        state: null,
        cvPoints: 0,
        vistaraClubId: 0,
        primaryTravelerName: 'Jankilal Dhakad',
        primaryTravelerEmailId: 'jankilal.dhakad@visa2fly.com',
        primaryTravelerCell: '8871404247',
        evisaApplied: false,
        evisaPartner: null,
        documentMappingRequired: false,
        fileStatus: null,
      },
      visaBookingBrief: {
        country: 'Dubai',
        visaType: 'Business',
        entryType: 'Single Entry',
        processingType: null,
        processingTime: null,
        stayPeriod: '29 Days',
        amountPerTraveler: 12400,
        totalAmount: 24800,
        contactPerson: 'Jankilal Dhakad',
        online: true,
        addressRequired: false,
        minTravelDate: 0,
        journeyLabel: null,
        journeyTime: null,
        appointmentDate: null,
        appointmentFileName: null,
        expectationJourneyCategory: null,
      },
      simBookingBrief: null,
      insuranceBookingBrief: null,
      priceDistributions: [
        {
          categoryName: 'Adult',
          ageRange: '18-120',
          amountPerPerson: 12600,
          subTotal: 12600,
          basePricing: {
            basePrice: 12000,
            fee: 508.47,
            tax: 91.53,
          },
          pax: 1,
        },
        {
          categoryName: 'Child',
          ageRange: '0-18',
          amountPerPerson: 4400,
          subTotal: 4400,
          basePricing: {
            basePrice: 4000,
            fee: 338.98,
            tax: 61.02,
          },
          pax: 1,
        },
      ],
      description: 'Dubai Business Visa',
      totalMarkup: 0,
      paymentDistribution: {
        igst: 152.55,
        cgst: 0,
        sgst: 0,
        visaCost: 16847.45,
        tax: 152.55,
      },
      crossSellDetails: null,
      fileOnHoldDetail: null,
      appointmentDetail: null,
      docCollectionDetail: null,
      docReturningDetail: null,
      extraPayment: 0,
      documentReturnedDate: null,
      docToBeCollectedFromEmbassyDetail: null,
      docCollectedFromEmbassyDetail: null,
      rejectedDetail: null,
      extraPaymentDetail: null,
      evisaPresent: true,
      announcement: null,
      expectationJourneySteps:
      [
        {
          "stepName": "Process initiation",
          "sequence": 1,
          "expectedDate": "2025-03-03",
          "startDate": "2025-03-03",
          "endDate": "2025-03-03",
          "delays": [
            {
              "previousExpectedDate": "2025-03-07",
              "expectedDate": "2025-03-08",
              "reasonForDelay": "File on hold due to late travel date",
              "delaySource": null,
              "createdBy": null,
              "createdAt": "2025-03-06T15:21:20.463"
            }
          ],
          "activities": null,
          "details": null
        },
        {
          "stepName": "Application review",
          "sequence": 2,
          "expectedDate": "2025-03-03",
          "startDate": "2025-03-03",
          "endDate": "2025-03-03",
          "delays": null,
          "activities": [
            {
              "activityId": 11075,
              "bookingState": "Validation initiated",
              "createdAt": "2025-03-06T15:23:06.187",
              "activityDetails": null
            },
            {
              "activityId": 11076,
              "bookingState": "Document Required",
              "createdAt": "2025-03-06T15:23:25.965",
              "activityDetails": {
                "Traveler Name(s)": "Jankilal"
              }
            }
          ],
          "details": null
        },
        {
          "stepName": "File On Hold",
          "sequence": 3,
          "expectedDate": "2025-03-10",
          "startDate": "2025-03-06",
          "endDate": null,
          "delays": null,
          "activities": null,
          "details": {
            "Date": "2025-03-10",
            "Reason": "for testing purposes"
          }
        },
        {
          "stepName": "Appointment picked",
          "sequence": 4,
          "expectedDate": "2025-03-07",
          "startDate": "2025-03-07",
          "endDate": "2025-03-07",
          "delays": null,
          "activities": [
            {
              "activityId": 11105,
              "bookingState": "Appointment Picked",
              "createdAt": "2025-03-07T17:37:05",
              "activityDetails": {
                "Date": "2025-03-13"
              }
            }
          ],
          "details": {
            "Date": "2025-03-21"
          }
        },
        {
          "stepName": "Day of biometric",
          "sequence": 5,
          "expectedDate": "2025-03-21",
          "startDate": "2025-03-07",
          "endDate": null,
          "delays": null,
          "activities": null,
          "details": {
            "Date": "2025-03-21"
          }
        },
        {
          "stepName": "Applied to embassy",
          "sequence": 6,
          "expectedDate": "2025-03-03",
          "startDate": "2025-03-03",
          "endDate": "2025-03-03",
          "delays": null,
          "activities": null,
          "details": null
        },
        {
          "stepName": "Application status",
          "sequence": 7,
          "expectedDate": "2025-03-03",
          "startDate": "2025-03-03",
          "endDate":null,
          "delays": null,
          "activities": [
            {
              "activityId": 11033,
              "bookingState": "Visa application approved",
              "createdAt": "2025-03-03T16:35:55.049",
              "activityDetails": null
            }
          ],
          "details": null
        }
      ],
      svj: null,
      couponRemoved: false,
    },
  },
};

export const mockGetVisaDocList = {
  response: {
    message: 'Evisa documents fetched successfully.',
    data: [
      {
        docName: 'Photograph',
        formats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        maxSize: '2MB',
        sequence: 1,
        fieldName: 'photograph',
        sampleType: 'Link',
        sample: 'https://static.visa2fly.com/sample/photograph/Dubai.jpg',
        sameAsPrimaryAllowed: false,
      },
      {
        docName: 'Passport front page',
        formats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        maxSize: '2MB',
        sequence: 2,
        fieldName: 'passportFrontImage',
        sampleType: 'Link',
        sample:
          'https://static.visa2fly.com/sample/passport/PASSPORT_FRONT.jpg',
        sameAsPrimaryAllowed: false,
      },
      {
        docName: 'Passport bio page',
        formats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        maxSize: '2MB',
        sequence: 3,
        fieldName: 'passportBioImage',
        sampleType: 'Link',
        sample: 'https://static.visa2fly.com/sample/passport/PASSPORT_BACK.jpg',
        sameAsPrimaryAllowed: false,
      },
      {
        docName: 'Pan card',
        formats: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        maxSize: '2MB',
        sequence: 4,
        fieldName: 'panCard',
        sampleType: 'Text',
        sample:
          'If you do not have pan card and traveling with family, you can upload pan card of other family member (traveling with you)',
        sameAsPrimaryAllowed: false,
      },
    ],
  },
};

export const uploadVisaDocument = {
  response: {
    message: 'Document uploaded successfully',
  },
};

export const mockConfirmPayment = {
  response: { message: 'Booking Confirmed', bookingId: '1739765600609TT50A' },
};

export const visaPlanSummary = {
  response: {
    data: {
      "country": "Dubai",
      "displayQuotes": {
        "quoteId": "Dubai-quote-46",
        "countryName": "Dubai",
        "purpose": "Tourist",
        "entryType": "Single Entry",
        "stayPeriod": "60 Days",
        "currency": "INR",
        "basePrice": 14000,
        "fee": 423.73,
        "serviceTax": 76.27,
        "markup": null,
        "validity": "58 Days",
        "processingTime": "3 to 4 Business Days",
        "minProcessingTime": 3,
        "maxProcessingTime": 4,
        "minProcessingTimeMatrix": "Days",
        "maxProcessingTimeMatrix": "Days",
        "embassyMinProcessingTime": 1,
        "embassyMaxProcessingTime": 2,
        "embassyMinProcessingTimeMatrix": "Days",
        "embassyMaxProcessingTimeMatrix": "Days",
        "category": "e-visa",
        "imageUpload": true,
        "addressRequired": false,
        "disclaimer": "\"Business Days: Monday to Friday|Price Variable as per Rate of Exchange|Stay Validity will be subject to the UAE Immigration Rules|Prices are subject to change without notice|For children(0-16 yrs): INR 6050\"",
        "disclaimers": [
          "\"Business Days: Monday to Friday",
          "Price Variable as per Rate of Exchange",
          "Stay Validity will be subject to the UAE Immigration Rules",
          "Prices are subject to change without notice",
          "For children(0-16 yrs): INR 6050\""
        ],
        "processingType": "Standard",
        "minTravelDate": 4,
        "priceDistribution": [
          {
            "minAge": 0,
            "maxAge": 120,
            "basePrice": 14000,
            "fee": 423.73,
            "serviceTax": 76.27
          }
        ],
        "withServices": null,
        "popular": false,
        "errorMsg": null,
        "getVisaBy": null,
        "expectationJourneyCategory": "Evisa",
        "journeyLabel": "Get your visa by",
        "journeyTime": "Wed, 12 Mar 2025",
        "stayPeriodDaysCount": 60
      },
      "announcement": null,
      "expectationJourney": [
        {
          "stepName": "Process initiation",
          "date": "2025-03-09",
          "sequence": 1
        },
        {
          "stepName": "Application review",
          "date": "2025-03-09",
          "sequence": 2
        },
        {
          "stepName": "Applied to embassy",
          "date": "2025-03-09",
          "sequence": 3
        },
        {
          "stepName": "Application status",
          "date": "2025-03-11",
          "sequence": 4
        }
      ]
    },
    message: "Data Fetched Successfully"
  }
}