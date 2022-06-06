import serviceRol from '@/services/softseguridad/rol'

export default {
  ROL_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceRol.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  ROL_CREATE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceRol.createUpdate(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  ROL_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceRol.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
