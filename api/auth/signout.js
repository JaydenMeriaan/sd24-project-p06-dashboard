export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProduction ? '; Secure' : ''}`
  res.setHeader('Set-Cookie', cookie)

  res.writeHead(302, { Location: '/overview' })
  return res.end()
}
