import browser from "webextension-polyfill";

import { AUTHORIZATION_TOKEN} from "../constants/auth.js";
import { API_URL } from "../constants/api.js";

function handleMessage (data, sender, sendResponse) {
	if (data.type === "graphql") {
		return fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: AUTHORIZATION_TOKEN,
			},
			body: data.content
		}).then((res) => res.json());
	}
}
browser.runtime.onMessage.addListener(handleMessage);
