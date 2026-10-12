"use strict";

/* =========================================
   CONFIGURACIÓN DE ACCESIBILIDAD
   ========================================= */

const movimientoReducido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* =========================================
   JAVASCRIPT: MENÚ RESPONSIVO
   ========================================= */

const menuBoton = document.getElementById("menu-boton");
const menu = document.getElementById("menu");

function cerrarMenu() {
  menu.classList.remove("abierto");
  menuBoton.setAttribute("aria-expanded", "false");
}

menuBoton.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");

  menuBoton.setAttribute("aria-expanded", String(abierto));
});

menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", cerrarMenu);
});

document.addEventListener("keydown", (evento) => {
  if (
    evento.key === "Escape" &&
    menu.classList.contains("abierto")
  ) {
    cerrarMenu();
    menuBoton.focus();
  }
});

/* =========================================
   JAVASCRIPT: FECHA Y HORA ACTUAL
   ========================================= */

function actualizarReloj() {
  const ahora = new Date();
  const reloj = document.getElementById("reloj");

  reloj.textContent = ahora.toLocaleString("es-MX", {
    dateStyle: "full",
    timeStyle: "medium"
  });

  reloj.dateTime = ahora.toISOString();

  document.getElementById("anio").textContent =
    ahora.getFullYear();
}

actualizarReloj();

// Se ejecuta cada 1,000 milisegundos, es decir, cada segundo.
setInterval(actualizarReloj, 1000);

/* =========================================
   JAVASCRIPT: BOTÓN IR ARRIBA
   ========================================= */

const botonArriba = document.getElementById("ir-arriba");

function actualizarBotonArriba() {
  botonArriba.hidden = window.scrollY < 350;
}

window.addEventListener("scroll", actualizarBotonArriba, {
  passive: true
});

actualizarBotonArriba();

botonArriba.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: movimientoReducido ? "auto" : "smooth"
  });
});

/* =========================================
   JAVASCRIPT: COTIZADOR
   Funcionalidad adicional del estudiante.
   ========================================= */

const arreglo = document.getElementById("arreglo");
const cantidad = document.getElementById("cantidad");
const entrega = document.getElementById("entrega");
const cotizacion = document.getElementById("cotizacion");

function calcularCotizacion() {
  const unidades = Number(cantidad.value);

  // Evita cantidades vacías, decimales o fuera del rango.
  if (
    cantidad.value.trim() === "" ||
    !Number.isInteger(unidades) ||
    unidades < 1 ||
    unidades > 20
  ) {
    cantidad.setAttribute("aria-invalid", "true");

    cotizacion.textContent =
      "Ingresa una cantidad entera entre 1 y 20.";

    return;
  }

  cantidad.setAttribute("aria-invalid", "false");

  const precioUnitario = Number(arreglo.value);
  const costoEntrega = entrega.checked ? 100 : 0;

  // Fórmula: precio del arreglo × cantidad + entrega.
  const total = precioUnitario * unidades + costoEntrega;

  const formatoMoneda = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  });

  cotizacion.textContent =
    "Total estimado: " + formatoMoneda.format(total) + " MXN";
}

[arreglo, cantidad, entrega].forEach((campo) => {
  campo.addEventListener("input", calcularCotizacion);
});

calcularCotizacion();

/* =========================================
   JAVASCRIPT: CONTADOR DEL MENSAJE
   ========================================= */

const mensaje = document.getElementById("mensaje");
const contadorMensaje = document.getElementById(
  "contador-mensaje"
);

function actualizarContador() {
  contadorMensaje.textContent =
    mensaje.value.length + " / 500";
}

mensaje.addEventListener("input", actualizarContador);

actualizarContador();

/* =========================================
   JAVASCRIPT: VALIDACIÓN DEL FORMULARIO
   ========================================= */

const formulario = document.getElementById("formulario");
const estadoFormulario = document.getElementById("form-estado");

const camposFormulario = [
  "nombre",
  "correo",
  "asunto",
  "mensaje"
];

function validarCampo(id) {
  const campo = document.getElementById(id);
  const valor = campo.value.trim();

  let error = "";

  // Nombre: obligatorio, entre 3 y 80 caracteres.
  if (
    id === "nombre" &&
    (valor.length < 3 || valor.length > 80)
  ) {
    error = "Escribe un nombre de entre 3 y 80 caracteres.";
  }

  // Correo: obligatorio y con formato válido.
  if (id === "correo") {
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formatoCorreo.test(valor) ||
      valor.length > 120 ||
      !campo.validity.valid
    ) {
      error =
        "Escribe un correo válido, por ejemplo nombre@correo.com.";
    }
  }

  // Asunto: se debe seleccionar una opción.
  if (id === "asunto" && valor === "") {
    error = "Selecciona el asunto de tu mensaje.";
  }

  // Mensaje: obligatorio, entre 10 y 500 caracteres.
  if (
    id === "mensaje" &&
    (valor.length < 10 || valor.length > 500)
  ) {
    error = "Escribe un mensaje de entre 10 y 500 caracteres.";
  }

  document.getElementById("error-" + id).textContent = error;

  campo.setAttribute(
    "aria-invalid",
    String(error !== "")
  );

  return error === "";
}

function limpiarEstadoFormulario() {
  estadoFormulario.textContent = "";

  estadoFormulario.classList.remove("exito", "fallo");
}

// Revisa de nuevo los campos cuando el usuario los corrige.
camposFormulario.forEach((id) => {
  const campo = document.getElementById(id);

  campo.addEventListener("input", () => {
    limpiarEstadoFormulario();

    if (campo.hasAttribute("aria-invalid")) {
      validarCampo(id);
    }
  });
});

formulario.addEventListener("submit", (evento) => {
  // Bloquea el envío y evita que la página se recargue.
  evento.preventDefault();

  limpiarEstadoFormulario();

  // Valida todos los campos, no solo el primero.
  const resultados = camposFormulario.map(validarCampo);

  if (resultados.includes(false)) {
    estadoFormulario.textContent =
      "Revisa los campos señalados antes de continuar.";

    estadoFormulario.classList.add("fallo");

    const primerError = resultados.indexOf(false);

    document
      .getElementById(camposFormulario[primerError])
      .focus();

    return;
  }

  const nombre = document.getElementById("nombre").value.trim();

  // textContent muestra el texto sin interpretarlo como HTML.
  estadoFormulario.textContent =
    "Gracias, " +
    nombre +
    ". Tu mensaje pasó la validación. " +
    "Esta es una confirmación de demostración; " +
    "no se ha enviado ningún correo.";

  estadoFormulario.classList.add("exito");

  formulario.reset();

  camposFormulario.forEach((id) => {
    document.getElementById(id).removeAttribute("aria-invalid");
    document.getElementById("error-" + id).textContent = "";
  });

  actualizarContador();
});

/* =========================================
   JQUERY Y PLUGIN BXSLIDER
   ========================================= */

if (window.jQuery) {
  jQuery(function ($) {
    // Respeta la preferencia de movimiento reducido.
    $.fx.off = movimientoReducido;

    /* -------------------------------------
       PLUGIN: BXSLIDER
       Carrusel con flechas y paginación.
       ------------------------------------- */

    if ($.fn.bxSlider) {
      $(".bxslider")
        .addClass("inicializado")
        .bxSlider({
          mode: "fade",
          auto: false,
          controls: true,
          pager: true,
          responsive: true,
          adaptiveHeight: true,
          speed: movimientoReducido ? 0 : 600,
          touchEnabled: false,

          prevText:
            '<span aria-hidden="true">‹</span>' +
            '<span class="texto-accesible">Anterior</span>',

          nextText:
            '<span aria-hidden="true">›</span>' +
            '<span class="texto-accesible">Siguiente</span>'
        });

      $(".bx-prev").attr(
        "aria-label",
        "Mostrar imagen anterior"
      );

      $(".bx-next").attr(
        "aria-label",
        "Mostrar imagen siguiente"
      );

      $(".bx-pager-link").each(function (indice) {
        $(this).attr(
          "aria-label",
          "Mostrar imagen " + (indice + 1)
        );
      });
    } else {
      $("#plugin-estado").text(
        "No se pudo cargar bxSlider. " +
        "Revisa tu conexión y recarga la página."
      );
    }

    /* -------------------------------------
       JQUERY: FILTROS
       Evento: click.
       Efecto: fadeIn.
       DOM: clases, atributos y texto.
       ------------------------------------- */

    $(".filtro").on("click", function () {
      const categoria = $(this).data("categoria");

      $(".filtro")
        .removeClass("activo")
        .attr("aria-pressed", "false");

      $(this)
        .addClass("activo")
        .attr("aria-pressed", "true");

      const tarjetas = $(".producto");

      // Cancela animaciones anteriores para evitar acumulaciones.
      tarjetas.stop(true, true).hide();

      const visibles =
        categoria === "todos"
          ? tarjetas
          : tarjetas.filter(function () {
              return $(this).data("categoria") === categoria;
            });

      visibles.fadeIn(300);

      $("#filtro-estado").text(
        visibles.length + " arreglos disponibles."
      );
    });

    /* -------------------------------------
       JQUERY: PREGUNTAS FRECUENTES
       Evento: click.
       Efecto: slideToggle.
       ------------------------------------- */

    $(".respuesta")
      .removeAttr("hidden")
      .hide();

    $(".pregunta").on("click", function () {
      const boton = $(this);

      const panel = $("#" + boton.attr("aria-controls"));

      const abierto =
        boton.attr("aria-expanded") !== "true";

      boton.attr("aria-expanded", String(abierto));

      boton.find("span").text(abierto ? "−" : "＋");

      panel
        .stop(true, true)
        .slideToggle(250);
    });

    /* -------------------------------------
       JQUERY: FAVORITOS
       Eventos: click y delegación.
       Efecto: fadeIn.
       DOM: append, remove, text y atributos.
       ------------------------------------- */

    const favoritos = new Set();

    function actualizarFavoritos() {
      $("#favoritos-vacio").toggle(favoritos.size === 0);

      $(".favorito").each(function () {
        const nombre = $(this).data("nombre");

        const seleccionado = favoritos.has(nombre);

        const etiqueta = seleccionado
          ? "Quitar " + nombre + " de favoritos"
          : "Agregar " + nombre + " a favoritos";

        $(this)
          .toggleClass("seleccionado", seleccionado)
          .attr("aria-pressed", String(seleccionado))
          .attr("aria-label", etiqueta)
          .text(seleccionado ? "♥" : "♡");
      });
    }

    function quitarFavorito(nombre) {
      favoritos.delete(nombre);

      $("#favoritos-lista li")
        .filter(function () {
          return $(this).data("nombre") === nombre;
        })
        .remove();

      actualizarFavoritos();
    }

    $(".favorito").on("click", function () {
      const nombre = $(this).data("nombre");

      // Si ya existe, lo elimina y evita duplicados.
      if (favoritos.has(nombre)) {
        quitarFavorito(nombre);
        return;
      }

      favoritos.add(nombre);

      const elemento = $("<li>")
        .data("nombre", nombre)
        .text(nombre + " ");

      const botonQuitar = $("<button>", {
        type: "button",
        class: "quitar",
        text: "Quitar",
        "aria-label": "Quitar " + nombre + " de favoritos"
      }).data("nombre", nombre);

      elemento.append(botonQuitar);

      $("#favoritos-lista").append(elemento.hide());

      elemento.fadeIn(250);

      actualizarFavoritos();
    });

    // Delegación para botones que se agregan dinámicamente.
    $("#favoritos-lista").on(
      "click",
      ".quitar",
      function () {
        quitarFavorito($(this).data("nombre"));
      }
    );
  });
} else {
  // Las funciones de JavaScript nativo siguen disponibles.
  document.getElementById("plugin-estado").textContent =
    "No se pudo cargar jQuery. " +
    "Revisa tu conexión y recarga la página.";

  document
    .querySelectorAll(".filtro, .favorito, .pregunta")
    .forEach((boton) => {
      boton.disabled = true;
    });
}