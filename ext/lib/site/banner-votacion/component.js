import React, { Component } from 'react'


export default class BannerVotacion extends Component {

  constructor (props) {
    super(props)
    this.state={
      visibility: false,
      firstTime: true
    }
    this.limit = window.innerHeight
    this.didScroll = false
  }

  componentDidMount (){
    window.addEventListener('scroll', this.checkScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.checkScroll)
  }

  checkScroll = () => {
    if (document.body.scrollTop > this.limit) this.didScroll = true
    if (document.body.scrollTop < this.limit && this.didScroll && this.state.firstTime){
      this.setState({
        visibility: true,
        firstTime: false
      })
    }
  }

  closeBanner = (event) => {
    this.setState({visibility: false})
  }

  render() {
    return (
      this.state.visibility && (
        <div className='container-banner'>
          <button className='closes' onClick={this.closeBanner}>x</button>
          <h3>
            ¡Ya está abierta la votación para el Presupuesto Participativo de este año!
            Tenés tiempo hasta el XXX
          </h3>
        </div>
      )
    )
  }
}
