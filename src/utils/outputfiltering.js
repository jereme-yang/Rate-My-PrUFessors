import RMPProfessorData from "../data_objects/rmpprofessordata.js"

/**
 * Helper function for getProfessorRating
 * reformats information from query
 * @param  data from gql query
 * @returns {RMPProfessorData} 
*/
export function normalizeGraphQLData(data) {
	//remove useless layers
	data = data.data.newSearch.teachers;
	data = data.edges;
	
	data = data.map((value) => RMPProfessorData.fromGraphQL(value.node));
	return data;

}


/**
 * Helper function for linkProfessor
 * Checks if the queried professor matches the search item by a set threshold.
 * @param {*} a returned professor name from query
 * @param {*} b expected professor name from UF course selection page
 * @returns 
 */
export function isCloseEnough(a, b) {
	const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }

    let distance = matrix[a.length][b.length]
	let threshold = 3

	return distance <= threshold
}