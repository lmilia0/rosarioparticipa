import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'

/*

mensaje.estado.0 = Invocaci&oacute;n incorrecta.
mensaje.estado.1 = Se encuentra habilitado para votar.
mensaje.estado.2 = Ya participaste con este documento.
mensaje.estado.3 = Lo sentimos, tus datos no se encuentran en el padr&oacute;n de votantes habilitados, \
pod&eacute;s dirigirte a tu Centro Municipal de Distrito o consultar a: <a href='yoparticipo@rosario.gob.ar'>yoparticipo@rosario.gob.ar</a>.
mensaje.estado.10 = El período de votación no ha comenzado todavía.
#El per&iacute;odo de votaci&oacute;n se inicia el 6/11 a las 8:00hs.
mensaje.estado.11 = Se encuentra en el período de votación.
mensaje.estado.12 = El período de votación ha finalizado.

 */

export default function ppHOC(Layout) {
  class PPStatus extends Component {
    _fetchingStatus = false
    componentWillReceiveProps (props) {
      if (!props.user.state.pending) {
        if (props.user.state.fulfilled) {
          const vPp = JSON.parse(localStorage.getItem('vPp')) || {}

          if (
            !this._fetchingStatus &&
            (vPp.id !== props.user.state.value.id ||
              (vPp.createdAt && this.tokenExpired(vPp.createdAt)))
          ) {
            this._fetchingStatus = true
            this.getStatus()
              .then((status) => {
                vPp.id = props.user.state.value.id
                vPp.createdAt = new Date()
                if (!status.puede_votar || (!status.padron_adulto && !status.padron_joven)) {
                  vPp.puede_votar = false
                } else {
                  vPp.puede_votar = true
                  vPp.padron = status.padron_adulto ? 'adulto' : 'joven'
                  vPp.msj = status.mensaje_aclaratorio
                  vPp.msj_code = status.codigo_mensaje
                }
                localStorage.setItem('vPp', JSON.stringify(vPp))
                this._fetchingStatus = false
              })
              .catch((err) => {
                console.log(err)
                this._fetchingStatus = false
                localStorage.removeItem('vPp')
              })
          }
        } else {
          localStorage.removeItem('vPp')
        }
      }
    }

    tokenExpired (tokenDate) {
      const unaHora = 60 * 60 * 1000
      const delta = ((new Date()) - new Date(tokenDate))
      return delta > unaHora
    }

    getStatus () {
      return fetch(
        '/ext/api/participatory-budget/status',
        {
          method: 'GET',
          credentials: 'same-origin'
        })
        .then((res) => res.json())
        .then((res) => {
          return res
        })
    }

    render () {
      return <Layout {...this.props} />
    }
  }
  return userConnector(PPStatus)
}
