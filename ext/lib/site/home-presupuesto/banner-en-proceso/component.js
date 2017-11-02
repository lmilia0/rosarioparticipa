import React from 'react'
import { withRouter } from 'react-router'

function cancelarVotacion (goTo) {
  return () => {
    sessionStorage.removeItem('pp-proyectos')
    sessionStorage.removeItem('pp-etapa')
    goTo('/presupuesto')
  }
}

export default withRouter(({ router }) => {
  const proyectos = JSON.parse(sessionStorage.getItem('pp-proyectos')) || []
  const votacionEnProceso = proyectos.length > 0

  return votacionEnProceso && (
    <div className='container-banner-votacion'>
      <p>Votación en proceso</p>
      <button className='btn btn-md' onClick={cancelarVotacion(router.push)}>Cancelar</button>
    </div>
  )
})
