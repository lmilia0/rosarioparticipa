import React, { Component } from 'react'
import FirstVote from './first-vote/component'
import SecondVote from './second-vote/component'
import VoteJoven from './vote-joven/component'
import Confirmacion from './confirmacion/component'


export default class VoteModal extends Component {
  constructor (props) {
    super (props)

    this.state = {
      edad: 'adulto',
      etapa: 'primer-voto'
    } 
  }

  componentWillMount () {
    if (localStorage.length > 0 && this.state.edad === 'adulto') {
      this.setState({etapa: 'segundo-voto'})
    }
  }

  saveTopic = () => {
    let topic = JSON.stringify(this.props.topic)
    if (localStorage.length === 0) {
      localStorage.setItem('0', topic)
    } else if (localStorage.length === 1) {
      localStorage.setItem('1', topic)
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
              savedTopic = {JSON.parse(localStorage.getItem(0))}
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