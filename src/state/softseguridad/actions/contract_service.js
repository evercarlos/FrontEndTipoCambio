import service from '@/services/softseguridad/contract_service'

export default {
  CONTRACT_SERVICE_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      service.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_SERVICE_CREATE_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      service.createUpdate(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_SERVICE_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      service.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
