import React from 'react'

export default ({ edad, toggleVotesModal }) => (
  <div className='modal-confirmation'>
    <a className='close-modal' onClick={toggleVotesModal}>X</a>
    <div className='confirmation-wrapper'>
      <div className='vote-img' />
      <h3 className='confirmation-title'>¡Tus votos fueron enviados!</h3>
      <p>Gracias por participar</p>
      <a className='return' href='/presupuesto'>Volver a los proyectos</a>
    </div>
  </div>
)
