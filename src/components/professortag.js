import { getOverallScoreDiv } from "../utils/componentutils.js";
import { UF_SCHOOL_ID } from "../constants/school.js";

export function setupProfTag(element, profData, lastName) {
	return new Promise(function(resolve, reject) {
		profData !== undefined ? element.setAttribute('href', profData.getURL()) : element.setAttribute('href', `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${UF_SCHOOL_ID}`);
		element.setAttribute('style', 'display: flex;');
		
		const linkName = document.createElement('div');
		linkName.classList.add('link-name');
		linkName.textContent = element.textContent;
		element.textContent = '';
		
		const RMPTag = document.createElement('a');
		RMPTag.setAttribute('target', '_blank');
		RMPTag.classList.add('link-balance-rmp');
		RMPTag.href = profData !== undefined ? profData.getURL() : `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${UF_SCHOOL_ID}`;
		RMPTag.textContent = '🔎 RMP';

		const EVALSTag = document.createElement('a');
		EVALSTag.setAttribute('target', '_blank');
		EVALSTag.classList.add('link-balance-rmp');
		EVALSTag.href = 'https://gatorevals.aa.ufl.edu/public-results/';
		EVALSTag.textContent = '🔎 EVALS';
		
		const container = document.createElement('div');
		container.setAttribute('style', 'margin-left: auto;');

		const balance = Object.assign(
			document.createElement('div'), {
			className: 'link-balance'
			});
			
		balance.appendChild(RMPTag);
		balance.appendChild(EVALSTag);

		container.appendChild(linkName);
		container.appendChild(balance);
		
		const rating = profData !== undefined ? getOverallScoreDiv(profData.getQualityRatingString()) : getOverallScoreDiv("", false);
		
		element.appendChild(rating);
		element.appendChild(container);
		resolve();
	})
	
}