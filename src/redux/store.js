import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import userReducer from './reducers/users'
import chatReducer from './reducers/chat'

const reducers = combineReducers({
  user: userReducer,
  chat: chatReducer

})

const middleware = applyMiddleware(thunk, logger)
const store = createStore(reducers, middleware)

export default store