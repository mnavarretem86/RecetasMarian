using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace TuProyecto.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CN_AUTH _cnAuth;
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cnAuth = new CN_AUTH(configuration);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] CN_LOGINREQUEST request)
        {
            var usuario = _cnAuth.Login(request.Email);
            if (usuario == null)
                return Unauthorized("Credenciales inválidas.");

            bool contraseñaValida = BCrypt.Net.BCrypt.Verify(request.Contrasena, usuario.Contrasena);
            if (!contraseñaValida)
                return Unauthorized("Credenciales inválidas.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("UsuarioId", usuario.UsuarioId.ToString()),
                    new Claim("Nombre", usuario.PrimerNombre),
                    new Claim(ClaimTypes.Role, usuario.NombreRol),
                    new Claim("Email", usuario.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                nombre = usuario.PrimerNombre,
                rol = usuario.NombreRol
            });
        }
    }
}
