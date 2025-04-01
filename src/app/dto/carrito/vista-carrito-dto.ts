import { DetalleCarrito } from "./detalle-carrito-dto";

export interface VistaCarritoDTO {
    id_carrito : string,
    detallesCarrito: DetalleCarrito[],
    fecha : string
}
