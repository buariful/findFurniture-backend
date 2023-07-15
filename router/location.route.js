const {
  insertLocations,
  getDistricts,
  getUpazila,
  getAllLocations,
} = require("../controllers/location.controller");

const router = require("express").Router();

// "/location/division" or "/location/district" for only getting all divisions and districts

router.route("/location/:keyword").get(getAllLocations);
router.route("/district/:division_id").get(getDistricts);
router.route("/upazila/:district_id").get(getUpazila);
router.route("/insertLocations").post(insertLocations);

module.exports = router;
