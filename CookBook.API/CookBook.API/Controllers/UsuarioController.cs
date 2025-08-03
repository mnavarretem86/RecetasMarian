using CAPA_DATOS;
using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using CookBook.API.APIModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CookBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {


        private readonly CN_USUARIO _CNUsuario;

        public UsuarioController(IConfiguration configuration)
        {
            _CNUsuario = new CN_USUARIO(configuration);
        }


        [HttpGet("Usuarios")]
        public IActionResult ObtenerUsuarios()
        {
            var usuarios = _CNUsuario.CN_ListarUsuarios();

            var result = usuarios.Select(u => new Usuario
            {
                UsuarioID = u.UsuarioID,
                Usuarios = u.Usuario,
                NombreCompletoUsuario = u.NombreCompletoUsuario,
                Email = u.Email,
                DNI = u.DNI,
                FechaCreacion = u.FechaCreacion,
                FechaModificacion = u.FechaModificacion,
                EstadoID = u.EstadoID
           }).ToList();

            return Ok(result);


        }
         [HttpGet("Usuariosporid")]
        public IActionResult UsuarioPorId([FromQuery] int id)
        {
            
            var usuario = new CE_DETALLE_USUARIO { UsuarioID = id };

            
            var resultado = _CNUsuario.Cn_FiltrarUsuarios(usuario);

            
            if (resultado == null || resultado.Count == 0)
                return NotFound("Usuario no encontrado");

            var usuarioResponse = new Usuario
            {
                UsuarioID = resultado[0].UsuarioID,
               Usuarios = resultado[0].Usuario,
        NombreCompletoUsuario = resultado[0].NombreCompletoUsuario,  

        Email = resultado[0].Email,
        DNI = resultado[0].DNI,
        FechaCreacion = resultado[0].FechaCreacion,
        FechaModificacion = resultado[0].FechaModificacion,
        EstadoID = resultado[0].EstadoID
    };

    

    return Ok(usuarioResponse);
}

        [HttpPut("actualizar")]
        public IActionResult ActualizarUsuario([FromBody] CE_USUARIO request)
        {
            try
            {
                var usuario = new CE_USUARIO
                {
                    UsuarioID = request.UsuarioID,
                    Usuario = request.Usuario,
                    PrimerNombre = request.PrimerNombre,
               PrimerApellido = request.PrimerApellido,
               Email = request.Email,
               DNI = request.DNI,
               Contrasena = request.Contrasena,
               EstadoID = request.EstadoID
                };

            _CNUsuario.CN_ActualizarUsuario(usuario); // Llama al método de actualización
            return Ok(new { mensaje = "Usuario procesado correctamente." });
        }
       catch (Exception ex)
       {
           return BadRequest(new { error = ex.Message});
       }
   }

       
        [HttpPost("IniciarSesion")]
        public IActionResult IniciarSesion([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Contrasena))
            {
                return BadRequest(new { message = "Email y contraseña requeridos." });
            }

            var usuario = _CNUsuario.IniciarSesion(request.Email, request.Contrasena);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Credenciales incorrectas." });
            }

            HttpContext.Session.SetInt32("UserId", usuario.UsuarioID);


            var usuarioResponse = new Usuario
            {
                UsuarioID = usuario.UsuarioID,
                Usuarios = usuario.Usuario,
                NombreCompletoUsuario = $"{usuario.PrimerNombre} {usuario.PrimerApellido}",
                Email = usuario.Email,
                DNI = usuario.DNI,
                FechaCreacion = usuario.FechaCreacion,
                FechaModificacion = usuario.FechaModificacion,
                EstadoID = usuario.EstadoID
            };

            return Ok(usuarioResponse);
        }


        [HttpGet("ObtenerUsuarioSesion")]
        public IActionResult ObtenerUsuarioSesion()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null)
            {
                return Unauthorized(new { message = "No hay sesión activa." });
            }

            return Ok(new { UsuarioId = userId });
        }


    } 
}




