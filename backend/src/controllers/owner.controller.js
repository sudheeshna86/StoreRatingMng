import {
  getOwnerStoreDashboard,
  getUsersWhoRatedStore,
} from "../services/owner.service.js";

export const getDashboard =
  async (req, res) => {
    try {
      const ownerId =
        req.user.id;

      const dashboard =
        await getOwnerStoreDashboard(
          ownerId
        );

      if (!dashboard) {
        return res.status(404).json({
          success: false,
          message:
            "No store assigned",
        });
      }

      return res.status(200).json({
        success: true,
        data: dashboard,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  };

export const getRatings =
  async (req, res) => {
    try {
      const ownerId =
        req.user.id;

      const ratings =
        await getUsersWhoRatedStore(
          ownerId
        );

      return res.status(200).json({
        success: true,
        count: ratings.length,
        data: ratings,
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  };