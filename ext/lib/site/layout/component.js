import React from 'react'
import Header from 'lib/header/component'
import BannerVotacion from '../banner-votacion/component'
import PpStatus from './pp-status'

const Layout = ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
    <BannerVotacion />
  </div>
)

export default PpStatus(Layout)
