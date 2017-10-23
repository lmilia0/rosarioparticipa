import React, { Component } from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({topic, saveTopic, savedTopic, toggleVotesModal}) => (
	<div className='form-component-wrapper'>
        <h3>Paso 2 de 2 </h3>
        <p>Hacé click en el botón más abajo para confirmar tus dos votos para Presupuesto Participativo.</p>
        <TopicCard topic={savedTopic} />
        <TopicCard topic={topic} />
        <button onClick={saveTopic} className='btn btn-active btn-pending'>Confirmar mi voto</button>
        <a onClick={toggleVotesModal}>Cancelar</a>
    </div>
	)