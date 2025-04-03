import { EstadoOrden } from "./estado-orden";
import { ItemsDTO } from "./items-dto";

export interface InformacionOrdenDTO {
    idOrden : string,
    idCliente : string,
    codigoPasarela : string,
    items : ItemsDTO[],
    total : Number,
    descuento : number,
    impuesto : Number,
    estadoOrden : EstadoOrden,
    codigoCupon : string
}
