import { Router, type IRouter } from "express";
import healthRouter from "./health";
import brandmindRouter from "./brandmind";

const router: IRouter = Router();

router.use(healthRouter);
router.use(brandmindRouter);

export default router;
