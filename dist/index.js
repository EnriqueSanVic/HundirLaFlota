import { Jugador } from './actores/Jugador.js';
import { NOMBRE_BOT } from './Constantes.js';
import { ControladorSonido } from './controladores/ControladorSonido.js';
import { PanelConfiguracion } from './componentes/PanelConfiguracion.js';
import { PanelFinJuego } from './componentes/PanelFinJuego.js';
import { JugadorBot } from './actores/JugadorBot.js';
export var controladorSonido;
export var panelConfiguracion;
export var panelFinJuego;
export var jugadores;
export var fasesEleccionTablero;
export var turno;
window.onload = main;
export function main() {
    confControladorSonido();
    panelConfiguracion = new PanelConfiguracion(document.body, escuchadorConfInicialTerminada);
    panelConfiguracion.desplegarComponente();
}
export function confControladorSonido() {
    let btnSonido = document.getElementById("btnSonido");
    let imgSonido = btnSonido.children[0];
    controladorSonido = new ControladorSonido(btnSonido, imgSonido);
    controladorSonido.iniciarClip();
}
export function escuchadorConfInicialTerminada(medidasTablero, nombresJugadores) {
    panelConfiguracion.eliminarComponente();
    generarJugadores(nombresJugadores, medidasTablero);
    iniciarElegirTablero();
}
export function iniciarElegirTablero() {
    fasesEleccionTablero = 0;
    jugadores[fasesEleccionTablero].elegirTablero(escuchadroTableroElegido, document.body);
}
export function escuchadroTableroElegido() {
    ++fasesEleccionTablero;
    if (fasesEleccionTablero < jugadores.length) {
        jugadores[fasesEleccionTablero].elegirTablero(escuchadroTableroElegido, document.body);
    }
    else {
        iniciarJuego();
    }
}
export function iniciarJuego() {
    prepararJugadores();
    turno = 0;
    jugadores[turno].iniciarTurno();
}
export function escuchadorFinalizarTurno() {
    if (++turno >= jugadores.length) {
        turno = 0;
    }
    if (!comprobarFinPartida()) {
        if (jugadores[turno].isEnJuego()) {
            jugadores[turno].iniciarTurno();
        }
        else {
            escuchadorFinalizarTurno();
        }
    }
}
export function comprobarFinPartida() {
    let jugadoresEnJuego = new Array();
    for (let i of jugadores) {
        if (i.isEnJuego()) {
            jugadoresEnJuego.push(i);
        }
    }
    if (jugadoresEnJuego.length > 1) {
        return false;
    }
    panelFinJuego = new PanelFinJuego(document.body, jugadoresEnJuego[0].getNombre());
    panelFinJuego.desplegarComponente();
    return true;
}
export function prepararJugadores() {
    for (let i of jugadores) {
        for (let j of jugadores) {
            if (i !== j) {
                i.addContrincante(j);
            }
        }
    }
    for (let i of jugadores) {
        i.setEscuchadorFinTurno(escuchadorFinalizarTurno);
        i.prepararJugador(document.body);
    }
}
export function generarJugadores(nombresJugadores, medidasTablero) {
    jugadores = new Array();
    if (nombresJugadores.length == 1) {
        jugadores.push(new Jugador(nombresJugadores[0], medidasTablero, escuchadorFinalizarTurno));
        jugadores.push(new JugadorBot(NOMBRE_BOT, medidasTablero, escuchadorFinalizarTurno));
    }
    else {
        for (let i = 0; i < nombresJugadores.length; i++) {
            jugadores.push(new Jugador(nombresJugadores[i], medidasTablero, escuchadorFinalizarTurno));
        }
    }
}
