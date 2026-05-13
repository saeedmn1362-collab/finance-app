import api from "@/lib/api";

// =========================
// 📊 Dashboard Service (Enterprise Version)
// =========================
export async function getDashboard(params = {}) {
  try {
    const res = await api.get("/dashboard", { params });

    // 🔥 همیشه فقط دادهٔ خالص برگردان
    return res.data?.data || null;
  } catch (error) {
    // ❗ خطا همیشه normalize شده است (به لطف Axios Client)
    throw {
      message: error.message,
      status: error.status,
      data: error.data,
    };
  }
}
