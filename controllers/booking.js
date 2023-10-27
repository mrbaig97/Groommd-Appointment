const BookingModel = require("../models/booking");
const SubserviceModel = require("../models/subServices");
const UserModel = require("../models/user");


async function fetchTotalDuration(serviceIds) {
    try {
        const services = await SubserviceModel.find({ _id: { $in: serviceIds } });

        if (services.length === 0) {
            return 0; // No services found, so total duration is 0
        }

        // Calculate the total duration by summing the durations of all services
        const totalDuration = services.reduce((acc, service) => {
            return acc + service.duration;
        }, 0);

        return totalDuration;
    } catch (error) {
        console.error("Error fetching durations:", error);
        return null; // Handle the error as needed
    }
}
exports.getBusinessTimingsAndGenerateSlots = async (req, res) => {
    const { barberId, serviceIds, userId, day, date } = req.body;

    if (!barberId || !serviceIds || !day || !date) {
        return res.status(400).json({ message: "Missing barberId, subserviceIds, day, or date" });
    }

    const duration = await fetchTotalDuration(serviceIds); // Fetch duration using the subserviceId

    if (duration === null) {
        return res.status(404).json({ message: "Subservice not found or duration not available" });
    }

    try {
        const user = await UserModel.findById(barberId);
        if (user) {
            const businessTimings = user.businessTimings;
            if (businessTimings) {
                const slots = [];

                businessTimings.forEach((timing) => {
                    if (timing.isOpen && timing.day === day) {
                        const startHour = parseInt(timing.startHour);
                        const startMinute = parseInt(timing.startMinute);
                        const endHour = parseInt(timing.endHour);
                        const endMinute = parseInt(timing.endMinute);
                        let currentHour = startHour;
                        let currentMinute = startMinute;

                        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                            let slotEndHour = currentHour;
                            let slotEndMinute = currentMinute + duration;

                            if (slotEndMinute >= 60) {
                                slotEndHour += Math.floor(slotEndMinute / 60);
                                slotEndMinute %= 60;
                            }

                            slots.push({
                                barberId: barberId,
                                userId: userId,
                                serviceIds: serviceIds,
                                day: day,
                                date: date, // Add the date to the slot
                                startHour: currentHour.toString(),
                                startMinute: currentMinute.toString(),
                                endHour: slotEndHour.toString(),
                                endMinute: slotEndMinute.toString(),
                            });

                            currentHour = slotEndHour;
                            currentMinute = slotEndMinute;
                        }
                    }
                });

                res.status(200).json({
                    message: "Slots retrieved successfully",
                    slots,
                });
            } else {
                res.status(404).json({ message: "Business timings not available for the user" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching business timings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




exports.createBooking = async (req, res) => {
    try {
        const { barberId, userId, serviceIds, date, startHour, startMinute, endHour, endMinute } = req.body;

        // Check if the user and barber exist
        const barber = await UserModel.findById(barberId);
        const user = await UserModel.findById(userId);
        if (!barber || !user) {
            return res.status(404).json({ message: "Barber or user not found" });
        }

        // Check if the selected services exist
        const services = await SubserviceModel.find({ _id: { $in: serviceIds } });
        if (services.length !== serviceIds.length) {
            return res.status(404).json({ message: "One or more services not found" });
        }

        // Create a new booking
        const newBooking = new BookingModel({
            barberId,
            userId,
            services: serviceIds,
            date,
            startHour,
            startMinute,
            endHour,
            endMinute,
            status: "pending" // You can set the initial status as needed
        });

        // Save the booking to the database
        await newBooking.save();

        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { barberId, date, serviceId, day } = req.body;
        const serviceData = await SubserviceModel.findById(serviceId);
        const barberData = await UserModel.findById(barberId);

        if (!barberData) {
            return res.status(404).json({ message: "Barber not found" });
        }

        const timing = barberData.businessTimings.find((item) => item.day === day);
        if (!timing) {
            return res.status(404).json({ message: "Business timings not found for this day" });
        }

        const duration = serviceData.duration; // Use the service's duration if available, or set your default duration.

        const existingBookings = await BookingModel.find({ barberId, date });

        const bookedSlots = [];
        existingBookings.forEach((item) => {
            const startHour = parseInt(item.startHour);
            const startMinute = parseInt(item.startMinute);
            const endHour = parseInt(item.endHour);
            const endMinute = parseInt(item.endMinute);
            // Convert booking time to minutes
            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            bookedSlots.push({ startMinutes, endMinutes });
        });

        const barberStartMinutes = parseInt(timing.startHour) * 60 + parseInt(timing.startMinute);
        const barberEndMinutes = parseInt(timing.endHour) * 60 + parseInt(timing.endMinute);
        
        const availableSlots = [];
        let currentMinutes = barberStartMinutes;
        
        // Iterate through the available time slots and check if they are booked
        while (currentMinutes + duration <= barberEndMinutes) {
            const slotEndMinutes = currentMinutes + duration;
            let isBooked = false;

            // Check if the slot overlaps with any booked slots
            for (const bookedSlot of bookedSlots) {
                if (currentMinutes < bookedSlot.endMinutes && slotEndMinutes > bookedSlot.startMinutes) {
                    isBooked = true;
                    break;
                }
            }

            if (!isBooked) {
                // Convert minutes back to hours and minutes
                const startHour = Math.floor(currentMinutes / 60);
                const startMinute = currentMinutes % 60;
                const endHour = Math.floor(slotEndMinutes / 60);
                const endMinute = slotEndMinutes % 60;

                availableSlots.push({
                    startHour: startHour.toString().padStart(2, '0'),
                    startMinute: startMinute.toString().padStart(2, '0'),
                    endHour: endHour.toString().padStart(2, '0'),
                    endMinute: endMinute.toString().padStart(2, '0'),
                });
            }
            
            currentMinutes += duration;
        }

        res.status(200).json({ message: "Available slots retrieved successfully", availableSlots });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// exports.getBookings = async (req, res) => {
//     try {
//         const bookings = await BookingModel.find({});
//         res.status(200).json({ message: "Bookings retrieved successfully", bookings });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };
