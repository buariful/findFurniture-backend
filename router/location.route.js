const {
  getDivisions,
  insertLocations,
  getDistricts,
  getUpazila,
} = require("../controllers/location.controller");

const router = require("express").Router();

router.route("/divisions").get(getDivisions);
router.route("/district/:division_id").get(getDistricts);
router.route("/upazila/:district_id").get(getUpazila);
router.route("/insertLocations").post(insertLocations);

module.exports = router;
