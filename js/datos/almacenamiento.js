const CLAVE_STORAGE = 'gestor_tareas_datos_v1';

export function obtenerTareas() {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE);
    if (!textoGuardado) {
        return [];
    }
    try {
        return JSON.parse(textoGuardado);
    } catch (error) {
        console.error('Error al leer el LocalStorage:', error);
        return [];
    }
}

export function guardarListaTareas(listaTareas) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas));
}

export function crearTareaLocal(datos) {
    const tareas = obtenerTareas();
    const codigoUnico = 'LOC-' + Date.now();
    const nuevaTarea = {
        id: codigoUnico,
        titulo: datos.titulo.trim(),
        fechaRegistro: datos.fechaRegistro,
        completada: Boolean(datos.completada),
        esImportada: false
    };
    tareas.unshift(nuevaTarea);
    guardarListaTareas(tareas);
    return nuevaTarea;
}

export function actualizarTareaLocal(idTarea, nuevosDatos) {
    const tareas = obtenerTareas();
    const indice = tareas.findIndex(t => t.id === idTarea);
    if (indice === -1) return false;

    // Regla del proyecto: las tareas importadas de la API no se pueden editar
    if (tareas[indice].esImportada) {
        return false;
    }

    tareas[indice] = {
        ...tareas[indice],
        titulo: nuevosDatos.titulo.trim(),
        fechaRegistro: nuevosDatos.fechaRegistro,
        completada: Boolean(nuevosDatos.completada)
    };
    guardarListaTareas(tareas);
    return true;
}

export function cambiarEstadoCompletada(idTarea) {
    const tareas = obtenerTareas();
    const indice = tareas.findIndex(t => t.id === idTarea);
    if (indice !== -1) {
        tareas[indice].completada = !tareas[indice].completada;
        guardarListaTareas(tareas);
    }
}

export function eliminarTareaPorId(idTarea) {
    const tareas = obtenerTareas();
    const filtradas = tareas.filter(t => t.id !== idTarea);
    guardarListaTareas(filtradas);
}

export function marcarTodasComoCompletadas() {
    const tareas = obtenerTareas().map(t => ({
        ...t,
        completada: true
    }));
    guardarListaTareas(tareas);
}

export function vaciarTodasLasTareas() {
    guardarListaTareas([]);
}

export function guardarTareasImportadas(listaSeleccionadaApi) {
    const tareasActuales = obtenerTareas();
    const hoy = new Date().toISOString().split('T')[0];

    const nuevasImportadas = listaSeleccionadaApi.map(item => {
        const sufijo = Math.floor(1000 + Math.random() * 9000);
        return {
            id: `API-${item.id}-${sufijo}`,
            titulo: item.title,
            fechaRegistro: hoy,
            completada: Boolean(item.completed),
            esImportada: true
        };
    });

    const listaCombinada = [...nuevasImportadas, ...tareasActuales];
    guardarListaTareas(listaCombinada);
}