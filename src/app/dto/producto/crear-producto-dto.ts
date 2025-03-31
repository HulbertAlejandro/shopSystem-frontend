import { TipoProducto } from "./tipo-producto"

export interface CrearProductoDTO {
    referencia : string,
    nombre : string,
    tipoProducto : TipoProducto,
    imageUrl : string,
    unidades : number,
    precio: number,
    descripcion : string
}
