import { chromium } from 'playwright';
import fs from 'fs';

const DIR = '/home/user/Usuarios-GLP/criativos-dark';
const FONTS = `${DIR}/fonts`;

const FACE = `
@font-face{font-family:'Spectral';font-weight:500;src:url('file://${FONTS}/spectral-500.ttf');}
@font-face{font-family:'Spectral';font-weight:600;src:url('file://${FONTS}/spectral-600.ttf');}
@font-face{font-family:'Poppins';font-weight:400;src:url('file://${FONTS}/poppins-400.ttf');}
@font-face{font-family:'Poppins';font-weight:600;src:url('file://${FONTS}/poppins-600.ttf');}
`;

const BASE = `
*{margin:0;padding:0;box-sizing:border-box;}
.stage{position:relative;width:1080px;height:1350px;overflow:hidden;color:#F3EFE7;}
.bg{position:absolute;inset:0;width:1080px;height:1350px;object-fit:cover;}
.scrim{position:absolute;inset:0;}
.wm{position:absolute;top:44px;left:56px;font-family:'Poppins';font-weight:600;
    font-size:23px;letter-spacing:.22em;color:#D4AF37;z-index:5;text-transform:uppercase;}
.wm span{opacity:.7;}
.block{position:absolute;z-index:4;}
.eyebrow{font-family:'Poppins';font-weight:600;font-size:22px;letter-spacing:.28em;
    color:#D4AF37;text-transform:uppercase;margin-bottom:24px;}
.head{font-family:'Spectral';font-weight:600;line-height:1.08;letter-spacing:-.015em;
    color:#F3EFE7;font-size:74px;}
.head .g{color:#D4AF37;}
.sub{font-family:'Poppins';font-weight:400;font-size:27px;line-height:1.5;
    color:rgba(243,239,231,.82);margin-top:26px;}
.proof{font-family:'Poppins';font-weight:500;font-size:23px;letter-spacing:.02em;
    color:rgba(243,239,231,.78);}
.proof b{color:#D4AF37;font-weight:600;}
.price{font-family:'Spectral';font-weight:600;font-size:96px;color:#D4AF37;line-height:1;}
.price .c{font-size:46px;vertical-align:super;}
.pnote{font-family:'Poppins';font-weight:400;font-size:25px;color:rgba(243,239,231,.85);margin-top:8px;}
.cta{display:inline-block;margin-top:30px;font-family:'Poppins';font-weight:600;
    font-size:29px;letter-spacing:.01em;color:#17140C;padding:22px 46px;border-radius:999px;
    background:linear-gradient(180deg,#E4C35A,#C9A233);box-shadow:0 18px 40px -14px rgba(212,175,55,.6);}
`;

// per-creative layouts
const creatives = {
  '01-problema': {
    scrim:'linear-gradient(180deg, rgba(6,6,7,.82) 0%, rgba(6,6,7,.5) 30%, rgba(6,6,7,0) 58%)',
    html:`<div class="block" style="top:118px;left:56px;right:56px;text-align:center;">
      <div class="eyebrow">El error más común</div>
      <div class="head">No es el <span class="g">GLP-1</span>.<br>Es no saber <span class="g">cómo&nbsp;comer</span><br>mientras lo usas.</div>
    </div>`
  },
  '02-mecanismo': {
    scrim:'linear-gradient(180deg, rgba(6,6,7,.8) 0%, rgba(6,6,7,.35) 26%, rgba(6,6,7,0) 50%), linear-gradient(0deg, rgba(6,6,7,.85) 0%, rgba(6,6,7,0) 22%)',
    html:`<div class="block" style="top:120px;left:56px;right:56px;text-align:center;">
      <div class="eyebrow">Tu plan, cada día</div>
      <div class="head">Qué comer, cuánta<br><span class="g">proteína</span> y en qué orden.</div>
    </div>
    <div class="block" style="bottom:70px;left:56px;right:56px;text-align:center;">
      <div class="proof">Compatible con <b>Ozempic</b> · <b>Wegovy</b> · <b>Mounjaro</b></div>
    </div>`
  },
  '04-oferta': {
    scrim:'linear-gradient(180deg, rgba(6,6,7,.82) 0%, rgba(6,6,7,.4) 26%, rgba(6,6,7,0) 46%), linear-gradient(0deg, rgba(6,6,7,.9) 0%, rgba(6,6,7,.5) 16%, rgba(6,6,7,0) 34%)',
    html:`<div class="block" style="top:120px;left:56px;right:56px;text-align:center;">
      <div class="eyebrow">Acceso completo</div>
      <div class="head">Todo tu plan <span class="g">GLP-1</span>.</div>
    </div>
    <div class="block" style="bottom:66px;left:56px;right:56px;text-align:center;">
      <div class="price"><span class="c">US$</span>9.90</div>
      <div class="pnote">Un pago. Sin mensualidades. Para siempre.</div>
      <div class="cta">QUIERO MI ACCESO →</div>
    </div>`
  },
  '05-emocional': {
    scrim:'linear-gradient(90deg, rgba(6,6,7,.86) 0%, rgba(6,6,7,.55) 40%, rgba(6,6,7,0) 70%)',
    html:`<div class="block" style="top:50%;transform:translateY(-50%);left:64px;width:560px;text-align:left;">
      <div class="eyebrow">Sin adivinar</div>
      <div class="head">Tu tratamiento,<br>con un plan que<br><span class="g">sí entiendes</span>.</div>
      <div class="sub">Comé bien, cuidá tu músculo y avanzá con confianza.</div>
    </div>`
  },
  '06-objecion': {
    scrim:'linear-gradient(180deg, rgba(6,6,7,.78) 0%, rgba(6,6,7,.3) 30%, rgba(6,6,7,0) 52%)',
    html:`<div class="block" style="top:120px;right:56px;width:640px;text-align:right;">
      <div class="eyebrow">¿Efectos secundarios?</div>
      <div class="head"><span class="g">¿Náuseas?</span><br>Comidas que sí toleras.</div>
    </div>`
  },
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
for (const [key,c] of Object.entries(creatives)) {
  const bg = `file://${DIR}/base-${key}.png`;
  const doc = `<!doctype html><html><head><meta charset="utf8"><style>${FACE}${BASE}</style></head>
  <body><div class="stage"><img class="bg" src="${bg}">
  <div class="scrim" style="background:${c.scrim};"></div>
  <div class="wm">Guía <span>GLP·1</span></div>
  ${c.html}</div></body></html>`;
  fs.writeFileSync(`${DIR}/_doc-${key}.html`, doc);
  await page.goto(`file://${DIR}/_doc-${key}.html`, { waitUntil:'load' });
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(300);
  const el = await page.$('.stage');
  await el.screenshot({ path:`${DIR}/final-${key}.png` });
  console.log('rendered', key);
}
await browser.close();
