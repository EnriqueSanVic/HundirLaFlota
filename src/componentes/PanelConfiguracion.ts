import { Componente } from "./Componente.js";
import { ComponenteFactory } from "./ComponenteFactory.js";
import { MEDIDAS_CASILLAS } from "../Constantes.js";

/**
 * Componente Gráfico.
 * 
 * Esta clase gestiona el icono gráfico del sonido para activar y desactivar el sonido.
 * También gestiona el sistema de sonido de la aplicación.
 */
export class PanelConfiguracion extends ComponenteFactory implements Componente{

    private static readonly NUM_JUGADORES_MAX:number = 4;

    public nodoPadre:HTMLElement;
    private contenedor:HTMLElement;

    private numJugadores:number = 1;

    private selectMedidasTablero:HTMLSelectElement;
    private selectNumJugadores:HTMLSelectElement;

    private inputNombres:HTMLInputElement[];

    private labMedidasTablero:HTMLHeadElement;
    private labNumJugadores:HTMLHeadElement;
    private labNombre:HTMLHeadElement;

    private btnJugar:HTMLButtonElement;

    //función a la que se llamará cuando se halla concluido el formulario
    private funcionEscuchadorJugar:Function;

    public constructor(nodoPadre:HTMLElement, funcionEscuchadorJugar:Function) {

        super();

        this.nodoPadre = nodoPadre;

        this.funcionEscuchadorJugar = funcionEscuchadorJugar;

        this.crearElementos();
    }


    private crearElementos():void {
        
        this.contenedor= super.crearContenedor(400,30);

        //label tamaño tablero
        this.labMedidasTablero = super.crearSubtitulo("MEDIDAS TABLERO");
        this.contenedor.appendChild(this.labMedidasTablero);

        //select medidas tablero
        this.selectMedidasTablero = this.crearSelectMedidasTablero();
        this.contenedor.appendChild(this.selectMedidasTablero);


        //label nº jugadores
        this.labNumJugadores = super.crearSubtitulo("Nº JUGADORES");
        this.contenedor.appendChild(this.labNumJugadores);

        //select nº jugadores
        this.selectNumJugadores = this.crearSelectNumJugadores();
        this.asignarEscuchadorSelectNumJugadores();
        this.contenedor.appendChild(this.selectNumJugadores);

        //label nombres
        this.labNombre = super.crearSubtitulo("NOMBRE/S");

        //inserción del subtitulo nombres
        this.contenedor.appendChild(this.labNombre);

        //inputs nombres
        this.inputNombres = this.crearInputs();
        this.desplegarInputs();

        //boton jugar
        this.btnJugar = super.crearBoton('JUGAR');
        this.asignarEscuchadorBtnJugar();
        this.contenedor.appendChild(this.btnJugar);


    }
    

    /**
     * Despliega los inputs la primera vez añadiendolos al contenedor
     * solo se muestra el primero pero todos están añadidos como hijos.
     */
    private desplegarInputs():void {
        
        for(let i:number = 0; i < this.inputNombres.length; i++){

            if(i !== 0){
                this.inputNombres[i].style.display = 'none';
                this.inputNombres[i].style.visibility = 'hidden';
            }

            this.contenedor.appendChild(this.inputNombres[i]);
        }
    }
    

    private asignarEscuchadorSelectNumJugadores():void {

        const ID_CONTROLADOR:string = 'controlador';

        this.selectNumJugadores[ID_CONTROLADOR] = this;

        this.selectNumJugadores.addEventListener('change', cambioJugadores);

        function cambioJugadores(this:HTMLSelectElement):void{
            this[ID_CONTROLADOR].actualizarVista(parseInt(this.value));
        }

    }

    /**
     * Pone visible o invisibles los elementos input dependiendo del numero selecionado.
     * @param nJugadores 
     */
    private actualizarVista(nJugadores:number):void{

        this.numJugadores = nJugadores;

        for(let i:number = 0; i < this.inputNombres.length; i++){

            if(i < nJugadores){

                this.inputNombres[i].style.display = 'block';
                this.inputNombres[i].style.visibility = 'visible';

            }else{

                this.inputNombres[i].style.display = 'none';
                this.inputNombres[i].style.visibility = 'hidden';

            }

        }

    }

    private asignarEscuchadorBtnJugar():void {
        
        const ID_CONTROLADOR:string = 'controlador';

        this.btnJugar[ID_CONTROLADOR] = this;

        this.btnJugar.addEventListener('click',function(this:HTMLElement){

            this[ID_CONTROLADOR].clickJugar();

        });

    }

    /**
     * Al hacer click sobre el boton de jugar
     * se comprueban todos los nombres y se llama a la función escuchadora del index.
     */
    private clickJugar(): void{
        
        var medidasTablero:MEDIDAS_CASILLAS;
        var nombresJugadores: string[] = new Array();

        let correcto:boolean = true;

        let nombre:string;

        medidasTablero = <MEDIDAS_CASILLAS> parseInt(this.selectMedidasTablero.value);

        for(let i:number = 0; i < this.numJugadores && correcto; i++){

            nombre = this.inputNombres[i].value;


            //si algún nombre la cadena vacía, el formulario es incorrecto
            if(nombre == ""){
                correcto = false;
            }else{
                nombresJugadores.push(nombre);
            }

            
        }

        if(correcto){
            this.funcionEscuchadorJugar(medidasTablero, nombresJugadores);
        }else{
            alert("Los campos del nombre de los jugadores no pueden estar vacíos.");
        }

    }

    


    private crearInputs(): HTMLInputElement[] {
        
        var inputs:HTMLInputElement[] = new Array();

        for(let i:number = 0; i < PanelConfiguracion.NUM_JUGADORES_MAX; i++){
            inputs[i] = super.crearInput();
        }

        return inputs;

    }
    

    private crearSelectNumJugadores(): HTMLSelectElement {
  
        var selectNumJugadores:HTMLSelectElement = document.createElement('select');

        selectNumJugadores.classList.add('seleccionador');

        selectNumJugadores.classList.add('centrarElemento');

        for(let i:number = 1; i<= PanelConfiguracion.NUM_JUGADORES_MAX; i++){     
            selectNumJugadores.appendChild(super.crearOption(i.toString(),i.toString()));
        }

        return selectNumJugadores;

    }

    private crearSelectMedidasTablero(): HTMLSelectElement {
  
        var selectMedidasTablero:HTMLSelectElement = document.createElement('select');

        selectMedidasTablero.classList.add('seleccionador');

        selectMedidasTablero.classList.add('centrarElemento');
    
        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._10x10.toString(), "10x10"));

        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._15x15.toString(), "15x15"));

        selectMedidasTablero.appendChild(this.crearOption(MEDIDAS_CASILLAS._20x20.toString(), "20x20"));
        
        return selectMedidasTablero;

    }


    
    

    public desplegarComponente():void{

        this.contenedor.style.visibility = 'visible';
        this.nodoPadre.appendChild(this.contenedor);

    }

    public eliminarComponente():void{

        this.contenedor.style.visibility = 'hidden';
        if(this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre){
            this.nodoPadre.removeChild(this.contenedor);
        }

    }

    

}


