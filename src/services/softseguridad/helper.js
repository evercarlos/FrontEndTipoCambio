import apiCall from '../indexHelper'

const apiServiceReniec = '/alerta/api/v1/reniec/reniec'

const service = {
  findReniec(dni) {
    const query = `/${dni}`
    return new Promise((resolve, reject) => {
      apiCall
        .get(apiServiceReniec + query)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
}

export default service
