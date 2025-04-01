import { TipoProducto } from "./tipo-producto";

export interface InformacionProductoDTO {
    referencia : string,
    nombre  : string,
    tipoProducto : TipoProducto,
    imageUrl  : string,
    unidades : number,
    precio : number,
    descripcion  : string
}
