const {
  insertLocations,
  getDistricts,
  getUpazila,
  getAllLocations,
} = require("../controllers/location.controller");
const { isAuthenticated } = require("../middleware/authentication");

const router = require("express").Router();

// "/location/division" or "/location/district" for only getting all divisions and districts
router.route("/location/:keyword").get(isAuthenticated, getAllLocations);
router.route("/district/:division_id").get(isAuthenticated, getDistricts);
router.route("/upazila/:district_id").get(isAuthenticated, getUpazila);
router.route("/insertLocations").post(isAuthenticated, insertLocations);

module.exports = router;
