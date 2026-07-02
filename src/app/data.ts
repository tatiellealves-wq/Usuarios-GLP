// Contenido del kit Guía GLP-1 Inteligente — fuente única para el app

export type Receta = {
  id: number;
  nombre: string;
  cat: 'desayuno' | 'principal' | 'snack';
  proteina: number;
  min: number;
  porciones: number;
  suave: boolean;
  ing: string;
  prep: string;
};

export const RECETAS: Receta[] = [
  { id: 1, nombre: 'Omelette proteico de espinacas y queso', cat: 'desayuno', proteina: 24, min: 8, porciones: 1, suave: true, ing: '3 huevos, espinacas baby, 30 g queso fresco, sal y pimienta.', prep: 'Bate los huevos, vierte en sartén a fuego medio, añade espinacas y queso, dobla y sirve.' },
  { id: 2, nombre: 'Yogur griego con frutos rojos y chía', cat: 'desayuno', proteina: 20, min: 3, porciones: 1, suave: true, ing: '200 g yogur griego, 1 taza frutos rojos, 1 cda chía, miel opcional.', prep: 'Mezcla todo en un bowl. La chía estabiliza la glucosa de la mañana.' },
  { id: 3, nombre: 'Avena proteica con canela y almendras', cat: 'desayuno', proteina: 28, min: 10, porciones: 1, suave: false, ing: '½ taza avena, 1 taza leche, 1 scoop proteína, canela, almendras, fruta.', prep: 'Cocina la avena con leche, retira e integra la proteína; termina con canela, almendras y fruta.' },
  { id: 4, nombre: 'Tostada integral con aguacate y huevo pochado', cat: 'desayuno', proteina: 14, min: 10, porciones: 1, suave: false, ing: '1 pan integral, ¼ aguacate, 1 huevo pochado, pimienta y limón.', prep: 'Tritura el aguacate sobre la tostada, corona con el huevo y termina con pimienta y limón.' },
  { id: 5, nombre: 'Batido verde de proteína', cat: 'desayuno', proteina: 26, min: 5, porciones: 1, suave: true, ing: 'Espinacas, 1 plátano congelado, 200 ml leche vegetal, 1 scoop proteína, linaza.', prep: 'Licúa todo hasta quedar cremoso. Frío y suave para días sin apetito.' },
  { id: 6, nombre: 'Panqueques de avena y plátano', cat: 'desayuno', proteina: 18, min: 15, porciones: 2, suave: false, ing: '1 plátano, 2 huevos, ½ taza avena, canela, aceite de coco.', prep: 'Licúa todo y cocina porciones pequeñas 2 min por lado. Sirve con frutos rojos.' },
  { id: 7, nombre: 'Queso cottage con durazno y nueces', cat: 'desayuno', proteina: 22, min: 3, porciones: 1, suave: true, ing: '¾ taza cottage, 1 durazno o pera, nueces, canela.', prep: 'Sirve el cottage y cubre con fruta, nueces y canela. Sin cocción, sin olores.' },
  { id: 8, nombre: 'Huevos revueltos cremosos con aguacate', cat: 'desayuno', proteina: 16, min: 8, porciones: 1, suave: true, ing: '2 huevos, 1 cda leche, ¼ aguacate, sal suave.', prep: 'Revuelve a fuego bajo, retira antes de que sequen. Sirve con aguacate en láminas.' },
  { id: 9, nombre: 'Smoothie bowl de proteína y frutas', cat: 'desayuno', proteina: 28, min: 7, porciones: 1, suave: false, ing: '1 scoop proteína, ½ plátano congelado, frutos rojos, 100 ml leche, granola, coco.', prep: 'Licúa espeso con poca leche; sirve en bowl con granola y coco.' },
  { id: 10, nombre: 'Chía pudding de vainilla', cat: 'desayuno', proteina: 18, min: 5, porciones: 1, suave: true, ing: '3 cdas chía, 200 ml leche, ½ scoop proteína vainilla, fruta.', prep: 'Mezcla y refrigera toda la noche. Por la mañana agrega fruta.' },
  { id: 11, nombre: 'Tortilla de claras con champiñones', cat: 'desayuno', proteina: 22, min: 10, porciones: 1, suave: false, ing: '5 claras, champiñones, pimiento, cebollín.', prep: 'Saltea los vegetales, añade las claras y cocina hasta cuajar.' },
  { id: 12, nombre: 'Arepa integral rellena de huevo y queso', cat: 'desayuno', proteina: 20, min: 15, porciones: 1, suave: false, ing: '1 arepa integral, 1 huevo revuelto, 40 g queso fresco, tomate.', prep: 'Asa la arepa, ábrela y rellena con huevo, queso y tomate.' },
  { id: 13, nombre: 'Pechuga a la plancha con ensalada y arroz', cat: 'principal', proteina: 38, min: 20, porciones: 1, suave: false, ing: '1 pechuga (150 g), hojas verdes, tomate, pepino, ½ taza arroz integral, aceite de oliva.', prep: 'Cocina la pechuga 5–6 min por lado. Sirve con ensalada aliñada y arroz.' },
  { id: 14, nombre: 'Salmón al horno con brócoli y batata', cat: 'principal', proteina: 32, min: 25, porciones: 1, suave: false, ing: '1 filete salmón, 1 taza brócoli, 1 batata, aceite de oliva, limón, eneldo.', prep: 'Hornea a 200 °C: batata 25 min; salmón y brócoli los últimos 15.' },
  { id: 15, nombre: 'Bowl de quinoa con pollo y aguacate', cat: 'principal', proteina: 36, min: 15, porciones: 1, suave: false, ing: '¾ taza quinoa cocida, 100 g pollo desmenuzado, ¼ aguacate, verduras asadas, semillas.', prep: 'Arma el bowl en capas y termina con semillas de calabaza.' },
  { id: 16, nombre: 'Sopa de lentejas con verduras', cat: 'principal', proteina: 18, min: 25, porciones: 3, suave: true, ing: '1 taza lentejas, zanahoria, apio, cebolla, comino, caldo de verduras.', prep: 'Sofríe, añade lentejas y caldo, cocina 20 min. Congela bien.' },
  { id: 17, nombre: 'Pescado blanco al limón con puré de coliflor', cat: 'principal', proteina: 28, min: 20, porciones: 1, suave: true, ing: '1 filete merluza/tilapia, ½ coliflor, aceite de oliva, limón, perejil.', prep: 'Pescado al vapor o sartén con limón; coliflor hervida y triturada con aceite.' },
  { id: 18, nombre: 'Ensalada de atún con garbanzos', cat: 'principal', proteina: 34, min: 10, porciones: 1, suave: false, ing: '1 lata atún en agua, ½ taza garbanzos, tomate, cebolla morada, aceite y limón.', prep: 'Mezcla todo en un bowl. Aguanta perfecto al día siguiente.' },
  { id: 19, nombre: 'Tacos de res magra en tortilla integral', cat: 'principal', proteina: 32, min: 20, porciones: 2, suave: false, ing: '200 g res magra molida, 4 tortillas integrales, lechuga, pico de gallo.', prep: 'Cocina la carne con especias suaves; sirve en tortillas con lechuga y pico de gallo.' },
  { id: 20, nombre: 'Pollo en caldo con verduras y arroz', cat: 'principal', proteina: 26, min: 25, porciones: 2, suave: true, ing: '1 pechuga en cubos, zanahoria, calabacín, ½ taza arroz, caldo bajo en sodio.', prep: 'Cocina todo junto hasta que el arroz esté listo. Hidrata y alimenta en días difíciles.' },
  { id: 21, nombre: 'Tofu salteado con verduras y sésamo', cat: 'principal', proteina: 22, min: 15, porciones: 1, suave: false, ing: '150 g tofu firme, brócoli, pimiento, zanahoria, soya baja en sodio, sésamo.', prep: 'Dora el tofu en cubos, añade verduras y saltea 5 min.' },
  { id: 22, nombre: 'Crema de calabaza con pollo desmenuzado', cat: 'principal', proteina: 26, min: 25, porciones: 2, suave: true, ing: '½ calabaza, 1 pechuga cocida, cebolla, caldo, un toque de jengibre.', prep: 'Cocina y licúa la calabaza con el caldo; incorpora el pollo al servir.' },
  { id: 23, nombre: 'Wrap integral de pavo y vegetales', cat: 'principal', proteina: 24, min: 8, porciones: 1, suave: false, ing: '1 tortilla integral, 80 g pavo en fetas, hojas verdes, tomate, ¼ aguacate, yogur.', prep: 'Arma, enrolla y corta a la mitad. El almuerzo portátil.' },
  { id: 24, nombre: 'Sopa minestrone con legumbres', cat: 'principal', proteina: 14, min: 25, porciones: 3, suave: true, ing: 'Alubias cocidas, zanahoria, apio, calabacín, tomate triturado.', prep: 'Sofríe, añade líquidos y cocina 20 min. Suma queso fresco para más proteína.' },
  { id: 25, nombre: 'Hummus con bastones de verdura', cat: 'snack', proteina: 7, min: 5, porciones: 1, suave: true, ing: '3 cdas hummus, pepino, zanahoria, apio.', prep: 'Fibra + proteína vegetal sin tocar la cocina.' },
  { id: 26, nombre: 'Yogur griego con miel y semillas', cat: 'snack', proteina: 18, min: 2, porciones: 1, suave: true, ing: '200 g yogur griego, 1 cdta miel, semillas de girasol o calabaza.', prep: 'El snack proteico más rápido que existe.' },
  { id: 27, nombre: 'Rollitos de pavo con queso y pepino', cat: 'snack', proteina: 14, min: 5, porciones: 1, suave: false, ing: 'Fetas de pavo, queso fresco, bastones de pepino.', prep: 'Enrolla el pavo con el queso y el pepino dentro.' },
  { id: 28, nombre: 'Puñado de almendras + 1 manzana', cat: 'snack', proteina: 6, min: 1, porciones: 1, suave: false, ing: '15–20 almendras, 1 manzana.', prep: 'El combo fibra + grasa saludable que corta el antojo.' },
  { id: 29, nombre: 'Batido de proteína con leche vegetal', cat: 'snack', proteina: 26, min: 3, porciones: 1, suave: true, ing: '1 scoop proteína, 250 ml leche vegetal, hielo.', prep: 'Tu red de seguridad proteica cuando el apetito no aparece.' },
  { id: 30, nombre: 'Huevos duros', cat: 'snack', proteina: 13, min: 12, porciones: 1, suave: true, ing: '2 huevos (cocina 6–8 en lote el domingo).', prep: '2 huevos = 13 g de proteína al alcance de la mano toda la semana.' },
  { id: 31, nombre: 'Queso cottage con tomates cherry', cat: 'snack', proteina: 14, min: 3, porciones: 1, suave: true, ing: '½ taza cottage, tomates cherry, pimienta, aceite de oliva.', prep: 'Versión salada del snack proteico.' },
  { id: 32, nombre: 'Tostadas de arroz con cottage y tomate', cat: 'snack', proteina: 12, min: 4, porciones: 1, suave: false, ing: '2 tostadas de arroz, queso cottage, tomate, orégano.', prep: 'Crocante por fuera, cremoso por dentro.' },
  { id: 33, nombre: 'Gelatina proteica con frutos rojos', cat: 'snack', proteina: 12, min: 5, porciones: 2, suave: true, ing: 'Gelatina sin azúcar, ½ scoop proteína, frutos rojos.', prep: 'Disuelve la proteína antes de refrigerar. Fría y suave para estómagos sensibles.' },
  { id: 34, nombre: 'Edamames al vapor con sal marina', cat: 'snack', proteina: 11, min: 6, porciones: 1, suave: false, ing: '1 taza edamames, sal marina.', prep: 'Proteína vegetal completa para picar sin culpa.' },
  { id: 35, nombre: 'Manzana asada con canela y yogur', cat: 'snack', proteina: 10, min: 8, porciones: 1, suave: true, ing: '1 manzana, canela, 100 g yogur griego.', prep: 'Hornea o microondea la manzana en gajos; sirve tibia con el yogur.' },
];

export const PASOS_INYECCION = [
  { id: 'antes-comida', fase: 'Antes de la dosis', texto: '2–3 h antes: comida ligera y proteica (yogur griego, omelette pequeño o pollo con verduras)' },
  { id: 'antes-agua', fase: 'Antes de la dosis', texto: 'Hidratación: 1–2 vasos de agua en las horas previas' },
  { id: 'antes-evitar', fase: 'Antes de la dosis', texto: 'Evitar: frituras, porciones grandes, alcohol y café en ayunas' },
  { id: 'despues-sorbos', fase: 'Primeras 24 h', texto: 'Sorbos pequeños de agua a lo largo del día — no grandes cantidades de una vez' },
  { id: 'despues-blandos', fase: 'Primeras 24 h', texto: 'Si hay hambre: alimentos blandos (plátano, arroz, tostada, caldo, compota)' },
  { id: 'despues-comidas', fase: 'Primeras 24 h', texto: 'Comidas pequeñas cada 3–4 horas; proteína suave y verduras cocidas' },
  { id: 'despues-evitar', fase: 'Primeras 24 h', texto: 'Evitar: picantes, olores intensos, gaseosas y acostarse antes de 2 h tras comer' },
];

export const FASES_SALIDA = [
  {
    nombre: 'Fase 1 · Consolidar la base', semanas: 'Semanas 1–4',
    items: ['Mantén tus horarios de comida exactos (3 comidas + 1 merienda)', 'Sube la proteína a 1.8 g/kg — tu escudo contra el hambre', 'Registra tu peso 2 veces por semana, mismo día y hora', 'El hambre que regresa es normal: respóndele con volumen (verduras, caldos, fibra), no con restricción'],
  },
  {
    nombre: 'Fase 2 · Saciedad natural', semanas: 'Semanas 5–8',
    items: ['Come en 20 minutos o más, sin pantallas', 'Agua antes de cada comida, siempre', 'Fuerza 2–3 veces por semana — el músculo protege tu metabolismo', 'Identifica tus 2 momentos de riesgo y define de antemano qué harás'],
  },
  {
    nombre: 'Fase 3 · Autonomía total', semanas: 'Semanas 9–12',
    items: ['Practica el plato estándar sin pesar: ½ verduras, ¼ proteína, ¼ carbohidrato', 'Define tu rango de mantenimiento (±2 kg) y tu plan si lo superas', 'Programa un control médico al final de la semana 12', 'El éxito es que la estructura ya no te cueste esfuerzo'],
  },
];

export const GUIA_CAPITULOS = [
  {
    titulo: '¿Qué son los medicamentos GLP-1?',
    texto: 'Ozempic® y Wegovy® (semaglutida) y Mounjaro® (tirzepatida) imitan hormonas naturales del sistema digestivo: reducen el hambre, prolongan la saciedad y enlentecen la digestión. Para efectos de tu alimentación, funcionan de forma muy similar — todo lo que ves en este app aplica a los tres. Su uso debe ser prescrito y supervisado por tu médico.',
  },
  {
    titulo: 'Los 4 hábitos pilares',
    texto: 'Alimentación consciente (comer despacio, escuchar la saciedad) · Actividad física regular (30 min de caminata + fuerza 2–3x/semana) · Sueño de calidad (7–9 h regulan las hormonas del hambre) · Gestión del estrés (el cortisol crónico dificulta el control del apetito). No cambies todo a la vez: un pilar por semana.',
  },
  {
    titulo: 'La proteína: tu escudo',
    texto: 'Objetivo: 1.6–1.8 g por kg de peso corporal, distribuidos en las 3 comidas. Sin suficiente proteína, hasta un 40% del peso perdido puede ser masa muscular. Regla práctica: si solo puedes comer poco, come primero la proteína del plato. Referencias: pechuga 120 g ≈ 35 g · 3 huevos ≈ 19 g · yogur griego 200 g ≈ 18 g · salmón 120 g ≈ 28 g · lentejas 1 taza ≈ 17 g · scoop de proteína ≈ 24 g.',
  },
  {
    titulo: 'Hidratación y fibra',
    texto: '8 vasos de agua como mínimo diario (2 L), un vaso 30 minutos antes de cada comida, y 25 g de fibra al día. La fibra necesita agua para funcionar: juntas mejoran el tránsito y la saciedad. Fuentes: hojas verdes, frutas enteras, avena, legumbres, chía y linaza.',
  },
  {
    titulo: 'Alimentos: sí y no',
    texto: 'SÍ: proteínas magras, verduras sin almidón, grasas saludables (aguacate, oliva, frutos secos), carbohidratos de calidad (batata, arroz integral, quinoa, avena, legumbres). LIMITA: ultraprocesados, azúcares y harinas blancas, bebidas azucaradas y alcohol, frituras, porciones muy grandes, picantes intensos. Estrategia 80/20: si el 80% viene de la lista sí, el 20% tiene espacio sin culpa.',
  },
  {
    titulo: 'Cómo reducir molestias digestivas',
    texto: '1) Porciones pequeñas y frecuentes (4–5 al día) · 2) Come despacio, 20 min por comida · 3) No te acuestes hasta 2 h después de comer · 4) Jengibre y menta en infusión alivian náuseas · 5) Sorbos pequeños de agua constantes · 6) Alimentos blandos en días sensibles · 7) Cocina con ventanas abiertas. Si las molestias son intensas o persisten más de una semana, contacta a tu médico.',
  },
  {
    titulo: 'El plato estándar GLP-1',
    texto: 'Cuando no quieras pensar: ½ del plato de verduras sin almidón · ¼ de proteína magra · ¼ de carbohidrato de calidad · 1 cucharada de grasa saludable. Funciona para almuerzo y cena, todos los días.',
  },
];

// Código maestro legado: sigue válido para compradores antiguos.
// Los códigos nuevos (únicos por venta) se validan con src/app/codigos.ts
// y se generan con tools/generador-codigos.html.
export const CLAVE_ACCESO = 'GLP1-VIP-2026';

export type Ejercicio = { nombre: string; seg: number; nota: string };
export type Rutina = { id: number; nombre: string; foco: string; ejercicios: Ejercicio[] };

// 40 s de trabajo por ejercicio, pensados para baja energía y cero equipamiento.
export const RUTINAS: Rutina[] = [
  {
    id: 1, nombre: 'Firmeza total en casa', foco: 'Cuerpo completo · 15 min',
    ejercicios: [
      { nombre: 'Sentadilla a la silla', seg: 40, nota: 'Baja hasta rozar la silla y sube. Piernas y glúteos firmes.' },
      { nombre: 'Flexiones en la pared', seg: 40, nota: 'Manos en la pared a la altura del pecho. Brazos y pecho.' },
      { nombre: 'Puente de glúteos', seg: 40, nota: 'Acostada, eleva la cadera apretando glúteos 2 segundos arriba.' },
      { nombre: 'Remo con botellas', seg: 40, nota: 'Inclínate y lleva las botellas (1–2 L) hacia las costillas. Espalda.' },
      { nombre: 'Elevación de talones', seg: 40, nota: 'De pie, sube a las puntas. Pantorrillas y estabilidad.' },
      { nombre: 'Plancha con rodillas', seg: 30, nota: 'Antebrazos y rodillas apoyados, abdomen apretado, espalda recta.' },
    ],
  },
  {
    id: 2, nombre: 'Brazos y postura', foco: 'Tren superior · 12 min',
    ejercicios: [
      { nombre: 'Flexiones en la pared', seg: 40, nota: 'Versión inclinada si quieres más reto: manos en una mesa.' },
      { nombre: 'Curl con botellas', seg: 40, nota: 'Codos pegados al cuerpo, sube las botellas controlando la bajada.' },
      { nombre: 'Press de hombros sentada', seg: 40, nota: 'Botellas desde los hombros hacia arriba, sin arquear la espalda.' },
      { nombre: 'Remo con botellas', seg: 40, nota: 'El mejor amigo de tu postura.' },
      { nombre: 'Apertura de brazos', seg: 40, nota: 'Brazos en cruz, círculos pequeños hacia atrás.' },
    ],
  },
  {
    id: 3, nombre: 'Piernas y glúteos', foco: 'Tren inferior · 12 min',
    ejercicios: [
      { nombre: 'Sentadilla a la silla', seg: 40, nota: 'El ejercicio más valioso del tratamiento.' },
      { nombre: 'Zancada corta apoyada', seg: 40, nota: 'Un paso al frente con la mano en la pared. Alterna piernas.' },
      { nombre: 'Puente de glúteos', seg: 40, nota: 'Aprieta arriba 2 segundos.' },
      { nombre: 'Patada de glúteo de pie', seg: 40, nota: 'Apoyada en la silla, lleva el talón hacia atrás. Alterna.' },
      { nombre: 'Elevación de talones', seg: 40, nota: 'Termina sintiendo las pantorrillas despiertas.' },
    ],
  },
];
