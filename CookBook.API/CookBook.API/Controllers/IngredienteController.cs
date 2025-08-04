using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace CookBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredienteController : ControllerBase
    {
        private readonly CN_INGREDIENTE _CNIngrediente;

        public IngredienteController(IConfiguration configuration)
        {
            _CNIngrediente = new CN_INGREDIENTE(configuration);
        }

        [HttpGet]
        public IActionResult ObtenerIngredientes()
        {
            var ingredientes = _CNIngrediente.ListarIngredientes();
            return Ok(ingredientes);
        }

        [HttpPost]
        public IActionResult GuardarIngrediente([FromBody] CE_INGREDIENTE ingrediente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _CNIngrediente.GuardarIngrediente(ingrediente);
                return Created("", new { mensaje = "Ingrediente creado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult ActualizarIngrediente(int id, [FromBody] CE_INGREDIENTE ingrediente)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (ingrediente.IngredienteId != id)
                return BadRequest(new { error = "El ID del ingrediente no coincide." });

            try
            {
                _CNIngrediente.ActualizarIngrediente(ingrediente);
                return Ok(new { mensaje = "Ingrediente actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
