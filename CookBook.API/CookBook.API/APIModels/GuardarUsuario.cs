namespace CookBook.API.APIModels
{
    public class GuardarUsuario
    {
       
            public string Usuario { get; set; }
            public string PrimerNombre { get; set; }
            public string PrimerApellido { get; set; }
            public string Email { get; set; }
            public string DNI { get; set; }
            public string Contrasena { get; set; }
            public int? EstadoID { get; set; }
        
    }
}
