import serviceHelper from '@/services/softseguridad/helper'

export default {
  RENIEC_FIND_DNI(_, params) {
    return new Promise((resolve, reject) => {
      serviceHelper.findReniec(params.dni).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}
