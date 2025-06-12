import { addonActions } from '../addonActions';
import { prepareExcessBaggageData } from '../../components/AddonList/ExcessBaggage/ExcessBaggageUtils';

export const defaultExcessBaggageState = {
  excessBaggageData: {
    data: [],
    delayLostProtection: false,
    isDisabledDelayLostProtection: false,
  },
};

/**
 * @param {{
 * excessBaggageData: {data: Array<*>, delayLostProtection: boolean, isDisabledDelayLostProtection: boolean},
 * upSellPopup?: *,
 * sellAddonSsr?: Array<*>
 * }} state
 * @param {{type: string, payload: *}} action
 * @returns
 */
export const excessBaggageReducer = (
  state = defaultExcessBaggageState,
  action = {},
) => {
  const { type, payload } = action;
  switch (type) {
    case addonActions.SET_EXCESS_BAGGAGE_DATA: {
      const newState = state.excessBaggageData?.data || [];
      const { index, data } = payload;
      newState[index] = data;

      return {
        ...state,
        excessBaggageData: {
          ...state.excessBaggageData,
          data: newState,
        },
      };
    }

    case addonActions.UPDATE_EXCESS_BAGGAGE_FORM_DATA: {
      const { delayLostProtection, excessBaggageData } = payload;

      return {
        ...state,
        excessBaggageData,
        upSellPopup: {
          ...state.upSellPopup,
          showLBUpsellPopup: false,
          actionTakenLB: delayLostProtection || state?.upSellPopup?.actionTakenLB,
        },
      };
    }

    case addonActions.SET_EXCESS_BAGGAGE_FORM_DATA: {
      return {
        ...state,
        excessBaggageData: {
          ...state.excessBaggageData,
          ...payload,
          openslider: false,
        },
      };
    }

    case addonActions.RESET_EXCESS_BAGGAGE_FORM_DATA: {
      const { excessBaggageFormData } = payload;

      return {
        ...state,
        excessBaggageFormData,
      };
    }

    case addonActions.RESET_EXCESS_BAGGAGE_FORM_ADDON_BUTTON: {
      const { newAddOnData, removedAddonSsr, sellAddonSsr, newData } = payload;
      // Old Code:
      // const { excessBaggageData } = state;

      return {
        ...state,
        excessBaggageData: {
          ...state.excessBaggageData,
          data: newData,
          delayLostProtection: false,
        },
        excessBaggageFormData: newData,
        setGetSelectedAddon: newAddOnData,
        sellAddonSsr,
        // delayLostBaggageProtection:
        //   excessBaggageData.isDisabledDelayLostProtection,
        removedAddonSsr,
      };
    }

    case addonActions.PREPARE_EXCESS_BAGGAGE_DATA: {
      const {
        newAddOnData,
        categoryName,
        removedAddonSsr,
        ssrCategory,
        tripIndex,
      } = payload;
      const { sellAddonSsr, excessBaggageData } = state;
      const excessBaggageAddOnSsr = prepareExcessBaggageData(
        state?.excessBaggageData?.data,
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
        sellAddonSsr: [...oldSellAddonSsr, ...excessBaggageAddOnSsr],
        excessBaggageData: { ...excessBaggageData },
        removedAddonSsr,
        // delayLostBaggageProtection:
        //   excessBaggageData.delayLostProtection ||
        //   excessBaggageData.isDisabledDelayLostProtection,
      };
    }

    case addonActions.SET_EXCESS_BAGGAE_DELAY_PROTECTION_CHECKBOX: {
      const { delayLostBaggageProtection, isDisabledDelayLostProtection } =
        payload;
      return {
        ...state,
        excessBaggageData: {
          ...state.excessBaggageData,
          isDisabledDelayLostProtection,
        },
        delayLostBaggageProtection,
      };
    }

    case addonActions.UNMOUNT_ADDONCONTAINER: {
      return {
        ...state,
        excessBaggageData: {
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
