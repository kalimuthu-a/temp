// eslint-disable-next-line import/prefer-default-export
export const GetFareDetails = (feesData, paxData) => {
  /* eslint-disable sonarjs/cognitive-complexity */
  if (!feesData?.adultPrice || !paxData?.length) {
    return {
      totalChild: 0,
      totalAdult: 0,
      totalBaseFareChild: 0,
      totalBaseFareAdult: 0,
      baseFareChild: 0,
      baseFareAdult: 0,
      totalBaseFare: 0,
      totalFees: 0,
      totalServiceTax: 0,
      totalAmount: 0,
    };
  }

  let totalChild = 0;
  let totalAdult = 0;
  let totalBaseFareChild = 0;
  let totalBaseFareAdult = 0;
  let baseFareChild = 0;
  let baseFareAdult = 0;
  let totalBaseFare = 0;
  let totalFees = 0;
  let totalServiceTax = 0;
  let totalAmount = 0;

  if (paxData) {
    paxData.forEach((passenger) => {
      const birthDate = new Date(passenger?.info?.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      let baseFare = 0;
      let fees = 0;
      let serviceTax = 0;

      //  will add once we get api confirmation
      // const isAdult = feesData.adultPrice.maxAge > age && feesData.adultPrice.minAge < age;
      const isChild = feesData.childPrice.maxAge > age && feesData.childPrice.minAge < age;

      if (feesData?.priceDistribution?.length === 1) {
        if (age > 16) {
          totalAdult += 1;
          baseFare = feesData.adultPrice?.basePrice ?? 0;
          fees = feesData.adultPrice?.fee ?? 0;
          serviceTax = feesData.adultPrice?.serviceTax ?? 0;
          totalBaseFareAdult += baseFare;
          baseFareAdult = baseFare;
        } else {
          totalChild += 1;
          baseFare = feesData.childPrice?.basePrice ?? 0;
          fees = feesData.childPrice?.fee ?? 0;
          serviceTax = feesData.childPrice?.serviceTax ?? 0;
          totalBaseFareChild += baseFare;
          baseFareChild = baseFare;
        }
      } else if (isChild) {
        totalChild += 1;
        baseFare = feesData.childPrice?.basePrice ?? 0;
        fees = feesData.childPrice?.fee ?? 0;
        serviceTax = feesData.childPrice?.serviceTax ?? 0;
        totalBaseFareChild += baseFare;
        baseFareChild = baseFare;
      } else {
        totalAdult += 1;
        baseFare = feesData.adultPrice?.basePrice ?? 0;
        fees = feesData.adultPrice?.fee ?? 0;
        serviceTax = feesData.adultPrice?.serviceTax ?? 0;
        totalBaseFareAdult += baseFare;
        baseFareAdult = baseFare;
      }

      totalFees += fees;
      totalServiceTax += serviceTax;
      totalAmount += baseFare + fees + serviceTax;
      totalBaseFare += baseFare;
    });
  }

  return {
    totalChild,
    totalAdult,
    totalBaseFareChild,
    totalBaseFareAdult,
    baseFareChild,
    baseFareAdult,
    totalBaseFare,
    totalFees,
    totalServiceTax,
    totalAmount,
  };
};

export const GetPaymentFareDetails = (feesData, paxData) => {
  if (!feesData?.priceDistributions?.length || !paxData?.length) {
    return {
      totalChild: 0,
      totalAdult: 0,
      totalBaseFareChild: 0,
      totalBaseFareAdult: 0,
      baseFareChild: 0,
      baseFareAdult: 0,
      totalBaseFare: 0,
      totalFees: 0,
      totalServiceTax: 0,
      totalAmount: 0,
    };
  }

  let totalChild = 0;
  let totalAdult = 0;
  let totalBaseFareChild = 0;
  let totalBaseFareAdult = 0;
  let baseFareChild = 0;
  let baseFareAdult = 0;
  let totalBaseFare = 0;
  let totalFees = 0;
  let totalServiceTax = 0;
  let totalAmount = 0;

  if (paxData) {
    paxData.forEach(() => {
      let baseFare = 0;
      let fees = 0;
      let serviceTax = 0;

      // Loop through each priceDistribution and map based on categoryName
      feesData?.priceDistributions?.forEach((distribution) => {
        const categoryName = distribution?.categoryName ?? '';
        const pax = distribution?.pax ?? 0;
        const basePrice = distribution?.basePricing?.basePrice ?? 0;
        const fee = distribution?.basePricing?.fee ?? 0;
        const tax = distribution?.basePricing?.tax ?? 0;

        // Handle Adult category
        if (categoryName.toLowerCase() === 'adult') {
          totalAdult += 1;
          baseFare = basePrice / pax ?? 0;
          fees = fee;
          serviceTax = tax;
          totalBaseFareAdult += baseFare;
          baseFareAdult = baseFare;
        } else if (categoryName.toLowerCase() === 'child') {
          totalChild += 1;
          baseFare = basePrice / pax ?? 0;
          fees = fee;
          serviceTax = tax;
          totalBaseFareChild += baseFare;
          baseFareChild = baseFare;
        }
      });

      totalFees += fees;
      totalServiceTax += serviceTax;
      totalAmount += baseFare + fees + serviceTax;
      totalBaseFare += baseFare;
    });
  }

  return {
    totalChild,
    totalAdult,
    totalBaseFareChild,
    totalBaseFareAdult,
    baseFareChild,
    baseFareAdult,
    totalBaseFare,
    totalFees,
    totalServiceTax,
    totalAmount,
  };
};
