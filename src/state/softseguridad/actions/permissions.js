import servicePermissions from '@/services/softseguridad/permissions'

export default {
  PERMISSION_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      servicePermissions.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  PERMISSION_CREATE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      servicePermissions.createUpdate(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  PERMISSION_DELETE_ALL(_, params) {
    return new Promise((resolve, reject) => {
      servicePermissions.deleteAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
