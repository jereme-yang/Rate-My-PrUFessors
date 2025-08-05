import {
  createToolTipElement,
  getOverallScoreDiv,
  getOverallEmojiDiv,
  createMeter,
} from "../utils/componentutils.js";
import { RMP_LOGO, EVALS_LOGO } from "../constants/logos.js";
import { abbreviateName } from "../utils/inputfiltering.js";
import { EMOJIS } from "../constants/emoji.js";
import tippy from "tippy.js";

export interface MostHelpfulReview {
  course: string;
  date: Date;
  comments: string;
  totalThumbsUp: number;
  totalThumbsDown: number;
}

export interface ProfData {
  getDisplayName(): string;
  department: string;
  getQualityRatingString(): string;
  ratingsCount: number;
  difficultyGPA: number;
  wouldTakeAgainPercentage?: number;
  topTags: string[];
  mostHelpfulRating?: MostHelpfulReview;
}

function titleSection(div: HTMLElement, profData: ProfData) {
  const container = document.createElement("div");
  container.className = "prof-card-name-and-logo";
  const name = Object.assign(document.createElement("div"), {
    className: "prof-card-rating-title",
    textContent: profData.getDisplayName(),
  });
  container.appendChild(name);
  container.appendChild(RMP_LOGO());
  div.appendChild(container);
  div.appendChild(
    createToolTipElement(
      `Professor in ${profData.department} ${EMOJIS.get(
        profData.department.toLowerCase()
      )}`
    )
  );
}

function mainSection(div: HTMLElement, profData: ProfData) {
  const d = document.createElement("div");
  d.classList.add("prof-card-main-info");
  d.appendChild(getOverallScoreDiv(profData.getQualityRatingString()));
  d.appendChild(getOverallEmojiDiv(profData.getQualityRatingString()));
  d.appendChild(
    Object.assign(document.createElement("div"), {
      style: "flex: 1",
      textContent: profData.ratingsCount + " review(s)",
    })
  );
  div.appendChild(d);
}

function difficultySection(div: HTMLElement, profData: ProfData) {
  const getDifficultyEmoji = (difficulty: number) =>
    difficulty >= 4.8
      ? EMOJIS.get("FORBIDDEN")
      : difficulty >= 4.0
      ? EMOJIS.get("HOT")
      : difficulty >= 2.0
      ? EMOJIS.get("OK")
      : difficulty > 0
      ? EMOJIS.get("CAKE")
      : EMOJIS.get("UNKNOWN");
  div.appendChild(
    Object.assign(document.createElement("strong"), {
      className: "prof-card-meter-title",
      textContent: `${getDifficultyEmoji(
        profData.difficultyGPA
      )} Level of Difficulty`,
    })
  );
  div.appendChild(
    createMeter(
      profData.difficultyGPA == 0 ? undefined : profData.difficultyGPA,
      "5.0",
      true
    )
  );
}

function wouldtakeagainSection(div: HTMLElement, profData: ProfData) {
  const getTakeAgainEmoji = (percent: number | undefined) =>
    percent !== undefined && percent >= 75
      ? EMOJIS.get("FIRE")
      : percent !== undefined && percent >= 33
      ? EMOJIS.get("MID")
      : percent !== undefined && percent >= 0
      ? EMOJIS.get("SKULL")
      : EMOJIS.get("UNKNOWN");
  div.appendChild(
    Object.assign(document.createElement("strong"), {
      className: "prof-card-meter-title",
      textContent: `${getTakeAgainEmoji(
        profData.wouldTakeAgainPercentage
      )} Would take again`,
    })
  );
  div.appendChild(
    createMeter(profData.wouldTakeAgainPercentage, "100", false)
  );
}

function tagsSection(div: HTMLElement, profData: ProfData) {
  const getTagsDiv = (tags: string[]) => {
    const ret = document.createElement("div");
    ret.classList.add("prof-card-tags");

    let i = 0;
    tags.some((t) => {
      i += t.length;
      if (i > 58) {
        return true;
      }
      const div = document.createElement("div");
      div.classList.add("prof-card-tag-bubble");
      div.style.backgroundColor = "rgba(128, 128, 128, 0.25)";

      const tag = document.createElement("strong");
      tag.textContent = t;
      tag.style.fontSize = "10px";

      div.appendChild(tag);
      ret.appendChild(div);
      return false;
    });

    return ret;
  };

  if (profData.topTags.length > 0) {
    div.appendChild(getTagsDiv(profData.topTags.slice(0, 3)));
  }
}

function reviewSection(div: HTMLElement, mostHelpfulReview: MostHelpfulReview) {
  const getSemesterOfReviewString = (a: string[]) => {
    const [monthStr, , year] = a;
    const month = parseInt(monthStr, 10);
    const semester =
      month >= 10 || month <= 1
        ? "Fall "
        : month >= 6 && month <= 9
        ? "Summer "
        : "Spring ";
    return semester + year;
  };
  div.appendChild(document.createElement("br"));
  div.appendChild(document.createElement("hr"));

  const container = document.createElement("div");
  container.className = "prof-card-review-header";
  const name = Object.assign(document.createElement("div"), {
    className: "prof-card-review-course",
    textContent: mostHelpfulReview.course,
  });
  const logo = Object.assign(document.createElement("div"), {
    className: "prof-card-review-date",
    textContent: getSemesterOfReviewString(
      mostHelpfulReview.date.toLocaleDateString().split("/")
    ),
  });
  container.appendChild(name);
  container.appendChild(logo);
  div.appendChild(container);

  div.appendChild(createToolTipElement(mostHelpfulReview.comments));

  div.appendChild(
    createToolTipElement(
      `👍${mostHelpfulReview.totalThumbsUp} 👎${mostHelpfulReview.totalThumbsDown}`
    )
  );
}

function notFoundSection(div: HTMLElement, name: string, logo: HTMLElement) {
  const nameContainer = document.createElement("div");
  nameContainer.className = "prof-card-name-and-logo";
  nameContainer.appendChild(
    Object.assign(document.createElement("div"), {
      className: "prof-card-rating-title",
      textContent: abbreviateName(name),
    })
  );
  nameContainer.appendChild(logo);

  const nfContainer = document.createElement("div");
  nfContainer.setAttribute("style", "margin: 130px 40px");
  nfContainer.appendChild(
    Object.assign(document.createElement("div"), {
      style: "font-size: 25px; text-align: center; font-weight: 500",
      textContent: "Not Found",
    })
  );
  nfContainer.appendChild(
    Object.assign(document.createElement("img"), {
      src: chrome.runtime.getURL("images/web-accessible/not_found.png"),
      style: "width: 300px; height: auto",
    })
  );
  nfContainer.appendChild(
    Object.assign(document.createElement("div"), {
      style: "font-size: 12px; text-align: center; font-weight: 500",
      textContent: "Click 🔎 to search",
    })
  );
  div.appendChild(nameContainer);
  div.appendChild(nfContainer);
}

export function setupRMPCard(
  element: HTMLElement,
  fullName: string,
  profData?: ProfData
): void {
  const div = document.createElement("div");

  if (profData !== undefined) {
    titleSection(div, profData);
    mainSection(div, profData);
    difficultySection(div, profData);
    wouldtakeagainSection(div, profData);
    tagsSection(div, profData);
    if (profData.mostHelpfulRating) {
      reviewSection(div, profData.mostHelpfulRating);
    }
  } else {
    notFoundSection(div, fullName, RMP_LOGO());
  }

  const tip = tippy(element.parentElement?.parentElement?.parentElement as HTMLElement, {
    trigger: "manual",
    theme: "light",
    placement: "right",
    maxWidth: 380,
    animation: "shift-away-extreme",
    delay: [150, 0],
    content: div,
  });
  element.addEventListener("mouseenter", () => tip.show());
  element.addEventListener("mouseleave", () => tip.hide());
}

function evalsMainSection(div: HTMLElement, avg: number) {
  const getGatorEvals = (rating: number) => {
    const evalsDiv = document.createElement("div");
    evalsDiv.classList.add("prof-card-evals-rating");

    let onesPlace = Math.floor(rating);
    let decimalPlace = (rating - onesPlace) * 100;

    let i: number;
    for (i = 0; i < onesPlace; i++) {
      evalsDiv.appendChild(
        Object.assign(document.createElement("img"), {
          className: "albert",
          src: chrome.runtime.getURL("images/web-accessible/albert-100.png"),
        })
      );
    }
    if (decimalPlace != 0) {
      const getPartialAlbert = (decimalPlace: number) =>
        decimalPlace >= 85
          ? "albert-90"
          : decimalPlace >= 65
          ? "albert-75"
          : decimalPlace >= 55
          ? "albert-60"
          : decimalPlace >= 45
          ? "albert-50"
          : decimalPlace >= 35
          ? "albert-40"
          : decimalPlace >= 15
          ? "albert-25"
          : "albert-10";
      evalsDiv.appendChild(
        Object.assign(document.createElement("img"), {
          className: "albert",
          src: chrome.runtime.getURL(
            "images/web-accessible/" + getPartialAlbert(decimalPlace) + ".png"
          ),
        })
      );
      i++;
    }
    while (i < 5) {
      evalsDiv.appendChild(
        Object.assign(document.createElement("img"), {
          className: "albert",
          src: chrome.runtime.getURL("images/web-accessible/albert-0.png"),
        })
      );
      i++;
    }
    return evalsDiv;
  };
  const d = document.createElement("div");
  d.classList.add("prof-card-evals-main-info");
  d.appendChild(getOverallScoreDiv(avg));
  const idcanymore = getOverallEmojiDiv(avg);
  idcanymore.style.flex = "0.4";
  d.appendChild(idcanymore);
  d.appendChild(getGatorEvals(avg));
  div.appendChild(d);
}

function evalsSubratingsSection(div: HTMLElement, data: number[]) {
  const tableData = [
    [
      { rating: data[0], description: "Enthusiastic about the Course" },
      { rating: data[1], description: "Explained Material Clearly" },
    ],
    [
      { rating: data[2], description: "Maintained Clear Standards" },
      { rating: data[3], description: "Engaging & Interactive" },
    ],
    [
      { rating: data[4], description: "Provided Prompt & Meaningful feedback" },
      { rating: data[5], description: "Instrumental to my Learning" },
    ],
  ];
  const table = document.createElement("table");
  table.classList.add("evals-rating-table");

  tableData.forEach((rowData) => {
    const row = document.createElement("tr");
    rowData.forEach((cellData) => {
      const cell = document.createElement("td");
      cell.style.width = "50%";
      const container = document.createElement("div");
      container.style.display = "flex";
      container.appendChild(getOverallScoreDiv(cellData.rating));
      container.appendChild(
        Object.assign(document.createElement("span"), {
          className: "evals-description",
          textContent: cellData.description,
        })
      );
      cell.appendChild(container);
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  div.appendChild(table);
}

export function setupEvalsCard(
  element: HTMLElement,
  name: string,
  data: Record<string, number[]>
): void {
  const div = document.createElement("div");
  if (data[name]) {
    const evalData = data[name];
    const container = document.createElement("div");
    container.className = "prof-card-name-and-logo";
    const nameDiv = Object.assign(document.createElement("div"), {
      className: "prof-card-rating-title",
      textContent: abbreviateName(name),
    });
    container.appendChild(nameDiv);
    container.appendChild(EVALS_LOGO());
    div.appendChild(container);
    div.appendChild(createToolTipElement(`Composite GatorEvals data`));

    evalsMainSection(div, evalData[6]);

    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("hr"));

    evalsSubratingsSection(div, evalData);
  } else {
    notFoundSection(div, name, EVALS_LOGO());
  }
  const tip = tippy(element.parentElement?.parentElement?.parentElement as HTMLElement, {
    trigger: "manual",
    theme: "light",
    placement: "right",
    maxWidth: 380,
    animation: "shift-away-extreme",
    delay: [150, 0],
    content: div,
  });
  element.addEventListener("mouseenter", () => tip.show());
  element.addEventListener("mouseleave", () => tip.hide());
}