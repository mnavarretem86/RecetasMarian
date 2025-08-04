using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_INGREDIENTE
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_INGREDIENTE(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Insertar ingrediente
        public void InsertarIngrediente(CE_INGREDIENTE obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesIngrediente", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre ?? string.Empty;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = obj.Descripcion ?? string.Empty;
                cmd.Parameters.Add("@Unidad", SqlDbType.NVarChar, 50).Value = obj.Unidad ?? string.Empty;
                // EstadoId y Fechas se manejan automáticamente desde el SP
                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Listar ingredientes
        public List<CE_INGREDIENTE> ListarIngredientes()
        {
            List<CE_INGREDIENTE> ingredientes = new List<CE_INGREDIENTE>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesIngrediente", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;

                DataTable table = new DataTable();
                da.Fill(table);

                foreach (DataRow dr in table.Rows)
                {
                    ingredientes.Add(new CE_INGREDIENTE
                    {
                        IngredienteId = dr["IngredienteId"] is DBNull ? 0 : Convert.ToInt32(dr["IngredienteId"]),
                        Nombre = dr["Nombre"]?.ToString() ?? "",
                        Descripcion = dr["Descripcion"]?.ToString() ?? "",
                        Unidad = dr["Unidad"]?.ToString() ?? "",
                        EstadoId = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"]),
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaModificacion"]),
                    });
                }

                return ingredientes;
            }
        }
        #endregion

        #region Actualizar ingrediente
        public void ActualizarIngrediente(CE_INGREDIENTE obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesIngrediente", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;
                cmd.Parameters.Add("@IngredienteId", SqlDbType.Int).Value = obj.IngredienteId;
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre ?? (object)DBNull.Value;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = obj.Descripcion ?? (object)DBNull.Value;
                cmd.Parameters.Add("@Unidad", SqlDbType.NVarChar, 50).Value = obj.Unidad ?? (object)DBNull.Value;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = obj.EstadoId == 0 ? (object)DBNull.Value : obj.EstadoId;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion
    }
}
