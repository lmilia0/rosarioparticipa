import React from 'react'
import { withRouter } from 'react-router'

function cancelarVotacion (goTo) {
  return () => {
    console.log('cancelar votacion')
    sessionStorage.removeItem('pp-proyectos')
    sessionStorage.removeItem('pp-etapa')
    goTo('/presupuesto')
  }
}

export default withRouter((props) => (
  <div className='container-banner-votacion'>
    <p>Votación en proceso</p>
    <button className='btn btn-md' onClick={cancelarVotacion(props.router.push)}>Cancelar</button>
  </div>
))
