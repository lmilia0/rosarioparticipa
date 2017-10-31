import React from 'react'
import Header from 'lib/header/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import BannerVotacion from '../banner-votacion/component'


const Layout = ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
    <BannerVotacion />
  </div>
)

export default Layout
