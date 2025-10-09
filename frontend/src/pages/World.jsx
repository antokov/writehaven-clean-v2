import React from 'react'

export default function World(){
  // Später: Welt-Elemente (Organisation, Orte, Beziehungen etc.)
  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Welt-Elemente</div>
          <button className="btn small">+ Element</button>
          <div className="side-list">
            {/* Weltliste */}
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="panel">
          <h3>Welt-Details</h3>
          <p className="empty">Wähle links ein Element oder lege ein neues an.</p>
        </div>
      </main>
    </div>
  )
}
