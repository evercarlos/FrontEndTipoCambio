import axios from 'axios'

const axiosConfig = {
  baseURL: 'http://51.222.9.20:8080',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  },
}
const apiCall = axios.create(axiosConfig)
export default apiCall
