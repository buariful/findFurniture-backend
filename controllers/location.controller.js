const asyncError = require("../middleware/asyncError");
const locationModel = require("../models/location.model");

exports.insertLocations = asyncError(async (req, res) => {
  const result = await locationModel.create({ locations: req.body });

  res.status(200).json({
    success: true,
    data: result,
  });
});

exports.getDivisions = asyncError(async (_req, res) => {
  const locations = await locationModel.find({});
  const result = locations[0].locations.divisions;

  res.status(200).json({
    success: true,
    totalResults: result.length,
    data: result,
  });
});

exports.getDistricts = asyncError(async (req, res) => {
  const division_id = req.params.division_id;
  const locations = await locationModel.find({});
  const allDistricts = locations[0].locations.districts;
  const targetedDistricts = allDistricts.filter(
    (dis) => dis.division_id === division_id
  );

  res.status(200).json({
    success: true,
    totalResults: targetedDistricts.length,
    data: targetedDistricts,
  });
});
exports.getUpazila = asyncError(async (req, res) => {
  const district_id = req.params.district_id;
  const locations = await locationModel.find({});
  const allUpazilas = locations[0].locations.upazilas;
  const targetedUpazilas = allUpazilas.filter(
    (upazila) => upazila.district_id === district_id
  );

  res.status(200).json({
    success: true,
    totalResults: targetedUpazilas.length,
    data: targetedUpazilas,
  });
});
