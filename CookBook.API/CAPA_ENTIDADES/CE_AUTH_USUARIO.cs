using System;

namespace CAPA_ENTIDADES
{
    public class CE_AUTH_USUARIO
    {
        public int UsuarioId { get; set; }
        public string Usuario { get; set; }
        public string PrimerNombre { get; set; }
        public string Email { get; set; }
        public string Contrasena { get; set; }
        public int RolId { get; set; }
        public string NombreRol { get; set; }
    }
}
