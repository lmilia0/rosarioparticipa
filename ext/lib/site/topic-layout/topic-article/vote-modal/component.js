import React, { Component } from 'react'
import FirstVote from './first-vote/component'
import SecondVote from './second-vote/component'
import VoteJoven from './vote-joven/component'
import Confirmacion from './confirmacion/component'
import ErrorModal from './error-modal/component'

export default class VoteModal extends Component {
  constructor (props) {
    super(props)
    const edad = JSON.parse(localStorage.getItem('ppStatus')).padron
    this.state = {
      etapa: (sessionStorage.getItem('pp-etapa') || (edad === 'joven' ? 'voto-joven' : 'primer-voto-adulto')),
      proyectos: sessionStorage.getItem('pp-proyectos') || []
    }
  }

  // Save Topic Adulto in Session Storage
  saveTopic = () => {
    if (this.state.etapa === 'primer-voto' && sessionStorage.topics === undefined) {
      const topic = JSON.stringify([this.props.topic])
      sessionStorage.setItem('topics', topic)
    }

    if (this.state.etapa === 'primer-voto' && this.state.edad === 'adulto'){
      window.location.href='/presupuesto'
    }
  }

  // Sent Topics to API
  sendTopics = () => {
    //Votacion adulta concatena los dos topics
    if (this.state.etapa === 'segundo-voto' && sessionStorage.topics.length > 0) {
      const previousTopic = JSON.parse(sessionStorage.getItem('topics'))
      const allTopics = JSON.stringify(previousTopic.concat([this.props.topic]))
      sessionStorage.setItem('topics', allTopics)
      //Votacion joven guarda topic
    } else if (this.state.etapa === 'primer-voto' && sessionStorage.topics === undefined) {
      const topic = JSON.stringify([this.props.topic])
      sessionStorage.setItem('topics', topic)
    }

    let topicsNumbers = this.gettingTopicsNumbers()
    
    fetch('/ext/api/votacion', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({numbers: topicsNumbers})
      })
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem('canVote', false)
          this.setState({etapa: 'confirmacion'})
        } else if (res.status=== 400) {
          this.setState({etapa: 'error'})
        }
      })
  }

  //Getting string of project numbers
  gettingTopicsNumbers = () => {
    let gettingTopics = JSON.parse(sessionStorage.getItem('topics'))
    let topicsNumbers = (gettingTopics.map((t)=>{return (t.attrs.number)})).join(',')
    return topicsNumbers
  }

  render () {
    return (
      <div className='modal-wrapper'>
        <div className='overlay' />
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
            savedTopic={JSON.parse(localStorage.getItem(0))}
            topic={this.props.topic}
            saveTopic={this.sendTopics}
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Voto Joven */
          this.state.etapa === 'voto-joven' &&
          <VoteJoven
            proyectos={this.state.proyectos}
            topic={this.props.topic}
            saveTopic={this.sendTopics}
            toggleVotesModal={this.props.toggleVotesModal} />
        }
        {/* Confirmación */
          this.state.etapa === 'confirmacion' &&
          <Confirmacion
            edad={this.state.edad}
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
