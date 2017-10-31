import React from 'react'
import Header from 'lib/header/component'
import PpStatus from './pp-status'

const Layout = ({ children }) => (
  <div id='outer-layout'>
    <Header />
    {children}
  </div>
)

export default PpStatus(Layout)
