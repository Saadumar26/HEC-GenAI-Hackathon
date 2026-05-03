import { Router, type IRouter } from "express";
import analyzeRouter from "./analyze";
import generateRouter from "./generate";
import editRouter from "./edit";
import sessionsRouter from "./sessions";

const router: IRouter = Router();

router.use(analyzeRouter);
router.use(generateRouter);
router.use(editRouter);
router.use(sessionsRouter);

export default router;
