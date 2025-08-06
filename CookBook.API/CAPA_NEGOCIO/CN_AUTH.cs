using CAPA_DATOS;
using CAPA_ENTIDADES;
using Microsoft.Extensions.Configuration;

namespace CAPA_NEGOCIO
{
    public class CN_AUTH
    {
        private readonly CD_AUTH _cdAuth;

        public CN_AUTH(IConfiguration configuration)
        {
            _cdAuth = new CD_AUTH(configuration);
        }

        public CE_AUTH_USUARIO Login(string email)
        {
            return _cdAuth.LoginPorEmail(email);
        }
    }
}
