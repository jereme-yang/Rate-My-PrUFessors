export function getOverallScoreDiv(score, isFound = true) {
	const rating = document.createElement('div');
	rating.classList.add('rating-number');

	if (!isFound) {
		rating.style.backgroundColor =  'rgba(128, 128, 128, 0.25)';
    	rating.textContent = "?";
		return rating
	}

	const strong = document.createElement('strong');
	strong.textContent = isNaN(score) ? "NA" : Number(score).toFixed(1);
	rating.appendChild(strong);

	if (score >= 4) {
		rating.style.backgroundColor =  'rgba(0, 128, 0, 0.25)';
	} else if (score >= 2) {
		rating.style.backgroundColor =  'rgba(255, 255, 0, 0.25)';
	} else if (score >= 0) {
		rating.style.backgroundColor =  'rgba(128, 0, 0, 0.25)';
	} else {
		rating.style.backgroundColor =  'rgba(128, 128, 128, 0.25)';
	}

	return rating
}


export function createMeter(value, max, inverse) {
	// Create the container element
	const container = document.createElement("span");
	container.classList.add("prof-card-meter-section");
  
	// Create the meter element
	const meter = document.createElement("meter");
	meter.setAttribute("min", "0");
	meter.setAttribute("max", max);
	meter.setAttribute("value", value);
	meter.setAttribute("low", max * 0.33);
	meter.setAttribute("high", max * 0.75);
	meter.setAttribute("optimum", max);
	meter.style.flex = "1";
  
	// Apply inverse or normal meter style
	inverse ? container.classList.add("inverse-meter") : container.classList.add("normal-meter");
  
	// Append meter to container
	container.appendChild(meter);
  
	// Create text element
	const text = Object.assign(
		document.createElement('p'), {
		style: 'paddingLeft: 8px',
		textContent: (typeof value === "undefined") ? "N/A" : `${value}/${max}`
	});
  
	// Append text to container
	container.appendChild(text);
  
	return container;
}


export function createToolTipElement(textContent) {
	const tooltipElement =  document.createElement('div');
	tooltipElement.classList.add('prof-card-rating-text');
	tooltipElement.textContent = textContent;
	return tooltipElement
}