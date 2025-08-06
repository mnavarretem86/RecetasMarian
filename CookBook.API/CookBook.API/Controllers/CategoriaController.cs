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
    public class CategoriaController : ControllerBase
    {
        private readonly CN_CATEGORIA _CNCategoria;

        public CategoriaController(IConfiguration configuration)
        {
            _CNCategoria = new CN_CATEGORIA(configuration);
        }

        [HttpGet]
        public IActionResult ObtenerCategorias()
        {
            var categorias = _CNCategoria.ListarCategorias();
            return Ok(categorias);
        }

        [HttpPost]
        public IActionResult GuardarCategoria([FromBody] CE_CATEGORIA categoria)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _CNCategoria.GuardarCategoria(categoria);
                return Created("", new { mensaje = "Categoría creada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult ActualizarCategoria(int id, [FromBody] CE_CATEGORIA categoria)
        {
            if (!ModelState.IsValid)    
                return BadRequest(ModelState);

            if (categoria.CategoriaId != id)
                return BadRequest(new { error = "El ID de la categoría no coincide." });

            try
            {
                _CNCategoria.ActualizarCategoria(categoria);
                return Ok(new { mensaje = "Categoría actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
