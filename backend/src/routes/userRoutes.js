router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (err) {
    console.log("PROFILE ERROR:", err); // 👈 اضافه کن
    res.status(500).json({ message: "خطای سرور" });
  }
});