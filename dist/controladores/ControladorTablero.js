import { MEDIDAS_CASILLAS, NUMERO_AGUA, SIMBOLO_NO_TOCADO, NUMERO_BARCO_4, NUMERO_BARCO_3, NUMERO_BARCO_2, conf_10x10, conf_15x15, conf_20x20, TIPO_CONTROLADOR } from "../Constantes.js";
import { PanelEleccionTablero } from "../componentes/PanelEleccionTablero.js";
import { PanelJuego } from "../componentes/PanelJuego.js";
import { TableroGrafico, TIPO_TABLERO_GRAFICO } from "../componentes/TableroGrafico.js";
export class CeldaLogicaReal {
    constructor(numero, tocado) {
        this.numero = numero;
        this.tocado = tocado;
    }
}
export class CeldaLogicaVisible {
    constructor(simbolo, tocado, descubierto) {
        this.simbolo = simbolo;
        this.descubierto = descubierto;
        this.tocado = tocado;
    }
}
export class ControladorTablero {
    constructor(jugador, medidas, tipoControlador) {
        this.jugador = jugador;
        this.medidas = medidas;
        this.tipoControlador = tipoControlador;
        this.construirMatrizes();
        this.tableroReal = new TableroGrafico(this, TIPO_TABLERO_GRAFICO.TIPO_REAL, this.medidas);
        this.tableroVisible = new TableroGrafico(this, TIPO_TABLERO_GRAFICO.TIPO_VISIBLE, this.medidas);
        this.actualizarTableroReal();
        this.actualizarTableroVisible();
    }
    actualizarTableroReal() {
        this.tableroReal.actualizarTablero(this.matrizLogicaReal, true);
    }
    actualizarTableroVisible() {
        this.tableroVisible.actualizarTablero(this.matrizLogicaVisible, true);
    }
    construirMatrizes() {
        switch (this.medidas) {
            case MEDIDAS_CASILLAS._10x10:
                this.nFil = 10;
                this.nCol = 10;
                this.matrizLogicaReal = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
                break;
            case MEDIDAS_CASILLAS._15x15:
                this.nFil = 15;
                this.nCol = 15;
                this.matrizLogicaReal = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
                break;
            case MEDIDAS_CASILLAS._20x20:
                this.nFil = 20;
                this.nCol = 20;
                this.matrizLogicaReal = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia(this.nFil, this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
                break;
        }
    }
    generarMatrizVacia(nFilas, nColumnas, ejemplo) {
        var matriz = new Array();
        var celda;
        for (let i = 0; i < nFilas; i++) {
            matriz[i] = new Array(nColumnas);
            for (let j = 0; j < nColumnas; j++) {
                if (ejemplo instanceof CeldaLogicaReal) {
                    celda = new CeldaLogicaReal(NUMERO_AGUA, false);
                }
                else if (ejemplo instanceof CeldaLogicaVisible) {
                    celda = new CeldaLogicaVisible(SIMBOLO_NO_TOCADO, false, false);
                }
                matriz[i][j] = celda;
            }
        }
        return matriz;
    }
    reiniciarMatrizLogicaReal() {
        for (let i = 0; i < this.matrizLogicaReal.length; i++) {
            for (let j = 0; j < this.matrizLogicaReal[0].length; j++) {
                this.matrizLogicaReal[i][j].numero = NUMERO_AGUA;
            }
        }
    }
    confBarcosAleatorios() {
        var configuracionTablero;
        switch (this.medidas) {
            case MEDIDAS_CASILLAS._10x10:
                configuracionTablero = conf_10x10;
                break;
            case MEDIDAS_CASILLAS._15x15:
                configuracionTablero = conf_15x15;
                break;
            case MEDIDAS_CASILLAS._20x20:
                configuracionTablero = conf_20x20;
                break;
        }
        this.reiniciarMatrizLogicaReal();
        for (let i = 0; i < configuracionTablero.BARCO_4_POS; i++) {
            this.crearBarco(NUMERO_BARCO_4);
        }
        for (let i = 0; i < configuracionTablero.BARCO_3_POS; i++) {
            this.crearBarco(NUMERO_BARCO_3);
        }
        for (let i = 0; i < configuracionTablero.BARCO_2_POS; i++) {
            this.crearBarco(NUMERO_BARCO_2);
        }
    }
    crearBarco(numeroBarco) {
        let correcto = true;
        let fil, col;
        let direccion = this.decidirDireccion();
        do {
            correcto = true;
            fil = this.getRandom(0, this.nFil);
            col = this.getRandom(0, this.nCol);
            if (direccion) {
                for (let k = fil; k < fil + numeroBarco && correcto; k++) {
                    if (typeof this.matrizLogicaReal[k] === 'undefined' || this.noEsValida(this.matrizLogicaReal[k][col])) {
                        correcto = false;
                    }
                }
            }
            else {
                for (let k = col; k < col + numeroBarco && correcto; k++) {
                    if (this.noEsValida(this.matrizLogicaReal[fil][k])) {
                        correcto = false;
                    }
                }
            }
        } while (!correcto);
        if (direccion) {
            for (let k = fil; k < fil + numeroBarco; k++) {
                this.matrizLogicaReal[k][col].numero = numeroBarco;
            }
        }
        else {
            for (let k = col; k < col + numeroBarco; k++) {
                this.matrizLogicaReal[fil][k].numero = numeroBarco;
            }
        }
        this.actualizarTableroReal();
    }
    noEsValida(casilla) {
        return (typeof casilla === 'undefined' || casilla.numero !== 0);
    }
    decidirDireccion() {
        let numero = Math.random();
        return (numero >= 0.5);
    }
    comprobarDerrota() {
        let derrotado = true;
        for (let i = 0; i < this.matrizLogicaReal.length && derrotado; i++) {
            for (let j = 0; j < this.matrizLogicaReal[0].length && derrotado; j++) {
                if (this.matrizLogicaReal[i][j].numero !== NUMERO_AGUA && !this.matrizLogicaReal[i][j].tocado) {
                    derrotado = false;
                }
            }
        }
        if (derrotado) {
            this.jugador.setEnJuego(false);
        }
        return derrotado;
    }
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    crearPanelEleccionTablero(nodoPadrePanelEleccion) {
        this.panelEleccionTablero = new PanelEleccionTablero(this, this.tableroReal, nodoPadrePanelEleccion, this.jugador.getNombre());
    }
    desplegarPanelEleccionTablero() {
        this.panelEleccionTablero.desplegarComponente();
    }
    eliminarPanelEleccionTablero() {
        this.panelEleccionTablero.eliminarComponente();
    }
    eventoFinEleccionTablero() {
        this.jugador.eventoFinEleccionTablero();
    }
    getTableroVisible() {
        return this.tableroVisible;
    }
    getAceptarToquePanelJuego() {
        return this.panelJuego.getAceptarToque();
    }
    setAceptarToquePanelJuego(aceptarToque) {
        return this.panelJuego.setAceptarToque(aceptarToque);
    }
    crearPanelJuego(nodoPadre, contrincantes) {
        this.panelJuego = new PanelJuego(this.jugador, this, this.tableroReal, nodoPadre, contrincantes);
    }
    desplegarPanelJuego() {
        this.panelJuego.setAceptarToque(true);
        this.panelJuego.desplegarComponente();
    }
    eliminarPanelJuego() {
        this.panelJuego.eliminarComponente();
    }
    iniciarTransicionEliminarPanelJuego() {
        this.panelJuego.iniciarTransicionEliminacion();
    }
    clickCasillaTableroVisible(fila, columna) {
        let tocado = false;
        if (this.jugador.getContrincanteActivoEscuchador().getAceptarToquePanelJuego()
            &&
                !this.matrizLogicaVisible[fila][columna].descubierto) {
            this.matrizLogicaVisible[fila][columna].descubierto = true;
            if (this.matrizLogicaReal[fila][columna].numero !== 0
                &&
                    !this.matrizLogicaReal[fila][columna].tocado) {
                this.matrizLogicaReal[fila][columna].tocado = true;
                this.matrizLogicaVisible[fila][columna].tocado = true;
                tocado = true;
            }
            else if (this.matrizLogicaReal[fila][columna].numero === 0
                &&
                    !this.matrizLogicaReal[fila][columna].tocado) {
                this.jugador.getContrincanteActivoEscuchador().setAceptarToquePanelJuego(false);
            }
            let derrotado = this.comprobarDerrota();
            this.actualizarTableroReal();
            this.actualizarTableroVisible();
            setTimeout(function (controlador) {
                controlador.jugador.clickCasillaTableroVisibleNotificarContrincante(tocado, derrotado);
            }, ControladorTablero.TIEMPO_DELAY_CLICK_CELDA, this);
        }
    }
    getTipoControlador() {
        return this.tipoControlador;
    }
    getMatrizLogicaVisible() {
        return this.matrizLogicaVisible;
    }
    jugadaAutomatica() {
        if (this.tipoControlador !== TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT) {
            throw new Error("Solo pueda hacer una jugada automática un jugador con un ControladorTablero construido para el TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL");
        }
        let matrizLogicaVisibleContrincante = this.panelJuego.getContrincanteActual().getMatrizLogicaVisible();
        let fil;
        let col;
        do {
            fil = this.getRandom(0, this.nFil);
            col = this.getRandom(0, this.nCol);
        } while (matrizLogicaVisibleContrincante[fil][col].descubierto);
        this.panelJuego.clikCeldaContrincante(fil, col);
    }
}
ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL = new CeldaLogicaReal(0, false);
ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE = new CeldaLogicaVisible('-', false, false);
ControladorTablero.TIEMPO_DELAY_CLICK_CELDA = 800;
