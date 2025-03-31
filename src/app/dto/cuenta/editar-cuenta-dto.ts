export interface EditarCuentaDTO {
    cedula: string;
    nombre: string;
    correo: string;
    direccion: string;
    telefono: string;
    password: string;
    confirmaPassword: string; // Debe coincidir con el backend
}
