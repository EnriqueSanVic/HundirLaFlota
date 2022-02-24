import { Componente } from "./Componente.js";
import { ComponenteFactory } from "./ComponenteFactory.js";
import { ControladorTablero } from "../controladores/ControladorTablero.js";
import { TableroGrafico } from "./TableroGrafico.js";


/**
 * Componente gráfico.
 * 
 * Clase que sirve para generar un panel de elección de tablero de un usuario.
 * Este panel de tablero permite alternar entre configuraciones aleatorias de barcos en el tablero
 * y elegir una composición definitica para el jugador.
 */
export class PanelEleccionTablero extends ComponenteFactory implements Componente{

    public nodoPadre: HTMLElement;

    private controladorTablero:ControladorTablero;

    private contenedorEleccionTablero:HTMLElement;
    private nombreJugadorContenedorEleccion:HTMLHeadElement;
    private btnReintentar:HTMLButtonElement;
    private btnSeleccionar:HTMLButtonElement;

    private tableroReal:TableroGrafico;

    constructor(controladorTablero:ControladorTablero, tableroReal:TableroGrafico, nodoPadre:HTMLElement, nombreJugador:string){

        super();

        this.controladorTablero = controladorTablero;

        this.tableroReal = tableroReal;

        this.nodoPadre = nodoPadre;

        this.contenedorEleccionTablero = super.crearContenedor(700,30);

        this.nombreJugadorContenedorEleccion = super.crearSubtitulo(nombreJugador);

        this.contenedorEleccionTablero.appendChild(this.nombreJugadorContenedorEleccion);

        //se deja preparado el tablero dentro del contenedor de elección
        this.tableroReal.setNodoPadre(this.contenedorEleccionTablero);
        this.tableroReal.desplegarComponente();

        this.btnReintentar = super.crearBoton('REINTENTAR');

        this.btnReintentar['controlador'] = this.controladorTablero;

        //escuchador para que se vuelva a poner otra configuración aleatoria de barcos
        this.btnReintentar.addEventListener('click', function(this:any){
            this['controlador'].confBarcosAleatorios();
        });

        this.contenedorEleccionTablero.appendChild(this.btnReintentar);

        this.btnSeleccionar = super.crearBoton('SELECCIONAR');

        this.contenedorEleccionTablero.appendChild(this.btnSeleccionar);

    }

    public desplegarComponente(): void {

        this.controladorTablero.confBarcosAleatorios();

        this.btnSeleccionar['controlador'] = this.controladorTablero;

        //Se configura aqui el evento click del boton de Seleccionar
        this.btnSeleccionar.addEventListener('click',function(){
            this['controlador'].eventoFinEleccionTablero();
        });

        this.nodoPadre.appendChild(this.contenedorEleccionTablero);

    }

    public eliminarComponente(): void {
        this.nodoPadre.removeChild(this.contenedorEleccionTablero);
    }

}