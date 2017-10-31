import React from 'react'
import TopicCard from 'ext/lib/site/home-presupuesto/topic-card/component'

export default ({ saveTopic, sendTopics, toggleVotesModal, proyectos }) => {
  const paso = proyectos.length
  let mensaje
  switch (paso) {
    case 1:
      mensaje = 'Luego de confirmar tu voto por este proyecto, deberás elegir dos más.'
      break
    case 2:
      mensaje = 'Luego de confirmar tu voto por este proyecto, deberás elegir uno más.'
      break
    case 3:
      mensaje = 'Hacé click en el botón de abajo para confirmar tu voto de Presupuesto Participativo Joven'
      break
  }
  return (
    <div className='modal-vote-dialog'>
      <a className='close-modal' onClick={toggleVotesModal}>X</a>
      <div className='form-component-wrapper'>
        <h3>Paso { paso } de 3 </h3>
        <p>{ mensaje }</p>
        <div className='proyectos-container'>
          {proyectos.map((p, i) => <TopicCard key={i} topic={p} isBlocked />)}
        </div>
        { paso === 3 && <button onClick={sendTopics(proyectos)} className='btn btn-active btn-pending'>Confirmar mi voto</button> }
        { paso < 3 && <button onClick={saveTopic} className='btn btn-active btn-pending'>Votar este proyecto</button> }
        <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
      </div>
    </div>
  )
}
