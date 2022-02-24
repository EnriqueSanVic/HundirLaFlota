
//interfaz que define funcionalidad de un componente gráfico
/**
 * Interfaz que sirve para definir un comportamiento mínimo
 * de un componetne gráfico.
 * El componente gráfico tiene un nodo padre.
 * Puede desplegarse en su nodo padre o eliminarse
 */
export interface Componente{

    /**
     * Nodo padre del DOM del componente gráfico.
     */
    nodoPadre:HTMLElement,

    /**
     * Método para desplegar el componete sobre su nodo padre.
     */
    desplegarComponente():void,

    /**
     * Método para eliminar el componetne de su nodo padre.
     */
    eliminarComponente():void
}