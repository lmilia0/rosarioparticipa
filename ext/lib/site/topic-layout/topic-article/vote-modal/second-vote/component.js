import React from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({ topic, proyectos, saveTopic, toggleVotesModal }) => (
  <div className='modal-vote-dialog'>
    <a className='close-modal' onClick={toggleVotesModal}>X</a>
    <div className='form-component-wrapper'>
      <h3>Paso 2 de 2 </h3>
      <p>Hacé click en el botón más abajo para confirmar tus dos votos para Presupuesto Participativo.</p>
      <div className='proyectos-container'>
        {[...proyectos, topic].map((p) => <TopicCard topic={p} />)}
      </div>
      <button onClick={saveTopic} className='btn btn-active btn-pending'>Confirmar mi voto</button>
      <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
    </div>
  </div>
)
