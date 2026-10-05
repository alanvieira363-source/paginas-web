# Web de Jerome · Guía para el dueño

Esta carpeta es tu web completa. No necesita programas especiales, ni instalar nada, ni “compilar” nada.
Todo se edita con el **Bloc de notas** (Windows) o **TextEdit** (Mac).

---

## 1. Ver la web en tu computadora

1. Abrí la carpeta `paginas-web` (o como la hayas llamado).
2. Hacé **doble clic en `index.html`**.
3. Se abre en tu navegador. Listo: así se verá en internet.

> El mapa y las tipografías necesitan conexión a internet. Todo lo demás funciona sin conexión.

---

## 2. Qué hay en la carpeta

| Archivo / carpeta     | Para qué sirve                                                   | ¿Lo tocás? |
|-----------------------|------------------------------------------------------------------|-----------|
| `lib/manifest.js`     | **Tus datos**: teléfono, dirección, cócteles, DJ, fotos de galería | **Sí**    |
| `assets/img/`         | Las fotos de la web                                              | **Sí**    |
| `index.html`          | La página (textos de cada sección)                               | A veces   |
| `styles.css`          | Colores y diseño                                                 | No hace falta |
| `main.js`             | Animaciones y funcionamiento                                     | No        |
| `lib/gsap.min.js`, `lib/ScrollTrigger.min.js` | Librerías de animación                   | No        |
| `assets/credits.json` | Créditos de las imágenes                                         | Si cambiás fotos |
| `.htaccess`           | Ajustes del servidor de Hostinger (puede estar oculto)           | No        |

---

## 3. Subir la web a Hostinger

1. Entrá a **hPanel** de Hostinger → **Sitios web** → tu dominio → **Administrador de archivos** (File Manager).
2. Abrí la carpeta **`public_html`**.
3. Si hay un `index.html` o `default.php` de ejemplo de Hostinger, borralo.
4. **Arrastrá todo el contenido de esta carpeta** dentro de `public_html`:
   `index.html`, `styles.css`, `main.js`, `.htaccess`, la carpeta `lib` y la carpeta `assets`.
   - Importante: tiene que quedar `public_html/index.html`, **no** `public_html/paginas-web/index.html`.
   - El archivo `.htaccess` empieza con punto y en algunos equipos está **oculto**. En Windows: Explorador → Vista → marcar “Elementos ocultos”. En Mac: `Cmd + Shift + .`
5. Entrá a tu dominio. ¡Ya está online!

Para activar el candado (https): hPanel → **Seguridad → SSL** → activar y marcar “Forzar HTTPS”.

---

## 4. Cambiar tus datos (teléfono, dirección, Instagram…)

Abrí **`lib/manifest.js`** con el Bloc de notas (clic derecho → *Abrir con* → *Bloc de notas*).

Al principio verás el bloque `brand:`. Cambiá solo lo que está **entre comillas**:

```js
address: "Malabia 1401",
phoneDisplay: "11 6472-3635",      // cómo se ve el número
phoneLink: "+541164723635",        // para llamar: con +54 y sin espacios
whatsapp: "5491164723635",         // WhatsApp: 549 + número, sin + ni espacios
instagram: "ejemplo",              // sin la @
```

**Reglas de oro**
- No borres las comillas `" "` ni las comas `,` del final de cada línea.
- Si un texto lleva comillas dentro, usá comillas simples: `'así'`.
- Guardá (Ctrl + S) y recargá la web con **Ctrl + F5**.

---

## 5. Cambiar el número de WhatsApp (paso a paso)

El número aparece en dos sitios. Hacé los dos:

1. **`lib/manifest.js`** → cambiá `whatsapp: "5491164723635"` (y también `phoneDisplay` y `phoneLink` si cambia el teléfono).
2. **`index.html`** → abrilo con el Bloc de notas, pulsá **Ctrl + H** (Reemplazar):
   - Buscar: `5491164723635` → Reemplazar por tu número nuevo → **Reemplazar todo**.
   - Si cambia también el teléfono normal: buscar `541164723635` y `11 6472-3635` y reemplazarlos igual.

¿Por qué en los dos? `index.html` es la “copia de seguridad”: si por algún motivo las animaciones no cargan, la web sigue mostrando los datos correctos.

---

## 6. Cambiar la carta de cócteles

En `lib/manifest.js`, buscá `cocktails: [`. Cada cóctel es un bloque así:

```js
{
  name: "Penumbra",
  series: "Casa",                    // "Casa" o "Temporada"
  glass: "coupe",                    // forma del dibujo de la copa
  subtitle: "La copa de la casa",
  ingredients: ["Mezcal ahumado", "Vermut oscuro", "Toque de café"],
  description: "Ahumado, amargo y largo…",
  liquid: "#7a2a1c",                 // color del trago en el dibujo
  accent: "#FF3D8B"                  // color del brillo de la tarjeta
},
```

- **Cambiar un cóctel:** editá los textos.
- **Añadir uno:** copiá un bloque entero (desde `{` hasta `},`), pegalo debajo y cambiá los textos.
- **Quitar uno:** borrá su bloque entero (con su `{ … },`).
- **Formas de copa disponibles:** `coupe`, `highball`, `martini`, `old_fashioned`, `rocks`, `wine`, `flute`, `mug`, `snifter`, `hurricane`.
  Cada copa se dibuja sola en 3D, gira y se llena con el color de `liquid`.
- **Colores de la marca:** rosa `#FF3D8B`, cian `#3DE2FF`, dorado `#C9A35B`.

> El título de la sección dice “Diez copas”. Si cambiás la cantidad, editá ese texto en `index.html` (buscá `Diez copas`).

---

## 7. Cambiar las sesiones de DJ

En `lib/manifest.js`, buscá `sessions: [`:

```js
{ day: "Jueves", genre: "Soul & Funk", note: "Vinilo entero, sin prisa.", icon: "vinyl", accent: "#C9A35B" },
```

`icon` puede ser: `vinyl` (vinilo), `house` (casita con ecualizador), `disco` (bola de espejos) o `wave` (ondas).
La web marca sola con **“Esta noche”** la sesión del día (hora de Buenos Aires).

---

## 8. Cambiar las fotos

Las imágenes actuales son **ilustraciones provisionales**: hay que sustituirlas por fotos reales del bar.

**La forma más fácil:** poné tu foto en `assets/img/` **con exactamente el mismo nombre** que la que querés reemplazar (borrá la vieja primero).

| Archivo                   | Dónde aparece                         | Formato ideal |
|---------------------------|---------------------------------------|---------------|
| `hero.webp`               | Portada (foto grande de fondo)        | Horizontal, 2000 × 1300 px |
| `local-1/2/3.webp`        | Collage de “El local”                 | Vertical, 900 × 1200 px |
| `privado.webp`            | Eventos privados                      | Horizontal, 1800 × 1100 px |
| `gal-01` … `gal-16.webp`  | Galería (las 3 tiras que se mueven)   | Cualquiera, ~1000 px de lado |

- **Las fotos del móvil suelen ser `.jpg`.** Podés:
  - convertirlas a `.webp` gratis en <https://squoosh.app> (arrastrás la foto → elegís *WebP* → descargar), **o**
  - usar la `.jpg` tal cual y cambiar el nombre en el archivo que la usa:
    - galería → `lib/manifest.js` (sección `gallery`, cambiá `gal-05.webp` por `mi-foto.jpg`);
    - portada, collage y privados → `index.html` (Ctrl + H: buscá `hero.webp` y poné tu nombre de archivo).
- Para la galería también podés cambiar `alt` (descripción breve de la foto) y `tag` (etiqueta que se ve encima).
- Las fotos oscuras, con luz cálida y neón, quedan mejor con el estilo de la web.
- Al cambiar fotos, actualizá `assets/credits.json` (autor de cada foto; si son tuyas, poné “Jerome”).

---

## 9. Cambiar otros textos

Los textos largos de cada sección (la presentación de “El local”, el titular de eventos privados, etc.) están en **`index.html`**.
Abrilo con el Bloc de notas, buscá el texto con **Ctrl + F** y cambialo. **No toques nada que esté entre `<` y `>`.**

---

## 10. “Cambié algo y no se ve” (caché)

1. Recargá con **Ctrl + F5** (Mac: `Cmd + Shift + R`). En el móvil, abrí la web en una pestaña de incógnito.
2. Si cambiaste `styles.css`, `main.js` o `lib/manifest.js` y sigue sin verse en internet:
   abrí `index.html`, pulsá **Ctrl + H** y reemplazá `?v=20261005` por la fecha de hoy, por ejemplo `?v=20261120`.
   Eso le dice a todos los navegadores “hay versión nueva”. Guardá y volvé a subir `index.html`.
3. Comprobá que subiste el archivo a `public_html` (y no a otra carpeta).

---

## 11. Si algo se rompe

- Lo más habitual: falta una coma o unas comillas en `lib/manifest.js`. Compará con el ejemplo de esta guía.
- **Antes de editar, hacé una copia** del archivo (`manifest-copia.js`). Si algo sale mal, volvés a la copia.
- Aunque `manifest.js` tenga un error, la web **sigue funcionando** con los datos de `index.html`; solo se pierden los cambios nuevos.

---

## Para revisar antes de publicar

- [ ] Instagram: ahora pone `@ejemplo`. Cambialo en `lib/manifest.js` y en `index.html` (Ctrl + H, buscá `ejemplo`).
- [ ] Texto de “Cómo llegar” (`directions` en `lib/manifest.js`): confirmá transporte y referencias.
- [ ] Fotos reales en `assets/img/`.
- [ ] Probá el formulario de reserva desde tu móvil: debe abrir WhatsApp con la reserva escrita.
