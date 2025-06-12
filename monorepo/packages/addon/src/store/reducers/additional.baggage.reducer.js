import { addonActions } from '../addonActions';
import { prepareAddtionalBaggageData } from '../../components/AddonList/AdditionalBaggage/AdditionalBaggageUtils';

export const defaultAdditionalBaggageState = {
  additionalBaggageData: {
    data: [],
    delayLostProtection: false,
    isDisabledDelayLostProtection: false,
  },
};

/**
 * @param {{
 * additionalBaggageData: {data: Array<*>, delayLostProtection: boolean, isDisabledDelayLostProtection: boolean},
 * upSellPopup?: *,
 * sellAddonSsr?: Array<*>
 * }} state
 * @param {{type: string, payload: *}} action
 * @returns
 */
export const additionalBaggageReducer = (
  state = defaultAdditionalBaggageState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_ADDITIONAL_BAGGAGE_DATA: {
      const newState = state.additionalBaggageData?.data || [];
      const { index, data } = payload;
      newState[index] = data;

      return {
        ...state,
        additionalBaggageData: {
          ...state.additionalBaggageData,
          data: newState,
        },
      };
    }

    case addonActions.UPDATE_ADDITIONAL_BAGGAGE_FORM_DATA: {
      const { delayLostProtection, additionalBaggageData } = payload;

      return {
        ...state,
        additionalBaggageData,
        upSellPopup: {
          ...state.upSellPopup,
          showLBUpsellPopup: false,
          actionTakenLB: delayLostProtection || state?.upSellPopup?.actionTakenLB,
        },
      };
    }

    case addonActions.SET_ADDITIONAL_BAGGAGE_FORM_DATA: {
      return {
        ...state,
        additionalBaggageData: {
          ...state.additionalBaggageData,
          ...payload,
          openslider: false,
        },
      };
    }

    case addonActions.RESET_ADDITIONAL_BAGGAGE_FORM_DATA: {
      const { additionalBaggageFormData } = payload;

      return {
        ...state,
        additionalBaggageFormData,
      };
    }

    case addonActions.RESET_ADDITIONAL_BAGGAGE_FORM_ADDON_BUTTON: {
      const { newAddOnData, removedAddonSsr, sellAddonSsr, newData } = payload;
      // Old Code:
      // const { additionalBaggageData } = state;

      return {
        ...state,
        additionalBaggageData: {
          ...state.additionalBaggageData,
          data: newData,
          delayLostProtection: false,
        },
        additionalBaggageFormData: newData,
        setGetSelectedAddon: newAddOnData,
        sellAddonSsr,
        // delayLostBaggageProtection:
        //   additionalBaggageData.isDisabledDelayLostProtection,
        removedAddonSsr,
      };
    }
    case addonActions.PREPARE_ADDITIONAL_BAGGAGE_DATA: {
      const {
        newAddOnData,
        categoryName,
        removedAddonSsr,
        ssrCategory,
        tripIndex,
      } = payload;
      const { sellAddonSsr, additionalBaggageData } = state;
      const excessAdditionalAddOnSsr = prepareAddtionalBaggageData(
        state?.additionalBaggageData?.data,
        categoryName,
        ssrCategory,
        tripIndex,
      );

      const oldSellAddonSsr =
        sellAddonSsr?.filter(
          (ssr) => !(ssr.categoryName === categoryName && ssr.tripIndex === tripIndex),
        ) || [];

      return {
        ...state,
        setGetSelectedAddon: newAddOnData,
        sellAddonSsr: [...oldSellAddonSsr, ...excessAdditionalAddOnSsr],
        additionalBaggageData: { ...additionalBaggageData },
        removedAddonSsr,
        // delayLostBaggageProtection:
        //   additionalBaggageData.delayLostProtection ||
        //   additionalBaggageData.isDisabledDelayLostProtection,
      };
    }

    // TD: Remove after testing
    // case addonActions.SET_EXCESS_BAGGAE_DELAY_PROTECTION_CHECKBOX: {
    //   const { delayLostBaggageProtection, isDisabledDelayLostProtection } =
    //     payload;
    //   return {
    //     ...state,
    //     additionalBaggageData: {
    //       ...state.additionalBaggageData,
    //       isDisabledDelayLostProtection,
    //     },
    //     delayLostBaggageProtection,
    //   };
    // }

    case addonActions.UNMOUNT_ADDONCONTAINER: {
      return {
        ...state,
        additionalBaggageData: {
          data: [],
          delayLostProtection: false,
          isDisabledDelayLostProtection: false,
        },
      };
    }

    default:
      return state;
  }
};
