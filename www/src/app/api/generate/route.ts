export async function POST(req: Request) {
  try {
    const { aim, systemInstruction } = await req.json();
    // Simulate per-aim processing delay
    await new Promise((r) => setTimeout(r, 600));

    // In a real implementation, you'd use the systemInstruction + aim here
    return Response.json({ ok: true, aim, usedInstruction: Boolean(systemInstruction) });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
}
