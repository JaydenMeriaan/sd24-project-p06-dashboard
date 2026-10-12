import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail en wachtwoord zijn verplicht' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Gebruiker niet gevonden' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Onjuiste inloggegevens' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const isProduction = process.env.NODE_ENV === 'production';
    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
      isProduction ? '; Secure' : ''
    }`;
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ message: 'Inloggen succesvol' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
}
