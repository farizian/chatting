import axios from "axios";
import { API_URL } from "../../helper/env";
import { getAllUser, getAllUserPending, getAllUserError, getDetailUser, getDetailUserPending, getDetailUserError, getDetailByName, getDetailByNamePending, getDetailByNameError } from "../../helper/var";



export const LOGIN = (data)=> {
  return new Promise((resolve, reject) =>{
    axios.post(`${API_URL}login`, data)
    .then((response) => {
      resolve(response.data)
      const tokenLogin = response.data.token
      const img = response.data.field[0].img
      localStorage.setItem("token", tokenLogin)
      localStorage.setItem("img", img)
    }).catch ((err) => {
      reject(err)
    })
  })
}
export const REGISTER = (data)=> {
  return new Promise((resolve, reject) =>{
    axios.post(`${API_URL}register`, data)
    .then((response) => {
      resolve(response.data.success)
    }).catch ((err) => {
      reject(err)
    })
  })
}
export const UPDATE_USER = (form, id)=> {
  const token = localStorage.getItem("token")
  return new Promise((resolve, reject) =>{
    const headers = {
      "Content-Type": "multipart/form-data",
      "token": token
    }
    axios.put(`${API_URL}user/${id}`, form, {headers})
    .then((response) => {
      resolve(response)
    }).catch ((err) => {
      reject(err)
    })
  })
}
export const GET_ALL_USER = (data) => {
  return (dispatch) => {
    dispatch({
      type: getAllUserPending
    })
    axios.get(`${API_URL}user?search=${data === undefined ? '' : data}&field=id`).then((response) => {
      dispatch({
        type: getAllUser,
        payload: response.data.field.data
      })
    }).catch((err) => {
      dispatch({
        type: getAllUserError,
        payload: `terjadi kesalahan, ${err}`
      })
    })
  }
}
export const GET_DETAIL_BY_NAME = (name) => {
  return (dispatch) => {
    dispatch({
      type: getDetailByNamePending
    })
    axios.get(`${API_URL}detailbyname/${name}`).then((response) => {
      const data = {
        id: response.data.field[0].id,
        img: response.data.field[0].img,
        username: response.data.field[0].username,
        email: response.data.field[0].email,
        password: response.data.field[0].password,
        phone_number: response.data.field[0].phone_number,
        tag_name: response.data.field[0].tag_name,
      }
      dispatch({
        type: getDetailByName,
        payload: data
      })
    }).catch((err) => {
      dispatch({
        type: getDetailByNameError,
        payload: `terjadi kesalahan, ${err}`
      })
    })
  }
}
export const GET_DETAIL_USER = () => {
  const token = localStorage.getItem("token")
  return (dispatch) => {
    dispatch({
      type: getDetailUserPending
    })
    axios.get(`${API_URL}userdetails`, {headers: {token: token} }).then((response) => {
      const data = {
        id: response.data.field[0].id,
        img: response.data.field[0].img,
        username: response.data.field[0].username,
        email: response.data.field[0].email,
        password: response.data.field[0].password,
        phone_number: response.data.field[0].phone_number,
        tag_name: response.data.field[0].tag_name,
      }
      dispatch({
        type: getDetailUser,
        payload: data
      })
    }).catch((err) => {
      dispatch({
        type: getDetailUserError,
        payload: `terjadi kesalahan, ${err}`
      })
    })
  }
}
