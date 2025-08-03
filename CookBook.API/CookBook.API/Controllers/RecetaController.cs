using System.Security.Claims;
using CAPA_DATOS;
using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Mvc;

namespace CookBook.API.Controllers
{
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

        [HttpDelete("delete")]
        public IActionResult EliminarRecetas(int id)
        {

            var lista = new RecetaCompletaDTO { RecetaId = id };
            string mensaje = _CNRecetas.EliminarRecetas(lista);
            if (mensaje.Contains("Eliminada"))
            {
                return Ok(new { success = true, message = mensaje });
            }
            else {
           
              return BadRequest(new {  success = false, message = mensaje } );
            }
        }


     

    }
}
