import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "../modules/accounts/account.controller";
import { validate } from "../core/validation/validate";
import {
  createAccountSchema,
  updateAccountSchema,
} from "../validations/account.validation";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createAccountSchema), createAccount);
router.get("/", getAccounts);
router.put("/:id", validate(updateAccountSchema), updateAccount);
router.delete("/:id", deleteAccount);

export default router;