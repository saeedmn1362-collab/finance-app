const dashboardService = require("../services/dashboardService");

// =========================
// GET DASHBOARD
// =========================
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const dashboardData = await dashboardService.getDashboardData(userId);

    res.status(200).json({
      success: true,
      message: "Dashboard data loaded",
      data: dashboardData,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
};