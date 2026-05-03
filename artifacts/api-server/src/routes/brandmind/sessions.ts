import { Router, type IRouter } from "express";
import { db, generationSessionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetSessionParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/brandmind/sessions", async (req, res) => {
  req.log.info("Listing sessions");
  try {
    const sessions = await db
      .select({
        id: generationSessionsTable.id,
        brandName: generationSessionsTable.brandName,
        intent: generationSessionsTable.intent,
        platforms: generationSessionsTable.platforms,
        createdAt: generationSessionsTable.createdAt,
      })
      .from(generationSessionsTable)
      .orderBy(desc(generationSessionsTable.createdAt))
      .limit(20);

    res.json(sessions.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "Failed to list sessions");
    res.status(500).json({ error: "Failed to list sessions" });
  }
});

router.get("/brandmind/sessions/:id", async (req, res) => {
  const parsed = GetSessionParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const { id } = parsed.data;
  req.log.info({ id }, "Getting session");

  try {
    const [session] = await db
      .select()
      .from(generationSessionsTable)
      .where(eq(generationSessionsTable.id, id))
      .limit(1);

    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json({
      ...session,
      createdAt: session.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err, id }, "Failed to get session");
    res.status(500).json({ error: "Failed to get session" });
  }
});

export default router;
