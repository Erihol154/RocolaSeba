// Descarga la planilla "Listado Vinilos" y regenera src/data/vinyls.json antes de compilar.
// Se ejecuta en cada build de Vercel (ver "build" en package.json).
// Si la descarga falla, deja el vinyls.json actual para que el deploy no se rompa.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'vinyls.json');
const RULES_PATH = path.join(ROOT, 'scripts', 'genre-rules.json');

const SHEET_ID = '15ZLrW09uaUtoUJL5rDmiJVu_rxqedKEw8Q9RqtZojjc';
const SHEET_TAB = 'Respuestas de formulario 1';
const DEFAULT_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;

// Para probar sin internet: SHEET_CSV_FILE=ruta/al/archivo.csv
const CSV_URL = process.env.SHEET_CSV_URL || DEFAULT_URL;
const CSV_FILE = process.env.SHEET_CSV_FILE;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const norm = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

function extractDriveIds(field) {
  if (!field) return [];
  return field.replace(/"/g, '').split(',').map((u) => u.trim()).filter(Boolean)
    .map((u) => (u.match(/id=([a-zA-Z0-9_-]+)/) || [])[1]).filter(Boolean);
}

function buildRecords(rows, rules, previous) {
  const headerIdx = rows.findIndex((r) => r.some((c) => c.includes('Compañía discográfica')));
  if (headerIdx === -1) throw new Error('No encontré la fila de encabezados ("Compañía discográfica").');

  // Datos ya enriquecidos (tapa oficial, preview de audio) del vinyls.json anterior.
  const byId = new Map(previous.map((p) => [p.id, p]));
  const byKey = new Map(previous.map((p) => [`${norm(p.artist)}|${norm(p.title)}`, p]));

  const genreOf = (text) => {
    const t = text.toLowerCase();
    for (const { genre, keywords } of rules) if (keywords.some((k) => t.includes(k))) return genre;
    return 'Pop / Rock General';
  };

  const records = [];
  const seen = new Set();
  rows.slice(headerIdx + 1).forEach((r, idx) => {
    if (r.length < 10) return;
    const g = (i) => (r[i] || '').trim();
    const [label, artist, title, sideA, sideB, coverCond, vinylCond, photosRaw, year] =
      [1, 2, 3, 4, 5, 6, 7, 8, 9].map(g);
    if (!artist && !title) return;
    const notes = g(10);

    const rawId = g(13);
    let id = rawId && rawId !== '#N/A' && rawId !== 'N/A' && !seen.has(rawId) ? rawId : `VINYL-${idx + 1}`;
    seen.add(id);

    const driveIds = extractDriveIds(photosRaw);
    const photos = driveIds.map((d) => `https://lh3.googleusercontent.com/d/${d}`);
    const prev = byId.get(id) || byKey.get(`${norm(artist)}|${norm(title)}`);

    records.push({
      id,
      artist,
      title,
      label,
      year: year && year !== 'No tiene' && year !== '0' ? year : 'N/A',
      genre: genreOf(`${artist} ${title} ${label} ${sideA} ${sideB}`),
      sideA,
      sideB,
      coverCondition: coverCond,
      vinylCondition: vinylCond,
      driveIds,
      primaryPhoto: photos[0] || null,
      photos,
      notes,
      officialCover: prev?.officialCover ?? null,
      audioPreview: prev?.audioPreview ?? null,
    });
  });
  return records;
}

async function main() {
  const previous = fs.existsSync(OUTPUT_PATH) ? JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')) : [];
  const rules = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));

  let text;
  if (CSV_FILE) {
    text = fs.readFileSync(CSV_FILE, 'utf8');
  } else {
    const res = await fetch(CSV_URL, { redirect: 'follow' });
    if (!res.ok) throw new Error(`La planilla respondió HTTP ${res.status}`);
    text = await res.text();
    if (/^\s*<!doctype html|<html/i.test(text)) {
      throw new Error('La planilla devolvió una página HTML (¿no está compartida como "cualquier persona con el enlace"?)');
    }
  }

  const records = buildRecords(parseCsv(text), rules, previous);

  // Protección: si la planilla viene vacía o muy recortada, no pisar la lista actual.
  if (records.length === 0 || (previous.length > 0 && records.length < previous.length * 0.5)) {
    throw new Error(`La planilla trajo ${records.length} discos (antes había ${previous.length}); parece un error.`);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2) + '\n', 'utf8');
  const added = records.filter((r) => !previous.some((p) => p.id === r.id)).length;
  console.log(`[sync-sheet] ${records.length} discos sincronizados desde la planilla (${added} nuevos).`);
}

main().catch((err) => {
  console.warn(`[sync-sheet] No se actualizó la lista: ${err.message}. Se usa el vinyls.json existente.`);
  process.exit(0);
});
