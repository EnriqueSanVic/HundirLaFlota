import { ComponenteFactory } from "./ComponenteFactory.js";
import { PantallaOpaca } from "./PantallaOpaca.js";
import { TIPO_CONTROLADOR } from "../Constantes.js";
export class PanelJuego extends ComponenteFactory {
    constructor(jugador, controladorTablero, tableroReal, nodoPadre, contrincantes) {
        super();
        this.REF_ACTIVO = "contrincante_activo_ref";
        this.contrincanteSelecionado = null;
        this.jugador = jugador;
        this.controladortablero = controladorTablero;
        this.tableroReal = tableroReal;
        this.nodoPadre = nodoPadre;
        this.contrincantes = contrincantes;
        this.aceptarToque = true;
        this.contenedor = super.crearContenedor(1050, 30, 20);
        this.generarNombre();
        this.generarAreaContrincantes();
        if (this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL) {
            this.generarAreaTableroReal();
        }
        this.generarAreaTableroContrincante();
        this.ponerEscuchadorAreaContrincantes();
        if (this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL) {
            this.pantallaOpaca = new PantallaOpaca(this.contenedor, this.jugador.getNombre());
        }
        this.areasContrincantes[0].click();
    }
    generarNombre() {
        var h3Nombre = super.crearH3(30, this.jugador.getNombre());
        this.contenedor.appendChild(h3Nombre);
    }
    generarAreaTableroContrincante() {
        if (this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT) {
            this.areaTableroContrincante = super.crearAreaTablero(false, "TABLERO ENEMIGO", true, false);
        }
        else {
            this.areaTableroContrincante = super.crearAreaTablero(false, "TABLERO ENEMIGO");
        }
        this.contenedor.appendChild(this.areaTableroContrincante);
    }
    generarAreaTableroReal() {
        this.areaTableroReal = super.crearAreaTablero(true, "TU TABLERO");
        this.tableroReal.eliminarComponente();
        this.tableroReal.setNodoPadre(this.areaTableroReal);
        this.tableroReal.desplegarComponente();
        this.contenedor.appendChild(this.areaTableroReal);
    }
    generarAreaContrincantes() {
        this.areaContrincantes = super.crearAreaContrincantes();
        this.areasContrincantes = new Array();
        let areaContrincante;
        for (let i = 0; i < this.contrincantes.length; i++) {
            areaContrincante = super.crearContrincante(this.contrincantes[i].getNombre());
            areaContrincante[this.REF_ACTIVO] = true;
            areaContrincante[PanelJuego.REF_CONTRINCANTE] = i;
            areaContrincante[PanelJuego.REF_CONTROLADOR] = this;
            this.areasContrincantes.push(areaContrincante);
            this.areaContrincantes.appendChild(areaContrincante);
        }
        this.contenedor.appendChild(this.areaContrincantes);
    }
    ponerEscuchadorAreaContrincantes() {
        for (let i of this.areasContrincantes) {
            i.addEventListener('click', this.escuchadorClickAreaContrincante);
        }
    }
    escuchadorClickAreaContrincante() {
        this[PanelJuego.REF_CONTROLADOR].escuchadorClickContrincante(this[PanelJuego.REF_CONTRINCANTE]);
    }
    escuchadorClickContrincante(indice) {
        if (this.contrincantes[indice].isEnJuego) {
            if (this.contrincanteSelecionado != null) {
                this.areasContrincantes[this.contrincanteSelecionado].classList.remove('contrincanteSeleccionado');
            }
            this.contrincanteSelecionado = indice;
            this.areasContrincantes[this.contrincanteSelecionado].classList.add('contrincanteSeleccionado');
            this.contrincantes[this.contrincanteSelecionado].setContrincanteActivoEscuchador(this.jugador);
            if (this.tableroContrincante !== undefined) {
                this.tableroContrincante.eliminarComponente();
            }
            this.tableroContrincante = this.contrincantes[this.contrincanteSelecionado].getTableroVisible();
            this.tableroContrincante.eliminarComponente();
            this.tableroContrincante.setNodoPadre(this.areaTableroContrincante);
            this.tableroContrincante.desplegarComponente();
        }
    }
    desplegarComponente() {
        if (this.pantallaOpaca !== undefined) {
            this.pantallaOpaca.desplegarComponente();
        }
        this.actualizarUsuariosFueraDeJuego();
        this.abrirTableroUltimo();
        this.contenedor.style.opacity = '1';
        this.nodoPadre.appendChild(this.contenedor);
    }
    iniciarTransicionEliminacion() {
        this.contenedor.style.opacity = '0';
    }
    abrirTableroUltimo() {
        if (this.areasContrincantes[this.contrincanteSelecionado] !== undefined) {
            if (this.areasContrincantes[this.contrincanteSelecionado][this.REF_ACTIVO]) {
                this.areasContrincantes[this.contrincanteSelecionado].click();
            }
            else {
                this.areasContrincantes[this.contrincanteSelecionado].classList.remove('contrincanteSeleccionado');
                for (let i = 0; i < this.areasContrincantes.length; i++) {
                    if (this.areasContrincantes[i][this.REF_ACTIVO]) {
                        this.contrincanteSelecionado = i;
                        this.abrirTableroUltimo();
                    }
                }
            }
        }
    }
    actualizarUsuariosFueraDeJuego() {
        for (let i = 0; i < this.contrincantes.length; i++) {
            if (!this.contrincantes[i].isEnJuego() && this.areasContrincantes[i][this.REF_ACTIVO]) {
                this.areasContrincantes[i][this.REF_ACTIVO] = false;
                this.areasContrincantes[i].childNodes[0].style.textDecoration = 'line-through';
                this.areasContrincantes[i].removeEventListener('click', this.escuchadorClickAreaContrincante);
            }
        }
    }
    eliminarComponente() {
        if (this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre) {
            this.nodoPadre.removeChild(this.contenedor);
        }
    }
    getAceptarToque() {
        return this.aceptarToque;
    }
    setAceptarToque(aceptarToque) {
        this.aceptarToque = aceptarToque;
    }
    getContrincanteActual() {
        return this.contrincantes[this.contrincanteSelecionado];
    }
    clikCeldaContrincante(fil, col) {
        this.tableroContrincante.click(fil, col);
    }
}
PanelJuego.REF_CONTRINCANTE = "contrincante_ref";
PanelJuego.REF_CONTROLADOR = "controlador_ref";
