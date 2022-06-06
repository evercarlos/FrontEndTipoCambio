import serviceProfile from '@/services/softseguridad/profile'

export default {
  PROFILE_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceProfile.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  PROFILE_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceProfile.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  PROFILE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceProfile.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  PROFILE_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceProfile.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
