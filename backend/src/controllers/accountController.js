const accountService = require("../services/accountService");

// =========================
// CREATE ACCOUNT
// =========================
const createAccount = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const account = await accountService.createAccount(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Create account failed",
    });
  }
};

// =========================
// GET ACCOUNTS (SORTED)
// =========================
const getAccounts = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const accounts = await accountService.getAccounts(userId, {
      orderBy: { createdAt: "desc" }, // یا { name: "asc" }
    });

    return res.status(200).json({
      success: true,
      message: "Accounts fetched successfully",
      count: accounts.length,
      data: accounts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Fetch accounts failed",
    });
  }
};

// =========================
// UPDATE ACCOUNT (PATCH STYLE)
// =========================
const updateAccount = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const accountId = req.params.id;

    if (!userId || !accountId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // فقط فیلدهای ارسال‌شده آپدیت می‌شوند
    const data = {};

    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.type !== undefined) data.type = req.body.type;
    if (req.body.initialBalance !== undefined)
      data.initialBalance = req.body.initialBalance;

    const updated = await accountService.updateAccount(
      userId,
      accountId,
      data
    );

    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: updated,
    });
  } catch (err) {
    const status =
      err.message === "Account not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: err.message || "Update failed",
    });
  }
};

// =========================
// DELETE ACCOUNT
// =========================
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const accountId = req.params.id;

    if (!userId || !accountId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const deleted = await accountService.deleteAccount(
      userId,
      accountId
    );

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: deleted,
    });
  } catch (err) {
    const status =
      err.message === "Account not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: err.message || "Delete failed",
    });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};