import { TIPO_CONTROLADOR } from "../Constantes.js";
import { ControladorTablero } from "../controladores/ControladorTablero.js";
import { Jugador } from "./Jugador.js";
export class JugadorBot extends Jugador {
    constructor(nombre, medida, escuchadorFinTurno) {
        super(nombre, medida, escuchadorFinTurno);
        this.TIEMPO_DELAY_CLICK_AUTO = 1500;
        this.TOKEN_BOT = true;
    }
    crearTablero(medida) {
        this.controladorTablero = new ControladorTablero(this, medida, TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT);
    }
    elegirTablero(escuchadorTableroElegido, nodoPadre) {
        this.escuchadorTableroElegido = escuchadorTableroElegido;
        this.controladorTablero.confBarcosAleatorios();
        this.escuchadorTableroElegido();
    }
    iniciarTurno() {
        super.iniciarTurno();
        this.atacar();
    }
    atacar() {
        setTimeout((controladorTablero) => {
            try {
                controladorTablero.jugadaAutomatica();
            }
            catch (error) {
                console.log(error);
            }
        }, this.TIEMPO_DELAY_CLICK_AUTO, super.getControladorTablero());
    }
}
