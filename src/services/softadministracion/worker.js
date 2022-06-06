import apiCall from '../indexTest'

const apiService = '/softmaster/api/v1/trabajadores'

const service = {
  findAll(params) {
    const query = `?limit=${params.limit}&page=${params.page}&query=${params.query}&sortBy=${params.sortBy}&codeExecutor=${params.codeExecutor}&idWorker=${params.idWorker}&admin=${params.admin}`
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
  find(params) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .get(`${apiService}/${params.id}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  create(model) {
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
  update(model) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .put(apiService, model)
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
