import axios from 'axios'
import history from '../history'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const GET_KEYS = 'GET_KEYS'
const UPLOAD_KEY = 'UPLOAD_KEY'
const REMOVE_KEY = 'REMOVE_KEY'
const CLEAR_KEY = 'CLEAR_KEY'

/**
 * INITIAL STATE
 */
const defaultKeyboard = {keys: []}

/**
 * ACTION CREATORS
 */
const getKeys = keys => ({type: GET_KEYS, keys})
const uploadKey = key => ({type: UPLOAD_KEY, key})
const removeKey = key => ({type: REMOVE_KEY, key})
export const clearKeys = () => ({type: CLEAR_KEY})

/**
 * THUNK CREATORS
 */
export const getKeysThunk = (keyboardId) => {
  return (dispatch) => {

    axios.get(`/api/keys/${keyboardId}`)
    .then(res => {
      const sortedKeys = _.sortBy(res.data,function(key) { return key.name });

      dispatch(getKeys(sortedKeys || defaultKeyboard))
    })
    .catch(err => console.log(err))
  }
}

export const uploadKeyThunk = (sound) => {
  return (dispatch, getState) => {

    const keyboardId = getState().keyboard.id;

    axios.post('/api/keys', sound, {
      headers: {
        "Content-Type": "audio/mpeg",
        "name": sound.name,
        "keyboardid": keyboardId
      }
    })
    .then(res => {
      dispatch(uploadKey(res.data || defaultKeyboard))
    })
    .catch(err => console.log(err))
  }
}

export const removeKeyThunk = (key) => {
  return (dispatch) => {

    axios.delete(`/api/keys/${key.id}`)
    .then(res => {
      dispatch(removeKey(key))
    })
    .catch(err => console.log(err))
  }
}

/**
 * REDUCER
 */
export default function (state = defaultKeyboard, action) {
  switch (action.type) {
    case GET_KEYS:
      return action.keys
    case UPLOAD_KEY:
      return [...state, action.key]
    case REMOVE_KEY:
      return [...state].filter(key => key !== action.key)
    case CLEAR_KEY:
      return defaultKeyboard;
    default:
      return state
  }
}
