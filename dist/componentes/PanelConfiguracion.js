import { ComponenteFactory } from "./ComponenteFactory.js";
import { MEDIDAS_CASILLAS } from "../Constantes.js";
export class PanelConfiguracion extends ComponenteFactory {
    constructor(nodoPadre, funcionEscuchadorJugar) {
        super();
        this.numJugadores = 1;
        this.nodoPadre = nodoPadre;
        this.funcionEscuchadorJugar = funcionEscuchadorJugar;
        this.crearElementos();
    }
    crearElementos() {
        this.contenedor = super.crearContenedor(400, 30);
        this.labMedidasTablero = super.crearSubtitulo("MEDIDAS TABLERO");
        this.contenedor.appendChild(this.labMedidasTablero);
        this.selectMedidasTablero = this.crearSelectMedidasTablero();
        this.contenedor.appendChild(this.selectMedidasTablero);
        this.labNumJugadores = super.crearSubtitulo("Nº JUGADORES");
        this.contenedor.appendChild(this.labNumJugadores);
        this.selectNumJugadores = this.crearSelectNumJugadores();
        this.asignarEscuchadorSelectNumJugadores();
        this.contenedor.appendChild(this.selectNumJugadores);
        this.labNombre = super.crearSubtitulo("NOMBRE/S");
        this.contenedor.appendChild(this.labNombre);
        this.inputNombres = this.crearInputs();
        this.desplegarInputs();
        this.btnJugar = super.crearBoton('JUGAR');
        this.asignarEscuchadorBtnJugar();
        this.contenedor.appendChild(this.btnJugar);
    }
    desplegarInputs() {
        for (let i = 0; i < this.inputNombres.length; i++) {
            if (i !== 0) {
                this.inputNombres[i].style.display = 'none';
                this.inputNombres[i].style.visibility = 'hidden';
            }
            this.contenedor.appendChild(this.inputNombres[i]);
        }
    }
    asignarEscuchadorSelectNumJugadores() {
        const ID_CONTROLADOR = 'controlador';
        this.selectNumJugadores[ID_CONTROLADOR] = this;
        this.selectNumJugadores.addEventListener('change', cambioJugadores);
        function cambioJugadores() {
            this[ID_CONTROLADOR].actualizarVista(parseInt(this.value));
        }
    }
    actualizarVista(nJugadores) {
        this.numJugadores = nJugadores;
        for (let i = 0; i < this.inputNombres.length; i++) {
            if (i < nJugadores) {
                this.inputNombres[i].style.display = 'block';
                this.inputNombres[i].style.visibility = 'visible';
            }
            else {
                this.inputNombres[i].style.display = 'none';
                this.inputNombres[i].style.visibility = 'hidden';
            }
        }
    }
    asignarEscuchadorBtnJugar() {
        const ID_CONTROLADOR = 'controlador';
        this.btnJugar[ID_CONTROLADOR] = this;
        this.btnJugar.addEventListener('click', function () {
            this[ID_CONTROLADOR].clickJugar();
        });
    }
    clickJugar() {
        var medidasTablero;
        var nombresJugadores = new Array();
        let correcto = true;
        let nombre;
        medidasTablero = parseInt(this.selectMedidasTablero.value);
        for (let i = 0; i < this.numJugadores && correcto; i++) {
            nombre = this.inputNombres[i].value;
            if (nombre == "") {
                correcto = false;
            }
            else {
                nombresJugadores.push(nombre);
            }
        }
        if (correcto) {
            this.funcionEscuchadorJugar(medidasTablero, nombresJugadores);
        }
        else {
            alert("Los campos del nombre de los jugadores no pueden estar vacíos.");
        }
    }
    crearInputs() {
        var inputs = new Array();
        for (let i = 0; i < PanelConfiguracion.NUM_JUGADORES_MAX; i++) {
            inputs[i] = super.crearInput();
        }
        return inputs;
    }
    crearSelectNumJugadores() {
        var selectNumJugadores = document.createElement('select');
        selectNumJugadores.classList.add('seleccionador');
        selectNumJugadores.classList.add('centrarElemento');
        for (let i = 1; i <= PanelConfiguracion.NUM_JUGADORES_MAX; i++) {
            selectNumJugadores.appendChild(super.crearOption(i.toString(), i.toString()));
        }
        return selectNumJugadores;
    }
    crearSelectMedidasTablero() {
        var selectMedidasTablero = document.createElement('select');
        selectMedidasTablero.classList.add('seleccionador');
        selectMedidasTablero.classList.add('centrarElemento');
        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._10x10.toString(), "10x10"));
        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._15x15.toString(), "15x15"));
        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._20x20.toString(), "20x20"));
        return selectMedidasTablero;
    }
    desplegarComponente() {
        this.contenedor.style.visibility = 'visible';
        this.nodoPadre.appendChild(this.contenedor);
    }
    eliminarComponente() {
        this.contenedor.style.visibility = 'hidden';
        if (this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre) {
            this.nodoPadre.removeChild(this.contenedor);
        }
    }
}
PanelConfiguracion.NUM_JUGADORES_MAX = 4;
