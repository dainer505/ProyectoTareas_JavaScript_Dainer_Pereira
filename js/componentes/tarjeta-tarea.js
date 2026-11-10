export class TarjetaTarea extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.tarea = null;
    }

    set datosTarea(objetoTarea) {
        this.tarea = objetoTarea;
        this.render();
    }

    formatearFechaBonita(fechaTexto) {
        if (!fechaTexto) return "Sin fecha";
        const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        const partes = fechaTexto.split("-");
        if (partes.length === 3) {
            const anio = partes[0];
            const mesIndice = parseInt(partes[1], 10) - 1;
            const dia = partes[2];
            return `${dia} ${meses[mesIndice] || ""} ${anio}`;
        }
        return fechaTexto;
    }

    render() {
        if (!this.tarea) return;

        const esApi = this.tarea.origen === "api";
        const textoEstado = this.tarea.completada ? "Completado" : "Pendiente";
        const claseEstado = this.tarea.completada ? "badge-completado" : "badge-pendiente";
        const fechaMostrada = this.formatearFechaBonita(this.tarea.fecha);

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 18px 20px;
                    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 18px;
                    height: 100%;
                    box-sizing: border-box;
                }
                .top-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                input[type="checkbox"] {
                    width: 17px;
                    height: 17px;
                    margin-top: 3px;
                    cursor: pointer;
                    accent-color: #0b3558;
                }
                .info {
                    flex: 1;
                }
                .titulo {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    text-decoration: ${this.tarea.completada ? "line-through" : "none"};
                }
                .fecha {
                    margin: 4px 0 0 0;
                    font-size: 0.82rem;
                    color: #64748b;
                }
                .bottom-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .badge {
                    padding: 5px 14px;
                    border-radius: 999px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .badge-pendiente {
                    background-color: #facc15;
                    color: #422006;
                }
                .badge-completado {
                    background-color: #16a34a;
                    color: #ffffff;
                }
                .icon-actions {
                    display: flex;
                    gap: 8px;
                }
                .icon-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    background-color: #f8fafc;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                }
                .icon-btn:hover:not(:disabled) {
                    background-color: #e2e8f0;
                }
                .icon-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .btn-delete {
                    color: #dc2626;
                }
            </style>

            <div class="card">
                <div class="top-row">
                    <input type="checkbox" id="checkEstado" ${this.tarea.completada ? "checked" : ""}>
                    <div class="info">
                        <h3 class="titulo">${this.tarea.titulo}</h3>
                        <p class="fecha">${fechaMostrada}</p>
                    </div>
                </div>

                <div class="bottom-row">
                    <span class="badge ${claseEstado}">${textoEstado}</span>
                    <div class="icon-actions">
                        <button type="button" id="btnEditar" class="icon-btn" ${esApi ? "disabled title='Tarea de API no editable'" : "title='Editar tarea'"}>
                            ✏️
                        </button>
                        <button type="button" id="btnEliminar" class="icon-btn btn-delete" title="Eliminar tarea">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;

        const checkEstado = this.shadowRoot.getElementById("checkEstado");
        const btnEditar = this.shadowRoot.getElementById("btnEditar");
        const btnEliminar = this.shadowRoot.getElementById("btnEliminar");

        checkEstado.addEventListener("change", () => {
            this.dispatchEvent(new CustomEvent("cambiar-estado", {
                detail: { id: this.tarea.id },
                bubbles: true,
                composed: true
            }));
        });

        btnEditar.addEventListener("click", () => {
            if (esApi) return;
            this.dispatchEvent(new CustomEvent("editar-tarea", {
                detail: { tarea: this.tarea },
                bubbles: true,
                composed: true
            }));
        });

        btnEliminar.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("eliminar-tarea", {
                detail: { id: this.tarea.id },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define("tarjeta-tarea", TarjetaTarea);