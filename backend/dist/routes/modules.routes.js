import { Router } from "express";
import { modules } from "../data/modules.js";
import { requireTopManagement } from "../auth/sessions.js";
const router = Router();
router.get("/", requireTopManagement, (_req, res) => res.json(modules));
router.get("/:id", requireTopManagement, (req, res) => {
    const module = modules.find((item) => item.id === req.params.id);
    if (!module) {
        res.status(404).json({ message: "Module not found." });
        return;
    }
    res.json(module);
});
export default router;
