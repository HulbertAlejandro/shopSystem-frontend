import { OrdenAbastecimientoDTO } from "./orden-abastecimiento-dto";

export interface OrdenAbastecimientoGlobalDTO {
        productos: OrdenAbastecimientoDTO[],
        proveedorId?: number, // si planeas agregarlo luego
        observaciones?: string
}
