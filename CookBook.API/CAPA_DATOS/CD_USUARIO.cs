using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography.X509Certificates;


namespace CAPA_DATOS
{
    public class CD_USUARIO
    {

        private readonly CD_CONEXION _CONEXION;
        DataTable table = new DataTable();
        SqlCommand cmd = new SqlCommand();
        SqlDataAdapter da = new SqlDataAdapter();


        public CD_USUARIO(IConfiguration configuration)
        {
            _CONEXION = new CD_CONEXION(configuration);
        }

        #region guardar 
        public void INSERTAR_USUARIO(CE_USUARIO obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 100).Value = obj.Usuario;
                cmd.Parameters.Add("@PrimerNombre", SqlDbType.NVarChar, 100).Value = obj.PrimerNombre;
                cmd.Parameters.Add("@PrimerApellido", SqlDbType.NVarChar, 100).Value = obj.PrimerApellido;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = obj.Email;
                cmd.Parameters.Add("@DNI", SqlDbType.NVarChar, 14).Value = obj.DNI;
                cmd.Parameters.Add("@Contrasena", SqlDbType.NVarChar, 64).Value = obj.Contrasena;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion guardar

        #region LISTAR usuarios
        public List<CE_DETALLE_USUARIO> LISTAR_USUARIOS()
        {
            List<CE_DETALLE_USUARIO> Usuario = new List<CE_DETALLE_USUARIO>();
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))

            {
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;
                DataTable table = new DataTable();
                cmd.CommandType = CommandType.StoredProcedure;
                da.Fill(table);
                foreach (DataRow dr in table.Rows)
                {
                    CE_DETALLE_USUARIO usuario = new CE_DETALLE_USUARIO
                    {
                        UsuarioID = dr["UsuarioId"] is DBNull ? 0 : Convert.ToInt32(dr["UsuarioId"]),
                        Usuario = dr["Usuario"] is DBNull ? string.Empty : dr["Usuario"].ToString(),
                        NombreCompletoUsuario = dr["NombreCompletoUsuario"] is DBNull ? string.Empty : dr["NombreCompletoUsuario"].ToString(),
                        Email = dr["Email"] is DBNull ? string.Empty : dr["Email"].ToString(),
                        DNI = dr["DNI"] is DBNull ? string.Empty : dr["DNI"].ToString(),
                        Contrasena = dr["Contrasena"] is DBNull ? string.Empty : dr["Contrasena"].ToString(),
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoID = dr["EstadoID"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoID"])
                    };
                    Usuario.Add(usuario);
                }
                return Usuario;
            }
        }
        #endregion Listar usuarios

        #region Actualizar 
        public void ACTUALIZAR_USUARIO(CE_USUARIO obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;
                cmd.Parameters.Add("@UsuarioId", SqlDbType.Int).Value = obj.UsuarioID;
                cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 100).Value = obj.Usuario;
                cmd.Parameters.Add("@PrimerNombre", SqlDbType.NVarChar, 100).Value = obj.PrimerNombre;
                cmd.Parameters.Add("@PrimerApellido", SqlDbType.NVarChar, 100).Value = obj.PrimerApellido;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = obj.Email;
                cmd.Parameters.Add("@DNI", SqlDbType.NVarChar, 14).Value = obj.DNI;
                cmd.Parameters.Add("@Contrasena", SqlDbType.VarBinary, 256).Value = obj.Contrasena;

            }
        }
        #endregion Actualizar 
        #region filtrar
        public List<CE_DETALLE_USUARIO> Filtrar_USUARIOS(CE_DETALLE_USUARIO obj)
        {
            List<CE_DETALLE_USUARIO> Usuario = new List<CE_DETALLE_USUARIO>();

            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_USUARIOS", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 4;
                cmd.Parameters.AddWithValue("@UsuarioID", obj.UsuarioID);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable table = new DataTable();
                da.Fill(table);

                if (table.Rows.Count > 0)
                {
                    DataRow dr = table.Rows[0];
                    CE_DETALLE_USUARIO usuario = new CE_DETALLE_USUARIO
                    {
                        UsuarioID = dr["UsuarioId"] is DBNull ? 0 : Convert.ToInt32(dr["UsuarioId"]),
                        Usuario = dr["Usuario"] is DBNull ? string.Empty : dr["Usuario"].ToString(),
                        NombreCompletoUsuario = dr["NombreCompletoUsuario"] is DBNull ? string.Empty : dr["NombreCompletoUsuario"].ToString(),
                        Email = dr["Email"] is DBNull ? string.Empty : dr["Email"].ToString(),
                        DNI = dr["DNI"] is DBNull ? string.Empty : dr["DNI"].ToString(),
                        Contrasena = dr["Contrasena"] is DBNull ? string.Empty : dr["Contrasena"].ToString(),
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoID = dr["EstadoID"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoID"])
                    }
                ;
                    Usuario.Add(usuario);
                }

                return Usuario;

            }
            #endregion filtrar


        }

        public CE_USUARIO IniciarSesion(string email, string contrasena)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("SP_IniciarSesion", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 100).Value = email;
                cmd.Parameters.Add("@Contrasena", SqlDbType.NVarChar, 64).Value = contrasena;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new CE_USUARIO
                        {
                            UsuarioID = Convert.ToInt32(reader["UsuarioId"]),
                            Usuario = reader["Usuario"].ToString(),
                            PrimerNombre = reader["PrimerNombre"].ToString(),
                            PrimerApellido = reader["PrimerApellido"].ToString(),
                            Email = reader["Email"].ToString(),
                            DNI = reader["DNI"] != DBNull.Value ? reader["DNI"].ToString() : null,
Contrasena = reader["Contrasena"] != DBNull.Value ? reader["Contrasena"].ToString() : null,
FechaCreacion = reader["FechaCreacion"] != DBNull.Value ? Convert.ToDateTime(reader["FechaCreacion"]) : (DateTime?)null,
FechaModificacion = reader["FechaModificacion"] != DBNull.Value ? Convert.ToDateTime(reader["FechaModificacion"]) : (DateTime?)null,
EstadoID = reader["EstadoID"] != DBNull.Value ? Convert.ToInt32(reader["EstadoID"]) : (int?)null
                        };
                    }
                }
            }

            return null;
        }
    } 
}
