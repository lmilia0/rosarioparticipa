import React from 'react'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default ({ topic, edad, toggleVotesModal }) => (
  <div className='modal-confirmation'>
    <a className='close-modal' onClick={toggleVotesModal}>X</a>
    <div className='confirmation-wrapper'>
      <div className='vote-img' />
      <h3 className='confirmation-title'>¡Tu voto fue enviado!</h3>
      <p>Gracias por participar</p>
      <div className='social-sharing'>
        <SharerFacebook
          className='fb'
          params={{
            picture: topic.coverUrl,
            link: window.location.origin + topic.url
          }} />
        <a target='_blank' href={`http://twitter.com/share?text=${encodeURIComponent(`Mirá el proyecto que quiero para mi barrio #YoVotoPorMiBarrio `)}&url=${window.location.origin}${topic.url}`} rel='noopener noreferrer' className='tw'></a>
      </div>
      <a className='return' href='/presupuesto'>Volver a los proyectos</a>
    </div>
  </div>
)
