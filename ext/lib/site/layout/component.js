import React from 'react'
import Header from 'lib/header/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import BannerVotacion from '../banner-votacion/component'

let cierreVotacion = null
let stageVotacion = null

//llamada a Forum Presupuesto
forumStore.findOneByName('presupuesto')
.then((forum) => {
  let stageVotacion = forum.extra.stage
  let cierreVotacion = forum.extra.cierre
})
.catch((err) => {
  console.log(err)
})

console.log('hola mundo')
console.log(stageVotacion)

const Layout = ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
    {stageVotacion === 'votacion-abierta' &&
      <BannerVotacion
        cierre={cierreVotacion} />
    }
  </div>
)

export default Layout
