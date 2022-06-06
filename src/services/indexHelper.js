import axios from 'axios'

const axiosConfig = {
  baseURL: 'http://localhost:8089',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  },
}
const apiCall = axios.create(axiosConfig)
export default apiCall
