// Contenido del kit Guía GLP-1 Inteligente — fuente única para el app

export type Receta = {
  id: number;
  nombre: string;
  cat: 'desayuno' | 'principal' | 'snack';
  proteina: number;
  cal: number; // calorías estimadas por porción
  min: number;
  porciones: number;
  suave: boolean;
  ing: string;
  prep: string;
  exclusiva?: boolean; // receta bonus solo disponible en el app
};

export const RECETAS: Receta[] = [
  { id: 1, nombre: 'Omelette proteico de espinacas y queso', cat: 'desayuno', proteina: 24, cal: 320, min: 8, porciones: 1, suave: true, ing: '3 huevos, espinacas baby, 30 g queso fresco, sal y pimienta.', prep: 'Bate los huevos, vierte en sartén a fuego medio, añade espinacas y queso, dobla y sirve.' },
  { id: 2, nombre: 'Yogur griego con frutos rojos y chía', cat: 'desayuno', proteina: 20, cal: 260, min: 3, porciones: 1, suave: true, ing: '200 g yogur griego, 1 taza frutos rojos, 1 cda chía, miel opcional.', prep: 'Mezcla todo en un bowl. La chía estabiliza la glucosa de la mañana.' },
  { id: 3, nombre: 'Avena proteica con canela y almendras', cat: 'desayuno', proteina: 28, cal: 420, min: 10, porciones: 1, suave: false, ing: '½ taza avena, 1 taza leche, 1 scoop proteína, canela, almendras, fruta.', prep: 'Cocina la avena con leche, retira e integra la proteína; termina con canela, almendras y fruta.' },
  { id: 4, nombre: 'Tostada integral con aguacate y huevo pochado', cat: 'desayuno', proteina: 14, cal: 300, min: 10, porciones: 1, suave: false, ing: '1 pan integral, ¼ aguacate, 1 huevo pochado, pimienta y limón.', prep: 'Tritura el aguacate sobre la tostada, corona con el huevo y termina con pimienta y limón.' },
  { id: 5, nombre: 'Batido verde de proteína', cat: 'desayuno', proteina: 26, cal: 320, min: 5, porciones: 1, suave: true, ing: 'Espinacas, 1 plátano congelado, 200 ml leche vegetal, 1 scoop proteína, linaza.', prep: 'Licúa todo hasta quedar cremoso. Frío y suave para días sin apetito.' },
  { id: 6, nombre: 'Panqueques de avena y plátano', cat: 'desayuno', proteina: 18, cal: 320, min: 15, porciones: 2, suave: false, ing: '1 plátano, 2 huevos, ½ taza avena, canela, aceite de coco.', prep: 'Licúa todo y cocina porciones pequeñas 2 min por lado. Sirve con frutos rojos.' },
  { id: 7, nombre: 'Queso cottage con durazno y nueces', cat: 'desayuno', proteina: 22, cal: 290, min: 3, porciones: 1, suave: true, ing: '¾ taza cottage, 1 durazno o pera, nueces, canela.', prep: 'Sirve el cottage y cubre con fruta, nueces y canela. Sin cocción, sin olores.' },
  { id: 8, nombre: 'Huevos revueltos cremosos con aguacate', cat: 'desayuno', proteina: 16, cal: 280, min: 8, porciones: 1, suave: true, ing: '2 huevos, 1 cda leche, ¼ aguacate, sal suave.', prep: 'Revuelve a fuego bajo, retira antes de que sequen. Sirve con aguacate en láminas.' },
  { id: 9, nombre: 'Smoothie bowl de proteína y frutas', cat: 'desayuno', proteina: 28, cal: 380, min: 7, porciones: 1, suave: false, ing: '1 scoop proteína, ½ plátano congelado, frutos rojos, 100 ml leche, granola, coco.', prep: 'Licúa espeso con poca leche; sirve en bowl con granola y coco.' },
  { id: 10, nombre: 'Chía pudding de vainilla', cat: 'desayuno', proteina: 18, cal: 280, min: 5, porciones: 1, suave: true, ing: '3 cdas chía, 200 ml leche, ½ scoop proteína vainilla, fruta.', prep: 'Mezcla y refrigera toda la noche. Por la mañana agrega fruta.' },
  { id: 11, nombre: 'Tortilla de claras con champiñones', cat: 'desayuno', proteina: 22, cal: 180, min: 10, porciones: 1, suave: false, ing: '5 claras, champiñones, pimiento, cebollín.', prep: 'Saltea los vegetales, añade las claras y cocina hasta cuajar.' },
  { id: 12, nombre: 'Arepa integral rellena de huevo y queso', cat: 'desayuno', proteina: 20, cal: 340, min: 15, porciones: 1, suave: false, ing: '1 arepa integral, 1 huevo revuelto, 40 g queso fresco, tomate.', prep: 'Asa la arepa, ábrela y rellena con huevo, queso y tomate.' },
  { id: 13, nombre: 'Pechuga a la plancha con ensalada y arroz', cat: 'principal', proteina: 38, cal: 450, min: 20, porciones: 1, suave: false, ing: '1 pechuga (150 g), hojas verdes, tomate, pepino, ½ taza arroz integral, aceite de oliva.', prep: 'Cocina la pechuga 5–6 min por lado. Sirve con ensalada aliñada y arroz.' },
  { id: 14, nombre: 'Salmón al horno con brócoli y batata', cat: 'principal', proteina: 32, cal: 470, min: 25, porciones: 1, suave: false, ing: '1 filete salmón, 1 taza brócoli, 1 batata, aceite de oliva, limón, eneldo.', prep: 'Hornea a 200 °C: batata 25 min; salmón y brócoli los últimos 15.' },
  { id: 15, nombre: 'Bowl de quinoa con pollo y aguacate', cat: 'principal', proteina: 36, cal: 500, min: 15, porciones: 1, suave: false, ing: '¾ taza quinoa cocida, 100 g pollo desmenuzado, ¼ aguacate, verduras asadas, semillas.', prep: 'Arma el bowl en capas y termina con semillas de calabaza.' },
  { id: 16, nombre: 'Sopa de lentejas con verduras', cat: 'principal', proteina: 18, cal: 280, min: 25, porciones: 3, suave: true, ing: '1 taza lentejas, zanahoria, apio, cebolla, comino, caldo de verduras.', prep: 'Sofríe, añade lentejas y caldo, cocina 20 min. Congela bien.' },
  { id: 17, nombre: 'Pescado blanco al limón con puré de coliflor', cat: 'principal', proteina: 28, cal: 320, min: 20, porciones: 1, suave: true, ing: '1 filete merluza/tilapia, ½ coliflor, aceite de oliva, limón, perejil.', prep: 'Pescado al vapor o sartén con limón; coliflor hervida y triturada con aceite.' },
  { id: 18, nombre: 'Ensalada de atún con garbanzos', cat: 'principal', proteina: 34, cal: 380, min: 10, porciones: 1, suave: false, ing: '1 lata atún en agua, ½ taza garbanzos, tomate, cebolla morada, aceite y limón.', prep: 'Mezcla todo en un bowl. Aguanta perfecto al día siguiente.' },
  { id: 19, nombre: 'Tacos de res magra en tortilla integral', cat: 'principal', proteina: 32, cal: 440, min: 20, porciones: 2, suave: false, ing: '200 g res magra molida, 4 tortillas integrales, lechuga, pico de gallo.', prep: 'Cocina la carne con especias suaves; sirve en tortillas con lechuga y pico de gallo.' },
  { id: 20, nombre: 'Pollo en caldo con verduras y arroz', cat: 'principal', proteina: 26, cal: 360, min: 25, porciones: 2, suave: true, ing: '1 pechuga en cubos, zanahoria, calabacín, ½ taza arroz, caldo bajo en sodio.', prep: 'Cocina todo junto hasta que el arroz esté listo. Hidrata y alimenta en días difíciles.' },
  { id: 21, nombre: 'Tofu salteado con verduras y sésamo', cat: 'principal', proteina: 22, cal: 340, min: 15, porciones: 1, suave: false, ing: '150 g tofu firme, brócoli, pimiento, zanahoria, soya baja en sodio, sésamo.', prep: 'Dora el tofu en cubos, añade verduras y saltea 5 min.' },
  { id: 22, nombre: 'Crema de calabaza con pollo desmenuzado', cat: 'principal', proteina: 26, cal: 300, min: 25, porciones: 2, suave: true, ing: '½ calabaza, 1 pechuga cocida, cebolla, caldo, un toque de jengibre.', prep: 'Cocina y licúa la calabaza con el caldo; incorpora el pollo al servir.' },
  { id: 23, nombre: 'Wrap integral de pavo y vegetales', cat: 'principal', proteina: 24, cal: 380, min: 8, porciones: 1, suave: false, ing: '1 tortilla integral, 80 g pavo en fetas, hojas verdes, tomate, ¼ aguacate, yogur.', prep: 'Arma, enrolla y corta a la mitad. El almuerzo portátil.' },
  { id: 24, nombre: 'Sopa minestrone con legumbres', cat: 'principal', proteina: 14, cal: 240, min: 25, porciones: 3, suave: true, ing: 'Alubias cocidas, zanahoria, apio, calabacín, tomate triturado.', prep: 'Sofríe, añade líquidos y cocina 20 min. Suma queso fresco para más proteína.' },
  { id: 25, nombre: 'Hummus con bastones de verdura', cat: 'snack', proteina: 7, cal: 180, min: 5, porciones: 1, suave: true, ing: '3 cdas hummus, pepino, zanahoria, apio.', prep: 'Fibra + proteína vegetal sin tocar la cocina.' },
  { id: 26, nombre: 'Yogur griego con miel y semillas', cat: 'snack', proteina: 18, cal: 220, min: 2, porciones: 1, suave: true, ing: '200 g yogur griego, 1 cdta miel, semillas de girasol o calabaza.', prep: 'El snack proteico más rápido que existe.' },
  { id: 27, nombre: 'Rollitos de pavo con queso y pepino', cat: 'snack', proteina: 14, cal: 160, min: 5, porciones: 1, suave: false, ing: 'Fetas de pavo, queso fresco, bastones de pepino.', prep: 'Enrolla el pavo con el queso y el pepino dentro.' },
  { id: 28, nombre: 'Puñado de almendras + 1 manzana', cat: 'snack', proteina: 6, cal: 240, min: 1, porciones: 1, suave: false, ing: '15–20 almendras, 1 manzana.', prep: 'El combo fibra + grasa saludable que corta el antojo.' },
  { id: 29, nombre: 'Batido de proteína con leche vegetal', cat: 'snack', proteina: 26, cal: 210, min: 3, porciones: 1, suave: true, ing: '1 scoop proteína, 250 ml leche vegetal, hielo.', prep: 'Tu red de seguridad proteica cuando el apetito no aparece.' },
  { id: 30, nombre: 'Huevos duros', cat: 'snack', proteina: 13, cal: 150, min: 12, porciones: 1, suave: true, ing: '2 huevos (cocina 6–8 en lote el domingo).', prep: '2 huevos = 13 g de proteína al alcance de la mano toda la semana.' },
  { id: 31, nombre: 'Queso cottage con tomates cherry', cat: 'snack', proteina: 14, cal: 150, min: 3, porciones: 1, suave: true, ing: '½ taza cottage, tomates cherry, pimienta, aceite de oliva.', prep: 'Versión salada del snack proteico.' },
  { id: 32, nombre: 'Tostadas de arroz con cottage y tomate', cat: 'snack', proteina: 12, cal: 160, min: 4, porciones: 1, suave: false, ing: '2 tostadas de arroz, queso cottage, tomate, orégano.', prep: 'Crocante por fuera, cremoso por dentro.' },
  { id: 33, nombre: 'Gelatina proteica con frutos rojos', cat: 'snack', proteina: 12, cal: 90, min: 5, porciones: 2, suave: true, ing: 'Gelatina sin azúcar, ½ scoop proteína, frutos rojos.', prep: 'Disuelve la proteína antes de refrigerar. Fría y suave para estómagos sensibles.' },
  { id: 34, nombre: 'Edamames al vapor con sal marina', cat: 'snack', proteina: 11, cal: 180, min: 6, porciones: 1, suave: false, ing: '1 taza edamames, sal marina.', prep: 'Proteína vegetal completa para picar sin culpa.' },
  { id: 35, nombre: 'Manzana asada con canela y yogur', cat: 'snack', proteina: 10, cal: 190, min: 8, porciones: 1, suave: true, ing: '1 manzana, canela, 100 g yogur griego.', prep: 'Hornea o microondea la manzana en gajos; sirve tibia con el yogur.' },
  // ---- 10 recetas bonus exclusivas del app ----
  { id: 36, nombre: 'Huevos al horno con espinacas y ricotta', cat: 'desayuno', proteina: 21, cal: 290, min: 14, porciones: 1, suave: true, exclusiva: true, ing: '2 huevos, 1 taza espinacas, 2 cdas ricotta, aceite de oliva.', prep: 'En un molde pequeño: espinacas, ricotta y los huevos encima. Hornea 10–12 min a 180 °C hasta que la clara cuaje.' },
  { id: 37, nombre: 'Tortitas de cottage y avena', cat: 'desayuno', proteina: 26, cal: 300, min: 12, porciones: 2, suave: false, exclusiva: true, ing: '½ taza cottage, 2 huevos, ½ taza avena, vainilla, canela.', prep: 'Licúa todo y cocina tortitas pequeñas a fuego medio, 2 min por lado. Van bien con frutos rojos.' },
  { id: 38, nombre: 'Vaso de kéfir con plátano y linaza', cat: 'desayuno', proteina: 14, cal: 220, min: 3, porciones: 1, suave: true, exclusiva: true, ing: '250 ml kéfir natural, ½ plátano, 1 cda linaza molida.', prep: 'Mezcla y listo. Los fermentados del kéfir ayudan a la digestión lenta del GLP-1.' },
  { id: 39, nombre: 'Albóndigas de pavo con puré de calabaza', cat: 'principal', proteina: 34, cal: 420, min: 30, porciones: 2, suave: true, exclusiva: true, ing: '250 g pavo molido, 1 huevo, 2 cdas avena, ½ calabaza, aceite de oliva.', prep: 'Forma albóndigas y hornéalas 20 min a 200 °C. Sirve sobre el puré de calabaza con un hilo de oliva.' },
  { id: 40, nombre: 'Estofado suave de res con verduras', cat: 'principal', proteina: 30, cal: 380, min: 35, porciones: 3, suave: true, exclusiva: true, ing: '300 g res magra en cubos, zanahoria, papa, apio, caldo bajo en sodio.', prep: 'Sella la carne, añade verduras y caldo, cocina tapado 30 min a fuego bajo. Congela en porciones.' },
  { id: 41, nombre: 'Pasta integral con atún y tomate', cat: 'principal', proteina: 28, cal: 450, min: 15, porciones: 1, suave: false, exclusiva: true, ing: '60 g pasta integral, 1 lata atún en agua, tomate triturado, ajo, orégano.', prep: 'Cocina la pasta; saltea el tomate con ajo, integra el atún y mezcla todo.' },
  { id: 42, nombre: 'Crema de brócoli con cottage', cat: 'principal', proteina: 18, cal: 210, min: 20, porciones: 2, suave: true, exclusiva: true, ing: '1 brócoli, ½ taza cottage, cebolla, caldo de verduras.', prep: 'Cocina el brócoli con la cebolla en el caldo, licúa con el cottage y sirve tibia.' },
  { id: 43, nombre: 'Rollitos de jamón de pavo con queso', cat: 'snack', proteina: 12, cal: 150, min: 2, porciones: 1, suave: true, exclusiva: true, ing: '3 fetas jamón de pavo, 2 bastones de queso bajo en grasa.', prep: 'Enrolla y listo. Proteína inmediata sin cocinar.' },
  { id: 44, nombre: 'Batido de cacao y proteína', cat: 'snack', proteina: 25, cal: 240, min: 3, porciones: 1, suave: true, exclusiva: true, ing: '1 scoop proteína chocolate, 250 ml leche, 1 cdta cacao puro, hielo.', prep: 'Licúa todo. Sabe a postre, alimenta como una comida.' },
  { id: 45, nombre: 'Tostada de ricotta con fresas', cat: 'snack', proteina: 11, cal: 240, min: 4, porciones: 1, suave: true, exclusiva: true, ing: '1 pan integral, 3 cdas ricotta, fresas laminadas, miel opcional.', prep: 'Unta la ricotta, cubre con fresas y un toque de miel si quieres.' },
];

// ---- Módulo 3: Lista de Supermercado Inteligente ----
export type CategoriaSuper = { categoria: string; items: string[] };

export const LISTA_SUPER: CategoriaSuper[] = [
  { categoria: 'Proteínas', items: ['Pechuga de pollo o pavo', 'Huevos (compra de a docena)', 'Pescado blanco (merluza, tilapia)', 'Salmón', 'Atún en agua (latas)', 'Res magra', 'Tofu firme', 'Legumbres (lentejas, garbanzos, alubias)', 'Proteína en polvo (whey o vegetal)'] },
  { categoria: 'Lácteos y huevos', items: ['Yogur griego natural sin azúcar', 'Queso cottage', 'Ricotta', 'Queso fresco bajo en grasa', 'Kéfir natural', 'Leche o bebida vegetal sin azúcar'] },
  { categoria: 'Verduras', items: ['Hojas verdes (espinaca, lechuga, rúcula)', 'Brócoli y coliflor', 'Zanahoria', 'Calabacín', 'Calabaza', 'Tomate', 'Pepino', 'Champiñones', 'Pimiento', 'Apio y cebolla'] },
  { categoria: 'Frutas', items: ['Frutos rojos (frescos o congelados)', 'Plátano', 'Manzana', 'Pera o durazno', 'Limón', 'Aguacate'] },
  { categoria: 'Carbohidratos de calidad', items: ['Avena', 'Arroz integral', 'Quinoa', 'Batata', 'Pan integral', 'Tortillas integrales', 'Pasta integral', 'Tostadas de arroz'] },
  { categoria: 'Grasas saludables', items: ['Aceite de oliva extra virgen', 'Frutos secos (almendras, nueces)', 'Semillas (chía, linaza, calabaza)', 'Mantequilla de maní natural'] },
  { categoria: 'Despensa y alivio digestivo', items: ['Caldo bajo en sodio', 'Jengibre fresco o en infusión', 'Menta en infusión', 'Canela', 'Especias suaves (orégano, comino)', 'Gelatina sin azúcar', 'Miel (uso ocasional)'] },
];

export const ALIMENTOS_EVITAR: { nombre: string; razon: string }[] = [
  { nombre: 'Frituras y comida rápida', razon: 'La grasa retrasa aún más el vaciado gástrico: es el disparador #1 de náuseas con GLP-1.' },
  { nombre: 'Bebidas gaseosas (incluso light)', razon: 'El gas distiende un estómago que ya vacía lento — provoca pesadez, reflujo y eructos.' },
  { nombre: 'Alcohol', razon: 'Irrita el estómago, aporta calorías vacías y potencia el mareo. Especialmente riesgoso el día de la dosis.' },
  { nombre: 'Embutidos grasos y carnes procesadas', razon: 'Grasa + sodio: digestión pesada y retención de líquidos que enmascara tu progreso real.' },
  { nombre: 'Salsas cremosas y quesos muy grasos', razon: 'Pequeñas cantidades concentran mucha grasa: malestar desproporcionado a lo que comiste.' },
  { nombre: 'Picantes intensos', razon: 'Con el vaciado lento, el picante permanece más tiempo en el estómago: acidez y reflujo.' },
  { nombre: 'Bollería, dulces y azúcar líquida', razon: 'Pico de glucosa sin saciedad: desplazan la proteína que tu músculo necesita.' },
  { nombre: 'Porciones grandes (de lo que sea)', razon: 'Con GLP-1 el estómago procesa lento: media porción ahora vale más que una entera con malestar.' },
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
  {
    titulo: 'Comer fuera de casa y eventos sociales',
    texto: 'Restaurante: elige proteína a la plancha o al horno + verduras; pide las salsas aparte; media porción o pide para llevar desde el inicio. Eventos: come tu proteína antes de salir para llegar sin hambre voraz; ten una bebida sin gas en la mano (agua con limón funciona); nadie nota lo que no comes. Si te preguntan, "estoy cuidando mi digestión" cierra el tema sin dar explicaciones.',
  },
  {
    titulo: 'Estreñimiento y digestión lenta',
    texto: 'El GLP-1 enlentece todo el tránsito — el estreñimiento es el efecto secundario más subestimado. Protocolo: 25–30 g de fibra al día (avena, legumbres, verduras, chía) + 2 L de agua (la fibra sin agua empeora el problema) + caminata de 15–20 min después de comer + kiwi o ciruela por la mañana. Si pasan más de 4 días sin evacuar o hay dolor, consulta a tu médico — no te automediques con laxantes de forma habitual.',
  },
  {
    titulo: 'Suplementos: cuáles valen la pena',
    texto: 'Con apetito reducido es difícil cubrir todo con comida. Los que suelen valer: proteína en polvo (la herramienta #1 en días de poco apetito), fibra en polvo si no llegas a 25 g, y un multivitamínico simple como red de seguridad. Consulta con tu médico antes de sumar cualquiera — especialmente vitamina D y B12, que se miden en sangre. Lo que NO necesitas: quemadores de grasa, detox, colágeno "adelgazante". Con GLP-1, el medicamento ya hace ese trabajo.',
  },
  {
    titulo: 'Preguntas frecuentes',
    texto: '"¿Puedo tomar café?" — Sí, con el estómago no vacío; en días sensibles cámbialo por descafeinado o infusión. · "¿Se me cae el pelo?" — La pérdida rápida de peso puede causarlo temporalmente; la proteína suficiente es tu mejor prevención. · "¿Qué hago si vomité?" — Hidrata con sorbos pequeños, vuelve a alimentos blandos y registra el episodio; si se repite, habla con tu médico sobre la dosis. · "¿Puedo saltarme comidas si no tengo hambre?" — Evítalo: comidas pequeñas mantienen el músculo y evitan el bajón de energía. La proteína no es opcional aunque el hambre no aparezca.',
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
      { nombre: 'Puente de glúteos', seg: 40, nota: 'Boca arriba, eleva la cadera apretando glúteos 2 segundos arriba.' },
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
      { nombre: 'Press de hombros en la silla', seg: 40, nota: 'Botellas desde los hombros hacia arriba, sin arquear la espalda.' },
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
      { nombre: 'Patada de glúteo de pie', seg: 40, nota: 'Con apoyo en la silla, lleva el talón hacia atrás. Alterna.' },
      { nombre: 'Elevación de talones', seg: 40, nota: 'Termina sintiendo las pantorrillas despiertas.' },
    ],
  },
];

// ---- Área de medicamentos (información educativa, no sustituye a tu médico) ----
export type MedicamentoId = 'mounjaro' | 'zepbound' | 'ozempic' | 'wegovy' | 'rybelsus';
export type Medicamento = {
  id: MedicamentoId;
  nombre: string;
  principio: string; // principio activo
  via: 'inyeccion' | 'oral';
  frecuencia: string; // ej. "1 vez por semana"
  aprobado: string;
  aplicar: string[];
  efectosComunes: string[];
  efectosAlerta: string[]; // señales para contactar al médico
  alimentacion: string[];
  faq: { q: string; a: string }[];
};

// Alimentación base compartida (misma fisiología en todos): evita repetir y mantiene consistencia.
const ALIM_BASE = [
  'Prioriza la proteína en cada comida (huevo, yogur griego, pollo, pescado, legumbres): protege tu músculo.',
  'Porciones pequeñas y frecuentes; come despacio y detente al primer signo de saciedad.',
  'Evita frituras, comidas muy grasosas, alcohol y bebidas con gas: son los que más náuseas provocan.',
  'Hidrátate (unos 8 vasos al día) y suma fibra (verduras, avena, chía) para prevenir el estreñimiento.',
];

const SEMAGLUTIDA_FAQ = (semanal: boolean): { q: string; a: string }[] => [
  semanal
    ? { q: '¿Olvidé mi dosis, qué hago?', a: 'Si faltan 48 horas o más para la siguiente, aplícala en cuanto lo recuerdes. Si falta menos, sáltala y sigue tu día habitual. Nunca apliques dos dosis juntas. Ante la duda, consulta a tu médico o farmacéutico.' }
    : { q: '¿Olvidé mi pastilla, qué hago?', a: 'Sáltala por completo y toma la siguiente al día siguiente a la hora de siempre. No tomes dos el mismo día. Consulta a tu médico si te pasa seguido.' },
  { q: '¿Puedo tomar alcohol?', a: 'Con moderación y nunca en ayunas: irrita el estómago, aporta calorías vacías y puede bajar tu glucosa. El día de la dosis, mejor evítalo.' },
  { q: '¿Es para diabetes o para adelgazar?', a: 'La semaglutida se usa en diabetes tipo 2 y, en otras presentaciones/dosis, en control de peso. Quién la indica y para qué es siempre decisión de tu médico.' },
  { q: '¿Cuándo empieza a hacer efecto?', a: 'El apetito suele bajar en las primeras semanas, pero el efecto pleno llega con el escalado de dosis a lo largo de las semanas. La constancia importa más que la rapidez.' },
];

const TIRZEPATIDA_FAQ: { q: string; a: string }[] = [
  { q: '¿Olvidé mi dosis, qué hago?', a: 'Puedes aplicarla dentro de los 4 días (96 horas) siguientes al día previsto. Si pasó más tiempo, sáltala y continúa con tu día habitual. Nunca apliques dos dosis juntas. Ante la duda, consulta a tu médico.' },
  { q: '¿En qué se diferencia de la semaglutida?', a: 'La tirzepatida actúa sobre dos hormonas (GIP y GLP-1) en lugar de una. Para tu alimentación, las recomendaciones son prácticamente las mismas.' },
  { q: '¿Puedo tomar alcohol?', a: 'Con moderación y nunca en ayunas: irrita el estómago y puede alterar la glucosa. El día de la dosis, mejor evítalo.' },
  { q: '¿Cuándo empieza a hacer efecto?', a: 'El apetito baja en las primeras semanas; el efecto pleno llega con el escalado de dosis. No aumentes por tu cuenta.' },
];

const APLICAR_INYECCION = [
  'Una inyección subcutánea 1 vez por semana, el mismo día. Puedes cambiar el día si han pasado al menos 48 h desde la última dosis.',
  'Zonas: abdomen, muslo o parte superior del brazo. Rota el sitio cada semana para cuidar la piel.',
  'Puede aplicarse a cualquier hora, con o sin comida.',
  'Guarda las plumas sin abrir en el refrigerador (2–8 °C), sin congelar. Sigue las indicaciones del prospecto para la pluma en uso.',
  'La dosis sube de forma gradual (escalado) según tu médico. Nunca aumentes ni ajustes la dosis por tu cuenta.',
];

const ALERTA_COMUN = [
  'Dolor abdominal intenso y persistente, que puede irradiarse a la espalda (posible pancreatitis).',
  'Vómitos o diarrea que no ceden, con signos de deshidratación (mareo, boca seca, orinar poco).',
  'Reacción alérgica: hinchazón de cara/labios, dificultad para respirar o sarpullido.',
  'Un bulto o dolor en el cuello, ronquera o dificultad para tragar.',
  'Cambios bruscos en la visión, o síntomas de azúcar muy baja si usas otros fármacos para la diabetes.',
];

export const MEDICAMENTOS: Medicamento[] = [
  {
    id: 'mounjaro', nombre: 'Mounjaro', principio: 'Tirzepatida', via: 'inyeccion', frecuencia: '1 vez por semana',
    aprobado: 'Aprobado para diabetes tipo 2. Doble acción (GIP + GLP-1).',
    aplicar: APLICAR_INYECCION,
    efectosComunes: ['Náuseas, especialmente al subir de dosis', 'Diarrea o estreñimiento', 'Vómitos y dolor abdominal', 'Menos apetito y digestión más lenta', 'Suelen mejorar a medida que tu cuerpo se adapta'],
    efectosAlerta: ALERTA_COMUN,
    alimentacion: ALIM_BASE,
    faq: TIRZEPATIDA_FAQ,
  },
  {
    id: 'zepbound', nombre: 'Zepbound', principio: 'Tirzepatida', via: 'inyeccion', frecuencia: '1 vez por semana',
    aprobado: 'Mismo principio activo que Mounjaro (tirzepatida), en la presentación enfocada en el control de peso crónico.',
    aplicar: APLICAR_INYECCION,
    efectosComunes: ['Náuseas, sobre todo al inicio y al subir dosis', 'Diarrea o estreñimiento', 'Vómitos, eructos y reflujo', 'Cansancio y menos apetito', 'Suelen disminuir con las semanas'],
    efectosAlerta: ALERTA_COMUN,
    alimentacion: ALIM_BASE,
    faq: TIRZEPATIDA_FAQ,
  },
  {
    id: 'ozempic', nombre: 'Ozempic', principio: 'Semaglutida', via: 'inyeccion', frecuencia: '1 vez por semana',
    aprobado: 'Aprobado para diabetes tipo 2. La pérdida de peso es un efecto asociado.',
    aplicar: APLICAR_INYECCION,
    efectosComunes: ['Náuseas (el más frecuente)', 'Diarrea o estreñimiento', 'Vómitos y dolor abdominal', 'Eructos y reflujo', 'Menos apetito; mejoran con el tiempo'],
    efectosAlerta: ALERTA_COMUN,
    alimentacion: ALIM_BASE,
    faq: SEMAGLUTIDA_FAQ(true),
  },
  {
    id: 'wegovy', nombre: 'Wegovy', principio: 'Semaglutida', via: 'inyeccion', frecuencia: '1 vez por semana',
    aprobado: 'Mismo principio activo que Ozempic (semaglutida), en la presentación enfocada en el control de peso crónico (dosis objetivo más altas).',
    aplicar: APLICAR_INYECCION,
    efectosComunes: ['Náuseas, sobre todo al subir de dosis', 'Diarrea o estreñimiento', 'Vómitos y dolor abdominal', 'Dolor de cabeza y cansancio', 'Menos apetito; suelen mejorar con las semanas'],
    efectosAlerta: ALERTA_COMUN,
    alimentacion: ALIM_BASE,
    faq: SEMAGLUTIDA_FAQ(true),
  },
  {
    id: 'rybelsus', nombre: 'Rybelsus', principio: 'Semaglutida (oral)', via: 'oral', frecuencia: '1 comprimido al día',
    aprobado: 'Aprobado para diabetes tipo 2. Es la semaglutida en pastilla — no se inyecta.',
    aplicar: [
      'Un comprimido por vía oral todos los días, a la misma hora (idealmente al despertar).',
      'En ayunas: tómalo con un sorbo de agua (máximo media taza, ~120 ml).',
      'Espera al menos 30 minutos antes de comer, beber otra cosa o tomar otros medicamentos.',
      'Tragar el comprimido entero: no lo partas, mastiques ni tritures.',
      'La dosis sube de forma gradual según tu médico. No la ajustes por tu cuenta.',
    ],
    efectosComunes: ['Náuseas, sobre todo al inicio', 'Diarrea o estreñimiento', 'Vómitos y dolor abdominal', 'Menos apetito y digestión más lenta', 'Suelen disminuir con las semanas'],
    efectosAlerta: ALERTA_COMUN,
    alimentacion: [
      'Respeta la ventana en ayunas: la absorción de Rybelsus baja mucho si hay comida o demasiada agua.',
      ...ALIM_BASE,
    ],
    faq: SEMAGLUTIDA_FAQ(false),
  },
];
