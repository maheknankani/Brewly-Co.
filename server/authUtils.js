const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'brewly_admin_super_secret_key_9842';

/**
 * Hashes a plaintext password using bcryptjs.
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Synchronous version of hashPassword for seed scripts.
 */
function hashPasswordSync(password) {
  return bcrypt.hashSync(password, 10);
}

/**
 * Compares plaintext password against a bcrypt hash.
 */
async function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return false;
  }
}

/**
 * Generates a signed JWT for an authenticated admin user.
 */
function generateAdminToken(adminData) {
  const payload = {
    id: adminData.id || adminData._id,
    username: adminData.username || adminData.email,
    email: adminData.email,
    role: adminData.role || 'admin',
    name: adminData.name || 'Head Roaster Admin'
  };

  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

/**
 * Verifies a JWT token string.
 */
function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    return jwt.verify(cleanToken, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  hashPassword,
  hashPasswordSync,
  verifyPassword,
  generateAdminToken,
  verifyAdminToken,
  SECRET
};
