import { EstadoCupon } from "./estado-cupon";
import { TipoCupon } from "./tipo-cupon";

export interface ItemCuponDTO {
    id : string,
    nombre : string,
    codigo : string,
    descuento : Number,
    fechaVencimiento : Date,
    tipo : TipoCupon,
    estado : EstadoCupon
}
