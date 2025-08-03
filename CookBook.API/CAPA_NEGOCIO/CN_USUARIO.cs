using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CAPA_NEGOCIO.CN_USUARIO;

namespace CAPA_NEGOCIO
{
    public class CN_USUARIO
    {
    

            private readonly CD_USUARIO _CDUsuario;
            public CN_USUARIO(IConfiguration configuration)
            {
                _CDUsuario = new CD_USUARIO(configuration);

            }
        public void CN_InsertarUsuario(CE_USUARIO usuario)
        {
            if (usuario == null)
                throw new ArgumentNullException(nameof(usuario));

            _CDUsuario.INSERTAR_USUARIO(usuario);
        }

        public List<CE_DETALLE_USUARIO> CN_ListarUsuarios()
        {
            return _CDUsuario.LISTAR_USUARIOS();
        }

        public void CN_ActualizarUsuario(CE_USUARIO usuario)
        {
            if (usuario == null || usuario.UsuarioID <= 0)
                throw new ArgumentException("Usuario inválido.");

            _CDUsuario.ACTUALIZAR_USUARIO(usuario);
        }
        public List<CE_DETALLE_USUARIO> Cn_FiltrarUsuarios(CE_DETALLE_USUARIO usuario)
        {
            return _CDUsuario.Filtrar_USUARIOS(usuario);
        }


        public CE_USUARIO IniciarSesion(string email, string contrasena)
        {
            
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(contrasena))
            {
                return null; // Si la entrada es inválida, no se intenta la consulta
            }

            return _CDUsuario.IniciarSesion(email, contrasena);
        }
    }

}

