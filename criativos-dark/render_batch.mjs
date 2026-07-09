import { chromium } from 'playwright';
import fs from 'fs';

const DIR = '/home/user/Usuarios-GLP/criativos-dark';
const FONTS = `${DIR}/fonts`;

const FACE = `
@font-face{font-family:'Spectral';font-weight:500;src:url('file://${FONTS}/spectral-500.ttf');}
@font-face{font-family:'Spectral';font-weight:600;src:url('file://${FONTS}/spectral-600.ttf');}
@font-face{font-family:'Poppins';font-weight:400;src:url('file://${FONTS}/poppins-400.ttf');}
@font-face{font-family:'Poppins';font-weight:600;src:url('file://${FONTS}/poppins-600.ttf');}`;

const BASE = `
*{margin:0;padding:0;box-sizing:border-box;}
.stage{position:relative;width:1080px;height:1350px;overflow:hidden;color:#F3EFE7;}
.bg{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover;}
.scrim{position:absolute;inset:0;}
.wm{position:absolute;top:44px;left:56px;font-family:'Poppins';font-weight:600;
    font-size:20px;letter-spacing:.2em;color:#D4AF37;z-index:5;text-transform:uppercase;}
.wm span{opacity:.6;}
.block{position:absolute;z-index:4;}
.eyebrow{font-family:'Poppins';font-weight:600;font-size:22px;letter-spacing:.28em;
    color:#D4AF37;text-transform:uppercase;margin-bottom:22px;}
.head{font-family:'Spectral';font-weight:600;line-height:1.08;letter-spacing:-.015em;
    color:#F3EFE7;font-size:72px;}
.head .g{color:#D4AF37;}
.tag{position:absolute;bottom:66px;left:56px;right:56px;z-index:4;text-align:center;
    font-family:'Poppins';font-weight:500;font-size:22px;letter-spacing:.02em;color:rgba(243,239,231,.8);}
.tag b{color:#D4AF37;font-weight:600;}`;

const TOP = 'linear-gradient(180deg, rgba(6,6,7,.84) 0%, rgba(6,6,7,.45) 32%, rgba(6,6,7,0) 60%)';
const TOPBOT = TOP + ', linear-gradient(0deg, rgba(6,6,7,.8) 0%, rgba(6,6,7,0) 20%)';
const LEFT = 'linear-gradient(90deg, rgba(6,6,7,.86) 0%, rgba(6,6,7,.5) 42%, rgba(6,6,7,0) 72%)';
const RIGHT = 'linear-gradient(180deg, rgba(6,6,7,.8) 0%, rgba(6,6,7,.3) 32%, rgba(6,6,7,0) 55%)';

// tag line (compatibility) reused
const COMPAT = `<div class="tag">Compatible con <b>Ozempic</b> · <b>Wegovy</b> · <b>Mounjaro</b></div>`;

// Single angle: "no es el medicamento, es tu protocolo" — 10 variations
const items = [
  { base:'01-problema', scrim:TOP, pos:'top:118px;left:56px;right:56px;text-align:center;',
    eyebrow:'El error más común', head:`No es el <span class="g">Ozempic</span>.<br>Es no tener un <span class="g">protocolo</span>.` },
  { base:'01-problema', scrim:TOP, pos:'top:118px;left:56px;right:56px;text-align:center;', suffix:'b',
    eyebrow:'La verdad incómoda', head:`El medicamento hace la mitad.<br>Tu <span class="g">protocolo</span> hace el resto.` },
  { base:'05-emocional', scrim:LEFT, pos:'top:50%;transform:translateY(-50%);left:64px;width:560px;text-align:left;',
    eyebrow:'Mismo GLP-1', head:`Distinto resultado.<br>La diferencia:<br>el <span class="g">protocolo</span>.` },
  { base:'05-emocional', scrim:LEFT, pos:'top:50%;transform:translateY(-50%);left:64px;width:580px;text-align:left;', suffix:'b',
    eyebrow:'21 días', head:`No pierdas músculo.<br>Sigue el <span class="g">protocolo</span>,<br>no solo la pluma.` },
  { base:'02-mecanismo', scrim:TOPBOT, pos:'top:120px;left:56px;right:56px;text-align:center;', tag:COMPAT,
    eyebrow:'Tu protocolo, cada día', head:`Qué comer, cuánta<br><span class="g">proteína</span> y en qué orden.` },
  { base:'02-mecanismo', scrim:TOP, pos:'top:120px;left:56px;right:56px;text-align:center;', suffix:'b',
    eyebrow:'El método', head:`El <span class="g">Método<br>Proteína Primero</span>:<br>tu plan de 21 días.` },
  { base:'04-oferta', scrim:TOP, pos:'top:120px;left:56px;right:56px;text-align:center;',
    eyebrow:'60 segundos', head:`Descubre tu<br><span class="g">protocolo</span> hoy.` },
  { base:'04-oferta', scrim:TOPBOT, pos:'top:120px;left:56px;right:56px;text-align:center;', suffix:'b', tag:COMPAT,
    eyebrow:'Acceso completo', head:`21 días. Un <span class="g">protocolo</span>.<br>Qué comer con tu GLP-1.` },
  { base:'06-objecion', scrim:RIGHT, pos:'top:120px;right:56px;width:640px;text-align:right;',
    eyebrow:'¿Náuseas?', head:`No es la pluma.<br>Es comer sin <span class="g">protocolo</span>.` },
  { base:'06-objecion', scrim:RIGHT, pos:'top:120px;right:56px;width:640px;text-align:right;', suffix:'b',
    eyebrow:'Días difíciles', head:`El <span class="g">protocolo</span> que sí<br>toleras con náuseas.` },
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
let n = 0;
for (const it of items) {
  n++;
  const key = `${it.base}${it.suffix||''}`;
  const bg = `file://${DIR}/base-${it.base}.png`;
  const doc = `<!doctype html><html><head><meta charset="utf8"><style>${FACE}${BASE}</style></head>
  <body><div class="stage"><img class="bg" src="${bg}">
  <div class="scrim" style="background:${it.scrim};"></div>
  <div class="wm">Método <span>Proteína Primero</span></div>
  <div class="block" style="${it.pos}"><div class="eyebrow">${it.eyebrow}</div><div class="head">${it.head}</div></div>
  ${it.tag||''}</div></body></html>`;
  fs.writeFileSync(`${DIR}/_b-${n}.html`, doc);
  await page.goto(`file://${DIR}/_b-${n}.html`, { waitUntil:'load' });
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(250);
  const num = String(n).padStart(2,'0');
  await (await page.$('.stage')).screenshot({ path:`${DIR}/lote-${num}-${key}.png` });
  console.log('rendered', num, key);
}
await browser.close();
