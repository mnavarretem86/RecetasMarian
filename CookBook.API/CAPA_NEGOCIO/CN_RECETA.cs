using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace CAPA_NEGOCIO
{


    public class CN_RECETA
    {

        private readonly CD_RECETAS _CDReceta;
        public CN_RECETA(IConfiguration configuration)
        {
            _CDReceta = new CD_RECETAS(configuration);

        }
        

        public List<CE_RECETAS_DETALLES> ListarRecetasDetalle()
        {
            return _CDReceta.LISTAR_RECETAS();
        }

        public void cn_GuardarRecetaCompleta(RecetaCompletaDTO receta)
        {
            _CDReceta.GuardarRecetaCompleta(receta);
        }
        public void cn_ActualizarRecetaCompleta(RecetaCompletaDTO receta)
        {
            _CDReceta.ActualizarRecetaCompleta(receta);
        }

        public string EliminarRecetas(RecetaCompletaDTO receta)
        {
             return _CDReceta.ELIMINAR_RECETAS(receta);
        }

    }



}
