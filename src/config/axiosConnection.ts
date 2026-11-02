import axios from 'axios'
import { carregarComVersao } from '../utils/storage.utils.ts'

const configured =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.API_URL as string | undefined) ||
  ""

const baseURL = configured.trim() || "/api"

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = carregarComVersao<string | null>('skadi_token', 1, null)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
