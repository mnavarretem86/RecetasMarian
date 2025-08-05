using System;

namespace CAPA_ENTIDADES
{
    public class CE_RECETAS_DETALLES
    {
        public int RecetaId { get; set; }
        public string Titulo { get; set; }
        public string DescripcionReceta { get; set; }
        public int TiempoPreparacion { get; set; }
        public string Usuario { get; set; }
        public string NombreCompletoUsuario { get; set; }
        public string Categoria { get; set; }
        public string Dificultad { get; set; }

        public string Ingredientes { get; set; }
        public string Pasos { get; set; }
    }
}
