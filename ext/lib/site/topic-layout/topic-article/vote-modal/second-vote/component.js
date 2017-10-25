import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({topic, saveTopic, toggleVotesModal}) => (
	<div className='modal-second-vote-dialog'>
        <a className='close-modal' onClick={toggleVotesModal}>X</a>
		<div className='form-component-wrapper'>
        	<h3>Paso 2 de 2 </h3>
        	<p>Hacé click en el botón más abajo para confirmar tus dos votos para Presupuesto Participativo.</p>
        	<div className='cards-container'>
        		<TopicCard topic={topic} />
        	</div>
        	<button onClick={saveTopic} className='btn btn-active btn-pending'>Confirmar mi voto</button>
        	<a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
    	</div>
    </div>
)