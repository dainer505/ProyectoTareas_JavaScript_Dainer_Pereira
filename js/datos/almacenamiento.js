const CLAVE_STORAGE = "task_manager_datos";

export function obtenerTareas() {
    const datosTexto = localStorage.getItem(CLAVE_STORAGE);
    if (datosTexto) {
        return JSON.parse(datosTexto);
    }
    return [];
}

export function guardarTareas(listaTareas) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas));
}

export function crearTareaLocal(datos) {
    const lista = obtenerTareas();

    const nuevaTarea = {
        id: "LOCAL-" + Date.now(),
        titulo: datos.titulo,
        fecha: datos.fecha,
        completada: datos.completada,
        origen: "local"
    };

    lista.unshift(nuevaTarea);
    guardarTareas(lista);
}

export function actualizarTareaLocal(id, nuevosDatos) {
    const lista = obtenerTareas();
    const tarea = lista.find(item => String(item.id) === String(id));

    if (tarea) {
        if (tarea.origen === "api") {
            alert("Las tareas importadas de la API no pueden editarse.");
            return;
        }
        tarea.titulo = nuevosDatos.titulo;
        tarea.fecha = nuevosDatos.fecha;
        tarea.completada = nuevosDatos.completada;
        guardarTareas(lista);
    }
}

export function cambiarEstadoTarea(id) {
    const lista = obtenerTareas();
    const tarea = lista.find(item => String(item.id) === String(id));

    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas(lista);
    }
}

export function eliminarTareaPorId(id) {
    const lista = obtenerTareas();
    const filtradas = lista.filter(item => String(item.id) !== String(id));
    guardarTareas(filtradas);
}

export function agregarTareasSeleccionadasAPI(tareasSeleccionadas) {
    const listaActual = obtenerTareas();
    const fechaHoy = new Date().toISOString().split("T")[0];

    tareasSeleccionadas.forEach(itemApi => {
        const nuevaImportada = {
            id: `API-${itemApi.id}-${Date.now()}`,
            titulo: itemApi.title,
            fecha: fechaHoy,
            completada: Boolean(itemApi.completed),
            origen: "api"
        };
        listaActual.unshift(nuevaImportada);
    });

    guardarTareas(listaActual);
}

export function marcarTodasComoTerminadas() {
    const lista = obtenerTareas();
    lista.forEach(tarea => {
        tarea.completada = true;
    });
    guardarTareas(lista);
}

export function vaciarTodaLaLista() {
    guardarTareas([]);
}