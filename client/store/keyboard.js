import axios from 'axios'
import history from '../history'
import showSavedThunk from './app'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const SET_KEY = 'SET_KEY'
const SHOW_PLAYING = 'SHOW_PLAYING'
const STOP_PLAYING = 'STOP_PLAYING'
const RESET = 'RESET'
const SAVE = 'SAVE'
const CREATE = 'CREATE'
const LOAD = 'LOAD'
const SET_KEYBOARD = 'SET_KEYBOARD'
const UNSET_KEY = 'UNSET_KEY'
const UNSET_SINGLE_KEY = 'UNSET_SINGLE_KEY'

/**
 * INITIAL STATE
 */
const defaultKeyboard = {id: null, name: '', keys: [
  {key: '1', audio: null, name: '', status: 'unmounted'},
  {key: '2', audio: null, name: '', status: 'unmounted'},
  {key: '3', audio: null, name: '', status: 'unmounted'},
  {key: '4', audio: null, name: '', status: 'unmounted'},
  {key: '7', audio: null, name: '', status: 'unmounted'},
  {key: '8', audio: null, name: '', status: 'unmounted'},
  {key: '9', audio: null, name: '', status: 'unmounted'},
  {key: '0', audio: null, name: '', status: 'unmounted'},
  {key: 'q', audio: null, name: '', status: 'unmounted'},
  {key: 'w', audio: null, name: '', status: 'unmounted'},
  {key: 'e', audio: null, name: '', status: 'unmounted'},
  {key: 'r', audio: null, name: '', status: 'unmounted'},
  {key: 'u', audio: null, name: '', status: 'unmounted'},
  {key: 'i', audio: null, name: '', status: 'unmounted'},
  {key: 'o', audio: null, name: '', status: 'unmounted'},
  {key: 'p', audio: null, name: '', status: 'unmounted'},
  {key: 'a', audio: null, name: '', status: 'unmounted'},
  {key: 's', audio: null, name: '', status: 'unmounted'},
  {key: 'd', audio: null, name: '', status: 'unmounted'},
  {key: 'f', audio: null, name: '', status: 'unmounted'},
  {key: 'j', audio: null, name: '', status: 'unmounted'},
  {key: 'k', audio: null, name: '', status: 'unmounted'},
  {key: 'l', audio: null, name: '', status: 'unmounted'},
  {key: ';', audio: null, name: '', status: 'unmounted'},
  {key: 'z', audio: null, name: '', status: 'unmounted'},
  {key: 'x', audio: null, name: '', status: 'unmounted'},
  {key: 'c', audio: null, name: '', status: 'unmounted'},
  {key: 'v', audio: null, name: '', status: 'unmounted'},
  {key: 'm', audio: null, name: '', status: 'unmounted'},
  {key: ',', audio: null, name: '', status: 'unmounted'},
  {key: '.', audio: null, name: '', status: 'unmounted'},
  {key: '/', audio: null, name: '', status: 'unmounted'}
]}

/**
 * ACTION CREATORS
 */

export const setKey = (selected, keyInfo) => {
  const audio = new Audio(selected.audioURL);
  let newKey = {key: keyInfo.key, audio: audio, name: selected.name, status: 'mounted'};

  return {type: SET_KEY, key: newKey}
}

export const unsetKey = (key, keyboard) => {

    let removeFromTrack;

    let updatedKeys = keyboard.keys.map(currentKey => {
      if (currentKey.name === key.name) {
        removeFromTrack = currentKey.key;
        return {key: currentKey.key, audio: null, name: '', status: 'unmounted'}
      } else {
        return currentKey;
      }
    })

    let currentTrack = keyboard.track;

    for (let time in currentTrack) {
      if (!currentTrack.hasOwnProperty(time)) continue;

      let keysAtTime = currentTrack[time];
      keysAtTime = keysAtTime.filter(keyAtTime => keyAtTime !== removeFromTrack)
      if (!keysAtTime.length) {
        delete currentTrack[time];
      } else {
        currentTrack[time] = keysAtTime;
      }
    }

    keyboard.keys = updatedKeys;
    keyboard.track = currentTrack;

    return ({type: UNSET_KEY, keyboard})
}

export const unsetSingleKey = (key, keyboard) => {

  let removeFromTrack;

  let updatedKeys = keyboard.keys.map(currentKey => {
    if (currentKey.key === key.key) {
      removeFromTrack = currentKey.key;
      return {key: currentKey.key, audio: null, name: '', status: 'unmounted'}
    } else {
      return currentKey;
    }
  })

  let currentTrack = keyboard.track;

  for (let time in currentTrack) {
    if (!currentTrack.hasOwnProperty(time)) continue;

    let keysAtTime = currentTrack[time];
    keysAtTime = keysAtTime.filter(keyAtTime => keyAtTime !== removeFromTrack)
    if (!keysAtTime.length) {
      delete currentTrack[time];
    } else {
      currentTrack[time] = keysAtTime;
    }
  }

  keyboard.keys = updatedKeys;
  keyboard.track = currentTrack;

  return ({type: UNSET_KEY, keyboard})
}

export const showPlaying = (key) => {
  let newKey = {key: key.key, audio: key.audio, name: key.name, status: 'playing'};

  return {type: SHOW_PLAYING, key: newKey}
}

export const stopPlaying = key => {
  let newKey = {key: key.key, audio: key.audio, name: key.name, status: 'mounted'};

  return {type: STOP_PLAYING, key: newKey}
}

export const resetKeyboard = () => ({type: RESET})

export const setName = name => ({type: CREATE, name})

export const loadKeyboard = keyboard => ({type: LOAD, keyboard})

export const setProject = keyboard => {
  let arrangmentWithAudio = []

  keyboard.arrangement.forEach(key => {
    if (key.audioURL) {
      const audio = new Audio(key.audioURL);
      key.audio = audio;
      arrangmentWithAudio.push(key);
    } else {
      arrangmentWithAudio.push(key);
    }
  })

  keyboard.arrangement = arrangmentWithAudio;
  history.push(`/projects/${keyboard.id}`)
  return ({type: SET_KEYBOARD, keyboard})
}

/**
 * THUNK CREATORS
 */
export const saveProjectThunk = (track, dontAlert) => {
  return (dispatch, getState) => {
    const keyboard = getState().keyboard;
    const userId = getState().user.id;
    const keys = getState().keys;

    const currentKeys = keyboard.keys.map(key => {
      if (key.name) {
        const audioURL = _.find(keys, { 'name': key.name}).audioURL;
        return {key: key.key, name: key.name, status: 'mounted', audioURL}
      } else {
        return {key: key.key, name: key.name, status: key.status}
      }
    })

    axios.put(`/api/keyboard/${keyboard.id}`, {arrangement: currentKeys, track})
    .then(res => {
      if (res.data[0] === 1) {
        if (!dontAlert) {
          alert('Project Saved!')
        }
      } else {
        alert('Unable to Save Project. Try Again.')
      }
    })
    .catch(err => console.log(err))
  }
}

export const createProjectThunk = (name) => {
  return (dispatch, getState) => {
    const userId = getState().user.id;
    const defaultKeys = defaultKeyboard.keys;

    console.log(name);

    axios.post(`/api/keyboard`, {name, arrangement: defaultKeys, userId})
    .then(res => {
      console.log(res.data);
      history.push(`/projects/${res.data.id}`);
      dispatch(loadKeyboard(res.data))
    })
    .catch(err => console.log(err))
  }
}

export const loadProjectThunk = (id) => {
  return (dispatch, getState) => {
    const userId = getState().user.id;

    axios.get(`/api/keyboard/${id}`)
    .then(res => {

      if (res.data) {

        let arrangmentWithAudio = []

        res.data.arrangement.forEach(key => {
          if (key.audioURL) {
            const audio = new Audio(key.audioURL);
            key.audio = audio;
            arrangmentWithAudio.push(key);
          } else {
            arrangmentWithAudio.push(key);
          }
        })

        res.data.arrangement = arrangmentWithAudio;

        dispatch(loadKeyboard(res.data))

      } else {

        history.push('/');

      }
    })
    .catch(err => console.log(err))
  }
}



/**
 * REDUCER
 */
export default function (state = defaultKeyboard, action) {
  switch (action.type) {
    case SET_KEY:
      return Object.assign({}, state, {keys: [...state.keys].map(oldKey => oldKey.key === action.key.key ? action.key : oldKey)})
    case SHOW_PLAYING:
      return Object.assign({}, state, {keys: [...state.keys].map(oldKey => oldKey.key === action.key.key ? action.key : oldKey)})
    case STOP_PLAYING:
      return Object.assign({}, state, {keys: [...state.keys].map(oldKey => oldKey.key === action.key.key ? action.key : oldKey)})
    case RESET:
    return Object.assign({}, state, {keys: defaultKeyboard.keys})
    case CREATE:
      return Object.assign({}, state, {name: action.name})
    case LOAD:
      return Object.assign({}, state, {id: action.keyboard.id, name: action.keyboard.name, keys: action.keyboard.arrangement, track: action.keyboard.track});
    case SET_KEYBOARD:
      return Object.assign({}, state, {id: action.keyboard.id, name: action.keyboard.name, keys: action.keyboard.arrangement, track: action.keyboard.track});
    case UNSET_KEY:
      return Object.assign({}, state, {keys: action.keyboard.keys, track: action.keyboard.track});
    case UNSET_SINGLE_KEY:
      return Object.assign({}, state, {keys: action.keyboard.keys, track: action.keyboard.track});
    default:
      return state
  }
}
