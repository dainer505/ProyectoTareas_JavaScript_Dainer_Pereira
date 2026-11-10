const ENDPOINT_API = "https://jsonplaceholder.typicode.com/todos";

export async function obtenerTareasDesdeAPI() {
    try {
        const respuestaServidor = await fetch(`${ENDPOINT_API}?_limit=8`);

        if (!respuestaServidor.ok) {
            throw new Error(`Error HTTP: ${respuestaServidor.status}`);
        }

        const registros = await respuestaServidor.json();
        return registros;
    } catch (err) {
        console.error("Error al consultar la API:", err);
        throw err;
    }
}