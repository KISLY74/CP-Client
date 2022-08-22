import axios from "axios"
import { API_URL } from "./userApi"

export const createCollection = async (collectionName, description, theme, email) => {
  await axios.post(`${API_URL}/api/collection/create`, { collectionName, description, theme, email })
}
export const getCollections = async () => {
  await axios.get(`${API_URL}/api/collection/get/all`)
}