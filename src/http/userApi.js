import axios from "axios"

export const API_URL = "http://localhost:1710"
const config = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}

export const regin = async (email, password, username) => {
  const res = await axios.post(`${API_URL}/api/user/regin`, { email, password, username })
  localStorage.setItem('token', res.data.token)
  return res
}
export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/user/login`, { email, password })
  localStorage.setItem('token', res.data.token)
  return res
}
export const check = async () => {
  const res = await axios.get(`${API_URL}/api/user/auth`, config)
  localStorage.setItem('token', res.data.token)
  return res
}
export const getOneUser = async (email) => {
  const data = await axios.post(`${API_URL}/api/user/get`, { email })
  return data
}
export const getUsers = async () => {
  const data = await axios.get(`${API_URL}/api/user/get/all`)
  return data
}
export const changeStatus = async (email, status) => {
  const data = await axios.put(`${API_URL}/api/user/change/status`, { email, status })
  return data
}
export const deleteUser = async (email) => {
  const data = await axios.put(`${API_URL}/api/user/delete`, { email })
  return data
}
export const addUserToAdmins = async (email) => {
  const data = await axios.put(`${API_URL}/api/user/add`, { email })
  return data
}
export const removeUserFromAdmins = async (email) => {
  const data = await axios.put(`${API_URL}/api/user/remove`, { email })
  return data
}
export const getUserByCollection = async (id) => {
  const res = await axios.post(`${API_URL}/api/user/getByIdCollection`, { id })
  return res.data
}