export class ModalFormulario extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.tareaEnEdicion = null;
    }

    connectedCallback() {
        this.render();
    }

    abrirParaCrear() {
        this.tareaEnEdicion = null;
        this.render();
        this.shadowRoot.getElementById("overlayFormulario").classList.add("activo");
    }

    abrirParaEditar(tarea) {
        this.tareaEnEdicion = tarea;
        this.render();
        this.shadowRoot.getElementById("overlayFormulario").classList.add("activo");
    }

    cerrar() {
        const overlay = this.shadowRoot.getElementById("overlayFormulario");
        if (overlay) overlay.classList.remove("activo");
    }

    render() {
        const editando = this.tareaEnEdicion !== null;
        const fechaPorDefecto = new Date().toISOString().split("T")[0];

        const valorTitulo = editando ? this.tareaEnEdicion.titulo : "";
        const valorFecha = editando ? this.tareaEnEdicion.fecha : fechaPorDefecto;
        const valorCompletada = editando ? this.tareaEnEdicion.completada : false;

        this.shadowRoot.innerHTML = `
            <style>
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(30, 41, 59, 0.75);
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
                    background-color: #ffffff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                    color: #1e293b;
                }
                .modal-header {
                    padding: 20px 24px 14px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #0f172a;
                }
                .modal-body {
                    padding: 20px 24px;
                }
                .campo {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #475569;
                }
                input[type="text"],
                input[type="date"] {
                    padding: 10px 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    background-color: #f8fafc;
                    font-size: 0.92rem;
                    color: #1e293b;
                    outline: none;
                }
                .check-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 8px;
                }
                .check-row input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                .check-row label {
                    font-weight: 500;
                    color: #1e293b;
                    cursor: pointer;
                }
                .modal-footer {
                    padding: 14px 24px 20px;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                button {
                    padding: 9px 18px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                }
                .btn-cancelar {
                    background-color: #e2e8f0;
                    color: #334155;
                }
                .btn-guardar {
                    background-color: #0b3558;
                    color: #ffffff;
                }
            </style>

            <div id="overlayFormulario" class="overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h2>${editando ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>
                    </div>
                    <form id="formTarea">
                        <div class="modal-body">
                            <div class="campo">
                                <label for="inputTitulo">Título / Descripción de la tarea</label>
                                <input type="text" id="inputTitulo" required value="${valorTitulo}" placeholder="Ej. Preparar entrega de proyecto...">
                            </div>

                            <div class="campo">
                                <label for="inputFecha">Fecha de registro</label>
                                <input type="date" id="inputFecha" required value="${valorFecha}">
                            </div>

                            <div class="check-row">
                                <input type="checkbox" id="checkCompletada" ${valorCompletada ? "checked" : ""}>
                                <label for="checkCompletada">Marcar tarea como completada</label>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" id="btnCancelar" class="btn-cancelar">Cancelar</button>
                            <button type="submit" class="btn-guardar">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("btnCancelar").addEventListener("click", () => {
            this.cerrar();
        });

        this.shadowRoot.getElementById("formTarea").addEventListener("submit", (e) => {
            e.preventDefault();

            const titulo = this.shadowRoot.getElementById("inputTitulo").value.trim();
            const fecha = this.shadowRoot.getElementById("inputFecha").value;
            const completada = this.shadowRoot.getElementById("checkCompletada").checked;

            this.dispatchEvent(new CustomEvent("guardar-formulario", {
                detail: {
                    id: editando ? this.tareaEnEdicion.id : null,
                    titulo: titulo,
                    fecha: fecha,
                    completada: completada
                },
                bubbles: true,
                composed: true
            }));

            this.cerrar();
        });
    }
}

customElements.define("modal-formulario", ModalFormulario);