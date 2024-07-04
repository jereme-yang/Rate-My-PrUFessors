import {filterNonProfessors, createProfessorSearchStrings} from '../../src/content/utils.mjs';
import "jest";

describe("filterNonProfessors", () => {
	test("- doesnt change empty string", () => {
		expect(filterNonProfessors("")).toBe("");
	})

	test("- does filter known string ", () => {
		expect(filterNonProfessors("STAFF")).toBe("");
	})

	test("- doesnt filter name", () => {
		expect(filterNonProfessors("Bob Dylan")).toBe("Bob Dylan");
	})
})

test("createProfessorSearchStrings - produces one string for a simple first name and last name input", () => {
	expect(createProfessorSearchStrings(["bob", "smith"])).toEqual(["bob smith"]);
})