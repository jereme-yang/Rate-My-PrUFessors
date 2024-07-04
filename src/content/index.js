import { filterNonProfessors, replaceCustomNicknames, createProfessorSearchStrings } from '../utils/inputfiltering.js';

import { normalizeGraphQLData, isCloseEnough } from '../utils/outputfiltering.js';

import { setupProfCard } from '../components/professorcard.js';

import { setupProfTag } from '../components/professortag.js';

import { UF_SCHOOL_ID } from '../constants/school.js';

import browser from "webextension-polyfill";

import 'arrive';


// apply css styles to the page
let head = document.getElementsByTagName("head")[0];
let csses = ["tippy.css", "light.css", "content.css"];
for (const css of csses) {
	var fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", browser.runtime.getURL(css));
	head.appendChild(fileref);
}


// driver code to call API queries and append html contents
const selectors = ['.sc-kpDqfm.dvjGPq.MuiTypography-root.MuiTypography-body1.sc-epRvzc.fFLxNM'];
selectors.forEach((selector) => {
	document.arrive(selector, function (target) {
		let profname = filterNonProfessors(target.textContent.trim());
		profname = replaceCustomNicknames(profname);
		let lastName = profname.split(' ')
		lastName = lastName[lastName.length - 1]

		searchProfessorByName(profname, UF_SCHOOL_ID)
			.then((results) => linkProfessor(target, results, lastName, UF_SCHOOL_ID))
			.catch((error) => {
					// if no luck, then provide a link with just [Last Name]
					linkProfessor(target, [], lastName, UF_SCHOOL_ID)
					return
				}
			)
	});
});


/**
 * Given a professors name as a regular string, attempt to look up the correct professor using the RMP API
 * @param {*} name a professors name to look up
 * @param {string} schoolId (optional) the base64 RateMyProfessors school ID to limit the search to 
 * @param {number} [maxTries=2] the maximum number of API calls to make before giving up
 */
async function searchProfessorByName(name, schoolId, maxTries=2) {

	//dont make a query if there was no valid name to use
	if (!name || name == ""){
		return Promise.reject("no name was provided when searching for a professor name")
	}

	// split and standardize the casing in the name
	const splitName = name.split(' ').map((part) => part.toLowerCase().trim());
	
	let searchStrings = createProfessorSearchStrings(splitName)
	searchStrings = searchStrings.slice(0, maxTries)
	return searchForProfessor(searchStrings, schoolId)
}


/**
 * Run a series of searches using the RateMyProfessors API until one comes back with data
 * @param {*} searches a list of search terms to, the length of this array determines the number of attempts that will be made
 * @param {string} schoolId a base64 school ID to limit searches to
 * @param {number} [delayms=500] the number of milliseconds to delay between subsequent requests to help respect rate limits.
 */
async function searchForProfessor(searches, schoolId, delayms=500) {
	//https://stackoverflow.com/a/38225011

	function rejectDelay(reason) {
		return new Promise(function(resolve, reject) {
			setTimeout(reject.bind(null, reason), delayms); 
		});
	}

	function testReturnedData(val) {
		if(val.length == 0) {
			throw val;
		} else {
			return val;
		}
	}

	function generateAttempt(search, schoolId) {
		return (reason) => GetProfessorRating(search, schoolId)
	}

	var p = Promise.reject();

	for (const search of searches) {
		p = p.catch(generateAttempt(search, schoolId)).then(testReturnedData).catch(rejectDelay);
		// Don't be tempted to simplify this to `p.catch(attempt).then(test, rejectDelay)`. Test failures would not be caught.
	}
	return p
}


/**
 * perform a single query to RateMyProfessors
 * @param {string} searchterm the search term to use (usually a professor's name)
 * @param {string} schoolId the ID of the school to limit the search to
 * @returns a promise that returns a list of RMPProfessorData objects
 */
async function GetProfessorRating(searchterm, schoolId) {
	const query = `query NewSearchTeachersQuery(
    $query: TeacherSearchQuery!
) {
	newSearch {
		teachers(query: $query) {
			didFallback
			edges {
				cursor
				node {
					id
					legacyId
					firstName
					lastName
					avgRatingRounded
					numRatings
					wouldTakeAgainPercentRounded
					wouldTakeAgainCount
					teacherRatingTags {
						id
						legacyId
						tagCount
						tagName
					}
					mostUsefulRating {
						id
						class
						isForOnlineClass
						legacyId
						comment
						helpfulRatingRounded
						ratingTags
						grade
						date
						iWouldTakeAgain
						qualityRating
						difficultyRatingRounded
						teacherNote{
							id
							comment
							createdAt
							class
						}
						thumbsDownTotal
						thumbsUpTotal
					}
					avgDifficultyRounded
					school {
						name
						id
					}
					department
				}
			}
		}
	}
}`;

	const queryVars = {
		text: searchterm,
	}

	if (schoolId) {
		queryVars.schoolID = schoolId
	}

	const body = JSON.stringify({
		query,
		variables: {
			query: queryVars,
		}
	});

	return browser.runtime.sendMessage({
		type: "graphql",
		content: body
	}).then((data) => normalizeGraphQLData(data));
}


/**
 * Adds link and professor card to the course selection page
 * @param {HTMLElement} element element to append link/card to
 * @param {Array[RMPProfessorData]} results queried list of RMPProfessorData objects 
 * @param {string} lastName last name of the professor queried
 * @param {string} schoolId uf schoolid
 */
function linkProfessor(element, results, lastName, schoolId) {
	element.setAttribute('target', '_blank');
	element.classList.add('blueText');
	element.parentElement && element.parentElement.classList.add('classSearchBasicResultsText');

	// check if the results have a match
	const result = results.find(result => isCloseEnough(result.getFullName(), element.textContent));
	
	// create a professor tag / card
	if (!result) {
		setupProfTag(element, [], lastName, schoolId, false);
	} else {
		let profData = results[i]
		setupProfTag(element, profData, lastName, schoolId, true);
		setupProfCard(element, profData);
	}
}



