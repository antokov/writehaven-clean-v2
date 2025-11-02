import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../styles/bookexport.css";

// ---------- Helpers ----------
const escapeHtml = (s = "") =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// locale-aware smart quotes: "..." -> „…“ (de) / “…” (en et al.)
function smartQuotes(text = "", locale = "en") {
  const isDe = locale.toLowerCase().startsWith("de");
  const OPEN = isDe ? "„" : "“";
  const CLOSE = isDe ? "“" : "”";
  let open = true;
  return text.replace(/"/g, () => (open = !open) ? CLOSE : OPEN);
}

// paragraphs to HTML <p>, first paragraph optional drop cap
function paragraphsHTML(text, firstIsDropcap = false, locale = "en") {
  const parts = (text || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return parts
    .map((p, i) => {
      const cls = firstIsDropcap && i === 0 ? ' class="dropcap"' : "";
      const withQuotes = smartQuotes(p, locale).replace(/\n+/g, " ");
      return `<p${cls}>${escapeHtml(withQuotes)}</p>`;
    })
    .join("\n");
}

const escReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Build chapter heading - only show title (or fallback to "Chapter X")
function buildChapterHeading(no, rawTitle = "", t, locale) {
  const title = (rawTitle || "").trim();

  // If there's a title, just return it (with smart quotes)
  if (title) {
    return escapeHtml(smartQuotes(title, locale));
  }

  // Fallback: if no title, show "Chapter X"
  const chapterWord = t("export.chapter", "Chapter");
  return `${chapterWord} ${no}`;
}

export default function BookExport() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const docLang = (locale.split("-")[0] || "en").toLowerCase();

  const { id } = useParams();
  const pid = Number(id);
  const iframeRef = useRef(null);

  const [project, setProject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewZoom, setPreviewZoom] = useState(1);

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
        console.error("Load error:", e);
        setLoading(false);
      }
    }

    if (pid) loadBookData();
  }, [pid]);

  // Generate complete HTML document for iframe with Paged.js
  const srcDoc = useMemo(() => {
    if (!project || chapters.length === 0) {
      return '<!doctype html><html><head><meta charset="utf-8"></head><body>Loading…</body></html>';
    }

    let chNo = 0;
    const chaptersHTML = chapters
      .map((ch) => {
        chNo += 1;
        const scenes = ch.scenes || [];
        const scenesHTML = scenes
          .map((sc, idx) => paragraphsHTML(sc.content || "", idx === 0, locale))
          .join("\n");

        return `
          <section class="chapter-section" data-chapter-index="${chNo - 1}">
            <h1 class="chapter-title">${buildChapterHeading(chNo, ch.title || "", t, locale)}</h1>
            ${scenesHTML}
          </section>
        `;
      })
      .join("\n");

    const bookTitle = escapeHtml(
      smartQuotes(project?.title || t("export.bookDefaultTitle", "Book"), locale)
    );

    return `<!doctype html>
<html lang="${docLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;700&family=Crimson+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{--book-font:"EB Garamond","Georgia",serif;--font-size:11pt;--lh:1.42;--zoom:1}
  html,body{margin:0;padding:0;background:#fff;overflow-x:hidden}
  .book{font-family:var(--book-font);font-size:var(--font-size);line-height:var(--lh);color:#111}

  /* 6×9" paperback with comfortable margins */
  @page{size:152.4mm 228.6mm;margin:20mm 18mm 24mm 18mm}
  @page{
    @top-center{content: string(running-chapter); font-family: var(--book-font); font-size:10pt; color:#444}
    @bottom-center{content: counter(page); font-family: var(--book-font); font-size:10pt; color:#444}
  }

  /* Typography */
  h1.chapter-title{
    break-before: page;
    font-weight:600;font-size:18pt;text-align:center;margin:0 0 10mm;
    string-set: running-chapter content(text);
  }
  .book p{text-align:justify;margin:0 0 3.2mm;text-indent:1.2em;widows:2;orphans:2}
  .book h1 + p{ text-indent:0 }
  .dropcap:first-letter{ float:left;font-size:3.2em;line-height:0.8;padding-right:.1em }

  /* Screen preview page styling */
  body {
    background: #f5f5f5;
    padding: 20px 0;
  }
  .pagedjs_pages{
    transform: scale(var(--zoom));
    transform-origin: top center;
    padding: 20px 0;
  }
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
  // Auto-run Paged.js
  window.PagedConfig = { auto: true };

  // Fit to available width after render
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
        ${bookTitle}
      </h1>
      <div style="font-family:'Crimson Pro',Georgia,serif;font-size:12pt;color:#555">${escapeHtml(t("export.subtitle", "Novel"))}</div>
    </section>
    ${chaptersHTML}
  </div>
</body>
</html>`;
  }, [project, chapters, t, locale, docLang]);

  const handleExportHTML = () => {
    const blob = new Blob([srcDoc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileBase =
      (project?.title || t("export.bookDefaultFilename", "book"))
        .toString()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "") || "book";
    a.href = url;
    a.download = `${fileBase}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printIframe = () => {
    const w = iframeRef.current?.contentWindow;
    if (w) w.print();
  };

  const savePDF = async () => {
    try {
      // Generate filename
      const fileBase =
        (project?.title || t("export.bookDefaultFilename", "book"))
          .toString()
          .replace(/[^a-z0-9]+/gi, "_")
          .replace(/^_+|_+$/g, "") || "book";

      // Send HTML to backend for PDF generation
      const response = await axios.post(
        `/api/projects/${pid}/export-pdf`,
        { html: srcDoc },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileBase}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t("export.pdfError", "Error generating PDF. Please try again."));
    }
  };

  const scrollToChapter = (chapterIndex) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const checkAndScroll = () => {
        const sections = iframeDoc.querySelectorAll("section.chapter-section");
        if (sections.length === 0) {
          setTimeout(checkAndScroll, 100);
          return;
        }
        const targetSection = iframeDoc.querySelector(
          `section[data-chapter-index="${chapterIndex}"]`
        );
        if (targetSection) {
          const page = targetSection.closest(".pagedjs_page");
          (page || targetSection).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      checkAndScroll();
    } catch (e) {
      console.error("Scroll error:", e);
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <main className="main">
          <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
            <p>{t("export.loading", "Loading book data...")}</p>
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
            <p>{t("export.noData", "No book data found.")}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="book-reader">
      {/* Left sidebar — chapter list */}
      <aside className="book-sidebar">
        <div className="book-sidebar-header">
          <h2>{project.title}</h2>
          <p className="book-meta">
            {t('export.chaptersCount', { count: chapters.length })}
          </p>

        </div>

        <div className="chapters-nav">
          <h3>{t("export.chapters", "Chapters")}</h3>
          <ul className="chapters-list">
            {chapters.map((ch, idx) => (
              <li key={ch.id} className="chapter-item">
                <button className="chapter-link" onClick={() => scrollToChapter(idx)}>
                  <span className="chapter-number">{idx + 1}</span>
                  <span className="chapter-title-text">
                    {ch.title || `${t("export.chapter", "Chapter")} ${idx + 1}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Zoom Controls in Sidebar */}
        <div className="zoom-controls-sidebar">
          <h3>{t("export.previewZoom", "Vorschau-Zoom")}</h3>
          <div className="zoom-controls-flex">
            <button
              onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.1))}
              title={t("export.zoomOut", "Zoom Out")}
              className="zoom-btn-sidebar"
            >
              −
            </button>
            <span className="zoom-level-sidebar">{Math.round(previewZoom * 100)}%</span>
            <button
              onClick={() => setPreviewZoom(Math.min(2, previewZoom + 0.1))}
              title={t("export.zoomIn", "Zoom In")}
              className="zoom-btn-sidebar"
            >
              +
            </button>
            <button
              onClick={() => setPreviewZoom(1)}
              title={t("export.resetZoom", "Reset Zoom")}
              className="zoom-btn-sidebar"
            >
              ⟲
            </button>
          </div>
        </div>

        <div className="export-actions">
          <button className="btn btn-export" onClick={savePDF}>
            💾 {t("export.savePdf", "Save as PDF")}
          </button>
          <button className="btn btn-export" onClick={handleExportHTML} style={{ marginTop: "0.75rem" }}>
            📥 {t("export.downloadHtml", "Download HTML")}
          </button>
        </div>
      </aside>

      {/* Main — Paged.js preview */}
      <main className="book-main">

        <div className="preview-stage">
          <iframe
            ref={iframeRef}
            title="Book Preview"
            className="preview-frame"
            srcDoc={srcDoc}
            style={{
              transform: `scale(${previewZoom})`,
              transformOrigin: 'top left',
              width: `${100 / previewZoom}%`,
              height: `${100 / previewZoom}%`
            }}
          />
        </div>
      </main>
    </div>
  );
}
