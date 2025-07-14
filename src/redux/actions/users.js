import { API_URL } from "../../helper/env";

export const LOGIN = (data) => {
  return new Promise((resolve, reject) => {
    if(response.data.field && response.data.field[0]) {
      const img = response.data.field[0].img
      const id = response.data.field[0].id
      resolve(response.data)
      if(response.data.token) {
        const tokenLogin = response.data.token
        localStorage.setItem("token", tokenLogin)
        
        const img = response.data.field.rows[0].img
        const id = response.data.field.rows[0].id
        localStorage.setItem("img", img)
        localStorage.setItem("id", id)
      }
    }
    axios.post(`${API_URL}register`, data)
      .then((response) => {
        resolve(response.data)
      }).catch((err) => {
        reject(err)
      })
  })
}

export const UPDATE_PW = (pw) => {
  const token = localStorage.getItem("token")
  return new Promise((resolve, reject) => {
    const headers = {
      "token": token
    }
    axios.put(`${API_URL}userpw`, pw, {headers})
      .then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
  })
}

export const UPDATE_USER = (form) => {
  const token = localStorage.getItem("token")
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      "token": token
    }
    axios.put(`${API_URL}user`, form, {headers})
      .then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
  })
}

export const GET_ALL_USER = (data) => {
  return (dispatch) => {
    dispatch({
      type: "getAllUserPending"
    })
    axios.get(`${API_URL}user?search=${data === undefined ? '' : data}&field=id`).then((response) => {
      dispatch({
        type: 'getAllUser',
        payload: response.data.field.data || response.data.field
      })
    }).catch((err) => {
      dispatch({
        type: "getAllUserError",
        payload: err
      })
    })
  }
}

export const GET_DETAIL_BYID = (id) => {
  return (dispatch) => {
    dispatch({
      type: "getDetailByIdPending"
    })
    axios.get(`${API_URL}detail/${id}`).then((response) => {
      const data = {
        id: response.data.field[0].id,
        img: response.data.field[0].img,
        username: response.data.field[0].username,
        email: response.data.field[0].email,
        password: response.data.field[0].password,
        phone: response.data.field[0].phone,
        tagName: response.data.field[0].tagname,
        bio: response.data.field[0].bio,
      }
      dispatch({
        type: "getDetailById",
        payload: data
      })
    }).catch((err) => {
      dispatch({
        type: "getDetailByIdError",
        payload: `terjadi kesalahan, ${err}`
      })
    })
  }
}

export const GET_DETAIL_USER = () => {
  const token = localStorage.getItem("token")
  return (dispatch) => {
    dispatch({
      type: "getDetailUserPending"
    })
    axios.get(`${API_URL}mydetails`, {headers: {token: token}}).then((response) => { 
      const data = {
        id: response.data.field[0].id,
        img: response.data.field[0].img,
        username: response.data.field[0].username,
        email: response.data.field[0].email,
        password: response.data.field[0].password,
        phone: response.data.field[0].phone,
        tagName: response.data.field[0].tagname,
        bio: response.data.field[0].bio,
      }
      dispatch({
        type: "getDetailUser",
        payload: data
      })
    }).catch((err) => {
      dispatch({
        type: "getDetailUserError",
        payload: err
      })
    })
  }
}
