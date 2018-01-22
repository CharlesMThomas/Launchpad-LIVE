import axios from 'axios'
import history from '../history'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const SETTING_KEY = 'SETTING_KEY'
const STOP_SETTING = 'STOP_SETTING'
const RESET = 'RESET'
const NEW_PROJECT = 'NEW_PROJECT'
const LOAD_PROJECT = 'LOAD_PROJECT'
const SHOW_SAVED = 'SHOW_SAVED'
const START_REC = 'START_REC'

/**
 * INITIAL STATE
 */
const defaultState = {setting: false, selected: {}, projectsView: 'menu', trackStatus: 'test'}

/**
 * ACTION CREATORS
 */
export const settingKey = key => {
  const newState = {setting: true, selected: key};
  return {type: SETTING_KEY, newState};
}

export const stopSetting = key => {
  const newState = {setting: false, selected: {}};
  return {type: SETTING_KEY, newState};
}

export const resetApp = () => ({type: RESET})
export const newProject = () => ({type: NEW_PROJECT})
export const loadProject = () => ({type: LOAD_PROJECT})
export const startRec = () => ({type: START_REC})

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function (state = defaultState, action) {
  switch (action.type) {
    case SETTING_KEY:
      return action.newState
    case STOP_SETTING:
      return action.newState
    case RESET:
      return defaultState
    case NEW_PROJECT:
      return Object.assign({}, state, {projectsView: 'new'});
    case LOAD_PROJECT:
      return Object.assign({}, state, {projectsView: 'load'});
    case START_REC:
    return Object.assign({}, state, {trackStatus: 'recording'});
    default:
      return state
  }
}
