using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CAPA_DATOS
{
    public class CD_USUARIO
    {
        private readonly CD_CONEXION _CONEXION;

        public CD_USUARIO(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region Insertar usuario
        public void InsertarUsuario(CE_USUARIO obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;

                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 100).Value = obj.Usuario ?? string.Empty;
                cmd.Parameters.Add("@PrimerNombre", SqlDbType.NVarChar, 100).Value = obj.PrimerNombre ?? string.Empty;
                cmd.Parameters.Add("@PrimerApellido", SqlDbType.NVarChar, 100).Value = obj.PrimerApellido ?? string.Empty;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = obj.Email ?? string.Empty;
                cmd.Parameters.Add("@DNI", SqlDbType.NVarChar, 14).Value = obj.DNI ?? string.Empty;
                cmd.Parameters.Add("@Contrasena", SqlDbType.NVarChar, 64).Value = obj.Contrasena ?? string.Empty;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion

        #region Actualizar usuario
        public void ActualizarUsuario(CE_USUARIO obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
                cmd.Parameters.Add("@UsuarioID", SqlDbType.Int).Value = obj.UsuarioID;

                // Para cada campo, si es null o cadena vacía => DBNull.Value
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(obj.Usuario) ? DBNull.Value : (object)obj.Usuario;

                cmd.Parameters.Add("@PrimerNombre", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(obj.PrimerNombre) ? DBNull.Value : (object)obj.PrimerNombre;

                cmd.Parameters.Add("@PrimerApellido", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(obj.PrimerApellido) ? DBNull.Value : (object)obj.PrimerApellido;

                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value =
                    string.IsNullOrWhiteSpace(obj.Email) ? DBNull.Value : (object)obj.Email;

                cmd.Parameters.Add("@DNI", SqlDbType.NVarChar, 14).Value =
                    string.IsNullOrWhiteSpace(obj.DNI) ? DBNull.Value : (object)obj.DNI;

                cmd.Parameters.Add("@Contrasena", SqlDbType.NVarChar, 64).Value =
                    string.IsNullOrWhiteSpace(obj.Contrasena) ? DBNull.Value : (object)obj.Contrasena;

                cmd.Parameters.Add("@EstadoID", SqlDbType.Int).Value =
                    obj.EstadoID == 0 ? DBNull.Value : (object)obj.EstadoID;

                cmd.ExecuteNonQuery();
            }
        }

        #endregion

        #region Listar usuarios
        public List<CE_USUARIO> ListarUsuarios()
        {
            List<CE_USUARIO> lista = new List<CE_USUARIO>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;

                DataTable dt = new DataTable();
                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    lista.Add(new CE_USUARIO
                    {
                        UsuarioID = dr["UsuarioId"] is DBNull ? 0 : Convert.ToInt32(dr["UsuarioId"]),
                        Usuario = dr["Usuario"]?.ToString(),
                        PrimerNombre = dr["NombreCompletoUsuario"]?.ToString()?.Split(' ')[0] ?? "",
                        PrimerApellido = dr["NombreCompletoUsuario"]?.ToString()?.Split(' ').Length > 1 ? dr["NombreCompletoUsuario"].ToString().Split(' ')[1] : "",
                        Email = dr["Email"]?.ToString(),
                        DNI = dr["DNI"]?.ToString(),
                        Contrasena = dr["Contrasena"]?.ToString(),
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoID = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"])
                    });
                }

                return lista;
            }
        }
        #endregion

        #region Obtener usuario por ID
        public CE_USUARIO ObtenerUsuarioPorId(int usuarioId)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 4;
                cmd.Parameters.Add("@UsuarioID", SqlDbType.Int).Value = usuarioId;

                DataTable dt = new DataTable();
                da.Fill(dt);

                if (dt.Rows.Count == 0)
                    return null;

                DataRow dr = dt.Rows[0];

                return new CE_USUARIO
                {
                    UsuarioID = dr["UsuarioId"] is DBNull ? 0 : Convert.ToInt32(dr["UsuarioId"]),
                    Usuario = dr["Usuario"]?.ToString(),
                    PrimerNombre = dr["NombreCompletoUsuario"]?.ToString()?.Split(' ')[0] ?? "",
                    PrimerApellido = dr["NombreCompletoUsuario"]?.ToString()?.Split(' ').Length > 1 ? dr["NombreCompletoUsuario"].ToString().Split(' ')[1] : "",
                    Email = dr["Email"]?.ToString(),
                    DNI = dr["DNI"]?.ToString(),
                    Contrasena = dr["Contrasena"]?.ToString(),
                    FechaCreacion = dr["FechaCreacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaCreacion"]),
                    FechaModificacion = dr["FechaModificacion"] is DBNull ? (DateTime?)null : Convert.ToDateTime(dr["FechaModificacion"]),
                    EstadoID = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"])
                };
            }
        }
        #endregion
    }
}
