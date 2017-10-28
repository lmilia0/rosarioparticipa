import React, { Component } from 'react'
import bus from 'bus'
import { SharerFacebook } from 'ext/lib/site/sharer'
import { prettyNumber, prettyPrice, twitText } from './utils.js'

export default class Pendiente extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: JSON.parse(localStorage.getItem('ppStatus')) || {}
    }
  }

  componentWillMount () {
    bus.on('pp-status', this.statusChange)
  }

  componentWillUnmount () {
    bus.off('pp-status', this.statusChange)
  }

  statusChange = (status) => {
    this.setState({ status })
  }

  render () {
    const { topic, user, toggleVotesModal } = this.props
    const ppStatus = this.state.status
    const canVote = ppStatus.puede_votar
    const padron = ppStatus.padron
    const message = ppStatus.msj
    const profileIsComplete = user.profileIsComplete()
    const messagePadron = topic.attrs.edad === 'joven' ? 'No estás habilitado a votar en Presupuesto Participativo Joven.' : 'Sólo estás habilitado a votar en Presupuesto Participativo Joven'

    return (
      <aside className='presupuesto-share pendiente'>
        {
          (topic.attrs && topic.attrs.budget) &&
            <div className='sharer-pending'>
              <div className='pending-header'>
                <span className='presupuesto'>Presupuesto:</span>
                {topic.attrs.number && <span className='numero-proyecto'>{`${prettyNumber(topic.attrs.number)}`}</span>}
              </div>
              <div className='pending-body'>
                { topic.attrs.budget && <span className='presu-proyecto'>{prettyPrice(topic.attrs.budget)}</span>}
                { // User is not logged in
                  !user.state.value &&
                    <a href='/signin' className='btn btn-active btn-pending'>Votar este proyecto</a>
                }
                { // User logged in & can't vote === true
                  (user.state.value && profileIsComplete && !canVote && !message) &&
                    <p className='no-vote-msj'>No estás habilitado para votar.</p>
                }
                { // User logged in & can't vote === true
                  (user.state.value && profileIsComplete && !canVote && message) &&
                    <p
                      className='no-vote-msj'
                      dangerouslySetInnerHTML={{ __html: message }} />
                }
                { // User logged in, profile complete, not Voted and wrong padron
                  (user.state.value && profileIsComplete && canVote && topic.attrs.edad !== padron) &&
                    <p className='no-vote-msj'>{messagePadron}</p>
                }
                { // User is logged in & Profile is not complete
                  (user.state.value && !profileIsComplete) &&
                    <button
                      onClick={() => { location.hash = '#completar-datos' }}
                      className='btn btn-active btn-pending'>
                      Votar este proyecto
                    </button>
                }
                { // User logged in, profile complete, not Voted and right padron
                  (user.state.value && profileIsComplete && canVote && topic.attrs.edad === padron) &&
                    <button onClick={toggleVotesModal} className='btn btn-active btn-pending'>Votar este proyecto</button>
                }
              </div>
            </div>
        }
        <div className='social-links'>
          <span className='hashtag'>#YoVotoPorMiBarrio</span>
          <SharerFacebook
            className='fb'
            params={{
              picture: topic.coverUrl,
              link: window.location.href
            }} />
          <a target='_blank' href={`http://twitter.com/share?text=${twitText()}&url=${window.location.origin}${topic.url}`} rel='noopener noreferrer' className='tw'></a>
        </div>
      </aside>
    )
  }
}