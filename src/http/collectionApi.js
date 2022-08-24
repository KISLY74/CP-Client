import axios from "axios"
import { API_URL } from "./userApi"

export const createCollection = async (name, description, theme, email) => {
  await axios.post(`${API_URL}/api/collection/create`, { name, description, theme, email })
}
export const getCollections = async () => {
  const data = await axios.get(`${API_URL}/api/collection/get/all`)
  return data.data
}
export const getCollectionsByUser = async (email) => {
  const data = await axios.post(`${API_URL}/api/collection/getAllByUser`, { email })
  return data.data
}
export const deleteCollection = async (id) => {
  await axios.put(`${API_URL}/api/collection/delete`, { id })
}