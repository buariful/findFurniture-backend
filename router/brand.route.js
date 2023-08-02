const {
  createBrand,
  getAllBrands,
  deleteBrand,
} = require("../controllers/brand.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");
const brandModel = require("../models/brand.model");
const router = require("express").Router();

router
  .route("/brand")
  .get(getAllBrands)
  .post(isAuthenticated, roleAuthorize(["admin"]), createBrand);

router
  .route("/brand/:id")
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteBrand);

router.route("/update/brand").put(async (req, res) => {
  try {
    // Update documents
    const updateResult = await brandModel.updateMany(
      {},
      { $set: { label: "$name", value: "$name" } },
      { new: true }
    );

    console.log(`${updateResult.nModified} documents updated successfully.`);
    res
      .status(200)
      .json({
        success: true,
        message: `${updateResult.nModified} documents updated successfully.`,
        data: updateResult,
      });
  } catch (error) {
    console.error("Error updating documents:", error);
    res
      .status(500)
      .json({ success: false, error: "Error updating documents." });
  }
});

module.exports = router;
