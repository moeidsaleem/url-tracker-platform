// write a function that takes a timestamp and returns a string with the time ago using moment.js
import moment from "moment";


export function momentAgo(timestamp: number): string {
    return moment(timestamp).fromNow();
}
