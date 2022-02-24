
/*Se importan los módulos de otros ficheros como clases
 funciones namespaces incluso variables o constantes.
*/

import {Jugador} from './actores/Jugador.js';
import {MEDIDAS_CASILLAS, NOMBRE_BOT} from './Constantes.js';
import {ControladorSonido} from './controladores/ControladorSonido.js';
import { PanelConfiguracion } from './componentes/PanelConfiguracion.js';
import { PanelFinJuego } from './componentes/PanelFinJuego.js';
import { JugadorBot } from './actores/JugadorBot.js';

/**
 * Se encagará del icono de sonido y del 
 * comportamiento del sistema de sonido.
 */
export var controladorSonido:ControladorSonido;

var matriz:number[];


/**
 * Se encarga del componente gráfico del panel de configuración inicial del juego.
 */
export var panelConfiguracion:PanelConfiguracion;

export var panelFinJuego:PanelFinJuego;

/**
 * Array que contiene todos los jugadores de la partida.
 */
export var jugadores: Jugador[];

/**
 * Variable que sirve para controlar el estado de la fase de
 * eleción de configuración de tablero para cada uno de los jugadores 
 * dados de alta.
 */
export var fasesEleccionTablero:number;

/**
 * Variable que se encarga de controlar el estado de a qué jugador del array (por indice)
 * le corresponde el turno actual.
 */
export var turno:number;

window.onload = main;

/**
 * Punto de entrada a la aplicación, se llama cuando se produce el evento
 * window.onload .
 */
export function main():void{

    confControladorSonido();
    
    panelConfiguracion = new PanelConfiguracion(document.body, escuchadorConfInicialTerminada);

    panelConfiguracion.desplegarComponente();
    

}

/**
 * función para configurar el objeto Controlador de sonido del avariable controladorSonido.
 */
export function confControladorSonido():void{

    //se recoge el boton del paquete de sonido
    let btnSonido:HTMLElement = document.getElementById("btnSonido");

    //se recoge la imagen por medio del boton para ahorrar en id´s en el HTML
    let imgSonido:HTMLImageElement = <HTMLImageElement> btnSonido.children[0];

    //se instancia
    controladorSonido = new ControladorSonido(btnSonido, imgSonido);

    //se inicia de manera asíncrona tras 5 segundos desde la llamada de esta función
    controladorSonido.iniciarClip();
    
}

/**
 * 
 * 
 * Esta función será llamada cuando se produzca el evento de pasar del primer formulario
 * de nombres satisfactoriamente recibiendo un array con el nombre de todos los jugadores
 * que van a participar, de esta manera no se necesita pasar el número de jugadores.
 * 
 * La funciónn elimina el panel de configuración que hay en pantalla.
 * 
 * Genera todos los jugadores con la función generarJugadores().
 * 
 * Inicia la fase de elección de tablero paracada jugador.
 * 
 * @event
 * @param medidasTablero se pasan las medidas escogidas por el usuario.
 * @param nombresJugadores array con los nombres de los jugadores.
 */
export function escuchadorConfInicialTerminada(medidasTablero:MEDIDAS_CASILLAS,nombresJugadores:string[]):void{

    //se elimina el panel de configuración
    panelConfiguracion.eliminarComponente();

    //se generan los jugadores
    generarJugadores(nombresJugadores, medidasTablero);


    iniciarElegirTablero();
}

/**
 * Se inicia la fase de elección de la configuración del tablero
 * para cada jugador.
 * 
 * Esta fase se irá iterando para cada objeto jugador por medio de la 
 * función escuchadroTableroElegido().
 */
export function iniciarElegirTablero():void{
    
    fasesEleccionTablero = 0;
    
    jugadores[fasesEleccionTablero].elegirTablero(escuchadroTableroElegido, document.body);

}

/**
 * 
 * 
 * Esta función será llamada cada vez que un jugador haya finalizado 
 * la elección de su tablero.
 * 
 * En ese momento se llamará a la elección de tablero del siguiente.
 * 
 * Una vez completados todos se pasará a la fase de Juego con la función iniciarJuego().
 * 
 * @event
 */
export function escuchadroTableroElegido():void{

    ++fasesEleccionTablero;

    if(fasesEleccionTablero < jugadores.length){
        jugadores[fasesEleccionTablero].elegirTablero(escuchadroTableroElegido, document.body);
    }else{
        iniciarJuego();
    }
    

}

/**
 * Esta función inicia la fase de juego.
 * 
 * Prepara los jugadores con la función prepararJugadores().
 * 
 * Después empezará llamando al tablero de juego
 * del primer jugador.
 */
export function iniciarJuego():void{

    /*
     * Primero hay que hacer que un jugador conozca al resto de jugadores para poder 
     * acceder a sus tableros visibles.
     */
    prepararJugadores();

    turno = 0;

    jugadores[turno].iniciarTurno();
    
}

/**
 * 
 * 
 * Esta función será llamada por cada jugador después de que su turno finalice
 * lo que hace será controlar el flujo de ejecución del turno y invocar el inicio
 * de turno del siguiente jugador en caso de que este siga en juego.
 * si este no sigue en juego se vuelve a llamar a esta función para pasar turno
 * de manera recursiva.
 * 
 * @event
 */
export function escuchadorFinalizarTurno():void{

    if(++turno >= jugadores.length){
        turno = 0;
    }

    //comprobamos si se ha terminado la partida
    if(!comprobarFinPartida()){

        //si el jugador está en juego
        if(jugadores[turno].isEnJuego()){
    
            //se le llama a iniciar el turno
            jugadores[turno].iniciarTurno();
            
        }else{
            //si un jugador ya no setá en juego se pasa el siguiente llamando otra vez a este escuchador de forma recursiva
            escuchadorFinalizarTurno();
        }

    }

}

export function comprobarFinPartida():boolean{

    let jugadoresEnJuego:Jugador[] = new Array();

    //se pushean en el arra y los jugadores que todavía están en juego
    for(let i of jugadores){
        if(i.isEnJuego()){
            jugadoresEnJuego.push(i);
        }
    }

    //si solo hay más de un jugador en juego no se ha terminado la partida
    if(jugadoresEnJuego.length > 1){
        return false;
    }

    //en este punto significa que ya se ha terminado la partida
    //Se invoca el panel de fin partida

    panelFinJuego = new PanelFinJuego(document.body, jugadoresEnJuego[0].getNombre());

    panelFinJuego.desplegarComponente();

    return true;
}



/**
 * Función que recorre cada jugador pasandole una referencia a del resto de jugadores que
 * no son él para que así pueda conocer a sus contrincantes.
 * 
 * Después se le da a conocer a cada jugador la función escuchadora del fin del turno 
 * llamada finalizarTurno() .
 * 
 * Despues llama a la función de cada jugador que deja sus componentes construidos
 * y preparardos para iniciar el turno.
 */
export function prepararJugadores():void{
    
    for(let i of jugadores){
        for(let j of jugadores){
            if(i !== j){
                i.addContrincante(j);
            }
        }
    }

    for(let i of jugadores){
        i.setEscuchadorFinTurno(escuchadorFinalizarTurno);
        i.prepararJugador(document.body);
    }

}   

/**
 * Crea todos los objetos Jugador de la partida.
 * @param nombresJugadores Array con los nombre de los jugadores.
 * @param medidasTablero Medidas del tablero que se han escogido para que las conozcan los jugadores.
 */
export function generarJugadores(nombresJugadores:string[], medidasTablero:MEDIDAS_CASILLAS):void{

    jugadores = new Array();

    //si solo se ha escogido un jugador se crea para el modo bot
    if(nombresJugadores.length == 1){

        jugadores.push(new Jugador(nombresJugadores[0], medidasTablero, escuchadorFinalizarTurno));
        jugadores.push(new JugadorBot(NOMBRE_BOT, medidasTablero, escuchadorFinalizarTurno));

    //si no se crea el modo multijugador
    }else{

        for(let i:number = 0; i < nombresJugadores.length; i++){

            jugadores.push(new Jugador(nombresJugadores[i], medidasTablero, escuchadorFinalizarTurno));
    
        }

    }

    

}



