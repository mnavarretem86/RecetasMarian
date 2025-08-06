using CAPA_ENTIDADES;
using CAPA_NEGOCIO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace CookBook.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DificultadController : ControllerBase
    {
        private readonly CN_DIFICULTAD _CNDificultad;

        public DificultadController(IConfiguration configuration)
        {
            _CNDificultad = new CN_DIFICULTAD(configuration);
        }

        [HttpGet]
        public IActionResult ObtenerDificultades()
        {
            try
            {
                var dificultades = _CNDificultad.ListarDificultades();
                return Ok(dificultades);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult GuardarDificultad([FromBody] CE_DIFICULTAD dificultad)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _CNDificultad.GuardarDificultad(dificultad);
                return Created("", new { mensaje = "Dificultad creada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult ActualizarDificultad(int id, [FromBody] CE_DIFICULTAD dificultad)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dificultad.DificultadId != id)
                return BadRequest(new { error = "El ID de la dificultad no coincide." });

            try
            {
                _CNDificultad.ActualizarDificultad(dificultad);
                return Ok(new { mensaje = "Dificultad actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}