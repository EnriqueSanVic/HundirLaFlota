import { TIEMPO_ANIMACION_ELIMINAR_PANEL_JUEGO, TIPO_CONTROLADOR } from '../Constantes.js';
import { ControladorTablero } from '../controladores/ControladorTablero.js';
export class Jugador {
    constructor(nombre, medida, escuchadorFinTurno) {
        this.nombre = nombre;
        this.crearTablero(medida);
        this.escuchadorFinTurno = escuchadorFinTurno;
        this.enJuego = true;
        this.contrincantes = new Array();
    }
    crearTablero(medida) {
        this.controladorTablero = new ControladorTablero(this, medida, TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL);
    }
    elegirTablero(escuchadorTableroElegido, nodoPadre) {
        this.escuchadorTableroElegido = escuchadorTableroElegido;
        this.controladorTablero.crearPanelEleccionTablero(nodoPadre);
        this.controladorTablero.desplegarPanelEleccionTablero();
    }
    eventoFinEleccionTablero() {
        this.controladorTablero.eliminarPanelEleccionTablero();
        this.escuchadorTableroElegido();
    }
    prepararJugador(nodoPadre) {
        this.controladorTablero.crearPanelJuego(nodoPadre, this.contrincantes);
    }
    iniciarTurno() {
        this.controladorTablero.desplegarPanelJuego();
    }
    getNombre() {
        return this.nombre;
    }
    addContrincante(jugador) {
        this.contrincantes.push(jugador);
    }
    getTableroVisible() {
        return this.controladorTablero.getTableroVisible();
    }
    setEnJuego(enJuego) {
        this.enJuego = enJuego;
    }
    isEnJuego() {
        return this.enJuego;
    }
    setEscuchadorFinTurno(escuchador) {
        this.escuchadorFinTurno = escuchador;
    }
    setContrincanteActivoEscuchador(contrincante) {
        this.contrincanteActivoEscuchador = contrincante;
    }
    getContrincanteActivoEscuchador() {
        return this.contrincanteActivoEscuchador;
    }
    getAceptarToquePanelJuego() {
        return this.controladorTablero.getAceptarToquePanelJuego();
    }
    setAceptarToquePanelJuego(aceptarToque) {
        return this.controladorTablero.setAceptarToquePanelJuego(aceptarToque);
    }
    clickCasillaTableroVisibleNotificarContrincante(tocado, derrotado) {
        this.contrincanteActivoEscuchador.escuchadorEventoAtaqueContrincante(tocado, derrotado);
    }
    getMatrizLogicaVisible() {
        return this.controladorTablero.getMatrizLogicaVisible();
    }
    escuchadorEventoAtaqueContrincante(tocado, derrotado) {
        if (derrotado) {
            tocado = false;
        }
        if (!tocado) {
            this.controladorTablero.iniciarTransicionEliminarPanelJuego();
            setTimeout(function (controlador) {
                controlador.controladorTablero.eliminarPanelJuego();
                controlador.escuchadorFinTurno();
            }, TIEMPO_ANIMACION_ELIMINAR_PANEL_JUEGO, this);
        }
        else {
            console.log(typeof (this.TOKEN_BOT));
            if (typeof (this.TOKEN_BOT) === 'boolean') {
                console.log(this);
                this.atacar();
            }
        }
    }
    getControladorTablero() {
        return this.controladorTablero;
    }
}
