import React from 'react'

export default function Characters(){
  // Du kannst hier später deine Character-Logik/Listen einbauen
  return (
    <div className="page-wrap">
      <aside className="side">
        <div className="side-group">
          <div className="side-head">Charaktere</div>
          <button className="btn small">+ Charakter</button>
          <div className="side-list">
            {/* Charakterliste */}
          </div>
        </div>
      </aside>
      <main className="main">
        <div className="panel">
          <h3>Charakter-Details</h3>
          <p className="empty">Wähle links einen Charakter oder lege einen neuen an.</p>
        </div>
      </main>
    </div>
  )
}
