import serviceAuth from '@/services/softseguridad/auth'

export default {
  AUTH_CREATE_TOKEN(_, params) {
    return new Promise((resolve, reject) => {
      serviceAuth.login(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  AUTH_INFO(_, params) {
    console.log(params) //eslint-disable-line
    return new Promise((resolve, reject) => {
      serviceAuth.info(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

/* export default {
  login({ commit }, model) {
    commit('auth_request')
    return new Promise((resolve, reject) => {
      serviceAuth.login(model).then(res => {
        const tok1 = res.token
        const dataUser = {
          nombreCompleto: res.user.nombreCompleto,
          username: res.user.username,
          perfil: res.user.authorities[0].authority,
          usuario: res.user.id,
          foto: res.user.foto,
        }
        const user = dataUser
        user.ability = {
          action: 'manage',
          subject: 'all',
        }
        localStorage.setItem('token-type', res.tokenType)
        localStorage.setItem('user-token', tok1)
        localStorage.setItem('user-data', JSON.stringify(user))
        commit('auth_success', { tok1, user })
        resolve()
      }).catch(err => {
        commit('auth_error')
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-data')
        localStorage.removeItem('token-type')
        const objErr = {
          title: 'Error al ingresar a tu sesión',
          message: 'Revisa que los datos que ingresaste sean los correctos',
          msj: err,
        }
        reject(objErr)
      })
    })
  },
} */
