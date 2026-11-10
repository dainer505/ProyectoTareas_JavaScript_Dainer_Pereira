import {
    obtenerTareas,
    guardarTareas,
    crearTareaLocal,
    actualizarTareaLocal,
    cambiarEstadoTarea,
    eliminarTareaPorId,
    agregarTareasSeleccionadasAPI,
    marcarTodasComoTerminadas,
    vaciarTodaLaLista
} from "./datos/almacenamiento.js";

import "./componentes/tarjeta-tarea.js";
import "./componentes/modal-formulario.js";

// --- Parte de SEBASTIÁN: Importaciones de API y Modal Importar ---
import { obtenerTareasDesdeAPI } from "./datos/conexion-api.js";
import "./componentes/modal-importar.js";

// --- Referencias del DOM ---
const contenedorTareas = document.getElementById("contenedorTareas");
const inputBuscar = document.getElementById("inputBuscar");
const botonesFiltro = document.querySelectorAll(".filter-btn");

const btnNuevaTarea = document.getElementById("btnNuevaTarea");
const btnAbrirImportar = document.getElementById("btnAbrirImportar");
const btnMarcarTodas = document.getElementById("btnMarcarTodas");
const btnVaciarLista = document.getElementById("btnVaciarLista");

const modalFormulario = document.getElementById("modalFormulario");
const modalImportar = document.getElementById("modalImportar");

let filtroActual = "todos";

// --- Parte de DAINER: Tareas iniciales de ejemplo (si LocalStorage está vacío la primera vez) ---
function cargarTareasInicialesSiEstaVacio() {
    const tareasGuardadas = obtenerTareas();
    if (tareasGuardadas.length === 0) {
        const iniciales = [
            { id: "LOCAL-1", titulo: "Revisar correo", fecha: "2023-11-25", completada: false, origen: "local" },
            { id: "LOCAL-2", titulo: "Preparar entrega", fecha: "2023-11-25", completada: true, origen: "local" },
            { id: "LOCAL-3", titulo: "Preparar una tarea", fecha: "2023-11-26", completada: true, origen: "local" }
        ];
        guardarTareas(iniciales);
    }
}

// --- Parte de DAINER: Renderizar Tarjetas en la Grilla ---
function renderizarInterfaz() {
    const todasLasTareas = obtenerTareas();
    const textoBusqueda = inputBuscar.value.toLowerCase().trim();

    const tareasFiltradas = todasLasTareas.filter(tarea => {
        const coincideTexto = tarea.titulo.toLowerCase().includes(textoBusqueda);

        let coincideEstado = true;
        if (filtroActual === "pendientes") {
            coincideEstado = tarea.completada === false;
        } else if (filtroActual === "completados") {
            coincideEstado = tarea.completada === true;
        }

        return coincideTexto && coincideEstado;
    });

    contenedorTareas.innerHTML = "";

    if (tareasFiltradas.length === 0) {
        contenedorTareas.innerHTML = `
            <div class="empty-state">
                <p>No hay tareas para mostrar en esta vista.</p>
            </div>
        `;
        return;
    }

    tareasFiltradas.forEach(tarea => {
        const componenteTarjeta = document.createElement("tarjeta-tarea");
        componenteTarjeta.datosTarea = tarea;
        contenedorTareas.appendChild(componenteTarjeta);
    });
}

// --- Parte de DAINER: Eventos de Tareas Locales y Barra Inferior ---
btnNuevaTarea.addEventListener("click", () => {
    modalFormulario.abrirParaCrear();
});

document.addEventListener("guardar-formulario", (evento) => {
    const datos = evento.detail;
    if (datos.id) {
        actualizarTareaLocal(datos.id, datos);
    } else {
        crearTareaLocal(datos);
    }
    renderizarInterfaz();
});

document.addEventListener("cambiar-estado", (evento) => {
    cambiarEstadoTarea(evento.detail.id);
    renderizarInterfaz();
});

document.addEventListener("editar-tarea", (evento) => {
    modalFormulario.abrirParaEditar(evento.detail.tarea);
});

document.addEventListener("eliminar-tarea", (evento) => {
    eliminarTareaPorId(evento.detail.id);
    renderizarInterfaz();
});

btnMarcarTodas.addEventListener("click", () => {
    marcarTodasComoTerminadas();
    renderizarInterfaz();
});

btnVaciarLista.addEventListener("click", () => {
    vaciarTodaLaLista();
    renderizarInterfaz();
});

// --- Parte de SEBASTIÁN: Eventos de API, Buscador y Botones de Filtro ---
btnAbrirImportar.addEventListener("click", async () => {
    try {
        btnAbrirImportar.textContent = "Cargando API...";
        const tareasDeLaAPI = await obtenerTareasDesdeAPI();
        modalImportar.mostrarTareasParaSeleccionar(tareasDeLaAPI);
    } catch (error) {
        alert("No se pudo conectar con JSONPlaceholder.");
    } finally {
        btnAbrirImportar.textContent = "Importar Tareas de la API";
    }
});

document.addEventListener("confirmar-importacion", (evento) => {
    agregarTareasSeleccionadasAPI(evento.detail.tareas);
    renderizarInterfaz();
});

inputBuscar.addEventListener("input", renderizarInterfaz);

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");
        filtroActual = boton.getAttribute("data-filtro");
        renderizarInterfaz();
    });
});

// Inicializar aplicación con 3 tarjetas de muestra igual al wireframe
cargarTareasInicialesSiEstaVacio();
renderizarInterfaz();