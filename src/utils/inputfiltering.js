import { customNames } from "./nicknames.js";

/**
 *  Maps real name -> nick name
 * @param {string} fullName 
 * @returns the mapped name if found, otherwise the original input
 */
export function replaceCustomNicknames(fullName) {
	if (customNames[fullName]) {
		return customNames[fullName];
	}

	return fullName;
}


/**
 * 	Filter out names that are not valid names
 * @param {*} input the input string to evaluate
 * @returns the input if it is valid, or an empty string if invalid 
 */
export function filterNonProfessors(input) {
	const nonprofs = [
		"STAFF",
	];
	if (nonprofs.includes(input)) {
		return ""
	}
	return input
}

/**
 *  Returns the first and last name combination for a given input
 * @param {*} nameComponents a list of strings representing name parts, i.e. ['Tom', 'Holland']
 * @param {*} nicknames an object mapping a full name to a series of nicknames commonly used to refer to people of that name
 */
export function createProfessorSearchStrings(nameComponents, nicknames = []) {

	const firstName = nameComponents[0];
	const lastName = nameComponents[nameComponents.length - 1];
	
	let searchStrings = []

	searchStrings.push(`${lastName} ${firstName}`)

	searchStrings.push(`${firstName} ${lastName}`)

	// TODO: expand further for middle names / aliases

	return searchStrings
}


export function abbreviateName(fullName, cutoff = 23) {
	const firstName = fullName.split(' ')[0];
	const lastName = fullName.split(" ").pop();
	return firstName.length + lastName.length < cutoff ? firstName + " " + lastName : firstName[0] + ". " + lastName;
}