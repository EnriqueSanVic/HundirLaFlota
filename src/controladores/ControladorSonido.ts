/**
 * Case que sirve para controlar el sistema de sonido del juego
 * también gestiona el icono de sonido fijado en pantalla.
 */
export class ControladorSonido{

    private static readonly TIEMPO_ITENTO_INICIO_AUDIO: number = 5000;

    private static readonly REF_PAQUETE_SONIDO = "flag_iniciado";
    
    private static readonly IMAGEN_SONIDO_ON:string = './img/sonidoOn.png';
    private static readonly IMAGEN_SONIDO_OFF:string = './img/sonidoOff.png';

    private static readonly AUDIO_SONIDO_PRINCIPAL:string = './sound/temaFondo.mp3';

    //elementos HTML
    private boton:HTMLElement;
    private imagenBoton:HTMLImageElement;

    //elemento de audio de html, el el clip de sonido
    private clip:HTMLAudioElement;

    //variable que controla el estado del componente, si está on o off
    private activo:boolean = true;

    private iniciado:boolean = false;

    public constructor(boton:HTMLElement, imagenBoton:HTMLImageElement){

        this.boton = boton;
        this.imagenBoton = imagenBoton;

        this.boton.style.top = 20 + 'px';
        this.boton.style.left = (document.documentElement.clientWidth - this.boton.offsetWidth - 60) + 'px';

        this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_ON; 

        this.configurarClip();
        this.confBoton();
        
    }


    private confBoton():void {

        const REF_CONTROLADOR:string = "controlador";

        //se añade al elemetno html la referencia del controlador para poder ser usada en el escuchador
        this.boton[REF_CONTROLADOR] = this;

        this.boton.addEventListener('click', function(this:HTMLElement):void{
            //se llama a la función click del elemento padre
            this[REF_CONTROLADOR].click();
        });


    }

    private click():void{

        //solo se cambiará el estado del paquete de sonido si la música ha sido iniciada
        if(this.iniciado){

            this.activo = !this.activo;

            if (this.activo) {

                this.clip.play();
                this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_ON; 
                
            }else{

                this.clip.pause();
                this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_OFF; 
                
            }

        }

    }

    

    private configurarClip():void{

        this.clip = new Audio(ControladorSonido.AUDIO_SONIDO_PRINCIPAL);

        //escuchador para crear el bucle, cuando termina comienza de nuevo
        this.clip.addEventListener('ended', function(){
            //se resetea el cursor del audio
            this.currentTime = 0;

            //se vuelve a iniciar
            this.play();

        }, false);

    }

    

    /**
     * Tras 5 segundos comienza el audio
     * 
     * Se pone con promise.prototype.catch() debido a que existe una excepción que se lanza cuando se va a 
     * iniciar un audio sin que el usuario haya interactuado con la página, por lo tanto 
     * de manera recursiva se intenta cada 5 segundos iniciar el audio por medio de esta función
     * hasta que el usuario interactúe con la pagina, en la siguiente llamada a esta función recursiva 
     * se logrará iniciar.
     * 
     * Informacón de la excepción:
     * 
     * DOMException: play() failed because the user didn't interact with the document first.
     *  https://goo.gl/xX8pDD
     */
    public iniciarClip():void{  


        this.clip[ControladorSonido.REF_PAQUETE_SONIDO] = this;
        
        setTimeout(inicioAudioRecursivo,ControladorSonido.TIEMPO_ITENTO_INICIO_AUDIO, this.clip);

        function inicioAudioRecursivo(clip:HTMLAudioElement):void{
 
            /**
             * La función play es una promesa y la funión catch es una función para 
             * pasar la función que se ejecutará en caso de que la promesa no se pueda
             * cumplir debido a un error, entonces se llamará a una función anónima que 
             * creará de nuevo el setTimeout llamando a la función inicioAudioRecursivo
             * para que sea un bucle de promesas de inicio de la pista con pausas de 
             * TIEMPO_ITENTO_INICIO_AUDIO entre promesa y promesa.
             * 
             * Se usa la flag iniciado para medir si anguna vez se ha logrado iniciar.
             */


            clip[ControladorSonido.REF_PAQUETE_SONIDO].iniciado = true;

            clip.play().catch(function(){

                clip[ControladorSonido.REF_PAQUETE_SONIDO].iniciado = false;
                setTimeout(inicioAudioRecursivo,ControladorSonido.TIEMPO_ITENTO_INICIO_AUDIO, clip);
            });

            
        }
        
    };

    

};