import { Componente } from "./Componente.js";
import { COLOR_AGUA, COLOR_BARCO_2, COLOR_BARCO_3, COLOR_BARCO_4, COLOR_TOCADO, MEDIDAS_CASILLAS, NUMERO_AGUA, NUMERO_BARCO_2, NUMERO_BARCO_3, NUMERO_BARCO_4 } from "../Constantes.js";
import { CeldaLogicaReal, CeldaLogicaVisible, ControladorTablero } from "../controladores/ControladorTablero.js";

export enum TIPO_TABLERO_GRAFICO{
    TIPO_REAL,
    TIPO_VISIBLE
}

/**
 * Componente gráfico.
 * 
 * Este es el componetne de un tablero,
 * por medio de polimorfismo se pueden generar tableros de tipo real (tablero que puede ver el jugador dueño del tablero) 
 * o de tipo visible (tablero que pueden ver los contrincantes de un jugador).
 */
export class TableroGrafico implements Componente{
    

    public static readonly REF_FILA:string = 'fila';
    public static readonly REF_COLUMNA:string = 'columna';
    public static readonly REF_CONTROLADOR:string = 'controlador';

    private tipoTablero:TIPO_TABLERO_GRAFICO;

    private medidas:MEDIDAS_CASILLAS;

    private controlador:ControladorTablero;

    private fontSize:string;

    public nodoPadre:HTMLElement;

    private contenedor:HTMLDivElement;

    private celdas:HTMLDivElement[][];

    private nFil:number;
    private nCol:number;

    constructor(controlador:ControladorTablero, tipoTablero:TIPO_TABLERO_GRAFICO, medidas:MEDIDAS_CASILLAS){

        this.controlador = controlador;

        this.tipoTablero = tipoTablero;

        this.medidas = medidas;

        this.recogerMedidas();

        this.crearContenedor();

        this.generarCeldas();

        this.ponerCeldas();

    }
 
    private crearContenedor():void {
        
        this.contenedor = document.createElement('div');

        //se define el número de filas y columnas de manera dinámica
        this.contenedor.style.gridTemplateRows = 'repeat(' + this.nFil +',auto)';
        this.contenedor.style.gridTemplateColumns = 'repeat(' + this.nCol +',auto)';

        this.contenedor.classList.add('contenedorTablero');

    }


    /**
     * Asigna valores a los atributos nFil y nCol en función del tipo de tablero.
     */
    private recogerMedidas(): void{

        
        switch(this.medidas){

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

    /**
     * Genera celdas vacías.
     */
    private generarCeldas():void{

        this.celdas = new Array();

        for(let i:number=0; i<this.nFil; i++){

            this.celdas[i] = new Array(this.nCol);

            for(let j:number=0; j<this.nCol; j++){

                this.celdas[i][j] = this.generarCelda(i,j);
            }
        }
    }
    
    /**
     * genera un celda dandole la referencia de lu fila y columna al elemento del DOM.
     * @param i 
     * @param j 
     * @returns 
     */
    private generarCelda(i:number, j:number): HTMLDivElement {
        
        var celda = document.createElement('div');

        //cada objeto de la celda conoce cual es su celda y su columna por medio de su array asociativo
        celda[TableroGrafico.REF_FILA] = i;
        celda[TableroGrafico.REF_COLUMNA] = j;

        celda[TableroGrafico.REF_CONTROLADOR] = this.controlador;

        celda.classList.add('celda');

        /*si es un tipo de tablero visible se le pone el escuchado de click
          a las celdas y se añade la clase que va a permitir crear un hover
           de color en css.
        */
        if(this.tipoTablero === TIPO_TABLERO_GRAFICO.TIPO_VISIBLE){

            celda.classList.add('celdaVisible');

            celda.addEventListener('click',this.clickCelda);
        }

        celda.style.fontSize = this.fontSize;

        return celda;

    }


    /**
     * Se manda la señal al ControladorTablero de este propieratio paraque este gestione el click sobre una casilla.
     * @param this 
     */
    private clickCelda(this:HTMLDivElement):void {
        
        this[TableroGrafico.REF_CONTROLADOR].clickCasillaTableroVisible(this[TableroGrafico.REF_FILA], this[TableroGrafico.REF_COLUMNA]);

    }

    /**
     * Se añaden todas las celdas al contenedor.
     */
    private ponerCeldas(): void{

        for(let i=0; i<this.celdas.length; i++){
            for(let j=0; j<this.celdas[0].length; j++){
                this.contenedor.appendChild(this.celdas[i][j]);
            }
        }

    }

    /**
     * Sirve para actualizar contenido del tablero gráfico.
     * Así como su aspecto de colores en base a su estado.
     * 
     * Dependiendo de que clase séa la matriz lógica que se recibe se actualizará 
     * con un aspecto y normas y otro.
     * 
     * Es una función polimórfica.
     * 
     * @param matriz matriz lógica que se quiera plasmar en el tablero gráfico
     */
    public actualizarTablero(matriz:CeldaLogicaReal[][]|CeldaLogicaVisible[][], colorear:boolean):void{

        for(let i=0; i<this.celdas.length; i++){
            for(let j=0; j<this.celdas[0].length; j++){

                if(matriz[0][0] instanceof CeldaLogicaReal){

                    this.celdas[i][j].innerText = ''+(<CeldaLogicaReal>matriz[i][j]).numero;

                    if(colorear){
                        this.colorearCelda(this.celdas[i][j], (<CeldaLogicaReal>matriz[i][j]));
                    }

                }else if(matriz[0][0] instanceof CeldaLogicaVisible){

                    this.celdas[i][j].innerText = ''+(<CeldaLogicaVisible>matriz[i][j]).simbolo;

                    if(colorear){
                        this.colorearCelda(this.celdas[i][j], (<CeldaLogicaVisible>matriz[i][j]));
                    }
                }

            }
        }

    }

    /**
     * 
     * Sirve para colorear una celda HTML en base al estado de su celda lógica.
     * 
     * @param celda celda HTML
     * @param celdaLogica celda lógica de tipo CeldaLogicaReal o CeldaLogicaVisible
     */
    private colorearCelda(celda:HTMLDivElement, celdaLogica:CeldaLogicaReal|CeldaLogicaVisible):void {

        if(celdaLogica instanceof CeldaLogicaReal){

            switch((<CeldaLogicaReal>celdaLogica).numero){
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

            if((<CeldaLogicaReal>celdaLogica).tocado){
                celda.style.color = 'red';
                celda.style.textDecoration = 'line-through';
            }

        }else if(celdaLogica instanceof CeldaLogicaVisible){

            if((<CeldaLogicaVisible>celdaLogica).descubierto && (<CeldaLogicaVisible>celdaLogica).tocado){
                celda.style.backgroundColor = COLOR_TOCADO;
            }else if((<CeldaLogicaVisible>celdaLogica).descubierto && !(<CeldaLogicaVisible>celdaLogica).tocado){
                celda.style.backgroundColor = COLOR_AGUA;
            }

        }

        
        
    }

    public setNodoPadre(nodoPadre:HTMLElement):void{

        this.nodoPadre = nodoPadre;

    }

    public desplegarComponente(): void {
        if(this.nodoPadre !== undefined){
            this.nodoPadre.appendChild(this.contenedor);
        }

    }

    public eliminarComponente(): void {
        //se cumprueba que el nodo padre no esten indefinido y que el contenedor sea un nodo hijo del supuesto nodo padre
        if(this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre){
            this.nodoPadre.removeChild(this.contenedor);
        }
    }

    /**
     * Método para hacer click sobre una celda gráfica del tablero.
     * 
     * @param fil coordenada fila
     * @param col coordenada columna
     */
    public click(fil: number, col: number):void {
        this.celdas[fil][col].click();
    }

    

    


}