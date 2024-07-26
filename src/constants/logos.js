export function RMP_LOGO() {
    return Object.assign(
        document.createElement('img'), {
        src: chrome.runtime.getURL('images/web-accessible/rmp.svg'),
        style: 'padding-top: 5px; height: 25px; width: auto;'
        });
}
export function EVALS_LOGO(){
    return Object.assign(
        document.createElement('img'), {
        src: chrome.runtime.getURL('images/web-accessible/evals.svg'),
        style: 'padding-top: 5px; height: 25px; width: auto;'
        });
} 