import React, { Component } from 'react'
import { withRouter } from 'react-router'
import bus from 'bus'
import FirstVote from './first-vote/component'
import SecondVote from './second-vote/component'
import VoteJoven from './vote-joven/component'
import Confirmacion from './confirmacion/component'
import ErrorModal from './error-modal/component'

class VoteModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      etapa: sessionStorage.getItem('pp-etapa'),
      proyectos: JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
    }
  }

  componentWillMount () {
    const { topic } = this.props
    sessionStorage.setItem('pp-padron', topic.attrs.edad)
    this.setState({ etapa: (sessionStorage.getItem('pp-etapa') || (topic.attrs.edad === 'joven' ? 'voto-joven' : 'primer-voto-adulto')) })
  }

  componentWillReceiveProps ({ show }) { this.setState({ show }) }

  // Save Topic Adulto in Session Storage
  saveTopic = () => {
    const proyectos = JSON.stringify([...this.state.proyectos, this.props.topic])
    if (this.state.etapa === 'primer-voto-adulto') {
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
    const edad = sessionStorage.getItem('pp-padron').toUpperCase()

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
          ppStatus.createdAt = false
          localStorage.setItem('ppStatus', JSON.stringify(ppStatus))
          bus.emit('refresh-status', ppStatus)
          sessionStorage.removeItem('pp-proyectos')
          sessionStorage.removeItem('pp-etapa')
          sessionStorage.removeItem('pp-padron')
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

  toggleVotesModal = () => {
    this.setState({
      show: !this.state.show
    })
  }

  render () {
    if (!this.state.show) return null
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
            toggleVotesModal={this.toggleVotesModal} />
        }
        {/* Primer Voto Adulto */
          this.state.etapa === 'primer-voto-adulto' &&
          <FirstVote
            topic={this.props.topic}
            saveTopic={this.saveTopic}
            toggleVotesModal={this.toggleVotesModal} />
        }
        {/* Segundo Voto Adulto */
          this.state.etapa === 'segundo-voto-adulto' &&
          <SecondVote
            proyectos={proyectos}
            sendTopics={this.sendTopics}
            toggleVotesModal={this.toggleVotesModal} />
        }
        {/* Confirmación */
          this.state.etapa === 'confirmacion' &&
          <Confirmacion
            toggleVotesModal={this.toggleVotesModal} />
        }
        {/* Error */
          this.state.etapa === 'error' &&
          <ErrorModal
            toggleVotesModal={this.toggleVotesModal} />
        }
      </div>
    )
  }
}

export default withRouter(VoteModal)
