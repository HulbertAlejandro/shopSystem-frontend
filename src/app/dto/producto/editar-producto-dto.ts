import { TipoProducto } from "./tipo-producto";

export interface EditarProductoDTO {
    referencia : string,
    nombre : string,
    tipoProducto : TipoProducto,
    imageUrl : string,
    unidades : number,
    precio: number,
    descripcion : string
}
