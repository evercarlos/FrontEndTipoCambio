import serviceUser from '@/services/softadministracion/user'

export default {
  USER_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  WORKER_USER_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.findAllUser(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_FIND(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.find(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_FIND_DNI(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.findByDni(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_CREATE_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.createAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  USER_RESET_PASSWORD(_, params) {
    return new Promise((resolve, reject) => {
      serviceUser.resetPassword(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
