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

// Default-Export (wichtig f�r: import ProjectLayout from '...'):
export default ProjectLayout
// Optional zus�tzlich als Named-Export:
export { ProjectLayout }
