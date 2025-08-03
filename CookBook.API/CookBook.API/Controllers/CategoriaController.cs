using CAPA_DATOS;
using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CookBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly CN_CATEGORIA _CNCategoria;

        public CategoriaController(IConfiguration configuration)
        {
            _CNCategoria= new CN_CATEGORIA(configuration);
        }

        [HttpGet("Categorias")]
        public IActionResult ObtenerCategoria()
        {
            var Cat = _CNCategoria.ListarcategoriaDetalle();
            return Ok(Cat);
        }


        [HttpPost("Guardar  categorias")]
        public IActionResult GuardarCategoria([FromBody] CE_CATEGORIA receta)
        {
            try
            {
                _CNCategoria.cn_GuardarCategoriaCompleta(receta);
                return Ok(new { mensaje = "Categoria procesada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
        [HttpPut(" Actualizar Categorias")]
        public IActionResult ActualizarCategoria([FromBody] CE_CATEGORIA receta)
        {
            try
            {
                _CNCategoria.cn_ActualizarCategoriaCompleta(receta);
                return Ok(new { mensaje = "Categoria procesada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }

        }
    }
}
