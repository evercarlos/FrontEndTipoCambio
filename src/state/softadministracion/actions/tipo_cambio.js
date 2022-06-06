import service from '@/services/softadministracion/tipo_cambio'

export default {
  TIPO_CAMBIO_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      service.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TIPO_CAMBIO_FIND(_, params) {
    return new Promise((resolve, reject) => {
      service.find(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TIPO_CAMBIO_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      service.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TIPO_CAMBIO_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      service.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TIPO_CAMBIO_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      service.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
