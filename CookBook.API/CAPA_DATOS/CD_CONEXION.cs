using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;



namespace CAPA_DATOS
{
    internal class CD_CONEXION
    {
        private readonly string _conexionString;
        private SqlConnection _CONEXION;


        public CD_CONEXION(IConfiguration configuration)
        {
            _conexionString = configuration.GetConnectionString("ConectarSql");
            _CONEXION = new SqlConnection(_conexionString);

        }
        public SqlConnection AbrirConexion()
        {
            if (_CONEXION.State == ConnectionState.Closed)
                _CONEXION.Open();
            return _CONEXION;
        }

        public SqlConnection CerrarConexion()
        {
            if (_CONEXION.State == ConnectionState.Open)
                _CONEXION.Close();
            return _CONEXION;
        }
    }

    
}
