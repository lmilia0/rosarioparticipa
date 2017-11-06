import React, { Component } from 'react'

export default ({toggleVotesModal}) => (
	<div className='modal-vote-dialog modal-joven-dialog'>
        <a className='close-modal' onClick={toggleVotesModal}>X</a>
		<div className='form-component-wrapper'>
            <h3 className='error-title'>Lo sentimos, hubo un error. </h3>
            <p>Tu voto no pudo ser procesado. Por favor, intentalo nuevamente. </p>
            <a className='cancel' onClick={toggleVotesModal}>Cancelar</a>
        </div>
    </div>
)