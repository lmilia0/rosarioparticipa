import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'


export default class VoteModal extends Component {
  constructor (props) {
    super (props) 
  }

  render() {
    console.log(this.props)
    return (
      <div className='modal-wrapper'>
        <div className='overlay'></div>
        <div className='modal-dialog'>
          <a className='close-modal' onClick={this.props.toggleVotesModal}>X</a>
          <div className='form-component-wrapper'>
            <h2>Paso 1 de 2 </h2>
            <p>Una vez confirmado el voto de distrito, debés votar por un proyecto de Área Barrial del mismo. </p>
            <TopicCard topic={this.props.topic} />
            <button className='btn btn-active btn-pending'>Votar este proyecto</button>
            <a>Cancelar</a>
          </div>  
        </div>
      </div>
    )
  }
}