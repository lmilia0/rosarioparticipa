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
      this.setState({etapa: 'segundo-voto'})
    }
  }
  //Save Topic Adulto in Session Storage
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
    } else if 
      //Votacion joven guarda topic
      (this.state.etapa === 'primer-voto' && sessionStorage.topics === undefined) {
      const topic = JSON.stringify([this.props.topic])
      sessionStorage.setItem('topics', topic)
    }

    let topicsNumbers = this.gettingTopicsNumbers()
    
    window.fetch('ext/lib/api/votacion', {
      credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ topicsNumbers })
      })
      .then((res) => res.json())
      .then((res) => console.log(res))
}



  //Getting string of project numbers
  gettingTopicsNumbers = () => {
    let gettingTopics = JSON.parse(sessionStorage.getItem('topics'))
    let topicsNumbers = (gettingTopics.map((t)=>{return (t.attrs.number)})).join(',')
    return topicsNumbers
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
              saveTopic = {this.sendTopics}
              toggleVotesModal = {this.props.toggleVotesModal} />
          }
          {/*Div Voto Unico Joven*/
            this.state.edad === 'joven' && this.state.etapa === 'primer-voto' &&
            <VoteJoven 
              topic = {this.props.topic}
              saveTopic = {this.sendTopics}
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