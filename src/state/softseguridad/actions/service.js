import serviceService from '@/services/softseguridad/service'

export default {
  SERVICE_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceService.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SERVICE_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceService.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SERVICE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceService.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  SERVICE_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceService.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
