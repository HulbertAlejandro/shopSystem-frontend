import { ItemsDTO } from "./items-dto";

export interface InformacionOrdenDTO {
    idCliente : string,
    codigoPasarela : string,
    items : ItemsDTO[],
    total : Number,
    descuento : Number,
    impuesto : Number,
    codigoCupon : string
}
