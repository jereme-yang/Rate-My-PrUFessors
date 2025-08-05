import { roundTo } from "../utils/round.js";

export interface RMPRatingDataParams {
  id?: number;
  legacyID?: string;
  date: Date;
  course?: string;
  qualityRating?: number;
  difficultyRating?: number;
  comments?: string;
  totalThumbsUp?: number;
  totalThumbsDown?: number;
  ratingTags: string[];
  isOnlineClass: boolean;
  iWouldTakeAgain: boolean;
}

export default class RMPRatingData {
  id: number;
  legacyID: string;
  date: Date;
  course: string;
  qualityRating: number;
  difficultyRating: number;
  comments: string;
  totalThumbsUp: number;
  totalThumbsDown: number;
  ratingTags: string[];
  isOnlineClass: boolean;
  iWouldTakeAgain: boolean;

  constructor(
    id: number = 0,
    legacyID: string = "",
    date: Date,
    course: string = "",
    qualityRating: number = 0,
    difficultyRating: number = 0,
    comments: string = "",
    totalThumbsUp: number = 0,
    totalThumbsDown: number = 0,
    ratingTags: string[] = [],
    isOnlineClass: boolean = false,
    iWouldTakeAgain: boolean = false
  ) {
    this.id = id;
    this.legacyID = legacyID;
    this.date = date;
    this.course = course;
    this.qualityRating = qualityRating;
    this.difficultyRating = difficultyRating;
    this.comments = comments;
    this.totalThumbsUp = totalThumbsUp;
    this.totalThumbsDown = totalThumbsDown;
    this.ratingTags = ratingTags;
    this.isOnlineClass = isOnlineClass;
    this.iWouldTakeAgain = iWouldTakeAgain;
  }

  static fromGraphQL(data: any): RMPRatingData {
    return new RMPRatingData(
      data.id,
      data.legacyId,
      new Date(data.date),
      data.class,
      roundTo(data.qualityRating, 2),
      roundTo(data.difficultyRatingRounded, 2),
      data.comment,
      data.thumbsUpTotal,
      data.thumbsDownTotal,
      data.ratingTags, // string[]
      data.isForOnlineClass,
      data.iWouldTakeAgain
    );
  }
}
