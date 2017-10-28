import React from 'react'
import user from 'lib/site/user/user'
import Pendiente from './pendiente'
import Proyectado from './proyectado'

export default ({ topic, forum, user, toggleVotesModal }) => (
  <div className='presupuesto-container'>
    {topic.attrs.state === 'pendiente' &&
      <Pendiente
        topic={topic}
        user={user}
        toggleVotesModal={toggleVotesModal} /> }
    {['proyectado', 'ejecutandose', 'finalizado'].includes(topic.attrs.state) &&
      <Proyectado
        forum={forum}
        topic={topic} /> }
  </div>
)
