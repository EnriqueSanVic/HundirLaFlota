import { ComponenteFactory } from "./ComponenteFactory.js";
export class PanelFinJuego extends ComponenteFactory {
    constructor(nodoPadre, nombreGandor) {
        super();
        this.nodoPadre = nodoPadre;
        this.contenedor = super.crearContenedor(700, 0, 40);
        this.labGanado = super.crearParrafo('tituloTablero', 'GANADOR:', 50);
        this.contenedor.appendChild(this.labGanado);
        this.labNombreGanador = super.crearH3(60, nombreGandor);
        this.contenedor.appendChild(this.labNombreGanador);
        this.btnReiniciar = super.crearBoton('REINICIAR');
        this.btnReiniciar.addEventListener('click', function () {
            window.location.reload();
        });
        this.contenedor.appendChild(this.btnReiniciar);
    }
    desplegarComponente() {
        if (this.nodoPadre !== undefined) {
            this.nodoPadre.appendChild(this.contenedor);
        }
    }
    eliminarComponente() {
        if (this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre) {
            this.nodoPadre.removeChild(this.contenedor);
        }
    }
}
