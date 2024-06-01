export function formatCash(str: string) {
    if (str === null || str === undefined) return ''
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
    })
}

export function convertToHourMinuteSecond(time: string) {
    const [hours, minutes, seconds] = time.split(':');

    let formattedTime = '';

    if (hours !== '00') {
        formattedTime += `${parseInt(hours)} giờ `;
    }

    if (minutes !== '00') {
        formattedTime += `${parseInt(minutes)} phút `;
    }

    if (seconds !== '00') {
        formattedTime += `${parseInt(seconds)} giây`;
    }

    return formattedTime.trim();
}

export function convertToVietnamTime(dateTime: string) {
    // Create a new Date object from the provided data time
    const date = new Date(dateTime);

    // Get the time difference in milliseconds between UTC and Vietnam time (GMT+7)
    // const timeDifference = 7 * 60 * 60 * 1000; // 7 hours * 60 minutes * 60 seconds * 1000 milliseconds

    // Add the time difference to the UTC date to get Vietnam time
    const vietnamTime = new Date(date.getTime());

    // Format the Vietnam time in the specified format
    const formattedVietnamTime = `${vietnamTime.getHours().toString().padStart(2, '0')}:${vietnamTime.getMinutes().toString().padStart(2, '0')} ${vietnamTime.getDate()}/${vietnamTime.getMonth() + 1}/${vietnamTime.getFullYear()}`;

    return formattedVietnamTime;
}

export function formatDateTime(time: string): string {
    const objectDate = new Date(time)
    let day = objectDate.getDate();

    let month = objectDate.getMonth() + 1;

    let year = objectDate.getFullYear();

    return day + "/" + month + "/" + year
}

export function formatDateTimeEng(time: string): string {
    const objectDate = new Date(time)
    let day = objectDate.getDate();

    let month = objectDate.getMonth() + 1;

    let year = objectDate.getFullYear();

    let strDay = day < 10 ? `0${day}` : `${day}`
    let strMonth = month < 10 ? `0${month}` : `${month}`
    let strYear = year < 10 ? `0${year}` : `${year}`

    return strYear + "-" + strMonth + "-" + strDay
}

// export function convertTime(time: number) {
//     const totalMinutes = Math.floor(time / 60);

//     const seconds = time % 60;
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = totalMinutes % 60;

//     const strHours = hours < 10 ? `0${hours}` : `${hours}`
//     const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
//     const strSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`


//     return `${strHours}:${strMinutes}:${strSeconds}`;
// }

export function convertTime(time: number) {
    const totalMinutes = Math.floor(time / 60);

    const seconds = time % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let formattedTime = '';

    if (hours !== 0) {
        formattedTime += `${hours} giờ `;
    }

    if (minutes !== 0) {
        formattedTime += `${minutes} phút `;
    }

    formattedTime += `${seconds} giây`;

    return formattedTime.trim();
}
