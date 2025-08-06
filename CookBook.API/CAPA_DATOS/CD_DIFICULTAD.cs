using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_DIFICULTAD
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_DIFICULTAD(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Insertar dificultad
        public void InsertarDificultad(CE_DIFICULTAD obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_DIFICULTADES", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre ?? string.Empty;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 255).Value = obj.Descripcion ?? string.Empty;
                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value = 1; // Por defecto, activo

                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Listar dificultades
        public List<CE_DIFICULTAD> ListarDificultades()
        {
            List<CE_DIFICULTAD> dificultades = new List<CE_DIFICULTAD>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_DIFICULTADES", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;

                DataTable table = new DataTable();
                da.Fill(table);

                foreach (DataRow dr in table.Rows)
                {
                    dificultades.Add(new CE_DIFICULTAD
                    {
                        DificultadId = dr["DificultadId"] is DBNull ? 0 : Convert.ToInt32(dr["DificultadId"]),
                        Nombre = dr["Nombre"]?.ToString() ?? "",
                        Descripcion = dr["Descripcion"]?.ToString() ?? "",
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoId = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"])
                    });
                }

                return dificultades;
            }
        }
        #endregion

        #region Actualizar dificultad
        public void ActualizarDificultad(CE_DIFICULTAD obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_DIFICULTADES", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;
                cmd.Parameters.Add("@DificultadId", SqlDbType.Int).Value = obj.DificultadId;

                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrEmpty(obj.Nombre) ? DBNull.Value : (object)obj.Nombre;

                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 255).Value =
                    string.IsNullOrEmpty(obj.Descripcion) ? DBNull.Value : (object)obj.Descripcion;

                cmd.Parameters.Add("@EstadoId", SqlDbType.Int).Value =
                    obj.EstadoId == 0 ? DBNull.Value : (object)obj.EstadoId;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion
    }
}