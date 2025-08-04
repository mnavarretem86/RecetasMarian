using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace CAPA_NEGOCIO
{
    public class CN_CATEGORIA
    {
        private readonly CD_CATEGORIA _CDCategoria;

        public CN_CATEGORIA(IConfiguration configuration)
        {
            _CDCategoria = new CD_CATEGORIA(configuration);
        }

        public List<CE_CATEGORIA> ListarCategorias()
        {
            return _CDCategoria.ListarCategorias();
        }

        public void GuardarCategoria(CE_CATEGORIA categoria)
        {
            _CDCategoria.InsertarCategoria(categoria);
        }

        public void ActualizarCategoria(CE_CATEGORIA categoria)
        {
            _CDCategoria.ActualizarCategoria(categoria);
        }
    }
}
