const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
const jsxPath = path.join(root, 'src/Componants/Navbar/Navbar.jsx');
const cssPath = path.join(root, 'src/Componants/Navbar/Navbar.css');
let jsx = fs.readFileSync(jsxPath, 'utf8').replace(/\r\n/g, '\n');
jsx = jsx.replace("  const panelRef = useRef(null);", "  const panelRef = useRef(null);\n  const menuRef = useRef(null);\n  const buttonRef = useRef(null);");
const start = jsx.indexOf('  useEffect(() => {\n    function handleDocClick');
const end = jsx.indexOf('  const t = translations[lang];', start);
if (start < 0 || end < 0) throw new Error('Unexpected navbar source');
jsx = jsx.slice(0, start) + `  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1200px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('button, a')?.focus();

    function closeOutside(event) {
      if (!panelRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    buttonRef.current?.focus();
  }

` + jsx.slice(end);
jsx = jsx.replace('  const t = translations[lang];', '  const t = translations[lang] || translations.en;');
jsx = jsx.replace('            className={`burger', '            type="button"\n            ref={buttonRef}\n            aria-controls="mobile-navigation"\n            className={`burger');
jsx = jsx.replace('<div className={`mobile-panel ${open ? \'open\' : \'\'}`} role="dialog" aria-modal="true" aria-label="Mobile menu">', '<nav id="mobile-navigation" ref={menuRef} className={`mobile-panel ${open ? \'open\' : \'\'}`} inert={!open} aria-label="Mobile navigation">');
jsx = jsx.replace('          </div>\n\n          <div className={`mobile-backdrop', '          </nav>\n\n          <div className={`mobile-backdrop');
jsx = jsx.replace('<li key={idx} onClick={() => setOpen(false)}>', '<li key={item.path}>').replace('<Link to={item.path}>{item.name}</Link>\n                  </li>', '<Link to={item.path} onClick={closeMenu}>{item.name}</Link>\n                  </li>');
jsx = jsx.replaceAll('className="btn btn-login" onClick={() => setOpen(false)}', 'className="btn btn-login" onClick={closeMenu}').replaceAll('className="btn btn-register" onClick={() => setOpen(false)}', 'className="btn btn-register" onClick={closeMenu}');
fs.writeFileSync(jsxPath, jsx);
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');
css = css.replace('  position: absolute;\n  left: 50%;\n  transform: translateX(-50%);', '  min-width: 0;');
css = css.replace('  gap: 75px;', '  gap: clamp(24px, 5vw, 75px);\n  white-space: nowrap;');
css = css.replace(/html\[dir="rtl"\] \.nav-left \{[\s\S]*?html\[dir="rtl"\] \.nav-right \{[\s\S]*?\}\s*/, '');
css = css.replace('  position: relative;\n}\n\n.burger', '  position: static;\n}\n\n.burger');
const panelStart = css.indexOf('.mobile-panel {');
const panelEnd = css.indexOf('.mobile-top {', panelStart);
css = css.slice(0, panelStart) + `.mobile-panel {
  position: absolute;
  top: 100%;
  inset-inline-end: 12px;
  width: min(360px, calc(100% - 24px));
  max-height: calc(100vh - 96px);
  max-height: calc(100dvh - 96px);
  overflow-y: auto;
  box-sizing: border-box;
  background: var(--bg);
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.3);
  border-radius: 8px;
  z-index: 1400;
  transform: translateY(-8px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.22s ease, opacity 0.22s ease, visibility 0.22s;
}
.mobile-panel.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.mobile-panel-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
  min-width: 0;
}
` + css.slice(panelEnd);
css = css.replace('  align-items: center;\n}\n.brand-small', '  align-items: center;\n  flex-wrap: wrap;\n  gap: 12px;\n}\n.mobile-actions {\n  display: flex;\n  gap: 8px;\n}\n.brand-small');
css = css.replace('  width: 100%;\n  text-align: center;', '  box-sizing: border-box;\n  width: 100%;\n  text-align: center;');
css = css.replace('  inset: 0;', '  inset: 80px 0 0;');
css = css.slice(0, css.indexOf('@media (min-width: 881px)')) + `/* Reserve enough space for the longer Arabic actions before showing desktop links. */
@media (min-width: 1200px) {
  .navbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 16px;
  }
  .nav-left { justify-self: start; }
  .nav-right { justify-self: end; }
  .mobile-controls { display: none; }
}
@media (max-width: 1199px) {
  .navbar { padding-inline: 12px; }
  .nav-center,
  .navbar .desktop-only { display: none; }
  .brand-name-logo { white-space: nowrap; }
}
.navbar a:focus-visible,
.navbar button:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-panel, .mobile-backdrop, .burger-bar { transition: none; }
}
`;
fs.writeFileSync(cssPath, css);
