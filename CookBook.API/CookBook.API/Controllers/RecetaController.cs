using System.Security.Claims;
using CAPA_DATOS;
using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CookBook.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RECETASController : ControllerBase
    {
        private readonly CN_RECETA _CNRecetas;

        public RECETASController(IConfiguration configuration)
        {
            _CNRecetas = new CN_RECETA(configuration);
        }

        [HttpGet("list")]
        public ActionResult<List<CE_RECETAS_DETALLES>> ListarRecetasDetalle()
        {
            var resultado = _CNRecetas.ListarRecetasDetalle();
            return Ok(resultado);
        }

        [HttpPost("create")]
        public IActionResult GuardarReceta([FromBody] RecetaCompletaDTO receta)
        {
            try
            {
                _CNRecetas.cn_GuardarRecetaCompleta(receta);
                return Ok(new { mensaje = "Receta procesada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("update")]
        public IActionResult ActualizarReceta([FromBody] RecetaCompletaDTO receta)
        {
            try
            {
                _CNRecetas.cn_ActualizarRecetaCompleta(receta);
                return Ok(new { mensaje = "Receta procesada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult EliminarReceta(int id)
        {
            try
            {
                _CNRecetas.cn_EliminarReceta(id);
                return Ok(new { mensaje = "Receta eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
