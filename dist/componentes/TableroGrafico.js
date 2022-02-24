import { COLOR_AGUA, COLOR_BARCO_2, COLOR_BARCO_3, COLOR_BARCO_4, COLOR_TOCADO, MEDIDAS_CASILLAS, NUMERO_AGUA, NUMERO_BARCO_2, NUMERO_BARCO_3, NUMERO_BARCO_4 } from "../Constantes.js";
import { CeldaLogicaReal, CeldaLogicaVisible } from "../controladores/ControladorTablero.js";
export var TIPO_TABLERO_GRAFICO;
(function (TIPO_TABLERO_GRAFICO) {
    TIPO_TABLERO_GRAFICO[TIPO_TABLERO_GRAFICO["TIPO_REAL"] = 0] = "TIPO_REAL";
    TIPO_TABLERO_GRAFICO[TIPO_TABLERO_GRAFICO["TIPO_VISIBLE"] = 1] = "TIPO_VISIBLE";
})(TIPO_TABLERO_GRAFICO || (TIPO_TABLERO_GRAFICO = {}));
export class TableroGrafico {
    constructor(controlador, tipoTablero, medidas) {
        this.controlador = controlador;
        this.tipoTablero = tipoTablero;
        this.medidas = medidas;
        this.recogerMedidas();
        this.crearContenedor();
        this.generarCeldas();
        this.ponerCeldas();
    }
    crearContenedor() {
        this.contenedor = document.createElement('div');
        this.contenedor.style.gridTemplateRows = 'repeat(' + this.nFil + ',auto)';
        this.contenedor.style.gridTemplateColumns = 'repeat(' + this.nCol + ',auto)';
        this.contenedor.classList.add('contenedorTablero');
    }
    recogerMedidas() {
        switch (this.medidas) {
            case MEDIDAS_CASILLAS._10x10:
                this.nFil = 10;
                this.nCol = 10;
                this.fontSize = '24px';
                break;
            case MEDIDAS_CASILLAS._15x15:
                this.nFil = 15;
                this.nCol = 15;
                this.fontSize = '18px';
                break;
            case MEDIDAS_CASILLAS._20x20:
                this.nFil = 20;
                this.nCol = 20;
                this.fontSize = '13px';
                break;
        }
    }
    generarCeldas() {
        this.celdas = new Array();
        for (let i = 0; i < this.nFil; i++) {
            this.celdas[i] = new Array(this.nCol);
            for (let j = 0; j < this.nCol; j++) {
                this.celdas[i][j] = this.generarCelda(i, j);
            }
        }
    }
    generarCelda(i, j) {
        var celda = document.createElement('div');
        celda[TableroGrafico.REF_FILA] = i;
        celda[TableroGrafico.REF_COLUMNA] = j;
        celda[TableroGrafico.REF_CONTROLADOR] = this.controlador;
        celda.classList.add('celda');
        if (this.tipoTablero === TIPO_TABLERO_GRAFICO.TIPO_VISIBLE) {
            celda.classList.add('celdaVisible');
            celda.addEventListener('click', this.clickCelda);
        }
        celda.style.fontSize = this.fontSize;
        return celda;
    }
    clickCelda() {
        this[TableroGrafico.REF_CONTROLADOR].clickCasillaTableroVisible(this[TableroGrafico.REF_FILA], this[TableroGrafico.REF_COLUMNA]);
    }
    ponerCeldas() {
        for (let i = 0; i < this.celdas.length; i++) {
            for (let j = 0; j < this.celdas[0].length; j++) {
                this.contenedor.appendChild(this.celdas[i][j]);
            }
        }
    }
    actualizarTablero(matriz, colorear) {
        for (let i = 0; i < this.celdas.length; i++) {
            for (let j = 0; j < this.celdas[0].length; j++) {
                if (matriz[0][0] instanceof CeldaLogicaReal) {
                    this.celdas[i][j].innerText = '' + matriz[i][j].numero;
                    if (colorear) {
                        this.colorearCelda(this.celdas[i][j], matriz[i][j]);
                    }
                }
                else if (matriz[0][0] instanceof CeldaLogicaVisible) {
                    this.celdas[i][j].innerText = '' + matriz[i][j].simbolo;
                    if (colorear) {
                        this.colorearCelda(this.celdas[i][j], matriz[i][j]);
                    }
                }
            }
        }
    }
    colorearCelda(celda, celdaLogica) {
        if (celdaLogica instanceof CeldaLogicaReal) {
            switch (celdaLogica.numero) {
                case NUMERO_AGUA:
                    celda.style.backgroundColor = COLOR_AGUA;
                    break;
                case NUMERO_BARCO_2:
                    celda.style.backgroundColor = COLOR_BARCO_2;
                    break;
                case NUMERO_BARCO_3:
                    celda.style.backgroundColor = COLOR_BARCO_3;
                    break;
                case NUMERO_BARCO_4:
                    celda.style.backgroundColor = COLOR_BARCO_4;
                    break;
            }
            if (celdaLogica.tocado) {
                celda.style.color = 'red';
                celda.style.textDecoration = 'line-through';
            }
        }
        else if (celdaLogica instanceof CeldaLogicaVisible) {
            if (celdaLogica.descubierto && celdaLogica.tocado) {
                celda.style.backgroundColor = COLOR_TOCADO;
            }
            else if (celdaLogica.descubierto && !celdaLogica.tocado) {
                celda.style.backgroundColor = COLOR_AGUA;
            }
        }
    }
    setNodoPadre(nodoPadre) {
        this.nodoPadre = nodoPadre;
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
    click(fil, col) {
        this.celdas[fil][col].click();
    }
}
TableroGrafico.REF_FILA = 'fila';
TableroGrafico.REF_COLUMNA = 'columna';
TableroGrafico.REF_CONTROLADOR = 'controlador';
