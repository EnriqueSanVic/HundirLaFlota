import { ComponenteFactory } from "./ComponenteFactory.js";
export class PanelEleccionTablero extends ComponenteFactory {
    constructor(controladorTablero, tableroReal, nodoPadre, nombreJugador) {
        super();
        this.controladorTablero = controladorTablero;
        this.tableroReal = tableroReal;
        this.nodoPadre = nodoPadre;
        this.contenedorEleccionTablero = super.crearContenedor(700, 30);
        this.nombreJugadorContenedorEleccion = super.crearSubtitulo(nombreJugador);
        this.contenedorEleccionTablero.appendChild(this.nombreJugadorContenedorEleccion);
        this.tableroReal.setNodoPadre(this.contenedorEleccionTablero);
        this.tableroReal.desplegarComponente();
        this.btnReintentar = super.crearBoton('REINTENTAR');
        this.btnReintentar['controlador'] = this.controladorTablero;
        this.btnReintentar.addEventListener('click', function () {
            this['controlador'].confBarcosAleatorios();
        });
        this.contenedorEleccionTablero.appendChild(this.btnReintentar);
        this.btnSeleccionar = super.crearBoton('SELECCIONAR');
        this.contenedorEleccionTablero.appendChild(this.btnSeleccionar);
    }
    desplegarComponente() {
        this.controladorTablero.confBarcosAleatorios();
        this.btnSeleccionar['controlador'] = this.controladorTablero;
        this.btnSeleccionar.addEventListener('click', function () {
            this['controlador'].eventoFinEleccionTablero();
        });
        this.nodoPadre.appendChild(this.contenedorEleccionTablero);
    }
    eliminarComponente() {
        this.nodoPadre.removeChild(this.contenedorEleccionTablero);
    }
}
