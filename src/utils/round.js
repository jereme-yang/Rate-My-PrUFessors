/**
 *  Rounds the number
 * @param {*} number number to round
 * @param {*} places round to this decimal place
 * @returns the rounded number
 */
export function roundTo(number, places){
	return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}