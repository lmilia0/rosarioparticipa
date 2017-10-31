import React from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({ topic, saveTopic, toggleVotesModal }) => {
  // El primer voto siempre tiene que ser de distrito?
  return (
    <div className='modal-vote-dialog modal-joven-dialog'>
      <a className='close-modal' onClick={toggleVotesModal}>X</a>
      <div className='form-component-wrapper'>
        <h3>Paso 1 de 2 </h3>
        {
          topic.attrs.area === '0'
            ? <p>Una vez confirmado el voto de distrito, debés votar por un proyecto de Área Barrial del mismo.</p>
            : <p>Una vez confirmado el voto del barrio, debés votar por un proyecto del Distrito del mismo.</p>
        }
        <div className='proyectos-container'>
          <TopicCard topic={topic} isBlocked />
        </div>
        <button onClick={saveTopic} className='btn btn-active btn-pending'>Votar este proyecto</button>
        <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
      </div>
    </div>
  )
}
