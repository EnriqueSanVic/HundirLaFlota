
import { MEDIDAS_CASILLAS, TIEMPO_ANIMACION_ELIMINAR_PANEL_JUEGO, TIPO_CONTROLADOR } from '../Constantes.js';
import {CeldaLogicaVisible, ControladorTablero} from '../controladores/ControladorTablero.js';
import { TableroGrafico } from '../componentes/TableroGrafico.js';
import { JugadorBot } from './JugadorBot.js';

/**
 * Clase para el perfil de un jugador humano.
 */
export class Jugador{

    private nombre:string;

    protected controladorTablero:ControladorTablero;

    protected escuchadorTableroElegido:Function;

    private contrincantes:Jugador[];

    private contrincanteActivoEscuchador:Jugador;

    //booleano que define si un jugador está en juego o no
    private enJuego:boolean;

    private escuchadorFinTurno:Function;

    public constructor(nombre:string, medida:MEDIDAS_CASILLAS, escuchadorFinTurno:Function){

        this.nombre = nombre;
        this.crearTablero(medida);
        this.escuchadorFinTurno = escuchadorFinTurno;

        this.enJuego = true;
        
        this.contrincantes = new Array();
   
    }

    //se declara como método a parte
    protected crearTablero(medida:MEDIDAS_CASILLAS):void{
        this.controladorTablero = new ControladorTablero(this, medida, TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL);
    }

    /**
     * Inicio de la fase de elegir la configuración de tablero de un jugador normal.
     * Este método despliega el componente de elección de tablero.
     * @param escuchadorTableroElegido función evento del index que se llamará cuando se termine de ejecutar la eleción.
     * @param nodoPadre nodo del DOM en el que se quiere desplegar el panel de eleción de tablero. 
     */
    public elegirTablero(escuchadorTableroElegido:Function, nodoPadre:HTMLElement):void{
        this.escuchadorTableroElegido = escuchadorTableroElegido;
        this.controladorTablero.crearPanelEleccionTablero(nodoPadre);
        this.controladorTablero.desplegarPanelEleccionTablero();
    }

    /**
     * Cuando se produce el evento de finalización de la elección de tablero 
     * el propio Controlador de tablero llamará a este método que a su vez
     * llamará al método de la vista que confirma finalmente la finalización.
     * @event
     */
    public eventoFinEleccionTablero():void{

        this.controladorTablero.eliminarPanelEleccionTablero();

        this.escuchadorTableroElegido();
    }

 
    public prepararJugador(nodoPadre:HTMLElement){
        this.controladorTablero.crearPanelJuego(nodoPadre, this.contrincantes);
    }

    /**
     * Método para iniciar el turno de un jugador, se desplegará el componente del panel de juego.
     */
    public iniciarTurno():void{

        this.controladorTablero.desplegarPanelJuego();

    }

    public getNombre():string{
        return this.nombre;
    }

    /**
     * Método para añadir otro jugador como contrincante de esta instancia.
     * @param jugador 
     */
    public addContrincante(jugador:Jugador):void{
        this.contrincantes.push(jugador);
    }

    public getTableroVisible():TableroGrafico{
        return this.controladorTablero.getTableroVisible();
    }

    public setEnJuego(enJuego:boolean):void{
        this.enJuego = enJuego;
    }

    public isEnJuego():boolean{
        return this.enJuego;
    }

    public setEscuchadorFinTurno(escuchador:Function){
        this.escuchadorFinTurno = escuchador;
    }

    public setContrincanteActivoEscuchador(contrincante:Jugador):void{
        this.contrincanteActivoEscuchador = contrincante;
    }

    public getContrincanteActivoEscuchador():Jugador{
        return this.contrincanteActivoEscuchador;
    }

    
    public getAceptarToquePanelJuego():boolean{
        return this.controladorTablero.getAceptarToquePanelJuego();
    }

    public setAceptarToquePanelJuego(aceptarToque:boolean):void{
        return this.controladorTablero.setAceptarToquePanelJuego(aceptarToque);
    }

    /**
     * Evento para notificar un ataque sobre la celda de un tablero del contrincante.
     * @event
     * @param tocado 
     * @param derrotado 
     */
    public clickCasillaTableroVisibleNotificarContrincante(tocado:boolean, derrotado:boolean):void{
        this.contrincanteActivoEscuchador.escuchadorEventoAtaqueContrincante(tocado, derrotado);
    }

    public getMatrizLogicaVisible():CeldaLogicaVisible[][]{
        return this.controladorTablero.getMatrizLogicaVisible();
    }

    /**
     * Escuchado del evento de la notificación del resultado de un ataque de un jugador a otro.
     * 
     * @event
     */
    public escuchadorEventoAtaqueContrincante(tocado:boolean, derrotado:boolean):void{

        /*Se hace este cambio de valores de las variables para que aunque haya sido tocado true
          no se debe de dar la oportunidad de seguir atacando y hay que cambiarla de valor a false
          para que el siguiente bloque de sentencias se comporte correctamente.
        */
        if(derrotado){
            tocado = false;
        }

        //solo si no se ha tocaodo ningún barco se eleimina el tablero y se pasa turno.
        if(!tocado){

            this.controladorTablero.iniciarTransicionEliminarPanelJuego();

            setTimeout(function(controlador:Jugador){

                controlador.controladorTablero.eliminarPanelJuego();
                controlador.escuchadorFinTurno();

            }, TIEMPO_ANIMACION_ELIMINAR_PANEL_JUEGO, this);
            
        }else{
            //si ha tocado y el contrincante es un JugadorBot tiene que volver a dar un toque
            /*Se que lo suyo es usar instanceof pero daba un error muy extraño javascript
              log -- Uncaught ReferenceError: Cannot access 'Class' before initialization
            */
            //es una forma muy rara pero no funcionaba tampoco !== undefined, no tiene sentido, ECMASCRPT 2016??
            if(typeof((<JugadorBot><unknown>this).TOKEN_BOT) === 'boolean'){
                
                (<JugadorBot><unknown>this).atacar();

            }

        }

    }

    protected getControladorTablero():ControladorTablero{
        return this.controladorTablero;
    }

}