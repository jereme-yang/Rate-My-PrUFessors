import { createToolTipElement, getOverallScoreDiv, createMeter } from "../utils/componentutils.js";
import { EMOJIS } from "../constants/emoji.js";
import tippy from "tippy.js"


function titleSection(div, profData) {
	div.appendChild(Object.assign(
		document.createElement('div'),{ 
		className: 'prof-card-rating-title', 
		textContent: profData.getFullName(true)
	  })
	);
	div.appendChild(
		createToolTipElement(`Professor in ${profData.department} ${EMOJIS.get(profData.department.toLowerCase())}`)
	);
}
function mainSection(div, profData) {
	const getOverallEmojiDiv = score => {
		const emoji = document.createElement("div");
	  
		if (score >= 4.0) {
		  emoji.textContent = EMOJIS.get("GOOD") + " Excellent";
		} else if (score >= 2.0) {
		  emoji.textContent = EMOJIS.get("FINE") + " Fine";
		} else if (score > 0) {
		  emoji.textContent = EMOJIS.get("LUCK") + " Good Luck";
		} else {
		  emoji.textContent = EMOJIS.get("UNKNOWN") + " Unknown";
		}
	  
		emoji.style.flex = "1";
	  
		return emoji;
	};

	const d = document.createElement("div");
	d.classList.add("prof-card-main-info");

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
	  
		tags.forEach(t => {
		  const div = document.createElement('div');
		  div.classList.add('prof-card-tag-bubble');
		  div.style.backgroundColor =  'rgba(128, 128, 128, 0.25)'
	  
		  const tag = document.createElement('strong');
		  tag.textContent = t;
		  tag.style.fontSize = '10px';
	  
		  div.appendChild(tag);
		  ret.appendChild(div);
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
	div.appendChild(document.createElement('br'));
	div.appendChild(document.createElement("hr"));
	// Mark if class was online
	div.appendChild(
		createToolTipElement(`Most Helpful Rating: ${mostHelpfulReview.course
			}${mostHelpfulReview.isOnlineClass ? ' (Online)' : ''}`)
	);
	
	div.appendChild(
		createToolTipElement(mostHelpfulReview.date.toLocaleDateString())
	);

	if (mostHelpfulReview.iWouldTakeAgain) {
		div.appendChild(
			createToolTipElement(`Would take again: ${mostHelpfulReview.iWouldTakeAgain ? "Yes" : "No"}`)
		);
	}

	div.appendChild(
		createToolTipElement(mostHelpfulReview.comments)
	);

	div.appendChild(
		createToolTipElement(`👍${mostHelpfulReview.totalThumbsUp} 👎${mostHelpfulReview.totalThumbsDown}`)
	);
}
export function setupProfCard(element, profData) {
	const div = document.createElement('div');

	titleSection(div, profData)
	
	mainSection(div, profData);
	
	difficultySection(div, profData);
	
	wouldtakeagainSection(div, profData);
	
	tagsSection(div, profData);

	if (profData.mostHelpfulRating) { reviewSection(div, profData.mostHelpfulRating); }

	// create popup attached to element with div as contents
	tippy(element, {
		theme: 'light',
		placement: 'right',
		// show delay is 250ms, hide delay is 0 ms
		delay: [250, 0],
		content: div
	});
}
