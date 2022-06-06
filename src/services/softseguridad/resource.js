import apiCall from '../index'

const apiService = '/seguridad/api/v1/recursos'

const service = {
  findAll(params) {
    const query = `?limit=${params.limit}&page=${params.page}&query=${params.query}&sortBy=${params.sortBy}&idService=${params.idService}`
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .get(apiService + query)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  createUpdate(model) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .post(apiService, model)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  delete(params) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .delete(`${apiService}/${params.id}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
}

export default service
