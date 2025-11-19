import React from 'react'
import { Outlet } from 'react-router-dom'

function ProjectLayout() {
  return (
    <Outlet />
  )
}

// Default-Export (wichtig f�r: import ProjectLayout from '...'):
export default ProjectLayout
// Optional zus�tzlich als Named-Export:
export { ProjectLayout }
