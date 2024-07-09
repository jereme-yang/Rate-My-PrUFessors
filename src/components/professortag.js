import { getOverallScoreDiv } from "../utils/componentutils.js";

export function setupProfTag(element, profData, lastName, schoolId, isFound = true) {
	isFound ? element.setAttribute('href', profData.getURL()) : element.setAttribute('href', `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${schoolId}`);
	element.setAttribute('style', 'display: flex;');
	
	const aTag = document.createElement('a');
	aTag.setAttribute('target', '_blank');
	aTag.classList.add('link-name');
	aTag.href = isFound ? profData.getURL() : `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${schoolId}`;
	aTag.textContent = element.textContent;
	
	element.textContent = '';
	
    const balance = Object.assign(
        document.createElement('div'), {
          className: 'link-balance', 
          textContent: '🔎 RMP'
        });
	
	const rating = isFound ? getOverallScoreDiv(profData.getQualityRatingString()) : getOverallScoreDiv("", false);
	
	element.appendChild(rating);
	aTag.appendChild(balance);
	element.appendChild(aTag);
}