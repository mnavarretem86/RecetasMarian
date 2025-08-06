using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace CAPA_NEGOCIO
{
    public class CN_USUARIO
    {
        private readonly CD_USUARIO _CDUsuario;

        public CN_USUARIO(IConfiguration configuration)
        {
            _CDUsuario = new CD_USUARIO(configuration);
        }

        public List<CE_USUARIO> ListarUsuarios()
        {
            return _CDUsuario.ListarUsuarios();
        }

        public CE_USUARIO ObtenerUsuarioPorId(int id)
        {
            return _CDUsuario.ObtenerUsuarioPorId(id);
        }

        public void CrearUsuario(CE_USUARIO usuario)
        {
            if (!string.IsNullOrWhiteSpace(usuario.Contrasena))
            {
                usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasena);
            }

            _CDUsuario.InsertarUsuario(usuario);
        }

        public void ActualizarUsuario(CE_USUARIO usuario)
        {
            if (!string.IsNullOrWhiteSpace(usuario.Contrasena))
            {
                usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasena);
            }

            _CDUsuario.ActualizarUsuario(usuario);
        }
    }
}
