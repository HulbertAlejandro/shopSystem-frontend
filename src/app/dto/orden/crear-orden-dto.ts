import { ItemsDTO } from "./items-dto";

export interface CrearOrdenDTO {
    idCliente : string,
    codigoPasarela : string,
    items : ItemsDTO[],
    total : Number,
    descuento : Number,
    impuesto : Number,
    codigoCupon : string
}
