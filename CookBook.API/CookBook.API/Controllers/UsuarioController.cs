using CAPA_DATOS;
using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace CookBook.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly CN_USUARIO _CNUsuario;

        public UsuarioController(IConfiguration configuration)
        {
            _CNUsuario = new CN_USUARIO(configuration);
        }

        [HttpGet]
        public IActionResult ObtenerUsuarios()
        {
            try
            {
                var usuarios = _CNUsuario.ListarUsuarios();
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerUsuarioPorId(int id)
        {
            try
            {
                var usuario = _CNUsuario.ObtenerUsuarioPorId(id);
                if (usuario == null)
                    return NotFound(new { mensaje = "Usuario no encontrado." });

                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult CrearUsuario([FromBody] CE_USUARIO usuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _CNUsuario.CrearUsuario(usuario);
                return Created("", new { mensaje = "Usuario creado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult ActualizarUsuario(int id, [FromBody] CE_USUARIO usuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            usuario.UsuarioID = id;

            try
            {
                _CNUsuario.ActualizarUsuario(usuario);
                return Ok(new { mensaje = "Usuario actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
