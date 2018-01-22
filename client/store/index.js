import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import keyboard from './keyboard'
import keys from './keys'
import app from './app'
import keyboards from './keyboards'

const reducer = combineReducers({user, keyboard, keys, app, keyboards})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  createLogger({collapsed: true})
))
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './keyboard'
export * from './keys'
export * from './app'
export * from './keyboards'
