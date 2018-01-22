import axios from 'axios'
import history from '../history'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const GET_KEYBOARDS = 'GET_KEYBOARDS'

/**
 * INITIAL STATE
 */
const defaultKeyboards = []

/**
 * ACTION CREATORS
 */
const getKeyboards = keyboards => ({type: GET_KEYBOARDS, keyboards})

/**
 * THUNK CREATORS
 */
export const getKeyboardsThunk = () => {
  return (dispatch, getState) => {
    const userId = getState().user.id;

    axios.get(`/api/keyboards/${userId}`)
    .then(res => {
      dispatch(getKeyboards(res.data || defaultKeyboard))
    })
    .catch(err => console.log(err))
  }
}

/**
 * REDUCER
 */
export default function (state = defaultKeyboards, action) {
  switch (action.type) {
    case GET_KEYBOARDS:
      return action.keyboards
    default:
      return state
  }
}
