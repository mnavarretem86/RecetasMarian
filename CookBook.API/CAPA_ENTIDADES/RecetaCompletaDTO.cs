using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAPA_ENTIDADES
{
    public class RecetaCompletaDTO
    {

        public int? RecetaId { get; set; }
   
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public int? TiempoPreparacion { get; set; }
        public int? UsuarioId { get; set; }
        public int? CategoriaId { get; set; }
        public string JsonIngredientes { get; set; }
        public string JsonPasos { get; set; }

    }
}
