import serviceContract from '@/services/softseguridad/contract'

export default {
  CONTRACT_FIND_ALL(_, params) {
    return new Promise((resolve, reject) => {
      serviceContract.findAll(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_CREATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceContract.create(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_UPDATE(_, params) {
    return new Promise((resolve, reject) => {
      serviceContract.update(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  CONTRACT_DELETE(_, params) {
    return new Promise((resolve, reject) => {
      serviceContract.delete(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
