/* =====================================================================
   JEROME · DATOS EDITABLES DE LA WEB
   ---------------------------------------------------------------------
   Este es el único archivo que necesitás tocar para cambiar textos,
   teléfono, cócteles, sesiones de DJ y fotos de la galería.

   REGLAS DE ORO (para no romper nada):
   1. Cambiá solo lo que está ENTRE COMILLAS "así".
   2. No borres las comas del final de cada línea.
   3. Si un texto lleva comillas dentro, usá comillas simples: 'así'.
   4. Guardá el archivo y recargá la web con Ctrl + F5.
   ===================================================================== */
(function () {
  'use strict';

  window.__JEROME__ = {

    /* ------------------------------------------------------------
       1. DATOS DEL BAR
       ------------------------------------------------------------ */
    brand: {
      name: "Jerome",
      slogan: "El mejor lugar para compartir momentos.",
      tagline: "Donde la noche baja la voz.",
      address: "Malabia 1401",
      city: "Palermo · CABA",
      // Lo que se busca en Google Maps para el mapa del pie de página
      mapQuery: "Malabia 1401, Palermo, Buenos Aires, Argentina",
      // Texto de "Cómo llegar" del pie de página
      directions: "En pleno Palermo. Llegás en subte (línea D), en colectivo o caminando desde Palermo Soho.",
      // Teléfono tal cual se ve en la web
      phoneDisplay: "11 6472-3635",
      // Teléfono para llamar: con +54 y sin espacios
      phoneLink: "+541164723635",
      // WhatsApp: código de país + número, SIN "+", SIN espacios.
      // En Argentina los celulares llevan 549 delante (549 + 11 + número).
      whatsapp: "5491164723635",
      instagram: "ejemplo",              // sin la @
      hours: "Miércoles a domingo · 19:00 → 02:30",
      hoursShort: "MIÉ → DOM · 19:00 → 02:30",
      capacity: "60 personas",
      established: "2024",
      // Días que abre: 0 = domingo, 1 = lunes, ... 6 = sábado
      openDays: [3, 4, 5, 6, 0]
    },

    /* ------------------------------------------------------------
       2. CARTA DE CÓCTELES
       ------------------------------------------------------------
       series:  "Casa" o "Temporada"
       glass:   forma del dibujo de la copa. Opciones:
                coupe, highball, martini, old_fashioned, rocks,
                wine, flute, mug, snifter, hurricane
       liquid:  color del trago dentro del dibujo (#RRGGBB)
       accent:  color de brillo de la tarjeta (#RRGGBB)
       Para añadir una copa: copiá un bloque { ... }, pegalo debajo
       y cambiá los textos. Para quitarla: borrá el bloque entero.
       ------------------------------------------------------------ */
    cocktails: [
      {
        name: "Penumbra",
        series: "Casa",
        glass: "coupe",
        subtitle: "La copa de la casa",
        ingredients: ["Mezcal ahumado", "Vermut oscuro", "Toque de café"],
        description: "Ahumado, amargo y largo. Un sorbo lento para empezar la noche en su tono justo. Copa coupe sobre hielo de mano.",
        liquid: "#7a2a1c",
        accent: "#FF3D8B"
      },
      {
        name: "Neón",
        series: "Casa",
        glass: "highball",
        subtitle: "Gin tonic de autor",
        ingredients: ["Ginebra cítrica", "Tónica seca", "Piel de pomelo"],
        description: "Burbuja viva, cítrico afilado y un brillo que recuerda al letrero de la entrada. Highball alto, hielo limpio.",
        liquid: "#3DE2FF",
        accent: "#3DE2FF"
      },
      {
        name: "Medianoche",
        series: "Casa",
        glass: "martini",
        subtitle: "Espresso martini",
        ingredients: ["Espresso reciente", "Vodka", "Licor de café"],
        description: "Café recién hecho y vodka helado, batido hasta dejar la espuma del color del cobre. Para la hora en que la pista calienta.",
        liquid: "#1c0e08",
        accent: "#C9A35B"
      },
      {
        name: "Brasa",
        series: "Casa",
        glass: "old_fashioned",
        subtitle: "Negroni con tequila",
        ingredients: ["Tequila reposado", "Campari", "Vermut rojo"],
        description: "Negroni reescrito con el ahumado del tequila reposado. Old fashioned, hielo macizo, piel de naranja quemada al pase.",
        liquid: "#b73422",
        accent: "#FF3D8B"
      },
      {
        name: "Vermut Negro",
        series: "Temporada",
        glass: "rocks",
        subtitle: "Vermut largo de la casa",
        ingredients: ["Vermut casa", "Naranja confitada", "Hielo macizo"],
        description: "Vermut servido sobre hielo de mano, con una naranja confitada en la propia barra. Pensado para los que entran y aún no piden.",
        liquid: "#3a1a0e",
        accent: "#C9A35B"
      },
      {
        name: "Sereno",
        series: "Temporada",
        glass: "wine",
        subtitle: "Spritz oscuro",
        ingredients: ["Aperol", "Cava seco", "Soda"],
        description: "Spritz reescrito en clave nocturna. Aperol, cava seco y soda fría. Para empezar sin pesar.",
        liquid: "#cc4a26",
        accent: "#FF3D8B"
      },
      {
        name: "Aurora",
        series: "Temporada",
        glass: "flute",
        subtitle: "French 75 con vermut",
        ingredients: ["Cava brut", "Ginebra", "Limón"],
        description: "Cava, ginebra y un toque de vermut blanco. Sube rápido, baja despacio.",
        liquid: "#e8c780",
        accent: "#C9A35B"
      },
      {
        name: "Última Hora",
        series: "Temporada",
        glass: "mug",
        subtitle: "Café final de noche",
        ingredients: ["Espresso", "Ron añejo", "Crema"],
        description: "Para los que se quedan al cierre. Espresso, ron añejo y una nube de crema. Servido en taza pequeña.",
        liquid: "#1a0d05",
        accent: "#C9A35B"
      },
      {
        name: "Veneno",
        series: "Temporada",
        glass: "snifter",
        subtitle: "Pisco sour de la casa",
        ingredients: ["Pisco", "Limón", "Cardamomo"],
        description: "Pisco peruano, limón y un golpe de cardamomo verde. Suave en boca, largo en cabeza.",
        liquid: "#d8c272",
        accent: "#3DE2FF"
      },
      {
        name: "Vértigo",
        series: "Temporada",
        glass: "hurricane",
        subtitle: "Mai tai oscuro",
        ingredients: ["Ron añejo", "Curaçao seco", "Lima"],
        description: "Mai tai reescrito con ron añejo y curaçao seco. La copa que se pide cuando ya hay confianza.",
        liquid: "#a8341a",
        accent: "#FF3D8B"
      }
    ],

    /* ------------------------------------------------------------
       3. MÚSICA · SESIONES DE DJ
       ------------------------------------------------------------
       icon: vinyl, house, disco o wave
       ------------------------------------------------------------ */
    sessions: [
      { day: "Jueves",  genre: "Soul & Funk",              note: "Vinilo entero, sin prisa.",            icon: "vinyl", accent: "#C9A35B" },
      { day: "Viernes", genre: "House",                    note: "Selección de la casa.",                icon: "house", accent: "#FF3D8B" },
      { day: "Sábado",  genre: "Disco & Nu-Disco",         note: "Pista llena, pies sueltos.",           icon: "disco", accent: "#3DE2FF" },
      { day: "Domingo", genre: "Jazz & Electrónica suave", note: "Sesión lenta para cerrar la semana.",  icon: "wave",  accent: "#C9A35B" }
    ],

    /* ------------------------------------------------------------
       4. GALERÍA
       ------------------------------------------------------------
       src: ruta de la foto dentro de assets/img/
       alt: descripción corta (la leen los buscadores y lectores de pantalla)
       tag: etiqueta pequeña que aparece sobre la foto
       Las fotos se reparten solas en 3 carriles.
       ------------------------------------------------------------ */
    gallery: [
      { src: "assets/img/gal-01.webp", alt: "Luces doradas desenfocadas en la barra",       tag: "Luz baja" },
      { src: "assets/img/gal-02.webp", alt: "Letrero de neón rosa con forma de copa",       tag: "Neón" },
      { src: "assets/img/gal-03.webp", alt: "Tubos de neón cian y rosa ondulados",          tag: "Neón" },
      { src: "assets/img/gal-04.webp", alt: "Humo de colores sobre fondo oscuro",           tag: "Humo" },
      { src: "assets/img/gal-05.webp", alt: "Burbujas en un trago ámbar",                   tag: "Burbuja" },
      { src: "assets/img/gal-06.webp", alt: "Hielo de mano a contraluz",                    tag: "Hielo" },
      { src: "assets/img/gal-07.webp", alt: "Copa coupe con trago rojo sobre la barra",     tag: "Cristal" },
      { src: "assets/img/gal-08.webp", alt: "Lámparas colgantes de luz cálida",             tag: "Luz baja" },
      { src: "assets/img/gal-09.webp", alt: "Botellas retroiluminadas en la contrabarra",   tag: "Barra" },
      { src: "assets/img/gal-10.webp", alt: "Rodaja de naranja a contraluz",                tag: "Cítrico" },
      { src: "assets/img/gal-11.webp", alt: "Humo dorado en espiral",                       tag: "Humo" },
      { src: "assets/img/gal-12.webp", alt: "Bokeh rosa y cian de la pista",                tag: "Pista" },
      { src: "assets/img/gal-13.webp", alt: "Reflejos sobre la barra de latón",             tag: "Latón" },
      { src: "assets/img/gal-14.webp", alt: "Burbujas finas de cava",                       tag: "Burbuja" },
      { src: "assets/img/gal-15.webp", alt: "Flecha de neón rosa en la pared de ladrillo",  tag: "Neón" },
      { src: "assets/img/gal-16.webp", alt: "Hielo macizo dentro de un trago ámbar",        tag: "Hielo" }
    ]
  };
})();
