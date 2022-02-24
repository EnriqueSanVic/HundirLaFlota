export class ComponenteFactory {
    constructor() {
    }
    crearContenedor(width, paddingBottom, padding = null) {
        var contenedor;
        contenedor = document.createElement('div');
        contenedor.style.width = width + 'px';
        contenedor.style.height = 'fit-content';
        contenedor.style.paddingBottom = paddingBottom + 'px';
        if (padding != null) {
            contenedor.style.padding = padding + 'px';
        }
        contenedor.className = 'contenedor';
        return contenedor;
    }
    crearSubtitulo(texto) {
        var subtitulo = document.createElement('h3');
        subtitulo.innerText = texto;
        subtitulo.classList.add('subtitulo');
        return subtitulo;
    }
    crearInput() {
        var input = document.createElement('input');
        input.classList.add('inputFormulario');
        input.classList.add('centrarElemento');
        return input;
    }
    crearOption(valor, texto) {
        var optionNum = document.createElement('option');
        optionNum.value = valor;
        optionNum.innerText = texto;
        return optionNum;
    }
    crearBoton(titulo) {
        var btn = document.createElement('button');
        btn.classList.add('botonFormulario');
        btn.innerText = titulo;
        return btn;
    }
    crearAreaContrincantes() {
        var area = document.createElement('div');
        area.classList.add('cuadroContrincantes');
        return area;
    }
    crearContrincante(nombre) {
        var area = document.createElement('div');
        area.classList.add('contrincante');
        var h3Nombre = this.crearH3(19, nombre);
        h3Nombre.style.color = "black";
        h3Nombre.style.textShadow = '1px 1px white';
        area.appendChild(h3Nombre);
        return area;
    }
    crearAreaTablero(direccionFloat, titulo, areaCentrada = false, interactuableUsuario = true) {
        const margen = 85;
        var area = document.createElement('div');
        area.classList.add('areaTableroJuego');
        if (direccionFloat) {
            area.style.float = 'left';
            area.style.marginLeft = margen + 'px';
        }
        else {
            area.style.float = 'right';
            area.style.marginRight = margen + 'px';
        }
        if (areaCentrada) {
            area.style.float = 'none';
            area.style.margin = 'auto';
        }
        if (!interactuableUsuario) {
            area.style.pointerEvents = 'none';
        }
        area.appendChild(this.crearParrafo('tituloTablero', titulo));
        return area;
    }
    crearParrafo(clase, texto, tamaño = null) {
        var pTitulo = document.createElement("p");
        pTitulo.classList.add(clase);
        pTitulo.innerText = texto;
        if (tamaño !== null) {
            pTitulo.style.fontSize = tamaño + 'px';
        }
        return pTitulo;
    }
    crearH3(tamaño, texto) {
        var h3Nombre = document.createElement('h3');
        h3Nombre.style.margin = 'auto';
        h3Nombre.style.fontSize = tamaño + 'px';
        h3Nombre.innerText = texto;
        return h3Nombre;
    }
}
