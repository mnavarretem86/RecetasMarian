using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_CATEGORIA
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_CATEGORIA(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Insertar categoría
        public void InsertarCategoria(CE_CATEGORIA obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre ?? string.Empty;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = obj.Descripcion ?? string.Empty;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Listar categorías
        public List<CE_CATEGORIA> ListarCategorias()
        {
            List<CE_CATEGORIA> categorias = new List<CE_CATEGORIA>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;

                DataTable table = new DataTable();
                da.Fill(table);

                foreach (DataRow dr in table.Rows)
                {
                    categorias.Add(new CE_CATEGORIA
                    {
                        CategoriaId = dr["CategoriaId"] is DBNull ? 0 : Convert.ToInt32(dr["CategoriaId"]),
                        Nombre = dr["Nombre"]?.ToString() ?? "",
                        Descripcion = dr["Descripcion"]?.ToString() ?? "",
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoId = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"])
                    });
                }

                return categorias;
            }
        }
        #endregion

        #region Actualizar categoría
        public void ActualizarCategoria(CE_CATEGORIA obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;
                cmd.Parameters.Add("@CategoriaId", SqlDbType.Int).Value = obj.CategoriaId;

                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrEmpty(obj.Nombre) ? DBNull.Value : (object)obj.Nombre;

                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrEmpty(obj.Descripcion) ? DBNull.Value : (object)obj.Descripcion;

                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value =
                    obj.EstadoId == 0 ? DBNull.Value : (object)obj.EstadoId;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion
    }
}
