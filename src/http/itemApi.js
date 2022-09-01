import axios from "axios"
import { API_URL } from "./userApi"

export const createItem = async (name, tags, id, additionalFields) => {
  await axios.post(`${API_URL}/api/item/create`, { name, tags, id, additionalFields })
}
export const getItems = async () => {
  const data = await axios.get(`${API_URL}/api/item/get/all`)
  return data.data
}
export const getItemsByCollection = async (id) => {
  const data = await axios.post(`${API_URL}/api/item/getAllByCollection`, { id })
  return data.data
}
export const deleteItem = async (id) => {
  await axios.put(`${API_URL}/api/item/delete`, { id })
}
export const editItem = async (id, name, tags, additionalFields) => {
  const res = await axios.put(`${API_URL}/api/item/edit`, { id, name, tags, additionalFields })
  return res.data
}
export const getItem = async (id) => {
  const res = await axios.post(`${API_URL}/api/item/get`, { id })
  return res.data
}