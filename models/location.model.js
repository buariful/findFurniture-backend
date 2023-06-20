const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  locations: {
    divisions: [
      {
        id: { type: String, require: true },
        name: { type: String, require: true },
        bn_name: { type: String, require: true },
        url: { type: String, require: true },
      },
    ],
    districts: [
      {
        id: { type: String, require: true },
        name: { type: String, require: true },
        bn_name: { type: String, require: true },
        url: { type: String, require: true },
        division_id: { type: String, require: true },
        lat: { type: String, require: true },
        lon: { type: String, require: true },
      },
    ],
    upazilas: [
      {
        id: { type: String, require: true },
        name: { type: String, require: true },
        bn_name: { type: String, require: true },
        url: { type: String, require: true },

        district_id: { type: String, require: true },
      },
    ],
  },
});

module.exports = mongoose.model("locationModel", locationSchema);
