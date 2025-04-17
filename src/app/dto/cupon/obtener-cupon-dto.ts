import { EstadoCupon } from "./estado-cupon"
import { TipoCupon } from "./tipo-cupon"

export interface ObtenerCuponDTO {
    id : string,
    codigo : string ,
    descuento : number,
    nombre : string ,
    tipo : TipoCupon,
    estado : EstadoCupon,
    fechaVencimiento : Date
}
