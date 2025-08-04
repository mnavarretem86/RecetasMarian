using System;

namespace CAPA_ENTIDADES
{
    public class CE_INGREDIENTE
    {
        public int IngredienteId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Unidad { get; set; } // antes UnidadMedida
        public int EstadoId { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public DateTime? FechaCreacion { get; set; }
    }
}
