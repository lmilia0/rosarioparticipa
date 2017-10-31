import React from 'react'
import Header from 'lib/header/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import BannerVotacion from '../banner-votacion/component'

let cierreVotacion = null
let stageVotacion = null

//llamada a Forum Presupuesto
forumStore.findOneByName('presupuesto')
.then((forum) => {
  const stageVotacion = forum.extra.stage
  const cierreVotacion = forum.extra.cierre
  console.log(stageVotacion)
})
.catch((err) => {
  console.log(err)
})

const Layout = ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
    {console.log(stageVotacion, cierreVotacion)}
    {stageVotacion === 'votacion-abierta' && console.log('renderearia') &&
      <BannerVotacion
        cierre={cierreVotacion} />
    }
  </div>
)

export default Layout
