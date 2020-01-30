export default class TimeUtils {

    static timeStringFromNumber(timeNum) {
        var hours = this.getTimeHours(timeNum);
        var minutes = this.getTimeMinutes(timeNum);
        var minutesStr = minutes.toString().padStart(2, '0');
        var timeStr = `${hours}:${minutesStr}`;
        return timeStr;
    }
    static minuteNumberToString(minutesNum) {
        // var hours = this.getTimeHours(timeNum);
        // var minutes = this.getTimeMinutes(timeNum);
        var minutes = Math.floor(minutesNum);
        var minutesStr = minutes.toString();
        var seconds = Math.floor(60 * (minutesNum - Math.floor(minutesNum)));
        var secondsStr = seconds.toString().padStart(2, '0');
        var timeStr = `${minutesStr}:${secondsStr}`;
        return timeStr;
    }
    
    static getTimeHours(time) {
        return Math.floor(time);
    }
    static getTimeMinutes(time) {
        return Math.floor(60 * (time - Math.floor(time)));
    }
    static getPaddedMinutesString(minutes) {
        return minutes.toString().padStart(2, '0');
    }
    static minutesToHourDecimal(minutes) {
        return minutes/60;
    }
    static secondsToHours(seconds) {
        return seconds/(60*60);
    }
    static millisecondsToHours(milliseconds) {
        return milliseconds / (1000 * 60 * 60);
    }

    // takes JavaScript Date object
    // returns the time of day in 24 hours
    // with minutes as a decimal
    // ex: 2020-01-01T13:30:00.000Z returns 13.5
    static datetimeToHourDecimal(datetime) {
        if (!(datetime instanceof Date)) {
            datetime = new Date(datetime);
        }
        var hours = datetime.getHours();
        var minutesDecimal = this.minutesToHourDecimal(datetime.getMinutes());
        var result = hours + minutesDecimal;
        if (result > 24) result = result - 24;
        return result;
    }

}