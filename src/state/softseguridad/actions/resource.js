import serviceResource from '@/services/softseguridad/resource'

export default {
  RESOURCE_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceResource.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  RESOURCE_CREATE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceResource.createUpdate(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  RESOURCE_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceResource.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
