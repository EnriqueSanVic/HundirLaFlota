import { Componente } from "./Componente.js";
import { ComponenteFactory } from "./ComponenteFactory.js";

/**
 * Componente gráfico.
 * Esta clase permite generar el panel de finalización de una partida.
 */
export class PanelFinJuego extends ComponenteFactory implements Componente{
    
    public nodoPadre: HTMLElement;

    private contenedor: HTMLElement;

    private labGanado:HTMLParagraphElement;

    private labNombreGanador:HTMLHeadElement;

    private btnReiniciar:HTMLButtonElement;

    constructor(nodoPadre:HTMLElement, nombreGandor:string){

        super();

        this.nodoPadre = nodoPadre;

        this.contenedor = super.crearContenedor(700,0,40);

        this.labGanado = super.crearParrafo('tituloTablero','GANADOR:',50);

        this.contenedor.appendChild(this.labGanado);

        this.labNombreGanador = super.crearH3(60,nombreGandor);

        this.contenedor.appendChild(this.labNombreGanador);
        
        this.btnReiniciar = super.crearBoton('REINICIAR');

        this.btnReiniciar.addEventListener('click', function(){
            //se recarga la página
            window.location.reload();
        });
        
        this.contenedor.appendChild(this.btnReiniciar);
    }
    

    public desplegarComponente(): void {
        if(this.nodoPadre !== undefined){
            this.nodoPadre.appendChild(this.contenedor);
        }
    }

    public eliminarComponente(): void {
        if(this.nodoPadre !== undefined && this.contenedor.parentNode === this.nodoPadre){
            this.nodoPadre.removeChild(this.contenedor);
        }
    }



}