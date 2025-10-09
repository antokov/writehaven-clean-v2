import React from 'react'
import { NavLink, useParams } from 'react-router-dom'

export default function TopNav(){
  const { id } = useParams()
  if (!id) return null            // nur auf Projektseiten anzeigen
  const base = `/project/${id}`
  return (
    <div className="tabs">
      <NavLink end to={base} className="tab">Schreiben</NavLink>
      <NavLink to={`${base}/characters`} className="tab">Charaktere</NavLink>
      <NavLink to={`${base}/world`} className="tab">Welt</NavLink>
      <NavLink to={`${base}/preview`} className="tab">Vorschau</NavLink>
    </div>
  )
}
