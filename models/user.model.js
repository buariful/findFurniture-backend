const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Enter a name not smaller than 3 characters"],
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Enter a password not smaller than 4 characters"],
    select: false,
  },
  avatar: {
    publicId: {
      type: String,
    },
    url: {
      type: String,
    },
    default: {
      type: String,
      default:
        "https://res.cloudinary.com/dygolqxi7/image/upload/v1689775723/FindFurniture/demo_avtar_rwreos.jpg",
    },
  },
  role: {
    type: String,
    default: "user",
  },
  cartItem: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" },
      quantity: { type: Number, default: 1 },
    },
  ],
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductModel" }],
});

// ================password hashed================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};
module.exports = mongoose.model("UserModel", userSchema);
