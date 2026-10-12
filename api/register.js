import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'E-mail is al geregistreerd' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
      select: { id: true, name: true, email: true },
    });

    return res.status(201).json({ message: 'Account succesvol aangemaakt', user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
}
