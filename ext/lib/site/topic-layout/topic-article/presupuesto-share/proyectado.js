import React from 'react'
import { prettyPrice, twitText } from './utils.js'

export default ({ topic, forum }) => {
  const topicUrl = `${window.location.origin}${topic.url}`
  const stateTitle = forum.topicsAttrs.find((ta) => ta.name === 'state').title
  const anioTitle = forum.topicsAttrs.find((ta) => ta.name === 'anio').title
  let state
  if (topic.attrs && topic.attrs.state) {
    state = forum.topicsAttrs
      .find((attr) => attr.name === 'state')
      .options
      .find((attr) => attr.name === topic.attrs.state)
      .title
  }

  return (
    <aside className='presupuesto-share ganador'>
      {topic.attrs && (
        <div className='box-header'>
          <span> {`${stateTitle}: ${state}`}</span>
        </div>
      )}
      <div className='box-content'>
        {
          topic.attrs && (
            <div className='box-content-item'>
              {topic.attrs.anio && <span className='anio-proyecto'>{`${anioTitle}: ${topic.attrs.anio}`}</span> }
              {topic.attrs.budget && <span className='presu-proyecto'>{`Presupuesto: ${prettyPrice(topic.attrs.budget)}`}</span>}
            </div>
          )
        }
        <div className='box-content-item'>
          <span className='box-content-title'>Cantidad de votos:</span>
          <span className='box-content-info'>{topic.attrs.votes}</span>
        </div>
      </div>
      <div className='box-footer'>
        <span className='hashtag'>#YoVotoPorMiBarrio</span>
        <a target='_blank' href={`http://www.facebook.com/sharer.php?u=${topicUrl}`} rel='noopener noreferrer' className='fb'></a>
        <a target='_blank' href={`http://twitter.com/share?text=${twitText()}&url=${topicUrl}`} rel='noopener noreferrer' className='tw'></a>
      </div>
    </aside>
  )
}