const countryDocs = {
  defaultCountrySettings: [
    {
      countryId: "101",
      countryName: "UNITED STATES OF AMERICA",
      countryCode: "USA",
      phoneDigit: 10,
      phoneCode: "+91",
      currencyCode: "USD",
      currencySymbol: "$",
      distanceUnit: "Miles",
      distanceSymbol: "Mi",
      documents: [
        {
          name: "Driving License",
          esName: "Licencia de conducir",
          fileFor: "drivingLicense",
          front: true,
          back: false,
          exp: true,
        },
        // {
        //   "name": "Aadhar Card",
        //   "esName": "Aadhar Card",
        //   "fileFor": "aadharCard",
        //   "front": true,
        //   "back": false,
        //   "exp": false
        // },
        // {
        //   "name": "Bank Passbook",
        //   "esName": "Bank Passbook",
        //   "fileFor": "bankPassbook",
        //   "front": true,
        //   "back": false,
        //   "exp": false
        // },
        // {
        //   "name": "Pan Card",
        //   "esName": "Pan Card",
        //   "fileFor": "panCard",
        //   "front": true,
        //   "back": false,
        //   "exp": false
        // }
      ],
      taxiDocuments: [
        {
          name: "Insurance",
          esName: "Insurance",
          fileFor: "insurance",
          front: true,
          back: false,
          exp: true,
        },
        // {
        //   "name": "Permit",
        //   "esName": "Permit",
        //   "fileFor": "permit",
        //   "front": true,
        //   "back": false,
        //   "exp": true
        // },
        {
          name: "Smart Card / Registration Card",
          esName: "Smart Card / Registration Card",
          fileFor: "registrationCard",
          front: true,
          back: false,
          exp: true,
        },
        {
          "name": "Tax ID / Social Security Number",
          "esName": "Tax ID / Social Security Number",
          "fileFor": "Tax ID / Social Security Number",
          "front": true,
          "back": false,
          "exp": false
        },
        // {
        //   "name": "Noc / Sale Deed",
        //   "esName": "Noc / Sale Deed",
        //   "fileFor": "saleDeed",
        //   "front": true,
        //   "back": false,
        //   "exp": false
        // }
      ],
    },
    {
      countryId: "231",
      countryName: "United States",
      countryCode: "US",
      phoneDigit: 10,
      phoneCode: "+1",
      currencyCode: "USD",
      currencySymbol: "$",
      distanceUnit: "Miles",
      distanceSymbol: "Mi",
      documents: [
        {
          name: "Driving License",
          esName: "Licencia de conducir",
          fileFor: "drivingLicense",
          front: true,
          back: false,
          exp: true,
        },
        // {
        //   name: "Aadhar Card",
        //   esName: "Aadhar Card",
        //   fileFor: "aadharCard",
        //   front: true,
        //   back: false,
        //   exp: false,
        // },
        // {
        //   name: "Bank Passbook",
        //   esName: "Bank Passbook",
        //   fileFor: "bankPassbook",
        //   front: true,
        //   back: false,
        //   exp: false,
        // },
        // {
        //   name: "Pan Card",
        //   esName: "Pan Card",
        //   fileFor: "panCard",
        //   front: true,
        //   back: false,
        //   exp: false,
        // },
      ],
      taxiDocuments: [
        {
          name: "Insurance",
          esName: "Insurance",
          fileFor: "insurance",
          front: true,
          back: false,
          exp: true,
        },
        // {
        //   name: "Permit",
        //   esName: "Permit",
        //   fileFor: "permit",
        //   front: true,
        //   back: false,
        //   exp: true,
        // },
        {
          name: "Smart Card / Registration Card",
          esName: "Smart Card / Registration Card",
          fileFor: "registrationCard",
          front: true,
          back: false,
          exp: false,
        },
        {
          name: "Tax ID / Social Security Number",
          esName: "Tax ID / Social Security Number",
          fileFor: "Tax ID / Social Security Number",
          front: true,
          back: false,
          exp: false,
        },
        // {
        //   name: "Noc / Sale Deed",
        //   esName: "Noc / Sale Deed",
        //   fileFor: "saleDeed",
        //   front: true,
        //   back: false,
        //   exp: false,
        // },
      ],
    },
  ],
};
module.exports = countryDocs;
