using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace CAPA_NEGOCIO
{
    public class CN_DIFICULTAD
    {
        private readonly CD_DIFICULTAD _CDDificultad;

        public CN_DIFICULTAD(IConfiguration configuration)
        {
            _CDDificultad = new CD_DIFICULTAD(configuration);
        }

        public List<CE_DIFICULTAD> ListarDificultades()
        {
            return _CDDificultad.ListarDificultades();
        }

        public void GuardarDificultad(CE_DIFICULTAD dificultad)
        {
            _CDDificultad.InsertarDificultad(dificultad);
        }

        public void ActualizarDificultad(CE_DIFICULTAD dificultad)
        {
            _CDDificultad.ActualizarDificultad(dificultad);
        }
    }
}