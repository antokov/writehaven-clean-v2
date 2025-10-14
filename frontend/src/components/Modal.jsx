import React from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2147483600
      }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        className="panel"
        style={{
          width: "min(1100px, 92vw)",
          height: "min(80vh, 800px)",
          display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,.25)",
          background: "#fff", borderRadius: 12
        }}
      >
        <div style={{display:"flex", alignItems:"center", padding:"10px 12px", borderBottom:"1px solid #e7ecf2"}}>
          <div style={{fontWeight:600}}>{title}</div>
          <button className="icon-btn" style={{marginLeft:"auto"}} onClick={onClose}>✕</button>
        </div>
        <div style={{flex:1, minHeight:0}}>{children}</div>
      </div>
    </div>
  );
  return createPortal(overlay, document.body);
}

export default Modal;