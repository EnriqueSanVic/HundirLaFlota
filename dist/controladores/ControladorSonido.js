export class ControladorSonido {
    constructor(boton, imagenBoton) {
        this.activo = true;
        this.iniciado = false;
        this.boton = boton;
        this.imagenBoton = imagenBoton;
        this.boton.style.top = 20 + 'px';
        this.boton.style.left = (document.documentElement.clientWidth - this.boton.offsetWidth - 60) + 'px';
        this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_ON;
        this.configurarClip();
        this.confBoton();
    }
    confBoton() {
        const REF_CONTROLADOR = "controlador";
        this.boton[REF_CONTROLADOR] = this;
        this.boton.addEventListener('click', function () {
            this[REF_CONTROLADOR].click();
        });
    }
    click() {
        if (this.iniciado) {
            this.activo = !this.activo;
            if (this.activo) {
                this.clip.play();
                this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_ON;
            }
            else {
                this.clip.pause();
                this.imagenBoton.src = ControladorSonido.IMAGEN_SONIDO_OFF;
            }
        }
    }
    configurarClip() {
        this.clip = new Audio(ControladorSonido.AUDIO_SONIDO_PRINCIPAL);
        this.clip.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    iniciarClip() {
        this.clip[ControladorSonido.REF_PAQUETE_SONIDO] = this;
        setTimeout(inicioAudioRecursivo, ControladorSonido.TIEMPO_ITENTO_INICIO_AUDIO, this.clip);
        function inicioAudioRecursivo(clip) {
            clip[ControladorSonido.REF_PAQUETE_SONIDO].iniciado = true;
            clip.play().catch(function () {
                clip[ControladorSonido.REF_PAQUETE_SONIDO].iniciado = false;
                setTimeout(inicioAudioRecursivo, ControladorSonido.TIEMPO_ITENTO_INICIO_AUDIO, clip);
            });
        }
    }
    ;
}
ControladorSonido.TIEMPO_ITENTO_INICIO_AUDIO = 5000;
ControladorSonido.REF_PAQUETE_SONIDO = "flag_iniciado";
ControladorSonido.IMAGEN_SONIDO_ON = './img/sonidoOn.png';
ControladorSonido.IMAGEN_SONIDO_OFF = './img/sonidoOff.png';
ControladorSonido.AUDIO_SONIDO_PRINCIPAL = './sound/temaFondo.mp3';
;
