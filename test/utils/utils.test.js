import { filterNonProfessors, createProfessorSearchStrings} from '../../src/utils/inputfiltering.js';
import LRUCache from '../../src/utils/lrucache.js';
import { performance } from 'perf_hooks';

describe("filterNonProfessors", () => {
  test("- doesnt change empty string", () => {
    expect(filterNonProfessors("")).toBe("");
  });

  test("- does filter known string ", () => {
    expect(filterNonProfessors("STAFF")).toBe("");
  });

  test("- doesnt filter name", () => {
    expect(filterNonProfessors("Bob Dylan")).toBe("Bob Dylan");
  });
});

test("createProfessorSearchStrings - produces one string for a simple first name and last name input", () => {
  expect(createProfessorSearchStrings(["bob", "smith"])).toEqual(["smith bob", "bob smith"]);
});

describe('LRUCache lookup speed', () => {
  it('should perform a fast lookup', () => {
    const cache = new LRUCache(10000); // 10,000 entries
    for (let i = 0; i < 10000; i++) {
      cache.set(`key${i}`, i);
    }

    const start = performance.now();
    cache.get('key5000');
    const end = performance.now();

    const lookupTimeMs = end - start;
    console.log(`LRUCache lookup time: ${lookupTimeMs} ms`);

    // Assert that lookup is under 1ms (adjust threshold as needed)
    expect(lookupTimeMs).toBeLessThan(1);
  });
});