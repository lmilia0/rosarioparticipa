import React, { Component } from 'react'
import Header from 'lib/header/component'
import userConnector from 'lib/site/connectors/user'

class Layout extends Component {
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
    const { children } = this.props
    return (
      <div id='outer-layout'>
        <Header />
        {children}
      </div>
    )
  }
}

export default userConnector(Layout)
