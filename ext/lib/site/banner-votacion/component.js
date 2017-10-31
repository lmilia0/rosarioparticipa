import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'


export default class BannerVotacion extends Component {

  constructor (props) {
    super(props)
    this.state={
      visibility: true,
      stageVotacion: null,
      cierreVotacion: null
    }
  }

  componentWillMount() {
    forumStore.findOneByName('presupuesto')
    .then((forum) => {
      this.setState({
        stageVotacion: forum.extra.stage,
        cierreVotacion: forum.extra.cierre
      })
    })
    .catch((err) => {
      console.log(err)
    })

    localStorage.removeItem('bannerRendered')
    this.checkFirstTime()
    this.checkDate()
  }

  componentDidMount() {
    this.state.visibility && localStorage.setItem('bannerRendered', true)
  }

  // se fija si es la primera vez que entraste
  checkFirstTime = () => {
    var alreadyRendered = localStorage.getItem('bannerRendered')
    alreadyRendered && this.setState({visibility: false}, () => {console.log('visibility: ', this.state.visibility)})
  }

  // se fija la fecha
  checkDate = () => {
    var today = new Date()
    var endDate = new Date(this.state.cierreVotacion)
    if (Date.parse(endDate) - Date.parse(today) < 0) {
      localStorage.removeItem('bannerRendered')
      this.setState({
        visibility: false
      })
    }
  }

  closeBanner = (event) => {
    this.setState({visibility: false})
  }

  render() {
    let cierre = new Date(this.props.cierre).toLocaleDateString()
    if (this.state.stageVotacion === 'votacion-abierta') {
      return (
        this.state.visibility && (
          <div className='container-banner'>
            <button className='closes' onClick={this.closeBanner}>x</button>
            <h3>
              ¡Ya está abierta la votación para el Presupuesto Participativo de este año!
            </h3>
            <h3>
              Tenés tiempo hasta el {this.state.cierreVotacion.toString()}
            </h3>
          </div>
        )
      )} else {return null}
    }
  }
