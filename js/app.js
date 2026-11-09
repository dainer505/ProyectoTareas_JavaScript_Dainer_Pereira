import {
    obtenerTareas,
    crearTareaLocal,
    actualizarTareaLocal,
    cambiarEstadoTarea,
    eliminarTareaPorId,
    agregarTareasImportadas
} from "./datos/almacenamiento.js";
import "./componentes/tarjeta-tarea.js";
import "./componentes/modal-formulario.js";

import { obtenerTareasDesdeAPI } from "./datos/conexion-api.js";
import "./componentes/modal-importar.js";

const contenedorTareas = document.getElementById("contenedorTareas");
const contadorTotal = document.getElementById("contadorTotal");
const contadorPendientes = document.getElementById("contadorPendientes");
const contadorCompletadas = document.getElementById("contadorCompletadas");

const inputBuscar = document.getElementById("inputBuscar");
const selectFiltroEstado = document.getElementById("selectFiltroEstado");
const selectFiltroOrigen = document.getElementById("selectFiltroOrigen");

const btnNuevaTarea = document.getElementById("btnNuevaTarea");
const btnAbrirImportar = document.getElementById("btnAbrirImportar");

const modalFormulario = document.getElementById("modalFormulario");
const modalImportar = document.getElementById("modalImportar");

function actualizarEstadisticas(tareas) {
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    contadorTotal.textContent = total;
    contadorPendientes.textContent = pendientes;
    contadorCompletadas.textContent = completadas;
}

function renderizarInterfaz() {
    const todasLasTareas = obtenerTareas();
    actualizarEstadisticas(todasLasTareas);

    const textoBusqueda = inputBuscar.value.toLowerCase().trim();
    const estadoSeleccionado = selectFiltroEstado.value;
    const origenSeleccionado = selectFiltroOrigen.value;

    const tareasFiltradas = todasLasTareas.filter(tarea => {
        const coincideTexto = tarea.titulo.toLowerCase().includes(textoBusqueda);
        const coincideEstado =
            estadoSeleccionado === "todas" ||
            (estadoSeleccionado === "completadas" && tarea.completada) ||
            (estadoSeleccionado === "pendientes" && !tarea.completada);
        const coincideOrigen =
            origenSeleccionado === "todos" || tarea.origen === origenSeleccionado;

        return coincideTexto && coincideEstado && coincideOrigen;
    });

    contenedorTareas.innerHTML = "";

    if (tareasFiltradas.length === 0) {
        contenedorTareas.innerHTML = `
            <div class="empty-state">
                <p>No hay tareas para mostrar con los filtros actuales.</p>
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

btnNuevaTarea.addEventListener("click", () => {
    modalFormulario.abrirParaCrear();
});

document.addEventListener("guardar-formulario", (e) => {
    const { id, titulo, descripcion, prioridad } = e.detail;
    if (id) {
        actualizarTareaLocal(id, { titulo, descripcion, prioridad });
    } else {
        crearTareaLocal({ titulo, descripcion, prioridad });
    }
    renderizarInterfaz();
});

document.addEventListener("cambiar-estado", (e) => {
    cambiarEstadoTarea(e.detail.id);
    renderizarInterfaz();
});

document.addEventListener("editar-tarea", (e) => {
    modalFormulario.abrirParaEditar(e.detail.tarea);
});

document.addEventListener("eliminar-tarea", (e) => {
    eliminarTareaPorId(e.detail.id);
    renderizarInterfaz();
});

btnAbrirImportar.addEventListener("click", () => {
    modalImportar.abrir();
});

document.addEventListener("confirmar-importacion", async (e) => {
    try {
        btnAbrirImportar.textContent = "Importando...";
        btnAbrirImportar.disabled = true;

        const tareasRemotas = await obtenerTareasDesdeAPI(e.detail.limite);
        agregarTareasImportadas(tareasRemotas);
        renderizarInterfaz();
    } catch (error) {
        alert("No se pudieron importar las tareas desde la API.");
    } finally {
        btnAbrirImportar.textContent = "Importar de API";
        btnAbrirImportar.disabled = false;
    }
});

inputBuscar.addEventListener("input", renderizarInterfaz);
selectFiltroEstado.addEventListener("change", renderizarInterfaz);
selectFiltroOrigen.addEventListener("change", renderizarInterfaz);

document.addEventListener("DOMContentLoaded", renderizarInterfaz);