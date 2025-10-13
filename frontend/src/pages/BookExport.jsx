import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../bookexport.css";

// Helper functions
const escapeHtml = (s = '') =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const replaceQuotes = (text) => {
  return text.replace(/"([^"]*)"/g, '„$1"');
};

function paragraphsHTML(text, firstIsDropcap = false) {
  const parts = (text || '')
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
  return parts
    .map((p, i) => {
      const cls = firstIsDropcap && i === 0 ? ' class="dropcap"' : '';
      return `<p${cls}>${escapeHtml(replaceQuotes(p)).replace(/\n+/g, ' ')}</p>`;
    })
    .join('\n');
}

const chapterHeading = (no, title = '') => {
  const t = (title || '').trim();
  return /^kapitel\b/i.test(t) ? t : `Kapitel ${no}${t ? ' — ' + escapeHtml(replaceQuotes(t)) : ''}`;
};

export default function BookExport() {
  const { id } = useParams();
  const pid = Number(id);
  const iframeRef = useRef(null);

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookData() {
      try {
        const projectRes = await axios.get(`/api/projects/${pid}`);
        const proj = projectRes.data;
        setProject(proj);

        const chaptersRes = await axios.get(`/api/projects/${pid}/chapters`);
        const chaps = chaptersRes.data || [];

        const chaptersWithScenes = await Promise.all(
          chaps.map(async (ch) => {
            const scenesRes = await axios.get(`/api/chapters/${ch.id}/scenes`);
            const scenes = scenesRes.data || [];

            const scenesWithContent = await Promise.all(
              scenes.map(async (sc) => {
                const sceneRes = await axios.get(`/api/scenes/${sc.id}`);
                return sceneRes.data;
              })
            );

            return { ...ch, scenes: scenesWithContent };
          })
        );

        setChapters(chaptersWithScenes);
        setLoading(false);
      } catch (e) {
        console.error("Fehler beim Laden:", e);
        setLoading(false);
      }
    }

    if (pid) loadBookData();
  }, [pid]);

  // Generate complete HTML document for iframe with Paged.js
  const srcDoc = useMemo(() => {
    if (!project || chapters.length === 0) {
      return '<!doctype html><html><head><meta charset="utf-8"></head><body>Lade Buchdaten...</body></html>';
    }

    let chNo = 0;
    const chaptersHTML = chapters
      .map(ch => {
        chNo += 1;
        const scenes = ch.scenes || [];
        const scenesHTML = scenes
          .map((sc, idx) => paragraphsHTML(sc.content || '', idx === 0))
          .join('\n');
        return `
          <section class="chapter-section" data-chapter-index="${chNo - 1}">
            <h1 class="chapter-title">${chapterHeading(chNo, ch.title || '')}</h1>
            ${scenesHTML}
          </section>
        `;
      })
      .join('\n');

    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;700&family=Crimson+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{--book-font:"EB Garamond","Georgia",serif;--font-size:11pt;--lh:1.42;--zoom:1}
  html,body{margin:0;padding:0;background:#fff;overflow-x:hidden}
  .book{font-family:var(--book-font);font-size:var(--font-size);line-height:var(--lh);color:#111}

  /* 6×9" Taschenbuch mit angenehmen Rändern */
  @page{size:152.4mm 228.6mm;margin:20mm 18mm 24mm 18mm}
  @page{
    @top-center{content: string(running-chapter); font-family: var(--book-font); font-size:10pt; color:#444}
    @bottom-center{content: counter(page); font-family: var(--book-font); font-size:10pt; color:#444}
  }

  /* Typografie */
  h1.chapter-title{
    break-before: page;
    font-weight:600;font-size:18pt;text-align:center;margin:0 0 10mm;
    string-set: running-chapter content(text);
  }
  .book p{text-align:justify;margin:0 0 3.2mm;text-indent:1.2em;widows:2;orphans:2}
  .book h1 + p{ text-indent:0 }
  .dropcap:first-letter{ float:left;font-size:3.2em;line-height:0.8;padding-right:.1em }

  /* Seiten in der Bildschirmvorschau – automatisch an Breite anpassen */
  body {
    background: #f5f5f5;
    padding: 20px 0;
  }
  .pagedjs_pages{
    transform: scale(var(--zoom));
    transform-origin: top center;
    padding: 20px 0;
  }
  /* Abstände bei Zoom anpassen, damit es hübsch bleibt */
  .pagedjs_page{
    box-shadow:0 4px 20px rgba(0,0,0,.15);
    margin: 24px auto;
    border-radius:4px;
    background: white;
  }
  .pagedjs_area { background: white !important; }
  .pagedjs_pages { background: transparent !important; }
</style>

<script>
  // Paged.js automatisch starten
  window.PagedConfig = { auto: true };

  // Nach dem Rendern skalieren wir die Seiten so,
  // dass sie möglichst die verfügbare Breite nutzen (ohne Scrollbalken).
  function fitToWidth(){
    const first = document.querySelector('.pagedjs_page');
    if(!first) return;
    const margin = 80;
    const viewport = window.innerWidth - margin;
    const pageWidth = first.getBoundingClientRect().width;
    if(!pageWidth) return;
    const desired = Math.min(1.4, Math.max(0.6, viewport / pageWidth));
    document.documentElement.style.setProperty('--zoom', desired.toFixed(2));
  }
  window.addEventListener('pagedjs:rendered', () => {
    fitToWidth();
    // Scroll to top after rendering
    window.scrollTo(0, 0);
  });
  window.addEventListener('resize', fitToWidth);
</script>
<script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>
</head>
<body>
  <div class="book">
    <section style="break-before:page;text-align:center;margin-top:35mm">
      <h1 style="font-family:'EB Garamond',Georgia,serif;font-size:28pt;margin:0 0 3mm">
        ${escapeHtml(replaceQuotes(project?.title || 'Buch'))}
      </h1>
      <div style="font-family:'Crimson Pro',Georgia,serif;font-size:12pt;color:#555">Roman</div>
    </section>
    ${chaptersHTML}
  </div>
</body>
</html>`;
  }, [project, chapters]);

  const handleExportHTML = () => {
    const blob = new Blob([srcDoc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printIframe = () => {
    const w = iframeRef.current?.contentWindow;
    if (w) w.print();
  };

  const scrollToChapter = (chapterIndex) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Warte bis Paged.js fertig gerendert hat
      const checkAndScroll = () => {
        const sections = iframeDoc.querySelectorAll('section.chapter-section');

        // Falls Paged.js noch nicht fertig ist, warte kurz
        if (sections.length === 0) {
          setTimeout(checkAndScroll, 100);
          return;
        }

        const targetSection = iframeDoc.querySelector(`section[data-chapter-index="${chapterIndex}"]`);
        if (targetSection) {
          // Finde die Paged.js Seite, die diese Section enthält
          const page = targetSection.closest('.pagedjs_page');
          if (page) {
            page.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Fallback: direkt zur Section scrollen
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };

      checkAndScroll();
    } catch (e) {
      console.error('Fehler beim Scrollen:', e);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <main className="main">
          <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
            <p>Lade Buchdaten...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!project || chapters.length === 0) {
    return (
      <div className="page-wrap">
        <main className="main">
          <div className="panel" style={{ padding: "2rem" }}>
            <p>Keine Buchdaten gefunden.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="book-reader">
      {/* Linke Sidebar - Kapitelübersicht */}
      <aside className="book-sidebar">
        <div className="book-sidebar-header">
          <h2>{project.title}</h2>
          <p className="book-meta">{chapters.length} Kapitel</p>
        </div>

        <div className="chapters-nav">
          <h3>Kapitel</h3>
          <ul className="chapters-list">
            {chapters.map((ch, idx) => (
              <li key={ch.id} className="chapter-item">
                <button
                  className="chapter-link"
                  onClick={() => scrollToChapter(idx)}
                >
                  <span className="chapter-number">{idx + 1}</span>
                  <span className="chapter-title-text">{ch.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="export-actions">
          <button className="btn btn-export" onClick={printIframe}>
            🖨️ Als PDF drucken
          </button>
          <button className="btn btn-export" onClick={handleExportHTML} style={{marginTop: '0.75rem'}}>
            📥 HTML Download
          </button>
        </div>
      </aside>

      {/* Hauptbereich - Buchvorschau mit Paged.js */}
      <main className="book-main">
        <div className="preview-stage">
          <iframe
            ref={iframeRef}
            title="Book Preview"
            className="preview-frame"
            srcDoc={srcDoc}
          />
        </div>
      </main>
    </div>
  );
}
