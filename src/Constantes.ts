/**
 * Enumeración de distintas constantes para usar como ID de las medidas del tablero
 * escogido al inicio del juego.
 */
export enum MEDIDAS_CASILLAS{
    _10x10,
    _15x15,
    _20x20
}

/**
 * Enumeración de distintas constantes para usar como ID del tipo de controlador que 
 * se ha elegido para un controlador de tablero.
 */
export enum TIPO_CONTROLADOR{
    _CONTROLADOR_JUGADOR_NORMAL,
    _CONTROLADOR_JUGADOR_BOT
}

/**
 * Nombre del jugador BOT
 */
export const NOMBRE_BOT:string = "LARRY";

export const TIEMPO_ANIMACION_ELIMINAR_PANEL_JUEGO:number = 750;

export const NUMERO_AGUA:number = 0;
export const SIMBOLO_NO_TOCADO:string = '-';

export const NUMERO_BARCO_4:number = 4;
export const NUMERO_BARCO_3:number = 3;
export const NUMERO_BARCO_2:number = 2;

export const COLOR_TOCADO: string = "red";
export const COLOR_AGUA: string = "rgb(113, 145, 206)";
export const COLOR_BARCO_4: string = "rgb(247, 255, 0)";
export const COLOR_BARCO_3: string = "rgb(0, 255, 9)";
export const COLOR_BARCO_2: string = "rgb(255, 70, 231)";


/**
 * Se crea una interfaz para instanciar clases anónimas que sirvan
 * para definir una estructura de datos para representar la configuración
 * del número de barcos en cada tipo de medidas de tablero.
*/
export interface confBarcosTablero{

    readonly BARCO_4_POS:number;
    readonly BARCO_3_POS:number;
    readonly BARCO_2_POS:number;

}

//se declaran las distintas configuraciones de barcos segun el tipo de tablero
/**
 * Configuración de barcos para una configuración de tablero 10x10
 */
export const conf_10x10:confBarcosTablero = {
    BARCO_4_POS: 1,
    BARCO_3_POS: 2,
    BARCO_2_POS: 4
}

/**
 * Configuración de barcos para una configuración de tablero 15x15
 */
export const conf_15x15:confBarcosTablero = {
    BARCO_4_POS: 1,
    BARCO_3_POS: 4,
    BARCO_2_POS: 6
}

/**
 * Configuración de barcos para una configuración de tablero 20x20
 */
export const conf_20x20:confBarcosTablero = {
    BARCO_4_POS: 2,
    BARCO_3_POS: 5,
    BARCO_2_POS: 8
}

