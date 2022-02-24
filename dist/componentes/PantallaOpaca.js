import { ComponenteFactory } from "./ComponenteFactory.js";
export class PantallaOpaca extends ComponenteFactory {
    constructor(nodoPadre, nombreJugador) {
        super();
        this.nodoPadre = nodoPadre;
        this.nombreJugador = nombreJugador;
        this.contenedor = document.createElement('div');
        this.contenedor.classList.add('pantallaOpaca');
        this.labTurno = super.crearParrafo('tituloTablero', 'TURNO DE: ', 40);
        this.labTurno.style.marginTop = 190 + "px";
        this.contenedor.appendChild(this.labTurno);
        this.contenedor.appendChild(document.createElement('br'));
        this.labNombreJugador = super.crearH3(60, this.nombreJugador);
        this.contenedor.appendChild(this.labNombreJugador);
        this.contenedor.appendChild(document.createElement('br'));
        this.btnContinuar = super.crearBoton("CONTINUAR");
        this.btnContinuar.style.marginTop = '0px';
        this.btnContinuar[PantallaOpaca.REF_CONTROLADOR] = this;
        this.btnContinuar.addEventListener('click', function () {
            this[PantallaOpaca.REF_CONTROLADOR].eliminarComponente();
        });
        this.contenedor.append(this.btnContinuar);
    }
    desplegarComponente() {
        this.nodoPadre.appendChild(this.contenedor);
    }
    eliminarComponente() {
        if (this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre) {
            this.nodoPadre.removeChild(this.contenedor);
        }
    }
}
PantallaOpaca.REF_CONTROLADOR = "controlador";
