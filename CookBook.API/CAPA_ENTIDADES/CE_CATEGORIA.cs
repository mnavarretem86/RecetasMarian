using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAPA_ENTIDADES
{
    public class CE_CATEGORIA
    {
        public int CategoriaId {  get; set; }
        public String Nombre {  get; set; }
        public string Descripcion {  get; set; }
         public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
        public int EstadoId {  get; set; }

    }
}
