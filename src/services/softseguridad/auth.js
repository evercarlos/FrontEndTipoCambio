import apiCall from '../index'

const apiService = '/tipocambio/api'

const service = {
  login(model) {
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .common[authorization] = ''
      apiCall
        .post(`${apiService}/auth`, model)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  info(params) {
    // const query = '/info'
    const query = `/info?idProfile=${params.id}`
    const authorization = 'Authorization'
    return new Promise((resolve, reject) => {
      apiCall
        .defaults
        .headers
        .get['idProfile'] = `${params.id}`
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
  /* info(params) {
    // const query = '/info'
    const query = `/info?idProfile=${params.id}`
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
  }, */
}

export default service
