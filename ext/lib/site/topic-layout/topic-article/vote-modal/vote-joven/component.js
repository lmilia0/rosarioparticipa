import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({topic, saveTopic, toggleVotesModal}) => (
	<div className='form-component-wrapper'>
        <h3>Confirmá tu voto!</h3>
        <p>Hacé click en el botón de abajo para confirmar tu voto de Presupuesto Participativo Joven</p>
        <TopicCard topic={topic} />
        <button onClick={saveTopic} className='btn btn-active btn-pending'>Votar este proyecto</button>
        <a onClick={toggleVotesModal}>Cancelar</a>
    </div>
	)