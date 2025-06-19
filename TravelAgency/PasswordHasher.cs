
using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

public static class PasswordHasher
{
    // Hash password with randomly generated salt
    public static string HashPassword(string password)
    {
        // Generate a 128-bit salt using a secure PRNG
        byte[] salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Derive a 256-bit subkey (32 bytes) using PBKDF2
        byte[] hash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32);

        // Combine salt + hash (Base64) using ":" delimiter
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    // Verify password using stored hash
    public static bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split(':');
        if (parts.Length != 2) return false;

        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] storedHashBytes = Convert.FromBase64String(parts[1]);

        // Hash input password with same salt
        byte[] attemptedHash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32);

        return CryptographicOperations.FixedTimeEquals(storedHashBytes, attemptedHash);
    }
}

