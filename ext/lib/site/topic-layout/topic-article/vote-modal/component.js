import React, { Component } from 'react'
import FirstVote from './first-vote/component'
import SecondVote from './second-vote/component'
import VoteJoven from './vote-joven/component'
import Confirmacion from './confirmacion/component'


export default class VoteModal extends Component {
  constructor (props) {
    super (props)

    this.state = {
      edad: '',
      etapa: 'primer-voto'
    } 
  }


  componentWillMount () {
    this.setState({edad: this.props.topic.attrs.edad})
    if (sessionStorage.topics !== undefined && sessionStorage.topics.length > 0 && this.props.topic.attrs.edad === 'adulto') {
      this.setState({etapa: 'segundo-voto'}, () => {console.log(this.state.etapa)})
    }
  }

  saveTopic = () => {
    if (this.state.etapa === 'primer-voto' && sessionStorage.topics === undefined) {
      const topic = JSON.stringify([this.props.topic])
      sessionStorage.setItem('topics', topic)
      sessionStorage.setItem('prueba', 'sarasa')
    } else if (this.state.etapa === 'segundo-voto' && sessionStorage.topics.length > 0) {
      const previousTopic = JSON.parse(sessionStorage.getItem('topics'))
      const allTopics = JSON.stringify(previousTopic.concat([this.props.topic]))
      console.log(allTopics)
      sessionStorage.setItem('topics', allTopics)
      sessionStorage.setItem('prueba', 'bb')
    }
    if (this.state.etapa === 'primer-voto' && this.state.edad === 'adulto'){
      window.location.href='/presupuesto'
    }
    if (this.state.etapa === 'segundo-voto' && this.state.edad === 'adulto'){
      this.setState({etapa: 'confirmacion'})
    }
    if (this.state.etapa ==='primer-voto' && this.state.edad === 'joven') {
      this.setState({etapa: 'confirmacion'})
    }
  }

  render() {
    return (
      <div className='modal-wrapper'>
        <div className='overlay'></div>
          {/*Div Primer Voto Adulto*/
            this.state.edad === 'adulto' && this.state.etapa === 'primer-voto' &&
            <FirstVote
              topic = {this.props.topic}
              saveTopic = {this.saveTopic}
              toggleVotesModal = {this.props.toggleVotesModal} />
          }
          {/*Div Segundo Voto Adulto*/
             this.state.edad === 'adulto' && this.state.etapa === 'segundo-voto' &&
            <SecondVote
              /*savedTopic = {JSON.parse(localStorage.getItem(0))}*/
              topic = {this.props.topic}
              saveTopic = {this.saveTopic}
              toggleVotesModal = {this.props.toggleVotesModal} />
          }
          {/*Div Voto Unico Joven*/
            this.state.edad === 'joven' && this.state.etapa === 'primer-voto' &&
            <VoteJoven 
              topic = {this.props.topic}
              saveTopic = {this.saveTopic}
              toggleVotesModal = {this.props.toggleVotesModal}
            />
          }
          {/* Div Confirmación */
            this.state.etapa === 'confirmacion' &&
            <Confirmacion 
              edad={this.state.edad}
              toggleVotesModal = {this.props.toggleVotesModal} />
          }
      </div>
    )
  }
}