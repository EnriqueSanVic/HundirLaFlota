import { MEDIDAS_CASILLAS, TIPO_CONTROLADOR } from "../Constantes.js";
import { ControladorTablero } from "../controladores/ControladorTablero.js";
import { Jugador } from "./Jugador.js";

export class JugadorBot extends Jugador{

    private TIEMPO_DELAY_CLICK_AUTO:number = 1500;

    public TOKEN_BOT:boolean = true;

    constructor(nombre:string, medida:MEDIDAS_CASILLAS, escuchadorFinTurno:Function){
        
        super(nombre, medida, escuchadorFinTurno);

    }

    
    /** 
     * Se sobreescribe este método para crear un tablero TIPO JUGADOR BOT en vez de uno de JUGADOR NORMAL.
     * 
     * @override */
    protected crearTablero(medida:MEDIDAS_CASILLAS):void{
        this.controladorTablero = new ControladorTablero(this, medida, TIPO_CONTROLADOR._CONTROLADOR_JUGADOR_BOT);
    }

    /**
     * Se sobreescribe para tener un comportameinto diferente para el bot
     * en este caso el bot configura automáticamente su tablero sin panel de configuración.
     * @param escuchadorTableroElegido funcion a la que se llamará cuando se produzca el evento de terminar la elección.
     * @param nodoPadre nodo padre para el panel en este caso no se utiliza pero hay que recibirlo para poder hacer el override del método.
     */
    public elegirTablero(escuchadorTableroElegido:Function, nodoPadre:HTMLElement):void{
        this.escuchadorTableroElegido = escuchadorTableroElegido;

        //se genera una configuración aleatoria
        this.controladorTablero.confBarcosAleatorios();

        //se llama al evento de pasar la fase de elección 
        this.escuchadorTableroElegido();
    }
    /**
    * Se sobreescribe para realizar el ataque atumático cuando se inicie el turno de un jugador bot.
    */
    public iniciarTurno():void{

        super.iniciarTurno();

        this.atacar();

    }
    

    /**
     * Método para que un jugador bot realice un ataque atomático sobre su panel de juego al contrincante seleccionado.
     * El contrincante seleccionado siepre devería ser el mismo y solo devería ser uno.
     */
    public atacar():void{

        
        setTimeout((controladorTablero:ControladorTablero) => {
            try{

                controladorTablero.jugadaAutomatica();

            }catch(error:unknown){
                console.log(error);
            }
        }, this.TIEMPO_DELAY_CLICK_AUTO , super.getControladorTablero());
        
    }




}