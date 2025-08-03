using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAPA_NEGOCIO
{
    public class CN_CATEGORIA
    {
        private readonly CD_CATEGORIA _CDCATEGORIA;
        public CN_CATEGORIA(IConfiguration configuration)
        {
           _CDCATEGORIA = new CD_CATEGORIA(configuration);

        }


        public List<CE_CATEGORIA> ListarcategoriaDetalle()
        {
            return _CDCATEGORIA.LISTAR_CATEGORIA();
        }

        public void cn_GuardarCategoriaCompleta(CE_CATEGORIA receta)
        {
            _CDCATEGORIA.INSERTAR_CATEGORIA(receta);
        }
        public void cn_ActualizarCategoriaCompleta(CE_CATEGORIA receta)
        {
            _CDCATEGORIA.Actualizar_CATEGORIA(receta);
        }

    }
}
