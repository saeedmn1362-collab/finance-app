const reportsService = require("../services/reportsService");

/**
 * 📊 Monthly Report
 */
async function getMonthlyReport(req, res, next) {
  try {
    const userId = req.user.userId;

    const year = Number(req.query.year);
    const month = Number(req.query.month);

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);

    // Validation حرفه‌ای
    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      year < 2000 ||
      year > 2100 ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({
        success: false,
        message: "سال یا ماه نامعتبر است",
      });
    }

    const data = await reportsService.getMonthlyReport(
      userId,
      year,
      month,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Monthly report loaded",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 📊 Yearly Report
 */
async function getYearlyReport(req, res, next) {
  try {
    const userId = req.user.userId;

    const year = Number(req.query.year);

    if (Number.isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: "سال نامعتبر است",
      });
    }

    const data = await reportsService.getYearlyReport(userId, year);

    return res.status(200).json({
      success: true,
      message: "Yearly report loaded",
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMonthlyReport,
  getYearlyReport,
};
