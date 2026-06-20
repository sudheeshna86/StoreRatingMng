import {
  createStore,
  findStoreByEmail,
  findStoreOwnerById,
  findStoreByOwner,
  getStores,
  getStoreById,
} from "../services/store.service.js";

export const createStoreHandler = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      address,
      ownerId,
    } = req.body;

    const existingStore =
      await findStoreByEmail(email);

    if (existingStore) {
      return res.status(409).json({
        success: false,
        message:
          "Store email already exists",
      });
    }

    const owner =
      await findStoreOwnerById(
        ownerId
      );

    if (!owner) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid store owner",
      });
    }

    const assignedStore =
      await findStoreByOwner(
        ownerId
      );

    if (assignedStore) {
      return res.status(400).json({
        success: false,
        message:
          "Store owner already has a store assigned",
      });
    }

    const store =
      await createStore({
        name,
        email,
        address,
        ownerId,
      });

    return res.status(201).json({
      success: true,
      message:
        "Store created successfully",
      data: store,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const getAllStores = async (
  req,
  res
) => {
  try {

    const stores =
      await getStores(req.query);

    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

export const getStoreDetails = async (
  req,
  res
) => {
  try {

    const store =
      await getStoreById(
        req.params.id
      );

    if (!store) {
      return res.status(404).json({
        success: false,
        message:
          "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: store,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};