using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_RECETAS
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_RECETAS(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Insertar Receta Completa
        public void GuardarRecetaCompleta(RecetaCompletaDTO receta)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_RECETA_COMPLETA", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;
                cmd.Parameters.AddWithValue("@RecetaId", (object)receta.RecetaId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Titulo", (object)receta.Titulo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Descripcion", (object)receta.Descripcion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TiempoPreparacion", (object)receta.TiempoPreparacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@UsuarioId", (object)receta.UsuarioId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CategoriaId", (object)receta.CategoriaId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@JsonIngredientes", (object)receta.JsonIngredientes ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@JsonPasos", (object)receta.JsonPasos ?? DBNull.Value);

                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Listar Recetas Detalladas
        public List<CE_RECETAS_DETALLES> LISTAR_RECETAS()
        {
            List<CE_RECETAS_DETALLES> recetas = new List<CE_RECETAS_DETALLES>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_RECETA_COMPLETA", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;

                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    DataTable tabla = new DataTable();
                    da.Fill(tabla);

                    foreach (DataRow dr in tabla.Rows)
                    {
                        recetas.Add(new CE_RECETAS_DETALLES
                        {
                            RecetaId = Convert.ToInt32(dr["RecetaId"]),
                            Titulo = dr["Titulo"].ToString(),
                            DescripcionReceta = dr["DescripcionReceta"].ToString(),
                            TiempoPreparacion = Convert.ToInt32(dr["TiempoPreparacion"]),
                            Usuario = dr["Usuario"].ToString(),
                            NombreCompletoUsuario = dr["NombreCompletoUsuario"].ToString(),
                            Categoria = dr["Categoria"].ToString(),
                            Ingredientes = dr["Ingredientes"].ToString(),
                            Pasos = dr["Pasos"].ToString()
                        });
                    }
                }
            }

            return recetas;
        }
        #endregion

        #region Actualizar Receta Completa
        public void ActualizarRecetaCompleta(RecetaCompletaDTO receta)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_RECETA_COMPLETA", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
                cmd.Parameters.AddWithValue("@RecetaId", (object)receta.RecetaId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Titulo", (object)receta.Titulo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Descripcion", (object)receta.Descripcion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TiempoPreparacion", (object)receta.TiempoPreparacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@UsuarioId", (object)receta.UsuarioId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CategoriaId", (object)receta.CategoriaId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@JsonIngredientes", (object)receta.JsonIngredientes ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@JsonPasos", (object)receta.JsonPasos ?? DBNull.Value);

                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Eliminar Receta (opcional)
        public string ELIMINAR_RECETAS(RecetaCompletaDTO receta)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_Eliminar_Recetas", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@RecetaId", receta.RecetaId);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return reader["Mensaje"].ToString();
                    }
                }
            }

            return "Error al eliminar.";
        }
        #endregion
    }
}
