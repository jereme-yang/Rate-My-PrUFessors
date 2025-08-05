import RMPRatingData from "./rmpratingdata.js";
import { roundTo } from "../utils/round.js";

export default class RMPProfessorData {
  id: number;
  legacyID: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  department: string;
  qualityRating: number;
  ratingsCount: number;
  difficultyGPA: number;
  wouldTakeAgainPercentage?: number;
  wouldTakeAgainCount: number;
  topTags: string[];
  mostHelpfulRating?: RMPRatingData;

  constructor(
    id: number = 0,
    legacyID: string = "",
    firstName: string = "",
    middleName: string = "",
    lastName: string = "",
    department: string = "",
    qualityRating: number = 0,
    ratingsCount: number = 0,
    difficultyGPA: number = 0,
    wouldTakeAgainPercentage?: number,
    wouldTakeAgainCount: number = 0,
    topTags: string[] = [],
    mostHelpfulRating?: RMPRatingData
  ) {
    this.id = id;
    this.legacyID = legacyID;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.department = department;
    this.qualityRating = qualityRating;
    this.ratingsCount = ratingsCount;
    this.difficultyGPA = difficultyGPA;
    this.wouldTakeAgainCount = wouldTakeAgainCount;
    if (
      wouldTakeAgainPercentage !== undefined &&
      wouldTakeAgainPercentage >= 0
    ) {
      this.wouldTakeAgainPercentage = wouldTakeAgainPercentage;
    }
    this.topTags = topTags;
    this.mostHelpfulRating = mostHelpfulRating;
  }

  static fromGraphQL(data: any): RMPProfessorData {
    return new RMPProfessorData(
      data.id,
      data.legacyId,
      data.firstName,
      "",
      data.lastName,
      data.department,
      roundTo(data.avgRatingRounded, 2),
      data.numRatings,
      roundTo(data.avgDifficultyRounded, 2),
      roundTo(data.wouldTakeAgainPercentRounded, 2),
      data.wouldTakeAgainCount,
      data.teacherRatingTags.map((tag: any) => tag.tagName),
      data.mostUsefulRating
        ? RMPRatingData.fromGraphQL(data.mostUsefulRating)
        : undefined
    );
  }

  getURL(): string {
    return "https://www.ratemyprofessors.com/professor/" + this.legacyID;
  }

  getQualityRatingString(fallback: string = "N/A"): string | number {
    return this.qualityRating ? this.qualityRating : fallback;
  }

  getDifficultyRatingString(fallback: string = "N/A"): string | number {
    return this.difficultyGPA ? this.difficultyGPA : fallback;
  }

  getFullName(): string {
    return `${this.firstName} ${
      this.middleName ? ` ${this.middleName} ` : ""
    } ${this.lastName}`;
  }

  getDisplayName(): string {
    return this.firstName.length + this.lastName.length < 23
      ? this.firstName + " " + this.lastName
      : this.firstName[0] + ". " + this.lastName;
  }
}
