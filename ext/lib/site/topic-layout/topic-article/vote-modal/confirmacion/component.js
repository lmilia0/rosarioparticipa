import React, { Component } from 'react'

export default ({edad}) => (
	<div className='form-component-wrapper'>
		<div className='vote-img' />
        <h3>{edad === 'adulto' ? 'Tus votos fueron enviados!' : 'Tu voto fue enviado!'}</h3>
        <p>Gracias por participar</p>
        <a href='/presupuesto'>Volver a los proyectos</a>
    </div>
)