import React from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'

export default function App() {
  return (
    <div className="app-root">
      <SiteHeader />
      <Outlet />
    </div>
  )
}
