import { chromium } from 'playwright';
import fs from 'fs';
const DIR = '/home/user/Usuarios-GLP/criativos-dark';
const F = `${DIR}/fonts`;
const CSS = `
@font-face{font-family:'Spectral';font-weight:600;src:url('file://${F}/spectral-600.ttf');}
@font-face{font-family:'Poppins';font-weight:400;src:url('file://${F}/poppins-400.ttf');}
@font-face{font-family:'Poppins';font-weight:600;src:url('file://${F}/poppins-600.ttf');}
*{margin:0;padding:0;box-sizing:border-box;}
.c{width:1080px;height:1080px;background:#0E0C0A;color:#F3EFE7;font-family:'Poppins';position:relative;padding:90px 84px;display:flex;flex-direction:column;overflow:hidden;}
.glow{position:absolute;bottom:-160px;right:-160px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(217,192,138,.09),transparent 62%);}
.wm{font-size:19px;font-weight:600;letter-spacing:.2em;color:#D9C08A;text-transform:uppercase;}
.wm span{opacity:.55;}
.num{font-family:'Spectral';font-weight:600;font-size:200px;line-height:.9;color:rgba(217,192,138,.16);position:absolute;top:64px;right:84px;}
.err{margin-top:auto;}
.tag{display:inline-block;font-size:20px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#f0918a;margin-bottom:26px;}
.tag.gold{color:#D9C08A;}
h1{font-family:'Spectral';font-weight:600;font-size:84px;line-height:1.06;letter-spacing:-.015em;}
h1 .g{color:#D9C08A;}
.body{font-size:30px;line-height:1.5;color:rgba(243,239,231,.78);margin-top:26px;max-width:840px;}
.body b{color:#F3EFE7;font-weight:600;}
.foot{margin-top:52px;display:flex;align-items:center;justify-content:flex-end;font-size:23px;}
.sw{color:#D9C08A;font-weight:600;}
.cta{margin-top:44px;display:inline-flex;align-self:flex-start;background:linear-gradient(180deg,#E4C35A,#C9A233);color:#17140C;font-weight:600;font-size:30px;padding:26px 52px;border-radius:999px;}
`;
const cards = [
 {tag:'',tagCls:'gold',h:`Los <span class="g">5 errores</span> que arruinan tu tratamiento con GLP-1`,b:`Y por qué ninguno se arregla subiendo la dosis.`,foot:'Desliza →'},
 {n:'1',tag:'Error 1',h:`Comer sin priorizar la <span class="g">proteína</span>`,b:`El GLP-1 te quita el hambre — y sin proteína suficiente pierdes <b>músculo</b>, no solo grasa. La piel se afloja sin que notes cuándo empezó.`,foot:'Desliza →'},
 {n:'2',tag:'Error 2',h:`Comer lo de siempre el día de la <span class="g">inyección</span>`,b:`Las náuseas casi nunca son "normales". Son comer lo incorrecto en las 24 horas equivocadas.`,foot:'Desliza →'},
 {n:'3',tag:'Error 3',h:`Comer muy poco <span class="g">de todo</span>`,b:`Menos comida no es mejor resultado: el cuerpo entra en modo ahorro y la <b>energía desaparece</b>. No es el sueño — es la nutrición.`,foot:'Desliza →'},
 {n:'4',tag:'Error 4',h:`<span class="g">Improvisar</span> cada comida`,b:`"¿Puedo comer esto? ¿Cuánto?" — decidir con hambre y sin guía es la razón por la que los resultados se estancan.`,foot:'Desliza →'},
 {n:'5',tag:'El más caro',h:`Terminar el tratamiento <span class="g">sin plan de salida</span>`,b:`El 80% recupera el peso en 12 meses. Los 5 errores tienen la misma solución: <b>un protocolo</b>.`,cta:'Descubre tu protocolo — gratis'},
];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport:{width:1080,height:1080}, deviceScaleFactor:1 });
let i=0;
for (const c of cards){
  i++;
  const doc = `<!doctype html><html><head><meta charset="utf8"><style>${CSS}</style></head><body><div class="c">
  <div class="glow"></div>
  ${c.n?`<div class="num">${c.n}</div>`:''}
  <div class="wm">Método <span>Proteína Primero</span></div>
  <div class="err">
    ${c.tag?`<div class="tag ${c.tagCls||''}">${c.tag}</div>`:''}
    <h1>${c.h}</h1>
    ${c.b?`<div class="body">${c.b}</div>`:''}
    ${c.cta?`<div class="cta">${c.cta} →</div>`:''}
    ${c.foot?`<div class="foot"><span class="sw">${c.foot}</span></div>`:''}
  </div></div></body></html>`;
  fs.writeFileSync(`${DIR}/_car-${i}.html`, doc);
  await page.goto(`file://${DIR}/_car-${i}.html`,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(200);
  await page.screenshot({ path:`${DIR}/carrusel-0${i}.png` });
  console.log('card',i,'ok');
}
await browser.close();
