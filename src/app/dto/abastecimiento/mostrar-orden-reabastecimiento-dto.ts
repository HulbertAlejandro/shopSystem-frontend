import { EstadoReabastecimiento } from "./estado-reabastecimiento";
import { ProductoReabastecerDTO } from "./producto-reabastecer-dto";

export interface MostrarOrdenReabastecimientoDTO {
    id : string,
    fechaCreacion : Date,
    productos : ProductoReabastecerDTO[],
    proveedorId : number,
    observaciones : string,
    estadoReabastecimiento : EstadoReabastecimiento 
}
