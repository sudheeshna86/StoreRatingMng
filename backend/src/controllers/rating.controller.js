import {
  getStoresForUser,
  findStoreById,
  findRating,
  createRating,
  updateRating,
} from "../services/rating.service.js";

export const getStores = async (
  req,
  res
) => {
  try {
    const {
      rows,
      pagination,
    } = await getStoresForUser(
      req.user.id,
      req.query
    );

    return res.status(200).json({
      success: true,
      count: pagination.totalRecords,
      pagination,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Server Error",
    });
  }
};

export const submitRating = async (
  req,
  res
) => {
  try {

    const userId =
      req.user.id;

    const {
      storeId,
    } = req.params;

    const {
      rating,
    } = req.body;

    const store =
      await findStoreById(
        storeId
      );

    if (!store) {
      return res.status(404).json({
        success: false,
        message:
          "Store not found",
      });
    }

    const existingRating =
      await findRating(
        userId,
        storeId
      );

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message:
          "Rating already submitted. Use update rating.",
      });
    }

    const newRating =
      await createRating(
        userId,
        storeId,
        rating
      );

    return res.status(201).json({
      success: true,
      message:
        "Rating submitted successfully",
      data: newRating,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Server Error",
    });

  }
};

export const modifyRating = async (
  req,
  res
) => {
  try {

    const userId =
      req.user.id;

    const {
      storeId,
    } = req.params;

    const {
      rating,
    } = req.body;

    const store =
      await findStoreById(
        storeId
      );

    if (!store) {
      return res.status(404).json({
        success: false,
        message:
          "Store not found",
      });
    }

    const existingRating =
      await findRating(
        userId,
        storeId
      );

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message:
          "Rating not found",
      });
    }

    const updatedRating =
      await updateRating(
        userId,
        storeId,
        rating
      );

    return res.status(200).json({
      success: true,
      message:
        "Rating updated successfully",
      data: updatedRating,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Server Error",
    });

  }
};