using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace CAPA_NEGOCIO
{
    public class CN_INGREDIENTE
    {
        private readonly CD_INGREDIENTE _CDIngrediente;

        public CN_INGREDIENTE(IConfiguration configuration)
        {
            _CDIngrediente = new CD_INGREDIENTE(configuration);
        }

        public List<CE_INGREDIENTE> ListarIngredientes()
        {
            return _CDIngrediente.ListarIngredientes();
        }

        public void GuardarIngrediente(CE_INGREDIENTE ingrediente)
        {
            _CDIngrediente.InsertarIngrediente(ingrediente);
        }

        public void ActualizarIngrediente(CE_INGREDIENTE ingrediente)
        {
            _CDIngrediente.ActualizarIngrediente(ingrediente);
        }
    }
}
