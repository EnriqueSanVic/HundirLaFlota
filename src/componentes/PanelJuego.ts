import { Componente } from "./Componente.js";
import { ComponenteFactory } from "./ComponenteFactory.js";
import { ControladorTablero } from "../controladores/ControladorTablero.js";
import { Jugador } from "../actores/Jugador.js";
import { PantallaOpaca } from "./PantallaOpaca.js";
import { TableroGrafico } from "./TableroGrafico.js";
import { TIPO_CONTROLADOR } from "../Constantes.js";

/**
 * Componente gráfico.
 * 
 * Esta clase permite generar y gestionar un panel de juego de un jugador.
 * 
 * Tiene un panel con botones para seleccionar a los contrincantes disponibles.
 * 
 * En un estado normal el jugador tiene su tablero real y el tablero visible del contrincante que está seleccionado.
 * 
 * En caso de ser un panel creado por un jugador bot solo tendrá el tablero visible del contrincante para que 
 * el usuario no pueda ver la configuración del tablero real del bot.
 * 
 */


export class PanelJuego extends ComponenteFactory implements Componente{
    

    public static readonly REF_CONTRINCANTE:string = "contrincante_ref";
    public static readonly REF_CONTROLADOR:string = "controlador_ref";
    private readonly REF_ACTIVO:string = "contrincante_activo_ref";

    public nodoPadre: HTMLElement;

    private controladortablero:ControladorTablero;

    private contenedor:HTMLDivElement;

    private pantallaOpaca:PantallaOpaca;

    private areaContrincantes:HTMLDivElement;

    private areaTableroReal:HTMLDivElement;
    private tableroReal:TableroGrafico;

    private areaTableroContrincante:HTMLDivElement;
    private tableroContrincante:TableroGrafico;

    private areasContrincantes:HTMLDivElement[];

    private contrincantes:Jugador[];

    private jugador:Jugador;

    private contrincanteSelecionado:number = null;

    private aceptarToque:boolean;

    
    /**
     * se pasa el tablero real directamente a pesar de que también se pasa 
     * el controladorTablero para no tener que hacer un método público que exponga
     * a cualquier otra entidad al tablero real de un controladorTablero.
     * 
     */
    constructor(jugador:Jugador,controladorTablero:ControladorTablero, tableroReal:TableroGrafico, nodoPadre:HTMLElement, contrincantes:Jugador[]){

        super();

        this.jugador = jugador;
        this.controladortablero = controladorTablero;
        this.tableroReal = tableroReal;
        this.nodoPadre = nodoPadre;
        this.contrincantes = contrincantes;

        this.aceptarToque = true;

        //se crea el contenedor
        this.contenedor = <HTMLDivElement>super.crearContenedor(1050,30,20);

        this.generarNombre();

        this.generarAreaContrincantes();

        //solo si su controlador es de tipo JUGADOR_NORMAL se saca el tablero real
        if(this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL){
            this.generarAreaTableroReal();
        }
        

        this.generarAreaTableroContrincante();

        this.ponerEscuchadorAreaContrincantes();

        //se crea la pantalla opaca
        if(this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_NORMAL){
            this.pantallaOpaca = new PantallaOpaca(this.contenedor, this.jugador.getNombre());
        }

        //se da click automatico al construir el elemento al componente 0 para que siempre aparezca la primera vez
        this.areasContrincantes[0].click();

    }

    private generarNombre():void {

        var h3Nombre = super.crearH3(30,this.jugador.getNombre());

        this.contenedor.appendChild(h3Nombre);

    }
    

    private generarAreaTableroContrincante():void {
        
        //si es un panel de juego de bot se crea centrado
        if(this.controladortablero.getTipoControlador() === TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT){

            //se instancia con el area del tablero centrado y sin capacidad de interactuar con el raton del usuario
            //es decir, se impide el evento de click
            this.areaTableroContrincante = super.crearAreaTablero(false, "TABLERO ENEMIGO", true, false);
        }else{

            this.areaTableroContrincante = super.crearAreaTablero(false, "TABLERO ENEMIGO");
        }
        

        this.contenedor.appendChild(this.areaTableroContrincante );

    }

    private generarAreaTableroReal():void {
        
        this.areaTableroReal = super.crearAreaTablero(true,"TU TABLERO");

        //se elimina el componente de donde estuviera
        this.tableroReal.eliminarComponente();

        //se pone en el area del tablero
        this.tableroReal.setNodoPadre(this.areaTableroReal);

        //se despliega
        this.tableroReal.desplegarComponente();

        this.contenedor.appendChild(this.areaTableroReal );

    }

    private generarAreaContrincantes():void {
        
        this.areaContrincantes = super.crearAreaContrincantes();

        this.areasContrincantes = new Array();

        let areaContrincante:HTMLDivElement;

        for(let i:number = 0; i < this.contrincantes.length; i++){

            areaContrincante = super.crearContrincante(this.contrincantes[i].getNombre());

            //se pone la referencia sobre la propiedad que indica si ese contrincante es seleccionable debido a que sigue en juego o no
            areaContrincante[this.REF_ACTIVO] = true;

            //se deja puesta una referencia
            areaContrincante[PanelJuego.REF_CONTRINCANTE] = i;

            areaContrincante[PanelJuego.REF_CONTROLADOR] = this;

            this.areasContrincantes.push(areaContrincante);

            this.areaContrincantes.appendChild(areaContrincante);
        }

        this.contenedor.appendChild(this.areaContrincantes);

    }

    private ponerEscuchadorAreaContrincantes():void {

        for(let i of this.areasContrincantes){
            i.addEventListener('click',this.escuchadorClickAreaContrincante);
        }
    }

    private escuchadorClickAreaContrincante(this:HTMLDivElement){
        
        this[PanelJuego.REF_CONTROLADOR].escuchadorClickContrincante(this[PanelJuego.REF_CONTRINCANTE]);
 
    }

    /**
     * 
     * Escuchado para recibir el evento de click sobre un botón de contrincante del panel de contrincantes
     * este escuchador hace los camibios de aspecto y tablero del contrincante actual.
     * 
     * @event
     * @param indice Indice de contrincante que se ha selecionado
     */
    private escuchadorClickContrincante(indice:number):void{

        //solo se escucha si el jugador está en juego
        if(this.contrincantes[indice].isEnJuego){

            //se cambia el ascpecto del boton del contrincante quitandoselo al anterior
            if(this.contrincanteSelecionado != null){
                this.areasContrincantes[this.contrincanteSelecionado].classList.remove('contrincanteSeleccionado');      
            }
            this.contrincanteSelecionado = indice;

            this.areasContrincantes[this.contrincanteSelecionado].classList.add('contrincanteSeleccionado');


            //se pone este jugador como escuchador a las acciones del talbero del otro jugador para saber quien le ataca
            this.contrincantes[this.contrincanteSelecionado].setContrincanteActivoEscuchador(this.jugador);

            //antes de cambiar el tableroContrincante al nuevo target tenemos que quitar el anteriors

            if(this.tableroContrincante !== undefined){
                this.tableroContrincante.eliminarComponente();
            }

            this.tableroContrincante = this.contrincantes[this.contrincanteSelecionado].getTableroVisible();

            //antes de ponerlo siempre se elimina de donde estuviera puesto
            this.tableroContrincante.eliminarComponente();
            //se pone en el area del tablero
            this.tableroContrincante.setNodoPadre(this.areaTableroContrincante);

            //se despliega
            this.tableroContrincante.desplegarComponente();

        }

        

    }

    
    public desplegarComponente(): void {

        //se pone la pantalla opaca a cada vez que se despliega el panel de juego
        //solo si no es undefined por que podría serlo si es un controlador tablero BOT
        if(this.pantallaOpaca !== undefined){
            this.pantallaOpaca.desplegarComponente();
        }
        

        this.actualizarUsuariosFueraDeJuego();

        this.abrirTableroUltimo();

        this.contenedor.style.opacity = '1';


        this.nodoPadre.appendChild(this.contenedor);
    }

    public iniciarTransicionEliminacion():void {
        this.contenedor.style.opacity = '0';
    }

    /**
     * Abre el último tablero queestuviera abierto en este panel de juego en su anterior turno
     * si el jugador ha caido se busca otro al que dar click.
     */
    private abrirTableroUltimo():void{
        
        /*antes de desplegarse se da automáticamente click al último target del 
        panel para que se carge el contrincante donde lo dejó en el ultimo turno.
        */
        if(this.areasContrincantes[this.contrincanteSelecionado] !== undefined){

            //solo se da click si está activo el botón
            if(this.areasContrincantes[this.contrincanteSelecionado][this.REF_ACTIVO]){
                this.areasContrincantes[this.contrincanteSelecionado].click();
            }else{

                //se le quita la clase css de casilla seleccionada al area de contrincante actual
                this.areasContrincantes[this.contrincanteSelecionado].classList.remove('contrincanteSeleccionado');
                
                //se recorren todas las areas de contrincantes
                for(let i:number=0; i < this.areasContrincantes.length; i++){

                    if(this.areasContrincantes[i][this.REF_ACTIVO]){
                        
                        //se cambia la variable que guarda el indice del area correcta de selección
                        this.contrincanteSelecionado = i;

                        //se vuelve a llamar a este método de forma recursiva para repetirla operación y ser clickeado
                        this.abrirTableroUltimo();
                    }

                }

            }
            
        }

    }

    /**
     * Actualiza el area de cada contrincante para poner si es posible 
     * interactuar con ella o no se recorren todos los contrincantes 
     * mirando si alguno pasa a estar fuera de juego.
     * 
     * Si es así se mira si ya se ha anulado dicho contrincante.
     * 
     * Si no se ha anulado ya se anula.
     */
    private actualizarUsuariosFueraDeJuego():void{

        for(let i :number = 0; i < this.contrincantes.length; i++){
            //si el contrincante ha perdido el turno y sigue activa su casilla
            if(!this.contrincantes[i].isEnJuego() && this.areasContrincantes[i][this.REF_ACTIVO]){
            
                //se niega la flag
                this.areasContrincantes[i][this.REF_ACTIVO] = false;

                //se anula la casilla
                //se accede al h3 del nombre para tachar el texto
                (<HTMLHeadElement>this.areasContrincantes[i].childNodes[0]).style.textDecoration = 'line-through';

                //se hace el que el div no sea clickeable
                this.areasContrincantes[i].removeEventListener('click', this.escuchadorClickAreaContrincante);
            }
        }

    }
  
    public eliminarComponente(): void {

        if(this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre){
            this.nodoPadre.removeChild(this.contenedor);
        }
        
    }

    public getAceptarToque(): boolean {
        return this.aceptarToque;
    }

    public setAceptarToque(aceptarToque:boolean):void {
        this.aceptarToque = aceptarToque;
    }

    public getContrincanteActual():Jugador{
        return this.contrincantes[this.contrincanteSelecionado];
    }

    public clikCeldaContrincante(fil: number, col: number):void {
        this.tableroContrincante.click(fil,col);
    }

    

}



