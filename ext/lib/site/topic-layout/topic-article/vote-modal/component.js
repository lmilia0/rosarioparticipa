import React, { Component } from 'react'
import { withRouter } from 'react-router'
import FirstVote from './first-vote/component'
import SecondVote from './second-vote/component'
import VoteJoven from './vote-joven/component'
import Confirmacion from './confirmacion/component'
import ErrorModal from './error-modal/component'

class VoteModal extends Component {
  constructor (props) {
    super(props)
    const edad = JSON.parse(localStorage.getItem('ppStatus')).padron
    this.state = {
      etapa: (sessionStorage.getItem('pp-etapa') || (edad === 'joven' ? 'voto-joven' : 'primer-voto-adulto')),
      proyectos: JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
    }
  }

  // Save Topic Adulto in Session Storage
  saveTopic = () => {
    const proyectos = JSON.stringify([...this.state.proyectos, this.props.topic])
    if (this.state.etapa === 'voto-joven') {
      if (proyectos.length === 3) {
        console.log('guardar proyectos')
        return
      }
    } else {
      sessionStorage.setItem('pp-etapa', 'segundo-voto-adulto')
    }
    sessionStorage.setItem('pp-proyectos', proyectos)
    this.props.router.push('/presupuesto')
  }

  // Sent Topics to API
  sendTopics = (proyectos) => () => {
    let distritales = ''
    let barriales = ''
    const distrito = proyectos[0].attrs.district.toUpperCase()
    const ppStatus = JSON.parse(localStorage.getItem('ppStatus'))
    const edad = ppStatus.padron.toUpperCase()

    if (edad === 'ADULTO') {
      distritales = proyectos.find((p) => p.attrs.area === '0').attrs.number
      barriales = proyectos.find((p) => p.attrs.area !== '0').attrs.number
    } else {
      distritales = proyectos.map((p) => p.attrs.number).join(',')
    }

    const data = {
      modalidad: edad,
      distrito: distrito,
      proyectos_distritales: distritales,
      proyectos_barriales: barriales
    }

    fetch(
      '/ext/api/participatory-budget/vote',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          ppStatus.puede_votar = false
          localStorage.setItem('ppStatus', JSON.stringify(ppStatus))
          sessionStorage.removeItem('pp-proyectos')
          sessionStorage.removeItem('pp-etapa')
          this.setState({ etapa: 'confirmacion' })
        } else if (res.status !== 400) {
          this.setState({ etapa: 'error' })
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({ etapa: 'error' })
      })
  }

  render () {
    const proyectos = [...this.state.proyectos, this.props.topic]
    return (
      <div className='modal-wrapper'>
        <div className='overlay' />
        {/* Voto Joven */
          this.state.etapa === 'voto-joven' &&
          <VoteJoven
            proyectos={proyectos}
            saveTopic={this.saveTopic}
            sendTopics={this.sendTopics}
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Primer Voto Adulto */
          this.state.etapa === 'primer-voto-adulto' &&
          <FirstVote
            topic={this.props.topic}
            saveTopic={this.saveTopic}
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Segundo Voto Adulto */
          this.state.etapa === 'segundo-voto-adulto' &&
          <SecondVote
            proyectos={proyectos}
            sendTopics={this.sendTopics}
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Confirmación */
          this.state.etapa === 'confirmacion' &&
          <Confirmacion
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Error */
          this.state.etapa === 'error' &&
          <ErrorModal
            toggleVotesModal={this.props.toggleVotesModal} />
        }
      </div>
    )
  }
}

export default withRouter(VoteModal)
