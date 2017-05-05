import React, { Component } from 'react'
import jump from 'jump.js'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import TopicCard from './topic-card/component'
import distritos from './distritos.json'

let distritoCurrent = ''

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      distrito: distritos[0],
      forum: null,
      forumJoven: null,
      topicsAreas: null,
      topicsDistrito: null,
      topicsJoven: null,
      scrollAfterFetch: false
    }
  }

  componentWillMount () {
    if (!window.location.hash && !distritoCurrent) return
    const distritoKey = distritos.map((d) => d.name).indexOf(distritoCurrent)
    if (~distritoKey) {
      window.history.pushState(null, null, `#${distritoCurrent}`)
      this.setState({ distrito: distritos[distritoKey] }, this.fetchForums)
    }
  }

  componentDidMount () {
    this.setState({ loading: true, scrollAfterFetch: false }, this.fetchForums)
  }

  _fetchingForums = false
  fetchForums = () => {
    if (this._fetchingForums) return
    this._fetchingForums = true
    this.setState({ loading: true })

    Promise.all([
      forumStore.findOneByName('presupuesto'),
      forumStore.findOneByName('presupuesto-joven')
    ])
      .then(([forum, forumJoven]) => {
        this._fetchingForums = false
        this.setState({
          forum,
          forumJoven
        }, this.fetchTopics)
      }).catch((err) => {
        this._fetchingForums = false
        console.error(err)
        this.setState({
          loading: false,
          forum: null,
          forumJoven: null
        })
      })
  }

  _fetchingTopics = false
  fetchTopics = () => {
    if (this._fetchingTopics) return
    this._fetchingTopics = true

    this.setState({ loading: true })

    Promise.all([
      topicStore.findAll({ forum: this.state.forum.id }),
      topicStore.findAll({ forum: this.state.forumJoven.id })
    ])
      .then(([topics, topicsJoven]) => {
        this._fetchingTopics = false

        topics = sortTopics(topics)
        topicsJoven = sortTopics(topicsJoven)

        this.setState({
          loading: false,
          topicsAreas: topics.filter((t) => {
            if (!t.attrs) return false
            return t.attrs.district === this.state.distrito.name &&
              t.attrs.area !== '0'
          }),
          topicsDistrito: topics.filter((t) => {
            if (!t.attrs) return false
            return t.attrs.district === this.state.distrito.name &&
              (!t.attrs.area || t.attrs.area === '0')
          }),
          topicsJoven: topicsJoven.filter((t) => {
            if (!t.attrs) return false
            return t.attrs.district === this.state.distrito.name
          })
        }, () => {
          if (this.state.scrollAfterFetch) {
            const header = document.querySelector('.ext-header')
            jump('.topics-section', {
              duration: 750,
              offset: -(header && header.clientHeight ? header.clientHeight : 100)
            })
          }
        })
      })
      .catch((err) => {
        this._fetchingTopics = false
        console.error(err)
        this.setState({
          loading: false,
          topicsAreas: null,
          topicsDistrito: null,
          topicsJoven: null
        })
      })
  }

  handleDistritoFilterChange = (distrito) => {
    distritoCurrent = distrito.name
    window.history.pushState(null, null, `#${distrito.name}`)
    this.setState({ distrito, scrollAfterFetch: true }, this.fetchForums)
  }

  render () {
    // <a href='#' className='find-district-link'>
    //   <i className='icon-location-pin'></i>
    //   <span>¿Cuál es mi distrito?</span>
    // </a>
    return (
      <div className='ext-home-presupuesto'>
        <div className='cover'>
          <div className='container'>
            <h1>Estos son los proyectos<br />que van a cambiar tu barrio</h1>
            <label>Elegí tu distrito</label>
            <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange} />
          </div>
        </div>
        {this.state.topicsAreas && this.state.topicsAreas.length > 0 && (
          <div className='topics-section areas'>
            <h2 className='topics-section-container'>
              Distrito {this.state.distrito.title} | Proyectos para tu barrio
            </h2>
            <div className='topics-container areas'>
              {this.state.loading && <div className='loader' />}
              {this.state.topicsAreas.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} forum={this.state.forum} />
              })}
            </div>
          </div>
        )}
        {this.state.topicsDistrito && this.state.topicsDistrito.length > 0 && (
          <div className='topics-section distrito'>
            <h2 className='topics-section-container'>
              Distrito {this.state.distrito.title} | Proyectos para tu distrito
            </h2>
            <div className='topics-container'>
              {this.state.loading && <div className='loader' />}
              {this.state.topicsDistrito.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} forum={this.state.forum} />
              })}
            </div>
          </div>
        )}
        {this.state.topicsJoven && this.state.topicsJoven.length > 0 && (
          <div className='topics-section pp-joven'>
            <h2 className='topics-section-container'>
              <span>Distrito {this.state.distrito.title} | Proyectos jóvenes</span><br />
              <sub />
            </h2>
            <div className='topics-container'>
              {this.state.loading && <div className='loader' />}
              {this.state.topicsJoven.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} forum={this.state.forumJoven} />
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)

function DistritoFilter (props) {
  const { active, onChange } = props

  return (
    <div className='distrito-filter'>
      {distritos.map((d) => {
        const isActive = d.name === active.name ? ' active' : ''
        return (
          <button
            type='button'
            key={d.name}
            data-name={d.name}
            onClick={onChange.bind(null, d)}
            className={`btn btn-lg btn-outline-primary${isActive}`}>
            {d.title}
          </button>
        )
      })}
    </div>
  )
}

function sortTopics (topics) {
  const winners = []
  const losers = []

  topics.forEach((topic) => {
    if (topic.attrs && topic.attrs.winner) {
      winners.push(topic)
    } else {
      losers.push(topic)
    }
  })

  return sortTopicsByNumber(winners).concat(sortTopicsByNumber(losers))
}

function sortTopicsByNumber (topics) {
  return topics.sort((a, b) => {
    if (!(a.attrs && a.attrs.number)) return -1
    if (!(b.attrs && b.attrs.number)) return 1
    return a.attrs.number > b.attrs.number
      ? 1
      : a.attrs.number < b.attrs.number
      ? -1
      : 0
  })
}