export async function GET() {
  const RENDER_API_URL = process.env.RENDER_API_URL;

  try {
    await fetch(`${RENDER_API_URL}/health`);
    return Response.json({ pinged: true });
  } catch (err) {
    return Response.json({ error: 'Ping failed', details: err }, { status: 500 });
  }
}
