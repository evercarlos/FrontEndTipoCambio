import serviceTypeResource from '@/services/softseguridad/typeResource'

export default {
  TYPE_RESOURCE_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceTypeResource.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TYPE_RESOURCE_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceTypeResource.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TYPE_RESOURCE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceTypeResource.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  TYPE_RESOURCE_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceTypeResource.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
