export class ModalImportar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    abrir() {
        this.shadowRoot.querySelector(".overlay").classList.add("activo");
    }

    cerrar() {
        this.shadowRoot.querySelector(".overlay").classList.remove("activo");
    }

    render() {
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
                    max-width: 420px;
                    padding: 24px;
                    color: #f8fafc;
                }
                h2 { margin: 0 0 10px; font-size: 1.25rem; }
                p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 16px; line-height: 1.4; }
                select {
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    background: #0f172a;
                    color: #f8fafc;
                    margin-bottom: 20px;
                }
                .acciones {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
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
                .btn-importar {
                    background: #8b5cf6;
                    color: white;
                }
            </style>

            <div class="overlay">
                <div class="modal">
                    <h2>Importar desde JSONPlaceholder</h2>
                    <p>Selecciona cuántas tareas remotas deseas descargar. Recuerda que las tareas de la API no podrán editar su texto.</p>
                    <select id="selectCantidad">
                        <option value="3">3 tareas de prueba</option>
                        <option value="6" selected>6 tareas de prueba</option>
                        <option value="10">10 tareas de prueba</option>
                    </select>
                    <div class="acciones">
                        <button type="button" class="btn-cancelar" id="btnCerrar">Cancelar</button>
                        <button type="button" class="btn-importar" id="btnConfirmar">Descargar Tareas</button>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("btnCerrar").addEventListener("click", () => this.cerrar());

        this.shadowRoot.getElementById("btnConfirmar").addEventListener("click", () => {
            const limite = Number(this.shadowRoot.getElementById("selectCantidad").value);
            this.dispatchEvent(new CustomEvent("confirmar-importacion", {
                detail: { limite },
                bubbles: true,
                composed: true
            }));
            this.cerrar();
        });
    }
}

customElements.define("modal-importar", ModalImportar);