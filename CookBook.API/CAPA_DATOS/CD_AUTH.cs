using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_AUTH
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_AUTH(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Login por email
        public CE_AUTH_USUARIO LoginPorEmail(string email)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_LOGIN", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = email ?? string.Empty;

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        return new CE_AUTH_USUARIO
                        {
                            UsuarioId = dr["UsuarioId"] is DBNull ? 0 : Convert.ToInt32(dr["UsuarioId"]),
                            Usuario = dr["Usuario"]?.ToString() ?? "",
                            PrimerNombre = dr["PrimerNombre"]?.ToString() ?? "",
                            Email = dr["Email"]?.ToString() ?? "",
                            Contrasena = dr["Contrasena"]?.ToString() ?? "",
                            RolId = dr["RolId"] is DBNull ? 0 : Convert.ToInt32(dr["RolId"]),
                            NombreRol = dr["NombreRol"]?.ToString() ?? ""
                        };
                    }
                }
            }

            return null;
        }
        #endregion
    }
}
