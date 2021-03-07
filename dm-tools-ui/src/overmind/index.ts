import { IConfig } from 'overmind';
import {
  createHook,
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from 'overmind-react';
import { state } from './state';
import * as actions from './actions';

export const config = {
  state,
  actions,
};

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {
    state: typeof config.state;
    actions: typeof config.actions;
  }
}

export const useOvermind = createHook<typeof config>();
export const useState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();
