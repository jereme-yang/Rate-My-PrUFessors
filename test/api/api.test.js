import { API_URL } from "../../build/constants/api.js";
import { AUTHORIZATION_TOKEN } from "../../build/constants/auth.js";
import fetch from "node-fetch";


describe('API speed test for "Hubert Wagner"', () => {
  it('should return results quickly for "Hubert Wagner"', async () => {
    const query = `
      query {
        searchProfessors(name: "Hubert Wagner") {
          name
          department
        }
      }
    `;

    const start = Date.now();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTHORIZATION_TOKEN,
      },
      body: JSON.stringify({ query }),
    });
    const end = Date.now();

    const durationMs = end - start;
    const data = await response.json();

    console.log(`API response time: ${durationMs} ms`);
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("data");
    expect(durationMs).toBeLessThan(1000); // adjust threshold as needed
  });
});
