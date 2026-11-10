export class ModalImportar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.listaTareasAPI = [];
    }

    connectedCallback() {
        this.render();
    }

    mostrarTareasParaSeleccionar(tareasDesdeAPI) {
        this.listaTareasAPI = tareasDesdeAPI;
        this.render();
        this.shadowRoot.getElementById("overlayImportar").classList.add("activo");
    }

    cerrar() {
        const overlay = this.shadowRoot.getElementById("overlayImportar");
        if (overlay) overlay.classList.remove("activo");
    }

    render() {
        let filasHTML = "";

        this.listaTareasAPI.forEach((item, index) => {
            const marcadoPorDefecto = index < 2 ? "checked" : "";
            filasHTML += `
                <label class="api-item">
                    <input type="checkbox" class="check-api" value="${item.id}" ${marcadoPorDefecto}>
                    <span>[API #${item.id}] ${item.title}</span>
                </label>
            `;
        });

        if (filasHTML === "") {
            filasHTML = `<p style="padding: 12px; color: #64748b;">Cargando tareas de la API...</p>`;
        }

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
                    max-width: 480px;
                    padding: 24px;
                    color: #1e293b;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
                }
                h2 {
                    margin: 0 0 4px 0;
                    font-size: 1.25rem;
                    color: #0f172a;
                }
                .endpoint-text {
                    margin: 0 0 16px 0;
                    font-size: 0.82rem;
                    color: #64748b;
                }
                .list-box {
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 16px;
                    max-height: 250px;
                    overflow-y: auto;
                    background-color: #f8fafc;
                }
                .api-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 0;
                    border-bottom: 1px solid #e2e8f0;
                    font-size: 0.88rem;
                    color: #1e293b;
                    cursor: pointer;
                }
                .api-item:last-child {
                    border-bottom: none;
                }
                .api-item input {
                    width: 16px;
                    height: 16px;
                    accent-color: #2563eb;
                    cursor: pointer;
                }
                .note {
                    margin-top: 12px;
                    font-size: 0.75rem;
                    color: #64748b;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 18px;
                }
                button {
                    padding: 10px 18px;
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
                .btn-importar {
                    background-color: #2563eb;
                    color: #ffffff;
                }
            </style>

            <div id="overlayImportar" class="overlay">
                <div class="modal">
                    <h2>Importar Tareas (API)</h2>
                    <p class="endpoint-text">Endpoint: https://jsonplaceholder.typicode.com/todos</p>

                    <div class="list-box">
                        ${filasHTML}
                    </div>

                    <p class="note">* Las tareas importadas recibirán ID propio (API-id-timestamp) y no podrán editarse.</p>

                    <div class="modal-footer">
                        <button type="button" id="btnCancelar" class="btn-cancelar">Cancelar</button>
                        <button type="button" id="btnConfirmar" class="btn-importar">Importar Seleccionadas</button>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("btnCancelar").addEventListener("click", () => {
            this.cerrar();
        });

        this.shadowRoot.getElementById("btnConfirmar").addEventListener("click", () => {
            const checksMarcados = this.shadowRoot.querySelectorAll(".check-api:checked");
            const tareasElegidas = [];

            checksMarcados.forEach(check => {
                const tareaOriginal = this.listaTareasAPI.find(t => String(t.id) === String(check.value));
                if (tareaOriginal) {
                    tareasElegidas.push(tareaOriginal);
                }
            });

            this.dispatchEvent(new CustomEvent("confirmar-importacion", {
                detail: { tareas: tareasElegidas },
                bubbles: true,
                composed: true
            }));

            this.cerrar();
        });
    }
}

customElements.define("modal-importar", ModalImportar);