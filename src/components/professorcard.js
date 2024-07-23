import { createToolTipElement, getOverallScoreDiv, getOverallEmojiDiv, createMeter } from "../utils/componentutils.js";
import { EMOJIS } from "../constants/emoji.js";
import tippy from "tippy.js"


function titleSection(div, profData) {
	const container = document.createElement("div");
	container.className = "prof-card-name-and-logo";
	const name = Object.assign(
		document.createElement('div'),{ 
		className: 'prof-card-rating-title', 
		textContent: profData.getDisplayName()
	  });
	const logo = Object.assign(
		document.createElement('img'), {
		  src: chrome.runtime.getURL('images/web-accessible/rmp.svg'),
		  style: 'padding-top: 5px; height: 25px; width: auto;'
		});
	container.appendChild(name);
	container.appendChild(logo);
	div.appendChild(container);
	div.appendChild(
		createToolTipElement(`Professor in ${profData.department} ${EMOJIS.get(profData.department.toLowerCase())}`)
	);
}
function mainSection(div, profData) {
	const d = document.createElement("div");
	d.classList.add("prof-card-main-info");
	// https://stackoverflow.com/questions/313893/how-to-measure-time-taken-by-a-function-to-execute
	d.appendChild(getOverallScoreDiv(profData.getQualityRatingString()));
	d.appendChild(getOverallEmojiDiv(profData.getQualityRatingString()));
	d.appendChild(Object.assign(
		document.createElement('div'),{ 
		style: 'flex: 1', 
		textContent: profData.ratingsCount + ' review(s)'
		})
	);
	div.appendChild(d);
}
function difficultySection(div, profData) {
	const getDifficultyEmoji = difficulty => (
		difficulty >= 4.8 ? EMOJIS.get("FORBIDDEN") :
		difficulty >= 4.0 ?  EMOJIS.get("HOT") :
		difficulty >= 2.0 ? EMOJIS.get("OK") :
		difficulty > 0 ? EMOJIS.get("CAKE") :
		EMOJIS.get("UNKNOWN")
	  );
	div.appendChild(Object.assign(
		document.createElement('strong'), {
		className: 'prof-card-meter-title',
		textContent: `${getDifficultyEmoji(profData.difficultyGPA)} Level of Difficulty`
	  })
	);
	div.appendChild(
		createMeter(profData.difficultyGPA == "0" ? undefined : profData.difficultyGPA, "5.0", true)
	);
}
function wouldtakeagainSection(div, profData) {
	const getTakeAgainEmoji = percent => (
		percent >= 75 ? EMOJIS.get("FIRE") :
		percent >= 33 ? EMOJIS.get("MID") :
		percent >= 0 ? EMOJIS.get("SKULL") :
		EMOJIS.get("UNKNOWN")
	  );
	div.appendChild(Object.assign(
		document.createElement('strong'), {
		className: 'prof-card-meter-title',
		textContent: `${getTakeAgainEmoji(profData.wouldTakeAgainPercentage ?? "N/A")} Would take again`
	  })
	);
	div.appendChild(
		createMeter(profData.wouldTakeAgainPercentage, "100", false)
	)
}
function tagsSection(div, profData) {
	const getTagsDiv = tags => {
		const ret = document.createElement('div');
		ret.classList.add('prof-card-tags');
		
		let i = 0;
		tags.some(t => {
		  i += t.length;
		  if (i > 58) {
			return true;
		  }
		  const div = document.createElement('div');
		  div.classList.add('prof-card-tag-bubble');
		  div.style.backgroundColor =  'rgba(128, 128, 128, 0.25)'
	  
		  const tag = document.createElement('strong');
		  tag.textContent = t;
		  tag.style.fontSize = '10px';
	  
		  div.appendChild(tag);
		  ret.appendChild(div);
		  return false;
		});
	  
		return ret;
	  };

	if (profData.topTags.length > 0) {
		div.appendChild(
			getTagsDiv(profData.topTags.slice(0,3))
		);
	}
}
function reviewSection(div, mostHelpfulReview) {
	const getSemesterOfReviewString = a => {
		const [month, , year] = a;
		const semester = (month >= 10 || month <= 1) ? "Fall " :
						 (month >= 6 && month <= 9) ? "Summer " :
						 "Spring ";
		return semester + year;
	  };
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement("hr"));
	
	const container = document.createElement("div");
	container.className = "prof-card-review-header";
	const name = Object.assign(
		document.createElement('div'),{ 
		className: 'prof-card-review-course', 
		textContent: mostHelpfulReview.course
	  });
	const logo = Object.assign(
		document.createElement('div'), {
		  className: 'prof-card-review-date',
		  textContent: getSemesterOfReviewString(mostHelpfulReview.date.toLocaleDateString().split('/'))
		});
	container.appendChild(name);
	container.appendChild(logo);
	div.appendChild(container);
	
	div.appendChild(
		createToolTipElement(mostHelpfulReview.comments)
	);

	div.appendChild(
		createToolTipElement(`👍${mostHelpfulReview.totalThumbsUp} 👎${mostHelpfulReview.totalThumbsDown}`)
	);
}
export function setupRMPCard(element, profData) {
	const div = document.createElement('div');

	titleSection(div, profData)

	mainSection(div, profData);
	
	difficultySection(div, profData);
	
	wouldtakeagainSection(div, profData);
	
	tagsSection(div, profData);

	if (profData.mostHelpfulRating) { reviewSection(div, profData.mostHelpfulRating); }

	// create popup attached to element with div as contents
	const tip = tippy(element.parentElement.parentElement.parentElement, {
		trigger: 'manual',
		theme: 'light',
		placement: 'right',
		maxWidth: 380,
		animation: 'shift-away-extreme',
		delay: [150, 0],
		content: div
	});
	element.addEventListener('mouseenter', () => tip.show())
	element.addEventListener('mouseleave', () => tip.hide())
}
function evalsMainSection(div, avg) {
	const getGatorEvals = rating => {
		const evalsDiv = document.createElement('div');
		evalsDiv.classList.add('prof-card-evals-rating');
	
		// Get the number in the 1s place
		let onesPlace = Math.floor(rating);
	
		// Get the number in the decimal place
		let decimalPlace = (rating - onesPlace) * 100;
	
		let i;
		for (i = 0; i < onesPlace; i++) {
			evalsDiv.appendChild(Object.assign(
				document.createElement('img'), {
				className: "albert",
				src: chrome.runtime.getURL("images/web-accessible/albert-100.png")
			}))
		}
		if (decimalPlace != 0) {
			const getPartialAlbert = decimalPlace => (
				decimalPlace >= 85 ? "albert-90" :
				decimalPlace >= 65 ? "albert-75" :
				decimalPlace >= 55 ? "albert-60" :
				decimalPlace >= 45 ? "albert-50" :
				decimalPlace >= 35 ? "albert-40" :
				decimalPlace >= 15 ? "albert-25" :
				"albert-10"
			);
			evalsDiv.appendChild(Object.assign(
				document.createElement('img'), {
				className: "albert",
				src: chrome.runtime.getURL("images/web-accessible/"+getPartialAlbert(decimalPlace)+".png")
			}))
			i++;
		}
		while (i < 5) {
			evalsDiv.appendChild(Object.assign(
				document.createElement('img'), {
				className: "albert",
				src: chrome.runtime.getURL("images/web-accessible/albert-0.png")
			}))
			i++;
		}
		return evalsDiv;
	}
	const d = document.createElement("div");
	d.classList.add("prof-card-evals-main-info");
	d.appendChild(getOverallScoreDiv(avg));
	const idcanymore = getOverallEmojiDiv(avg);
	idcanymore.style.flex = "0.4";
	d.appendChild(idcanymore);
	d.appendChild(getGatorEvals(avg));
	div.appendChild(d);
}
function evalsSubratingsSection(div, data) {
	const tableData = [
		[
			{ rating: data[0], description: "Enthusiastic about the Course" },
			{ rating: data[1], description: "Explained Material Clearly" }
		],
		[
			{ rating: data[2], description: "Maintained Clear Standards" },
			{ rating: data[3], description: "Engaging & Interactive" }
		],
		[
			{ rating: data[4], description: "Provided Prompt & Meaningful feedback" },
			{ rating: data[5], description: "Instrumental to my Learning" }
		]
	];
	const table = document.createElement('table');
	table.classList.add('evals-rating-table');

	tableData.forEach(rowData => {
		const row = document.createElement('tr');
		rowData.forEach(cellData => {
			const cell = document.createElement('td');
			cell.style.width = '50%';
			const container = document.createElement('div');
			container.style.display = 'flex';
			container.appendChild(getOverallScoreDiv(cellData.rating));
			container.appendChild(Object.assign(
				document.createElement('span'),{
				className: 'evals-description',
				textContent: cellData.description
			  })
			);
			cell.appendChild(container);
			row.appendChild(cell);
		});
		table.appendChild(row);
	});

	div.appendChild(table);
}
export function setupEvalsCard(element, name, data) {
	if (data[name]) {
		data = data[name];
		const div = document.createElement('div');

		const container = document.createElement("div");
		container.className = "prof-card-name-and-logo";
		const nameDiv = Object.assign(
			document.createElement('div'),{ 
			className: 'prof-card-rating-title', 
			textContent: name
		});
		const logo = Object.assign(
			document.createElement('img'), {
			src: chrome.runtime.getURL('images/web-accessible/evals.svg'),
			style: 'padding-top: 5px; height: 25px; width: auto;'
			});
		container.appendChild(nameDiv);
		container.appendChild(logo);
		div.appendChild(container);
		div.appendChild(
			createToolTipElement(`Composite GatorEvals data until Spring 2024`)
		);

		evalsMainSection(div, data[6]);

		div.appendChild(document.createElement('br'));
		div.appendChild(document.createElement("hr"));

		evalsSubratingsSection(div, data);

		// create popup attached to element with div as contents
		const tip = tippy(element.parentElement.parentElement.parentElement, {
			trigger: 'manual',
			theme: 'light',
			placement: 'right',
			maxWidth: 380,
			animation: 'shift-away-extreme',
			delay: [150, 0],
			content: div
		});

		element.addEventListener('mouseenter', () => tip.show())
		element.addEventListener('mouseleave', () => tip.hide())
	}
	
}
