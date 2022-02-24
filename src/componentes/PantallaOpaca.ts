import { Componente } from "./Componente.js";
import { ComponenteFactory } from "./ComponenteFactory.js";

/**
 * Componente gráfico.
 * 
 * Componente que sirve para crear una capa que ocupe todo el area 
 * del contenedor padre y que implementa un boton de continuar,
 * cuando se hace click este boton, se quita esta capa haciendo visible
 * el el componente padre.
 */
export class PantallaOpaca extends ComponenteFactory implements Componente{

    public static readonly REF_CONTROLADOR:string = "controlador";
    
    public nodoPadre: HTMLElement;

    private contenedor:HTMLDivElement;

    private labTurno:HTMLParagraphElement;

    private labNombreJugador:HTMLHeadElement;

    private nombreJugador:string;

    private btnContinuar:HTMLButtonElement;

    constructor(nodoPadre:HTMLElement, nombreJugador:string){

        super();

        this.nodoPadre = nodoPadre;

        this.nombreJugador = nombreJugador;

        this.contenedor = document.createElement('div');

        this.contenedor.classList.add('pantallaOpaca');

        this.labTurno = super.crearParrafo('tituloTablero','TURNO DE: ', 40);

        this.labTurno.style.marginTop =  190 + "px";

        this.contenedor.appendChild(this.labTurno);

        this.contenedor.appendChild(document.createElement('br'));

        this.labNombreJugador = super.crearH3(60,this.nombreJugador);

        this.contenedor.appendChild(this.labNombreJugador);

        this.contenedor.appendChild(document.createElement('br'));

        this.btnContinuar = super.crearBoton("CONTINUAR");

        this.btnContinuar.style.marginTop = '0px';

        this.btnContinuar[PantallaOpaca.REF_CONTROLADOR] = this;

        //escuchador en el botón que cuando se clickea se elimina el componente pantalla opaca de su contenedor padre
        this.btnContinuar.addEventListener('click', function(){
            this[PantallaOpaca.REF_CONTROLADOR].eliminarComponente();
        });

        this.contenedor.append(this.btnContinuar);

    }

    public desplegarComponente(): void {

        this.nodoPadre.appendChild(this.contenedor);
        
    }

    public eliminarComponente(): void {

        if(this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre){
            this.nodoPadre.removeChild(this.contenedor);
        }

    }

}