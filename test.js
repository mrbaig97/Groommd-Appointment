
// const timing = {
//     startHour:9,
//     startMinute:0,
//     endHour:18,
//     endMinute:0
// }
// const duration = 75

// const slots = (((timing.endHour - timing.startHour) * 60) + (timing.startMinute + timing.endMinute)) / duration

// const myAvailabilities = []

// for (var i = 1; i <= slots; i++) {

//     ///9:00 6:00 duration 30 
//     if (i == 1) {

//         myAvailabilities.push(
//             {
//                 startHour: timing.startHour,
//                 startMinute: timing.startMinute,
//                 endHour: parseInt((timing.startMinute + duration / 60))+ timing.startHour,
//                 endMinute: timing.startMinute + duration % 60,
//             }
//         )
//     }else{
//         myAvailabilities.push(
//             {
//                 startHour:  myAvailabilities[i-2].endHour,
//                 startMinute:   myAvailabilities[i-2].endMinute,
//                 endHour: parseInt((timing.startMinute + (duration*i) / 60))+ timing.startHour,
//                 endMinute: timing.startMinute + (duration*i) % 60,
//             }
//         )
//     }
// }

// console.log(myAvailabilities)


const timing = {
    startHour:9,
    startMinute:0,
    endHour:18,
    endMinute:0
}
const duration = 30
const isAlreadyBooked=[{
    startHour:10,
    startMinute:0,
    endHour:11,
    endMinute:0
}]
const barberTime = (((timing.endHour - timing.startHour) * 60) + (timing.startMinute + timing.endMinute)) 
var bookedTime= 0

isAlreadyBooked.map((item)=>{
    bookedTime+=(((item.endHour - item.startHour) * 60) + (item.startMinute + item.endMinute))
})
const slot = (barberTime-bookedTime)/duration

console.log(slot)