import { TipoProducto } from "../producto/tipo-producto";

export interface ItemsDTO {
    referencia : string,
    nombre : string,
    cantidad : number,
    precio : number,
    idDetalleCarrito  : string
}
