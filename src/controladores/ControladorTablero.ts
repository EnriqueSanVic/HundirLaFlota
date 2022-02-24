import { MEDIDAS_CASILLAS, confBarcosTablero,NUMERO_AGUA, SIMBOLO_NO_TOCADO, NUMERO_BARCO_4, NUMERO_BARCO_3, NUMERO_BARCO_2, conf_10x10, conf_15x15, conf_20x20, TIPO_CONTROLADOR} from "../Constantes.js";
import { Jugador } from "../actores/Jugador.js";
import { PanelEleccionTablero } from "../componentes/PanelEleccionTablero.js";
import { PanelJuego } from "../componentes/PanelJuego.js";
import { TableroGrafico, TIPO_TABLERO_GRAFICO } from "../componentes/TableroGrafico.js";

/**
 * Clase para representar una casilla lógica del tablero real de un jugador.
 * 
 * Una celda lógica real tiene en su estado un número que es el valor que guarda 
 * y que representa al tipo de barco que guarda esta celda y un booleano 
 * sobre si ha sido atacada.
 */
export class CeldaLogicaReal{
    
    public numero:number;
    public tocado:boolean;

    constructor(numero:number, tocado:boolean){
        this.numero = numero;
        this.tocado = tocado;
    }

}

/**
 * Clase para representar una casilla lógica del tablero visible de un jugador.
 * 
 * Una celda lógica visible tiene en su estado un símbolo (char) que es el valor que guarda 
 * y que representa el símbolo que aparecerá en el tablero gráfico.
 * 
 * Un booleano para ver si ha sido tocado por que había un barco y no era una posición vacía ante un ataque.
 * Un booleano para ver si ya ha sido descubierta por el enemigo o no.
 */
export class CeldaLogicaVisible{  

    public simbolo:string;
    public tocado:boolean;
    public descubierto:boolean;

    constructor(simbolo:string, tocado:boolean, descubierto:boolean){
        this.simbolo = simbolo;
        this.descubierto = descubierto;
        this.tocado = tocado;
    }
}

/**
 * Clase que sirve para gestionar todo el sistema de tableros de un jugador.
 * 
 * Gestiona:
 * 
 * -las matrices lógicas.
 * -Los componentes gráficos que representan las matrices lógicas;
 * -El panel de juego.
 * -El panel de elección del tablero.
 * 
 */
export class ControladorTablero{

    public static readonly EJEMPLO_CELDA_LOGICA_REAL:CeldaLogicaReal = new CeldaLogicaReal(0,false);
    public static readonly EJEMPLO_CELDA_LOGICA_VISIBLE:CeldaLogicaVisible = new CeldaLogicaVisible('-',false,false);
    
    public static readonly TIEMPO_DELAY_CLICK_CELDA:number = 800;

    private tipoControlador:TIPO_CONTROLADOR;

    private jugador:Jugador;

    private nFil:number;
    private nCol:number;

    private matrizLogicaReal:CeldaLogicaReal[][];
    private matrizLogicaVisible:CeldaLogicaVisible[][];

    private medidas:MEDIDAS_CASILLAS;

    private tableroReal:TableroGrafico;
    private tableroVisible:TableroGrafico;

    private panelEleccionTablero:PanelEleccionTablero;

    private panelJuego:PanelJuego;

    public constructor(jugador:Jugador, medidas:MEDIDAS_CASILLAS, tipoControlador:TIPO_CONTROLADOR){

        this.jugador = jugador;
        this.medidas = medidas;
        this.tipoControlador = tipoControlador;

        //se crean las matrices lógicas
        this.construirMatrizes();

        //se crean los tableros gráficos
        this.tableroReal = new TableroGrafico(this, TIPO_TABLERO_GRAFICO.TIPO_REAL, this.medidas);
        this.tableroVisible = new TableroGrafico(this, TIPO_TABLERO_GRAFICO.TIPO_VISIBLE, this.medidas);

        //se actualizan la primera vez respecto a sus matrices
        
        this.actualizarTableroReal();
        this.actualizarTableroVisible();

    }

    /**
     * Sirve para mandar un nuevo estado de la matriz lógica real al tablero gráfico que la representa
     * y que se actualice.
     */
    private actualizarTableroReal():void{
        this.tableroReal.actualizarTablero(this.matrizLogicaReal, true);
    }

    /**
     * Sirve para mandar un nuevo estado de la matriz lógica visible al tablero gráfico que la representa
     * y que se actualice.
     */
    private actualizarTableroVisible():void{
        this.tableroVisible.actualizarTablero(this.matrizLogicaVisible, true);
    }
    

    /**
     * Se contrullen las matrices lógicas dependiendo de las medidas seleccionadas.
     */
    private construirMatrizes(): void{
        
        switch(this.medidas){

            case MEDIDAS_CASILLAS._10x10:
                this.nFil = 10;
                this.nCol = 10;
                this.matrizLogicaReal = this.generarMatrizVacia<CeldaLogicaReal>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia<CeldaLogicaVisible>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
                break;

            case MEDIDAS_CASILLAS._15x15:
                this.nFil = 15;
                this.nCol = 15;
                this.matrizLogicaReal = this.generarMatrizVacia<CeldaLogicaReal>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia<CeldaLogicaVisible>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
                break;

            case MEDIDAS_CASILLAS._20x20:
                this.nFil = 20;
                this.nCol = 20;
                this.matrizLogicaReal = this.generarMatrizVacia<CeldaLogicaReal>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_REAL);
                this.matrizLogicaVisible = this.generarMatrizVacia<CeldaLogicaVisible>(this.nFil,this.nCol, ControladorTablero.EJEMPLO_CELDA_LOGICA_VISIBLE);
             break;

        }        

    }


    /**
     * Método para generar la matriz del tipo que se requiera 
     * llenando todas las posiciones con el simbolo que se le pase.
     * 
     * el simbolo ha de ser del mismo tipo que se pasa en <T> por que la 
     * matriz que se generará será también de tipo T.
     * 
     * @param nFilas numero de filas
     * @param nColumnas numero de columnas
     * @param ejemplo objeto de ejemplo del tipo que se quiere instanciar de casilla para poder usar instanceof
     * @returns matriz/array bidimensional de tipo T
     */
    private generarMatrizVacia <T extends CeldaLogicaReal|CeldaLogicaVisible> (nFilas:number, nColumnas:number, ejemplo:CeldaLogicaReal|CeldaLogicaVisible): T[][]{

        var matriz:T[][] = new Array();
        var celda:T;

        for(let i=0; i<nFilas; i++){

            matriz[i] = new Array(nColumnas);

            for(let j=0; j<nColumnas; j++){

                if(celda instanceof CeldaLogicaReal){

                    celda = <T> <unknown>new CeldaLogicaReal(NUMERO_AGUA,false);

                }else if(ejemplo instanceof CeldaLogicaVisible){

                    celda = <T> <unknown>new CeldaLogicaVisible(SIMBOLO_NO_TOCADO, false, false);

                }
                
                matriz[i][j] = celda;
            }
        }

        return matriz;

    }

    /**
     * Reinicia la matriz real con todas las posiciones en agua.
     */
    private reiniciarMatrizLogicaReal():void{
        for(let i=0; i< this.matrizLogicaReal.length; i++){
            for(let j=0; j< this.matrizLogicaReal[0].length; j++){
                this.matrizLogicaReal[i][j].numero = NUMERO_AGUA;
            }
        }
    }

    /**
     * Método que sirve para configurar una disposición de los barcos de manera aleatoria.
     * cada vez que se llame a este método se crearán nuevos estsdos de las matrices real
     * y visible y se actualizarán sus tableros gráficos homólogos.
     * 
     */
    public confBarcosAleatorios():void {

        //recogemos la configuracion de barcos relacionada con las medidas del tablero
        var configuracionTablero:confBarcosTablero;

        switch(this.medidas){
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

        //IMPORTANTE se reinicia la matriz lógica real antes de comenzar con el rellenado de barcos
        this.reiniciarMatrizLogicaReal();

        //se recorre cada tipo de barco el numero de veces que indique la configuración

        for(let i=0; i < configuracionTablero.BARCO_4_POS; i++){

            this.crearBarco(NUMERO_BARCO_4);

        }

        for(let i=0; i < configuracionTablero.BARCO_3_POS; i++){

            this.crearBarco(NUMERO_BARCO_3);

        }

        for(let i=0; i < configuracionTablero.BARCO_2_POS; i++){

            this.crearBarco(NUMERO_BARCO_2);

        }

    }


    /**
     * Genera un nuevo barco sobre la matriz lógica real en una posición
     * que no haya ya otro barco con una horientación vertical u horizontal 
     * aletatoria al 50%.
     *  
     * @param numeroBarco número del tipo de barco que se quire generar
     */
    private crearBarco(numeroBarco:number):void{

        let correcto:boolean = true;

        let fil:number, col:number;

        //true horizontal - false vertical
        let direccion: boolean = this.decidirDireccion();

        //se busca una posición a partir de la cual se pueda colocar siendo vertical u horizontal
        do{

            correcto = true;

            //se genera un punto random
            fil = this.getRandom(0, this.nFil);
            col = this.getRandom(0, this.nCol);

            if(direccion){
                //recorremos las casillas de la derecha a la escogida
                for(let k=fil; k < fil + numeroBarco && correcto; k++){
                    //hay que comprobar antes que la fila k existe por que si se sale de la matriz da herror al enviar this.matrizLogicaReal[k][col] por que no escapaz de leer la propiedad [col] de la fila k
                    //si el numero de la casilla no está definido o no es 0
                    if(typeof this.matrizLogicaReal[k] === 'undefined' || this.noEsValida(this.matrizLogicaReal[k][col])){
                        correcto = false;
                    }
                }
            
            }else{

                //recorremos las casillas de la derecha a la escogida
                for(let k=col; k < col + numeroBarco && correcto; k++){
                    //si el numero de la casilla no está definido o no es 0
                    if(this.noEsValida(this.matrizLogicaReal[fil][k])){
                        correcto = false;
                    }
                }
    
    
            }

            

        }while(!correcto);

        //en este punto las variable fil y col conjunto a la direccion tienen el valor de una casilla válida
        //a si que se imprime en la matriz

        if(direccion){
            //recorremos las casillas de la derecha a la escogida
            for(let k=fil; k < fil + numeroBarco; k++){
                this.matrizLogicaReal[k][col].numero = numeroBarco;
            }
        
        }else{

            //recorremos las casillas de la derecha a la escogida
            for(let k=col; k < col + numeroBarco; k++){
                this.matrizLogicaReal[fil][k].numero = numeroBarco;
            }

        }

        this.actualizarTableroReal();

    }

    //una casilla no es válida cuando es undefined o cuando tien otro numero diferente a 0
    private noEsValida(casilla:CeldaLogicaReal):boolean{
        return (typeof casilla === 'undefined' || casilla.numero !== 0);
    }
    /**
     * 
     * Método que decide la horientación de un barco.
     * 
     * @returns booleano que indica la dirección si es horizontal o vertical.
     */
    private decidirDireccion():boolean{

        let numero = Math.random();

        return (numero >= 0.5);
    }

    /**
     * Comprueba si el jugador ha sido derrotado por medio de
     * comprobar si entodas las posiciones de la matrizLogicaReal
     * en la que hay varcos han sido tocadas. De ser así se lo transmite a su objeto jugador.
     * 
     * Se presupone que el jugador ha sido derrotado y se recorrentodas las casillas y en el 
     * momento en el que haya una casilla con barco que no ha sido tocada se sale de la iteración 
     * sobre la matriz para ser una comprobación óptima y que no ocupe mucho procesamiento.
     * 
     * Con que haya una sola celda que es un barco y no está tocada significa
     * que el jugador todavia no ha sido derrotado.
     */
    private comprobarDerrota():boolean {

        let derrotado:boolean = true;

        for(let i:number=0; i < this.matrizLogicaReal.length && derrotado; i++){
            for(let j:number=0; j < this.matrizLogicaReal[0].length && derrotado; j++){

                if(this.matrizLogicaReal[i][j].numero !== NUMERO_AGUA && !this.matrizLogicaReal[i][j].tocado){
                    derrotado = false;
                }

            }
        }

        if(derrotado){
            this.jugador.setEnJuego(false);
            
        }

        return derrotado;

    }

    //min inclusive y max exclusive
    private getRandom(min, max):number {
        return Math.floor(Math.random() * (max - min)) + min;
      }


    //ZONA PANEL ELECCIÓN TABLERO
    public crearPanelEleccionTablero(nodoPadrePanelEleccion:HTMLElement):void{
        this.panelEleccionTablero = new PanelEleccionTablero(this, this.tableroReal, nodoPadrePanelEleccion, this.jugador.getNombre());
    }

    public desplegarPanelEleccionTablero():void{
        this.panelEleccionTablero.desplegarComponente();
    }


    public eliminarPanelEleccionTablero(): void{
        this.panelEleccionTablero.eliminarComponente();
    }

    /**
     * Evento que es llamado cuando el panel de elección de tablero ha terminado su fase.
     * @event
     */
    public eventoFinEleccionTablero():void{

        this.jugador.eventoFinEleccionTablero();

    }

    public getTableroVisible():TableroGrafico{
        return this.tableroVisible;
    }

    public getAceptarToquePanelJuego():boolean{
        return this.panelJuego.getAceptarToque();
    }

    public setAceptarToquePanelJuego(aceptarToque:boolean):void{
        return this.panelJuego.setAceptarToque(aceptarToque);
    }

    /**
     * crea un nuevo panel de juego.
     * @param nodoPadre nodo del DOm sobre el que se quiere desplegar el componente.
     * @param contrincantes array de contrincantes del jugador al que pertenece este controlador.
     */
    public crearPanelJuego(nodoPadre:HTMLElement, contrincantes:Jugador[]):void{
        this.panelJuego = new PanelJuego(this.jugador, this, this.tableroReal,nodoPadre, contrincantes);
    }


    /**
     * Despliega el panel de juego.
     */
    public desplegarPanelJuego():void{
        //se restablece la flag aceptarToque para que vuelva a damitir un toque en el tablero enemigo
        this.panelJuego.setAceptarToque(true);
        this.panelJuego.desplegarComponente();
    }

    public eliminarPanelJuego():void{
        this.panelJuego.eliminarComponente();
    }

    public iniciarTransicionEliminarPanelJuego():void {
        this.panelJuego.iniciarTransicionEliminacion();
    }

    /**
     * Este método se ejecuta desde el punto de vista de un juegador que está siendo atacado
     * por otro, de esta manera es la instancia del jugador atacado el que tiene la respontabilidad
     * de decidir que reacción desencadena el ataque, así queda la información sobre el estado de su
     * tablero encapsulada en la instancia del jugador sin que sean las instancias Jugador contrincantes
     * las que tengan que conocer el estado del tablero del contrincante.
     * @param fila coordenada fila en al que se ha producido el ataque.
     * @param columna coordenada columna en al que se ha producido el ataque.
     */
    public clickCasillaTableroVisible(fila:number, columna:number):void{

        let tocado:boolean = false;

        //si el punto ya está descubierto en la matriz visible no tiene que hacer nada
        //se pregunta si el panel de juego del jugador contrincante admite toques o no
        if(
            this.jugador.getContrincanteActivoEscuchador().getAceptarToquePanelJuego()
            &&
            !this.matrizLogicaVisible[fila][columna].descubierto
        ){
 

            //en la matriz visible simepre se va a descubir el punto del toque
            this.matrizLogicaVisible[fila][columna].descubierto = true;

            /**
             * Se comprueba que el numero no sea agua y que no haya sido tocado ya
             * en sese caso se toca en la matriz real y en la matriz visible
             */
            if(
                this.matrizLogicaReal[fila][columna].numero !== 0 
                && 
                !this.matrizLogicaReal[fila][columna].tocado 
            ){
                this.matrizLogicaReal[fila][columna].tocado = true;
                this.matrizLogicaVisible[fila][columna].tocado = true;
                tocado = true;
            
            /*si el toque se ha dado en un cero tiene que bloquearse la opción 
              de seguir dando toques en el panel de juego del contrincante.
            */
            }else if(
                this.matrizLogicaReal[fila][columna].numero === 0 
                && 
                !this.matrizLogicaReal[fila][columna].tocado
                ){
                this.jugador.getContrincanteActivoEscuchador().setAceptarToquePanelJuego(false);
            }

            //una vez realizados todos los ajustes vamos a comprobar si ha derrotado al jugador que tiene este controlador de tableos
            let derrotado = this.comprobarDerrota();

            //se actualizan los componentes gráficoas para plasmar el cambio.
            this.actualizarTableroReal();
            this.actualizarTableroVisible();

            //tarda un pequeño delay en notificar al jugador para que de tiempo a ver el resultado del toque


            setTimeout(function(controlador:ControladorTablero){

                controlador.jugador.clickCasillaTableroVisibleNotificarContrincante(tocado, derrotado);

            }, ControladorTablero.TIEMPO_DELAY_CLICK_CELDA, this);
            

        }


    }

    public getTipoControlador():TIPO_CONTROLADOR{
        return this.tipoControlador;
    }

    public getMatrizLogicaVisible():CeldaLogicaVisible[][]{
        return this.matrizLogicaVisible;
    }

    /**
     * Método para realizar la jugada automática del bot.
     * 
     * De manera provisional elije una celda aleatoria que no haya sido ya tocada.
     * 
     * Me gustaría haber implementado un sistema de inteligencia de ataque dependiendo del estado
     * actual del tablero del contrincnte pero por falta de tiempo de desarrollo he acabado implementando
     * este sistema de ataque a posiciones aleatorias.
     */
    public jugadaAutomatica():void{

        /**
         * Se comprueba que este controlador tenga permiso para usar esta función
         * Si esta instancia de controlador no la ha creado un jugador bot se lanza una excepción.
        */
        if(this.tipoControlador !== TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT){
            throw new Error("Solo pueda hacer una jugada automática un jugador con un ControladorTablero construido para el TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL");
        }

        let matrizLogicaVisibleContrincante:CeldaLogicaVisible[][] = this.panelJuego.getContrincanteActual().getMatrizLogicaVisible();

        let fil:number; 
        let col:number; 

        
        //se eligen coordenadas aleatorioas en la matriz del constrincante hasta que una no se haya descubierto
        do{

            fil = this.getRandom(0, this.nFil);
            col = this.getRandom(0, this.nCol);


        }while(matrizLogicaVisibleContrincante[fil][col].descubierto);

        //se da click en la celda del contrincante
        this.panelJuego.clikCeldaContrincante(fil,col);

        
    }

    

}


