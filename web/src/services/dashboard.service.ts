import api from "@/lib/api";

// =========================
// Types
// =========================
type DashboardParams = Record<string, string | number | boolean>;

type NormalizedError = {
  message: string;
  status: number;
  data: unknown;
};

// =========================
// 📊 Dashboard Service
// =========================
export async function getDashboard(
  params: DashboardParams = {}
) {
  try {
    const res = await api.get("/dashboard", {
      params,
    });

    // ✅ همیشه فقط data خالص
    return res.data?.data ?? null;
  } catch (error: unknown) {
    // ✅ Safe Error Normalization
    if (typeof error === "object" && error !== null) {
      const err = error as Partial<NormalizedError>;

      throw {
        message: err.message ?? "Unknown error",
        status: err.status ?? 500,
        data: err.data ?? null,
      } satisfies NormalizedError;
    }

    throw {
      message: "Unknown error",
      status: 500,
      data: null,
    } satisfies NormalizedError;
  }
}