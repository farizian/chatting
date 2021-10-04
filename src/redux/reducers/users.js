import { getAllUser, getAllUserPending, getAllUserError, getDetailUser, getDetailUserPending, getDetailUserError, getDetailByName, getDetailByNamePending, getDetailByNameError } from "../../helper/var";

const userState = {
  getAll: [],
  loadAll: false,
  errorAll: false,
  errorMessageAll: '',
  getDetail: {},
  loadDetail: false,
  errorDetail: false,
  errorMessageDetail: '',
  getDetailByName: {},
  loadDetailByName: false,
  errorDetailByName: false,
  errorMessageDetailByName: '',
}

const userReducer = (state=userState, action) => {
  switch (action.type) {
    case getAllUserPending:
      return {...state, loadAll: true}
    case getAllUser:
      return {...state, loadAll: false, getAll: action.payload}
    case getAllUserError:
      return {...state, loadAll: false, errorAll: true, errorMessageAll: action.payload}
    case getDetailUserPending:
      return {...state, loadDetail: true}
    case getDetailUser:
      return {...state, loadDetail: false, getDetail: action.payload}
    case getDetailUserError:
      return {...state, loadDetail: false, errorDetail: true, errorMessageDetail: action.payload}
    case getDetailByNamePending:
      return {...state, loadDetail: true}
    case getDetailByName:
      return {...state, loadDetailByName: false, getDetailByName: action.payload}
    case getDetailByNameError:
      return {...state, loadDetailByName: false, errorDetailByName: true, errorMessageDetailByName: action.payload}
    default:
      return state
  }
}

export default userReducer