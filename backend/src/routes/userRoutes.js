const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const prisma = require("../lib/prisma");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "خطای سرور" });
  }
});

module.exports = router;