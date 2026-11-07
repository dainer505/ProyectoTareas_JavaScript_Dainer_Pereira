export class ModalFormulario extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._tareaEdicion = null;
    }

    connectedCallback() {
        this.render();
    }

    abrirParaCrear() {
        this._tareaEdicion = null;
        this.render();
        this.shadowRoot.querySelector(".overlay").classList.add("activo");
    }

    abrirParaEditar(tarea) {
        this._tareaEdicion = tarea;
        this.render();
        this.shadowRoot.querySelector(".overlay").classList.add("activo");
    }

    cerrar() {
        const overlay = this.shadowRoot.querySelector(".overlay");
        if (overlay) overlay.classList.remove("activo");
    }

    render() {
        const editando = Boolean(this._tareaEdicion);
        const tituloActual = editando ? this._tareaEdicion.titulo : "";
        const descActual = editando ? this._tareaEdicion.descripcion : "";
        const prioActual = editando ? this._tareaEdicion.prioridad : "media";

        this.shadowRoot.innerHTML = `
            <style>
                .overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.75);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    z-index: 1000;
                }
                .overlay.activo {
                    display: flex;
                }
                .modal {
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 460px;
                    padding: 24px;
                    color: #f8fafc;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.5);
                }
                h2 {
                    margin: 0 0 16px;
                    font-size: 1.3rem;
                }
                .campo {
                    margin-bottom: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                label {
                    font-size: 0.85rem;
                    color: #94a3b8;
                }
                input, textarea, select {
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    background: #0f172a;
                    color: #f8fafc;
                    font-family: inherit;
                    font-size: 0.95rem;
                }
                textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .acciones {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                button {
                    padding: 10px 16px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-cancelar {
                    background: transparent;
                    border: 1px solid #334155;
                    color: #cbd5e1;
                }
                .btn-guardar {
                    background: #3b82f6;
                    color: white;
                }
            </style>

            <div class="overlay">
                <div class="modal">
                    <h2>${editando ? "Editar Tarea Local" : "Nueva Tarea"}</h2>
                    <form id="formTarea">
                        <div class="campo">
                            <label for="titulo">Título de la tarea</label>
                            <input type="text" id="titulo" required value="${tituloActual}" placeholder="Ej: Diseñar componente...">
                        </div>
                        <div class="campo">
                            <label for="descripcion">Descripción</label>
                            <textarea id="descripcion" placeholder="Detalles de la tarea...">${descActual}</textarea>
                        </div>
                        <div class="campo">
                            <label for="prioridad">Prioridad</label>
                            <select id="prioridad">
                                <option value="baja" ${prioActual === "baja" ? "selected" : ""}>Baja</option>
                                <option value="media" ${prioActual === "media" ? "selected" : ""}>Media</option>
                                <option value="alta" ${prioActual === "alta" ? "selected" : ""}>Alta</option>
                            </select>
                        </div>
                        <div class="acciones">
                            <button type="button" class="btn-cancelar" id="btnCancelar">Cancelar</button>
                            <button type="submit" class="btn-guardar">
                                ${editando ? "Guardar Cambios" : "Crear Tarea"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("btnCancelar").addEventListener("click", () => this.cerrar());

        this.shadowRoot.getElementById("formTarea").addEventListener("submit", (e) => {
            e.preventDefault();
            const datos = {
                id: editando ? this._tareaEdicion.id : null,
                titulo: this.shadowRoot.getElementById("titulo").value,
                descripcion: this.shadowRoot.getElementById("descripcion").value,
                prioridad: this.shadowRoot.getElementById("prioridad").value
            };

            this.dispatchEvent(new CustomEvent("guardar-formulario", {
                detail: datos,
                bubbles: true,
                composed: true
            }));
            this.cerrar();
        });
    }
}

customElements.define("modal-formulario", ModalFormulario);