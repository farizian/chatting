
const userState = {
  getAll: [],
  loadAll: false,
  errorAll: false,
  errorMessageAll: '',
  getDetail: {},
  loadDetail: false,
  errorDetail: false,
  errorMessageDetail: '',
  getDetailById: {},
  loadDetailById: false,
  errorDetailById: false,
  errorMessageDetailById: '',
}

const userReducer = (state=userState, action) => {
  switch (action.type) {
    case "getAllUserPending":
      return {...state, loadAll: true}
    case "getAllUser":
      return {...state, loadAll: false, getAll: action.payload}
    case "getAllUserError":
      return {...state, loadAll: false, errorAll: true, errorMessageAll: action.payload}
    case "getDetailUserPending":
      return {...state, loadDetail: true}
    case "getDetailUser":
      return {...state, loadDetail: false, getDetail: action.payload}
    case "getDetailUserError":
      return {...state, loadDetail: false, errorDetail: true, errorMessageDetail: action.payload}
    case "getDetailByIdPending":
      return {...state, loadDetail: true}
    case "getDetailById":
      return {...state, loadDetailById: false, getDetailById: action.payload}
    case "getDetailByIdError":
      return {...state, loadDetailById: false, errorDetailById: true, errorMessageDetailById: action.payload}
    default:
      return state
  }
}

export default userReducer