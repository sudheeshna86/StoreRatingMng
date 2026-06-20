import {
  getDashboardStats,
} from "../services/admin.service.js";

export const getDashboard = async (req,res) => {
  try {
    const stats =
      await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};