import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'

export default class BannerVotacion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visibility: !sessionStorage.getItem('pp-17-banner'),
      stageVotacion: null,
      cierreVotacion: null
    }
  }

  componentWillMount () {
    forumStore.findOneByName('presupuesto')
    .then((forum) => {
      this.setState({
        stageVotacion: forum.extra.stage,
        cierreVotacion: new Date(forum.extra.cierre)
      })
    })
    .catch(() => {
      this.setState({
        visibility: false
      })
    })
  }

  closeBanner = (event) => {
    sessionStorage.setItem('pp-17-banner', true)
    this.setState({ visibility: false })
  }

  render () {
    if (this.state.stageVotacion !== 'votacion-abierta') return null
    const { cierreVotacion } = this.state
    return this.state.visibility && (
      <div className='container-banner'>
        <button className='closes' onClick={this.closeBanner}>x</button>
        <h3>
          ¡Ya está abierta la votación para el Presupuesto Participativo de este año!
        </h3>
        <h3>
          Tenés tiempo hasta el {cierreVotacion && `${cierreVotacion.getDate()}/${(cierreVotacion.getMonth() + 1)}`}
        </h3>
      </div>
    )
  }
}
