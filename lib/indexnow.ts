

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '24BF8B1A-BB47-4E3F-8E2A-B5EC3940A84C';

export async function submitToIndexNow(urls: string[]) {
    // If we're not in production, don't actually submit, just log it.
    if (process.env.NODE_ENV !== 'production') {
        console.log('IndexNow submission skipped in non-production environment:', urls);
        return { success: true, skipped: true };
    }

    // We need the host to construct the key location if not provided in config
    // But strictly speaking, the protocol just needs the host domain in the body
    // We'll assume the first URL's hostname is the host
    if (urls.length === 0) return { success: false, error: 'No URLs provided' };

    try {
        const urlObj = new URL(urls[0]);
        const host = urlObj.hostname;

        const body = {
            host: host,
            key: INDEXNOW_KEY,
            keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
            urlList: urls,
        };

        const response = await fetch(INDEXNOW_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            console.log('Successfully submitted URLs to IndexNow:', urls);
            return { success: true };
        } else {
            const errorText = await response.text();
            console.error('Failed to submit to IndexNow:', response.status, errorText);
            return { success: false, error: errorText, status: response.status };
        }
    } catch (error) {
        console.error('Error submitting to IndexNow:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
