namespace CookBook.API.APIModels
{
   public class Usuario
    {
        public int UsuarioID { get; set; }
        public string Usuarios { get; set; }
        public string NombreCompletoUsuario { get; set; }
        public string Email { get; set; }
        public string DNI { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
 public int? EstadoID { get; set; }
    }
   
}
