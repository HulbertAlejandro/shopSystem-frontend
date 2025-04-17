import { TipoProducto } from "../producto/tipo-producto"

export interface ItemsCarritoDTO {
    id : string,
    idUsuario:string,
    nombreProducto : string,
    tipoProducto : TipoProducto,
    unidades : number,
    precio : number
}
