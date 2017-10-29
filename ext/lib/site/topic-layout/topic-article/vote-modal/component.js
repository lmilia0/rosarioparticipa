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
      proyectos: sessionStorage.getItem('pp-proyectos') || []
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

  // // Sent Topics to API
  // sendTopics = () => {
  //   //Votacion adulta concatena los dos topics
  //   if (this.state.etapa === 'segundo-voto' && sessionStorage.topics.length > 0) {
  //     const previousTopic = JSON.parse(sessionStorage.getItem('topics'))
  //     const allTopics = JSON.stringify(previousTopic.concat([this.props.topic]))
  //     sessionStorage.setItem('topics', allTopics)
  //     //Votacion joven guarda topic
  //   } else if (this.state.etapa === 'primer-voto' && sessionStorage.topics === undefined) {
  //     const topic = JSON.stringify([this.props.topic])
  //     sessionStorage.setItem('topics', topic)
  //   }

  //   let topicsNumbers = this.gettingTopicsNumbers()
    
  //   fetch('/ext/api/votacion', {
  //     method: 'POST',
  //     credentials: 'same-origin',
  //     headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({numbers: topicsNumbers})
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         sessionStorage.setItem('canVote', false)
  //         this.setState({etapa: 'confirmacion'})
  //       } else if (res.status=== 400) {
  //         this.setState({etapa: 'error'})
  //       }
  //     })
  // }

  // //Getting string of project numbers
  // gettingTopicsNumbers = () => {
  //   // let gettingTopics = JSON.parse(sessionStorage.getItem('topics'))
  //   // let topicsNumbers = (gettingTopics.map((t)=>{return (t.attrs.number)})).join(',')
  //   // return topicsNumbers
  // }

  render () {
    return (
      <div className='modal-wrapper'>
        <div className='overlay' />
        {/* Voto Joven */
          this.state.etapa === 'voto-joven' &&
          <VoteJoven
            proyectos={this.state.proyectos}
            topic={this.props.topic}
            saveTopic={this.saveTopic}
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
            proyectos={this.state.proyectos}
            topic={this.props.topic}
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
