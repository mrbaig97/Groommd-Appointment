const BookingeModel = require("../models/booking");
const SubserviceModel = require("../models/subServices");
const UserModel = require("../models/user");

exports.createBooking = async (req, res) => {
    try {
        const { barberId, userId, serviceId, date, startHour, startMinute, endHour, endMinute } = req.body;

        // Check if the user and barber exist
        const barber = await UserModel.findById(barberId);
        const user = await UserModel.findById(userId);
        if (!barber || !user) {
            return res.status(404).json({ message: "Barber or user not found" });
        }

        // Check if the selected service exists
        const service = await SubserviceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Create a new booking
        const newBooking = new BookingeModel({
            barberId,
            userId,
            service: serviceId,
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

exports.getAvailability = async (req, res) => {
    try {
        const { barberId, date, serviceId, day } = req.body
        const serviceData = await SubserviceModel.findById(serviceId)
        const barberData = await UserModel.findById(barberId)
        const isAlreadyBooked = await BookingeModel.find({ barberId, date })
        if (isAlreadyBooked.length == 0) {


            const timing = barberData.businessTimings.filter((item) => {
                return item.day == day
            })[0]
            const slots = (((timing.endHour - timing.startHour) * 60) + (timing.startMinute + timing.endMinute)) / duration
            const myAvailabilities = []
            for (var i = 0; i < slots; i++) {
                ///9:00 6:00 duration 30 
                if (i == 0) {

                    myAvailabilities.push(
                        {
                            startHour: timing.startHour,
                            startMinute: timing.startMinute,
                            endHour: parseInt((timing.startMinute + duration / 60)) + timing.startHour,
                            endMinute: timing.startMinute + duration % 60,
                        }
                    )
                } else {
                    myAvailabilities.push(
                        {
                            startHour: myAvailabilities[i - 2].endHour,
                            startMinute: myAvailabilities[i - 2].endMinute,
                            endHour: parseInt((timing.startMinute + (duration * i) / 60)) + timing.startHour,
                            endMinute: timing.startMinute + (duration * i) % 60,
                        }
                    )
                }
            }

        } else {
            const timing = barberData.businessTimings.filter((item) => {
                return item.day == day
            })[0]
            const barberTime = (((timing.endHour - timing.startHour) * 60) + (timing.startMinute + timing.endMinute))
            var bookedTime = 0
            isAlreadyBooked.map((item) => {
                bookedTime += (((item.endHour - item.startHour) * 60) + (item.startMinute + item.endMinute))
            })
            const slots = (barberTime - bookedTime) / duration
            const myAvailabilities = []
            for (var i = 0; i < slots; i++) {

                var startHour, startMinute, endHour, endMinute;
                if (i == 0) {



                    startHour = timing.startHour
                    startMinute = timing.startMinute
                    endHour = parseInt((timing.startMinute + duration / 60)) + timing.startHour
                    endMinute = timing.startMinute + duration % 60


                } else {
                    startHour = myAvailabilities[i - 2].endHour
                    startMinute = myAvailabilities[i - 2].endMinute
                    endHour = parseInt((timing.startMinute + (duration * i) / 60)) + timing.startHour
                    endMinute = timing.startMinute + (duration * i) % 60

                }
                // yahan logic lgani hai k agr koi time booked time se clash ho raha ho tw kia kren 
                
                myAvailabilities.push({ startHour, startMinute, endHour, endMinute })
            }
        }
    } catch (err) { }
}