import { Router } from "express";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "./account.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../core/validation/validate";
import {
  createAccountSchema,
  updateAccountSchema,
} from "../../validations/account.validation";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(createAccountSchema), createAccount);
router.get("/", getAccounts);
router.put("/:id", validate(updateAccountSchema), updateAccount);
router.delete("/:id", deleteAccount);

export default router;