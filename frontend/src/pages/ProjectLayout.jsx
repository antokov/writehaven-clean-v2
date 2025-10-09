import React from 'react'
import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav.jsx'

function ProjectLayout() {
  return (
    <>
      <TopNav />
      <Outlet />
    </>
  )
}

// Default-Export (wichtig für: import ProjectLayout from '...'):
export default ProjectLayout
// Optional zusätzlich als Named-Export:
export { ProjectLayout }
