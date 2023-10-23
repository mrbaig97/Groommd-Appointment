const mongoose = require("mongoose");

// Define the schema for the service model
const bookingSchema = new mongoose.Schema(
    {
        barberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the Barber model
        }, userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the Barber model
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Subservice"
        },
        date: { type: String },
        startHour: { type: String },
        startMinute: { type: String,default:"0" },
        endHour: { type: String },
        endMinute: { type: String ,default:"0"},
        status: { type: String, enum: ["pending", "approved", "completed", "rejected"], default: "pending" }

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

// Create the Service model
const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
