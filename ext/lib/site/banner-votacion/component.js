import React, { Component } from 'react'


export default class BannerVotacion extends Component {

  constructor (props) {
    super(props)
    this.state={
      visibility: true
    }
  }

  componentWillMount() {
    // localStorage.removeItem('bannerRendered')
    this.checkFirstTime()
    this.checkDate()
  }

  componentDidMount() {
    this.state.visibility && localStorage.setItem('bannerRendered', true)
  }

  checkFirstTime = () => {
    var alreadyRendered = localStorage.getItem('bannerRendered')
    alreadyRendered && this.setState({visibility: false}, () => {console.log('visibility: ', this.state.visibility)})
  }

  checkDate = () => {
    var today = new Date()
    var endDate = new Date(this.props.cierre)
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
    return (
      this.state.visibility && (
        <div className='container-banner'>
          <button className='closes' onClick={this.closeBanner}>x</button>
          <h3>
            ¡Ya está abierta la votación para el Presupuesto Participativo de este año!
          </h3>
          <h3>
            Tenés tiempo hasta el {cierre}
          </h3>
        </div>
      )
    )
  }
}
