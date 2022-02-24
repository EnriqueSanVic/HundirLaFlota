
/**
 * Clase que implementa métodos de creación de componentes HTML
 * que pueden ser utilizadas por clases hijas que van a manipular el DOM
 * y les puede venir muy bien tener estos métodos de manera generalizada
 * y personalizable para generar componentes.
 * 
 * Está pensada para ser usada como parte de un framework de creación de componentes
 * ogreciendo herramientas genéricas de creación de elementos HTML.
 */
export class ComponenteFactory{
    

    constructor(){

    }

    /**
     * Crea contenedores DIV
     * 
     * @param width ancho
     * @param paddingBottom padding bottom
     * @param padding padding
     * @returns 
     */
    protected crearContenedor(width:number, paddingBottom:number, padding:number = null): HTMLElement {

        var contenedor:HTMLElement;

        contenedor = document.createElement('div');

        contenedor.style.width = width + 'px';

        contenedor.style.height = 'fit-content';

        contenedor.style.paddingBottom = paddingBottom + 'px';

        if(padding != null){
            contenedor.style.padding = padding + 'px';
        }

        contenedor.className = 'contenedor';

        return contenedor;

    }

    /**
     * Crea elementos <h3> 
     * @param texto texto del nodo de texto.
     * @returns 
     */
    protected crearSubtitulo(texto:string): HTMLHeadElement{

        //despliegue del subtitulo nombres
        var subtitulo:HTMLHeadElement = document.createElement('h3');

        subtitulo.innerText = texto;

        subtitulo.classList.add('subtitulo');

        return subtitulo;
    }

    /**
     * Crea elementos <input> de texto
     * @returns 
     */
    protected crearInput(): HTMLInputElement {
            
        var input:HTMLInputElement = document.createElement('input');

        input.classList.add('inputFormulario');

        input.classList.add('centrarElemento');

        return input;

    }

    /**
     * Crea elementos <option> etiquetas option de un select de HTML.
     * @param valor contenido del atributo value
     * @param texto contenido del nodo de texto.
     * @returns 
     */
     protected crearOption(valor:string, texto:string): HTMLOptionElement{

        var optionNum:HTMLOptionElement = document.createElement('option');

        optionNum.value = valor;

        optionNum.innerText = texto;

        return optionNum;
    }

    /**
     * Crea elementos <button>
     * @param titulo texto que contiene el botón.
     * @returns 
     */
    protected crearBoton(titulo:string): HTMLButtonElement {
        
        var btn = document.createElement('button');

        btn.classList.add('botonFormulario');

        btn.innerText = titulo;

        return btn;

    }

    /**
     * crea areas de para almacenat div conntrincantes.
     * @returns 
     */
    public crearAreaContrincantes():HTMLDivElement{

        var area = document.createElement('div');

        area.classList.add('cuadroContrincantes');

        return area;

    }

    /**
     * crea <div> contrincante.
     * @param nombre 
     * @returns 
     */
    public crearContrincante(nombre:string): HTMLDivElement{

        var area = document.createElement('div');

        area.classList.add('contrincante');

        var h3Nombre = this.crearH3(19,nombre);

        h3Nombre.style.color = "black";

        h3Nombre.style.textShadow = '1px 1px white';

        area.appendChild(h3Nombre);

        return area;
    }

    //se un area invisible solamente para posicionar el tablero
    /**
     * Crea areas de tablero que son contenedores <div> intermedios entre un tablero y el contenedor final
     * para que la implementación del tablero no dependa del posicionamiento del mismo sino que se posicionará
     * esta ára y el tablero irá dentro.
     * @param direccionFloat Dirección del float css.
     * @param titulo Título del area de tablero.
     * @param areaCentrada Si el area tien que tener un margin:auto, por defecto es false.
     * @param interactuableUsuario Si el area puede recibir eventos de interacción del usuario, por defecto es false.
     * @returns 
     */
    crearAreaTablero(direccionFloat: boolean, titulo:string, areaCentrada:boolean = false, interactuableUsuario:boolean = true): HTMLDivElement {

        const margen:number = 85;
        
        var area = document.createElement('div');

        area.classList.add('areaTableroJuego');

        if(direccionFloat){

            area.style.float = 'left';
            area.style.marginLeft = margen + 'px';

        }else{

            area.style.float = 'right';
            area.style.marginRight = margen + 'px';

        }

        if(areaCentrada){
            area.style.float = 'none';
            area.style.margin = 'auto';
        }

        if(!interactuableUsuario){
            area.style.pointerEvents =  'none';
        }

        area.appendChild(this.crearParrafo('tituloTablero',titulo));

        return area;
    }

    /**
     * crea un elemento <p>
     * @param clase clase css que se le quiere asignar
     * @param texto contenido del nodo de texto.
     * @param tamaño tamaño de la fuente.
     * @returns 
     */
    public crearParrafo(clase:string, texto:string, tamaño:number = null):HTMLParagraphElement{

        var pTitulo = document.createElement("p");

        pTitulo.classList.add(clase);

        pTitulo.innerText = texto;

        if(tamaño !== null){
            pTitulo.style.fontSize = tamaño + 'px';
        }

        return pTitulo;

    }

    /**
    * Crea elementos <h3>
    * @param tamaño tamño de la fuente.
    * @param texto contenido del nodo de texto.
    * @returns 
    */
    public crearH3(tamaño:number, texto:string):HTMLHeadElement {

        var h3Nombre = document.createElement('h3');

        h3Nombre.style.margin = 'auto';

        h3Nombre.style.fontSize = tamaño + 'px';

        h3Nombre.innerText = texto;

        return h3Nombre;

    }

    

}