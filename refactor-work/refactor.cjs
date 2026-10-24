const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'src');
function edit(file, transform) {
  const target = path.join(root, file);
  fs.writeFileSync(target, transform(fs.readFileSync(target, 'utf8')));
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (file.endsWith('.jsx')) {
      let source = fs.readFileSync(file, 'utf8');
      source = source.replace(/import React, \{/g, 'import {').replace(/^import React from 'react'\r?\n/m, '');
      fs.writeFileSync(file, source);
    }
  }
}
walk(root);
edit('App.jsx', s => s.replace("./Componants/Navbar/NavBar", "./Componants/Navbar/Navbar").replace('{ Link, Route, Routes }', '{ Route, Routes }'));
edit('main.jsx', s => s.replace('"../src/App"', '"./App"'));
fs.mkdirSync(path.join(root, 'utils'), { recursive: true });
fs.writeFileSync(path.join(root, 'utils/storage.js'), `// Storage can be unavailable when browser privacy settings block access.
export function readStoredValue(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
`);
for (const file of ['assets/LogIn/Login.jsx', 'assets/Register/Register.jsx', 'Componants/Footer/Footer.jsx']) {
  edit(file, s => {
    s = `import { readStoredValue } from '../../utils/storage';\n` + s;
    s = s.replace(/  const safeGet = \([\s\S]*?\r?\n  };\r?\n/, '');
    return s.replace(/safeGet\(/g, 'readStoredValue(');
  });
}
fs.writeFileSync(path.join(root, 'utils/doctors.js'), `// Callers normalize queries so whitespace-only submit behavior stays unchanged.
export function matchesDoctor(doctor, query) {
  return doctor.name.toLowerCase().includes(query) ||
    doctor.specialty.toLowerCase().includes(query);
}
`);
edit('assets/Reservation/Booking.jsx', s => {
  s = `import { matchesDoctor } from '../../utils/doctors';\n` + s;
  s = s.replace(/d =>\r?\n      d.name.toLowerCase\(\).includes\(q\) \|\|\r?\n      d.specialty.toLowerCase\(\).includes\(q\)\r?\n    /g, 'doctor => matchesDoctor(doctor, q)');
  s = s.replace("      if (!day?.times.includes(formData.time)) setFormData(prev => ({ ...prev, time: '' }));", "      setFormData(prev => day?.times.includes(prev.time) ? prev : { ...prev, time: '' });");
  return s;
});
edit('assets/Services/Services.jsx', s => s.replace('}, []);', '}, [lang, dark]);'));
edit('assets/Team/Team.jsx', s => s.replace(', useRef', '').replace(/  const cardsRef = useRef\(\{\}\); *\r?\n/, '').replace(/            ref=\{el => \{ if \(el\) cardsRef.current\[doc.id\] = el; \}\}\r?\n/, ''));
