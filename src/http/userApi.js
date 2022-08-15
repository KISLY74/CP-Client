import axios from "axios"

const API_URL = "http://localhost:1710"
const config = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}

export const regin = async (email, password, username) => {
  const data = await axios.post(`${API_URL}/api/user/regin`, { email, password, username })
  localStorage.setItem('token', data.token)
  return data
}
export const login = async (email, password) => {
  const data = await axios.post(`${API_URL}/api/user/login`, config, { email, password })
  localStorage.setItem('token', data.token)
  return data
}
export const check = async () => {
  const data = await axios.get(`${API_URL}/api/user/login`, config)
  localStorage.setItem('token', data.token)
  return data
}
export const getOneUser = async (email) => {
  const data = await axios.post(`${API_URL}/api/user/get`, { email })
  return data
}