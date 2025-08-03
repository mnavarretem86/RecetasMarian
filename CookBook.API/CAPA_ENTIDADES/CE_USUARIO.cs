using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAPA_ENTIDADES
{
    public class CE_USUARIO
    {
        public int UsuarioID { get; set; }
        public string Usuario { get; set; }
        public string PrimerNombre { get; set; }
        public string PrimerApellido { get; set; }
        public string Email { get; set; }
        public string DNI { get; set; }
        public string Contrasena { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? EstadoID { get; set; }
    }
    public class CE_DETALLE_USUARIO
    {
        public int UsuarioID { get; set; }
        public string Usuario { get; set; }
        public string NombreCompletoUsuario { get; set; }
        public string Email { get; set; }
        public string DNI { get; set; }
        public string Contrasena { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? EstadoID { get; set; }
    }
    public class LoginModel
    {
        public string Email { get; set; }
        public string Contrasena { get; set; }
    }
}
