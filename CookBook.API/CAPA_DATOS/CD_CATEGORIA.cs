using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAPA_DATOS
{
    public class CD_CATEGORIA
    {
       
            private readonly CD_CONEXION _CONEXION;
            DataTable table = new DataTable();
            SqlCommand cmd = new SqlCommand();
            SqlDataAdapter da = new SqlDataAdapter();


            public CD_CATEGORIA(IConfiguration configuration)
            {
                _CONEXION = new CD_CONEXION(configuration);
            }

        #region guardar 
        public void INSERTAR_CATEGORIA(CE_CATEGORIA obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 2;
         
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = obj.Descripcion;

            cmd.ExecuteNonQuery();
        }
    }
        #endregion guardar

        #region LISTAR categoria
        public List<CE_CATEGORIA> LISTAR_CATEGORIA()
        {
            List<CE_CATEGORIA> categoria = new List<CE_CATEGORIA>();
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))

            {
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 1;
                DataTable table = new DataTable();
                cmd.CommandType = CommandType.StoredProcedure;
                da.Fill(table);
                foreach (DataRow dr in table.Rows)
                {
                    CE_CATEGORIA categorias = new CE_CATEGORIA
                    {
                        CategoriaId = dr["CategoriaId"] is DBNull ? 0 : Convert.ToInt32(dr["CategoriaId"]),
                        Nombre = dr["Nombre"] is DBNull ? string.Empty : dr["Nombre"].ToString(),
                        Descripcion = dr["Descripcion"] is DBNull ? string.Empty : dr["Descripcion"].ToString(),
                        FechaCreacion = dr["FechaCreacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaCreacion"]),
                        FechaModificacion = dr["FechaModificacion"] is DBNull ? DateTime.MinValue : Convert.ToDateTime(dr["FechaModificacion"]),
                        EstadoId = dr["EstadoId"] is DBNull ? 0 : Convert.ToInt32(dr["EstadoId"])
                    };
                    categoria.Add(categorias);
                }
                return categoria;
            }
        }
        #endregion Listar categoria


        #region guardar 
        public void Actualizar_CATEGORIA(CE_CATEGORIA obj)
        {
            using (SqlConnection con = _CONEXION.AbrirConexion())
            using (SqlCommand cmd = new SqlCommand("USP_AccionesCategoria", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Accion", SqlDbType.Int).Value = 3;
                cmd.Parameters.Add("@CategoriaId", SqlDbType.Int).Value = obj.CategoriaId;
                cmd.Parameters.Add("@Nombre", SqlDbType.NVarChar, 100).Value = obj.Nombre;
                cmd.Parameters.Add("@Descripcion", SqlDbType.NVarChar, 100).Value = obj.Descripcion;

                cmd.ExecuteNonQuery();
            }
        }
        #endregion guardar
    }
}
