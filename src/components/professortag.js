import { getOverallScoreDiv } from "../utils/componentutils.js";

export function setupProfTag(element, profData, lastName, schoolId, isFound = true) {
	return new Promise(function(resolve, reject) {
		isFound ? element.setAttribute('href', profData.getURL()) : element.setAttribute('href', `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${schoolId}`);
		element.setAttribute('style', 'display: flex;');
		
		const linkName = document.createElement('div');
		linkName.classList.add('link-name');
		linkName.textContent = element.textContent;
		element.textContent = '';
		
		const RMPTag = document.createElement('a');
		RMPTag.setAttribute('target', '_blank');
		RMPTag.classList.add('link-balance-rmp');
		RMPTag.href = isFound ? profData.getURL() : `https://www.ratemyprofessors.com/search/professors?q=${lastName}&sid=${schoolId}`;
		RMPTag.textContent = '🔎 RMP';

		const EVALSTag = document.createElement('a');
		EVALSTag.setAttribute('target', '_blank');
		EVALSTag.classList.add('link-balance-rmp');
		EVALSTag.href = 'https://gatorevals.aa.ufl.edu/public-results/';
		EVALSTag.textContent = '🔎 EVALS';
		
		const container = document.createElement('div');
		container.style = "position: relative;";

		const balance = Object.assign(
			document.createElement('div'), {
			className: 'link-balance'
			});
			
		balance.appendChild(RMPTag);
		balance.appendChild(EVALSTag);

		container.appendChild(linkName);
		container.appendChild(balance);
		
		const rating = isFound ? getOverallScoreDiv(profData.getQualityRatingString()) : getOverallScoreDiv("", false);
		
		element.appendChild(rating);
		element.appendChild(container);
		resolve();
	})
	
}