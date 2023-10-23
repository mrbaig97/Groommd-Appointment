const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    images: [],
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "barber", "admin"],
      default: "user",
    },
    shopname: String, // Specific to barbers
    businessTimings:

      [{
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        isOpen: Boolean,
        startHour: { type: String },
        startMinute: { type: String, default: "00" },
        endHour: { type: String },
        endMinute: { type: String, default: "00" },


      }], // Specific to barbers
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service", // Assuming you have a Service model
      },
    ], // Specific to barbers
    // Add other fields specific to admins
  },
  {
    versionKey: false, // This option will remove the __v field from the document
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true, // This option will automatically add createdAt and updatedAt timestamps
  }

);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;



