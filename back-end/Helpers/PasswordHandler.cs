using System.Security.Cryptography;
using System.Text;

namespace back_end.Helper
{
    public static class PasswordHandler
    {
        public static string Encrypt(string s)
        {
            byte[] encryptedBytes = Encoding.UTF8.GetBytes(s);
            encryptedBytes = new SHA256Managed().ComputeHash(encryptedBytes);
            string hash = Encoding.UTF8.GetString(encryptedBytes);

            return hash;
        }
    }
}
