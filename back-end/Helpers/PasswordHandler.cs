using System.Security.Cryptography;
using System.Text;

namespace back_end.Helpers
{
    public static class PasswordHandler
    {
        private const string SecurityKey = "zxcfghqwe2314qxc24h";
        public static string Encrypt(string s)
        {
            byte[] encryptedBytes = Encoding.UTF8.GetBytes(s);

            var md5CryptoServiceProvider = MD5.Create();
            byte[] securityKeyArray = md5CryptoServiceProvider.ComputeHash(
                Encoding.UTF8.GetBytes(SecurityKey)
            );

            md5CryptoServiceProvider.Clear();
            var desCryptoServiceProvider = TripleDES.Create();
            desCryptoServiceProvider.Key = securityKeyArray;
            desCryptoServiceProvider.Mode = CipherMode.ECB;
            desCryptoServiceProvider.Padding = PaddingMode.PKCS7;

            var cryptoTransform = desCryptoServiceProvider.CreateEncryptor();

            byte[] hashArray = cryptoTransform.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
            desCryptoServiceProvider.Clear();

            return Convert.ToBase64String(hashArray);
        }
    }
}
