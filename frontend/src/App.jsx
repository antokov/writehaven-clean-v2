import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div>
      <header className="appbar">
        <Link to="/" className="brand">Writehaven</Link>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
