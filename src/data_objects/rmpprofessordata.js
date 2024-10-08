import RMPRatingData from "./rmpratingdata.js";
import { roundTo } from "../utils/round.js";

export default class RMPProfessorData {

	constructor(id, legacyID, firstName, middleName, lastName, department, qualityRating, ratingsCount, difficultyGPA, wouldTakeAgainPercentage, wouldTakeAgainCount, topTags, mostHelpfulRating) {
		this.id = id || 0;
		this.legacyID = legacyID || "";
		this.firstName = firstName || "";
		this.middleName = middleName;
		this.lastName = lastName || "";
		this.department = department || "";
		this.qualityRating = qualityRating || 0;
		this.ratingsCount = ratingsCount || 0;
		this.difficultyGPA = difficultyGPA;
		this.wouldTakeAgainCount = wouldTakeAgainCount || 0;
		if (wouldTakeAgainPercentage >= 0) {
			this.wouldTakeAgainPercentage = wouldTakeAgainPercentage;
		}
		this.topTags = topTags || [];
		this.mostHelpfulRating = mostHelpfulRating;
	}


	static fromGraphQL(data) {
		return new RMPProfessorData(
			data.id,
			data.legacyId,
			data.firstName,
			"",
			data.lastName,
			data.department,
			roundTo(data.avgRatingRounded,2),
			data.numRatings,
			roundTo(data.avgDifficultyRounded, 2),
			roundTo(data.wouldTakeAgainPercentRounded, 2),
			data.wouldTakeAgainCount,
			data.teacherRatingTags.map((tag) => tag.tagName),
			data.mostUsefulRating ? RMPRatingData.fromGraphQL(data.mostUsefulRating) : undefined,			
		)
	}


	getURL() {
		return "https://www.ratemyprofessors.com/professor/" + this.legacyID
	}

	getQualityRatingString(fallback = "N/A") {
		return this.qualityRating ? this.qualityRating : fallback
	}

	getDifficultyRatingString(fallback="N/A") {
		return this.difficultyGPA ? this.difficultyGPA : fallback
	}
	
	getFullName() {
		return `${this.firstName} ${this.middleName ? ` ${this.middleName} ` : ""} ${this.lastName}`
	}
	getDisplayName() {
		return this.firstName.length + this.lastName.length < 23 ? this.firstName + " " + this.lastName : this.firstName[0] + ". " + this.lastName;
	}
}