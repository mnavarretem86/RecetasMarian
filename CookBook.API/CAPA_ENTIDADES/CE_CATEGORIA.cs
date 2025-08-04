using System;
using System.ComponentModel.DataAnnotations;

namespace CAPA_ENTIDADES
{
    public class CE_CATEGORIA
    {
        public int CategoriaId { get; set; }

        [StringLength(100)]
        public string Nombre { get; set; }

        [StringLength(100)]
        public string Descripcion { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        [Range(0, 1, ErrorMessage = "El EstadoId debe ser 0 (Inactivo) o 1 (Activo).")]
        public int EstadoId { get; set; }
    }
}
