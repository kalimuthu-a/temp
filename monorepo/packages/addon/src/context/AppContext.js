import React from 'react';

import Cookies from 'skyplus-design-system-app/src/functions/cookies';
import combineReducers from '../store/combineReducers';

import {
  travelAssistanceReducer,
  defaultTravelAssistanceState,
} from '../store/reducers/travel.assistance.reducer';

import {
  commonReducer,
  defaultCommonState,
} from '../store/reducers/common.reducer';

import {
  excessBaggageReducer,
  defaultExcessBaggageState,
} from '../store/reducers/excess.baggage.reducer';

import {
  additionalBaggageReducer,
  defaultAdditionalBaggageState,
} from '../store/reducers/additional.baggage.reducer';

import {
  cancellationReducer,
  defaultCancellationState,
} from '../store/reducers/cancellation.reducer';

import {
  lostProtectionReducer,
  defaultLostProtectionState,
} from '../store/reducers/lost.protection.reducer';

import {
  quickBoardReducer,
  defaultQuickBoardState,
} from '../store/reducers/quick.board.reducer';

import {
  fastForwardReducer,
  defaultFastForwardState,
} from '../store/reducers/fast.forward.reducer';

import {
  goodNightReducer,
  defaultGoodNightState,
} from '../store/reducers/good.night.reducer';

import {
  loungeReducer,
  defaultLoungeState,
} from '../store/reducers/lounge.reducer';

import { barReducer, defaultBarState } from '../store/reducers/bar.reducer';
import {
  sportsEquipmentReducer,
  defaultSportsEquipmentState,
} from '../store/reducers/sports.equipment.reducer';

import {
  tiffinReducer,
  defaultTiffinState,
} from '../store/reducers/tiffin.reducer';

const AppContext = React.createContext({});

const AppProvider = AppContext.Provider;

const addonInitialState = {
  isAuthenticated: Cookies.get('auth_user', true, true) || false,
  loggedInUser: Cookies.get('auth_user', true, true) || false,
  token: null,
  containerConfigData: null,
  userInfo: {
    userType: 'member',
  },
  page: '',
  setGetSelectedAddon: [],
  delayLostBaggageProtection: null,
  sellAddonSsr: [],
  categories: {},
  ...defaultCommonState,
  ...defaultTravelAssistanceState,
  ...defaultExcessBaggageState,
  ...defaultAdditionalBaggageState,
  ...defaultCancellationState,
  ...defaultLostProtectionState,
  ...defaultQuickBoardState,
  ...defaultFastForwardState,
  ...defaultGoodNightState,
  ...defaultLoungeState,
  ...defaultBarState,
  ...defaultSportsEquipmentState,
  ...defaultTiffinState,
};

const addonReducer = combineReducers({
  travelAssistance: travelAssistanceReducer,
  cancellation: cancellationReducer,
  excessBaggage: excessBaggageReducer,
  additionalBaggage: additionalBaggageReducer,
  lostProtection: lostProtectionReducer,
  quickBoard: quickBoardReducer,
  common: commonReducer,
  fastForward: fastForwardReducer,
  goodNight: goodNightReducer,
  lounge: loungeReducer,
  bar: barReducer,
  sportsEquipment: sportsEquipmentReducer,
  tiffin: tiffinReducer,
});

export { AppContext, AppProvider, addonReducer, addonInitialState };
