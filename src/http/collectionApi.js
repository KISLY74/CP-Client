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
export const editCollection = async (id, name, description, theme) => {
  await axios.put(`${API_URL}/api/collection/edit`, { id, name, description, theme })
}
export const changeItemsInCollection = async (id, items) => {
  await axios.put(`${API_URL}/api/collection/change/items`, { id, items })
}
export const addAdditionalFields = async (id, stringsFields, numbersFields, booleansFields, datesFields, textsFields) => {
  await axios.put(`${API_URL}/api/collection/addFields`, { id, stringsFields, numbersFields, booleansFields, datesFields, textsFields })
}
export const getAdditionalFields = async (id) => {
  const res = await axios.post(`${API_URL}/api/collection/getFields`, { id })
  return res.data
}