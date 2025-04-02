import { EstadoCupon } from "./estado-cupon"
import { TipoCupon } from "./tipo-cupon"

export interface CrearCuponDTO {
    codigo : string,
    nombre  : string,
    descripcion : string ,
    descuento : number,
    tipo : TipoCupon,
    estado : EstadoCupon,
    fechaInicio : Date,
    fechaVencimiento : Date
}
