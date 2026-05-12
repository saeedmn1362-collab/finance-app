const accountService = require("../services/accountService");

const createAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const account = await accountService.createAccount(userId, req.body);
    res.status(201).json({ message: "حساب ساخته شد", account });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAccounts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accounts = await accountService.getAccounts(userId);
    res.json({ message: "لیست حساب‌ها", accounts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountId = req.params.id;
    const updated = await accountService.updateAccount(userId, accountId, req.body);
    res.json({ message: "حساب آپدیت شد", account: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const accountId = req.params.id;
    const result = await accountService.deleteAccount(userId, accountId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
};