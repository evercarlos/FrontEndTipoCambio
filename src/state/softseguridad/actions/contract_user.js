import service from '@/services/softseguridad/contract_user'

export default {
  CONTRACT_USER_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      service.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_USER_CREATE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      service.createUpdate(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_USER_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      service.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
