import { TipoProducto } from "./tipo-producto";

export interface ProductoCarritoDTO {
    id: string,
    idUsuario: string,
    nombreProducto: string,
    tipoProducto: TipoProducto, // Asegúrate que coincida con el enum en Java
    unidades: number,
    precio: number
}