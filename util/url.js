export async function getCurrentUrl() {
    return await browser.tabs.query({currentWindow: true, active: true});
}