const URL_API_TODOS = 'https://jsonplaceholder.typicode.com/todos?_limit=15';

export async function consultarTareasApi() {
    try {
        const respuesta = await fetch(URL_API_TODOS);
        if (!respuesta.ok) {
            throw new Error('No se pudo obtener respuesta del servidor');
        }
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al consultar JSONPlaceholder:', error);
        throw error;
    }
}