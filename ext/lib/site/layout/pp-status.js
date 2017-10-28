import React, { Component } from 'react'
import userConnector from 'lib/site/connectors/user'
import bus from 'bus'

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
          let ppStatus = JSON.parse(localStorage.getItem('ppStatus')) || {}

          if (
            !this._fetchingStatus &&
            (ppStatus.id !== props.user.state.value.id ||
              (ppStatus.createdAt && this.tokenExpired(ppStatus.createdAt)))
          ) {
            this._fetchingStatus = true
            this.getStatus()
              .then((status) => {
                ppStatus = {}
                ppStatus.id = props.user.state.value.id
                ppStatus.createdAt = new Date()
                if (!status.puede_votar || (!status.padron_adulto && !status.padron_joven)) {
                  ppStatus.puede_votar = false
                  ppStatus.msj = status.mensaje_aclaratorio
                  ppStatus.msj_code = status.codigo_mensaje
                } else {
                  ppStatus.puede_votar = true
                  ppStatus.padron = status.padron_adulto ? 'adulto' : 'joven'
                  ppStatus.msj = status.mensaje_aclaratorio
                  ppStatus.msj_code = status.codigo_mensaje
                }
                localStorage.setItem('ppStatus', JSON.stringify(ppStatus))
                this._fetchingStatus = false
                bus.emit('pp-status', ppStatus)
              })
              .catch((err) => {
                this._fetchingStatus = false
                bus.emit('pp-status', {})
                localStorage.removeItem('ppStatus')
              })
          }
        } else {
          bus.emit('pp-status', {})
          localStorage.removeItem('ppStatus')
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
          return res.results || {}
        })
    }

    render () {
      return <Layout {...this.props} />
    }
  }
  return userConnector(PPStatus)
}
