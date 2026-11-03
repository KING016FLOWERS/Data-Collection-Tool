import { Router } from "express";
import { modules } from "../data/modules.js";
import { requireAssignedDepartment } from "../auth/sessions.js";
/** Dedicated data endpoint for department users; never returns other modules. */
const router = Router();
router.get("/:id", requireAssignedDepartment, (req, res) => {
    const module = modules.find((item) => item.id === req.params.id);
    if (!module) {
        res.status(404).json({ message: "Department module not found." });
        return;
    }
    res.json(module);
});
export default router;
