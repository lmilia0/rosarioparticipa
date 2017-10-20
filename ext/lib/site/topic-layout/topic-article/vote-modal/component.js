import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'


export default class VoteModal extends Component {
  constructor (props) {
    super (props)

    this.state = {
      edad: 'adulto',
      etapa: 'primer-voto'
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
  }

  render() {
    return (
      <div className='modal-wrapper'>
        <div className='overlay'></div>
        {/*Div Primer Voto*/
        this.state.edad === 'adulto' && this.state.etapa === 'primer-voto' &&
          <div className='modal-dialog'>
            <a className='close-modal' onClick={this.props.toggleVotesModal}>X</a>
            <div className='form-component-wrapper'>
              <h3>Paso 1 de 2 </h3>
              <p>Una vez confirmado el voto de distrito, debés votar por un proyecto de Área Barrial del mismo. </p>
              <TopicCard topic={this.props.topic} />
              <button onClick={this.saveTopic} className='btn btn-active btn-pending'>Votar este proyecto</button>
              <a onClick={this.props.toggleVotesModal}>Cancelar</a>
            </div>  
          </div>
        }
      </div>
    )
  }
}