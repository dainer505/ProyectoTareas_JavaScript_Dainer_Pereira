export class TarjetaTarea extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._tarea = null;
    }

    set datosTarea(objetoTarea) {
        this._tarea = objetoTarea;
        this.render();
    }

    get datosTarea() {
        return this._tarea;
    }

    render() {
        if (!this._tarea) return;

        const { id, titulo, descripcion, prioridad, completada, origen, fechaCreacion } = this._tarea;
        const esApi = origen === "api";

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card {
                    background-color: #1e293b;
                    border: 1px solid ${completada ? "#10b981" : "#334155"};
                    border-radius: 10px;
                    padding: 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 14px;
                    height: 100%;
                    box-sizing: border-box;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    opacity: ${completada ? "0.8" : "1"};
                }
                .card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
                }
                .badges {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                }
                .badge {
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 6px;
                    text-transform: uppercase;
                }
                .origen-local { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .origen-api { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
                .prio-alta { background: rgba(239, 68, 68, 0.2); color: #f87171; }
                .prio-media { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
                .prio-baja { background: rgba(16, 185, 129, 0.2); color: #34d399; }

                .titulo {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #f8fafc;
                    text-decoration: ${completada ? "line-through" : "none"};
                }
                .descripcion {
                    margin: 6px 0 0;
                    font-size: 0.9rem;
                    color: #94a3b8;
                    line-height: 1.4;
                }
                .meta {
                    font-size: 0.78rem;
                    color: #64748b;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                    padding-top: 10px;
                    border-top: 1px solid #334155;
                }
                button {
                    flex: 1;
                    padding: 8px 10px;
                    border-radius: 6px;
                    border: 1px solid #334155;
                    background: #0f172a;
                    color: #f8fafc;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                button:hover:not(:disabled) {
                    background: #334155;
                }
                .btn-toggle {
                    border-color: ${completada ? "#f59e0b" : "#10b981"};
                    color: ${completada ? "#fbbf24" : "#34d399"};
                }
                .btn-delete {
                    border-color: #ef4444;
                    color: #f87171;
                }
                button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
            </style>

            <article class="card">
                <div>
                    <div class="badges">
                        <span class="badge ${esApi ? "origen-api" : "origen-local"}">
                            ${esApi ? "API Externa" : "Local"}
                        </span>
                        <span class="badge prio-${prioridad}">
                            Prioridad ${prioridad}
                        </span>
                    </div>
                    <h3 class="titulo" style="margin-top: 12px;">${titulo}</h3>
                    <p class="descripcion">${descripcion || "Sin descripción adicional."}</p>
                </div>

                <div>
                    <div class="meta">Registro: ${fechaCreacion}</div>
                    <div class="actions" style="margin-top: 10px;">
                        <button class="btn-toggle" id="btnEstado">
                            ${completada ? "Reabrir" : "Completar"}
                        </button>
                        <button id="btnEditar" ${esApi ? "disabled title='No editable (Origen API)'" : ""}>
                            ${esApi ? "Bloqueada" : "Editar"}
                        </button>
                        <button class="btn-delete" id="btnEliminar">Eliminar</button>
                    </div>
                </div>
            </article>
        `;

        this.shadowRoot.getElementById("btnEstado").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("cambiar-estado", {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById("btnEditar").addEventListener("click", () => {
            if (esApi) return;
            this.dispatchEvent(new CustomEvent("editar-tarea", {
                detail: { tarea: this._tarea },
                bubbles: true,
                composed: true
            }));
        });

        this.shadowRoot.getElementById("btnEliminar").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("eliminar-tarea", {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define("tarjeta-tarea", TarjetaTarea);