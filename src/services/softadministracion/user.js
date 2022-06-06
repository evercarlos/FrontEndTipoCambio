import apiCall from '../indexTest'

const apiService = '/softmaster/api/v1/usuario'

const service = {
  findAll(params) {
    const query = `?limit=${params.limit}&page=${params.page}&query=${params.query}&sortBy=${params.sortBy}`
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
  findAllUser(params) {
    const query = `?idWorker=${params.idWorker}`
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .get( `${apiService}/listar_usuarios/${query}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  find(model) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .get(`${apiService}/${model.dni}`)
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
  resetPassword(params) {
    const authorization = 'Authorization'
    const query = `?idUser=${params.idUser}&currentPassword=${params.currentPassword}&password=${params.password}`
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = `${localStorage.getItem('token-type')} ${localStorage.getItem('user-token')}`
      apiCall
        .put(`${apiService}/resetPassword${query}`)
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
