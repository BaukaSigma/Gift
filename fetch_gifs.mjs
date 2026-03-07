import https from 'https';

const urls = [
    "https://tenor.com/view/mochi-mochi-hello-white-mochi-mochi-mochi-mochi-hello-hello-wave-gif-15143463",
    "https://tenor.com/view/peach-cat-clever-cute-adorable-gif-16367837",
    "https://tenor.com/view/peach-and-goma-gif-3360365036046576665",
    "https://tenor.com/view/hug-day-gif-22501944",
    "https://tenor.com/view/mochi-mochi-peach-cat-gif-hug-gif-26958685"
];

const fetchUrl = (url) => new Promise((resolve) => {
    https.get(url, (res) => {
        // handle redirect if needed
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get("https://tenor.com" + res.headers.location, (res2) => {
                let data = '';
                res2.on('data', chunk => data += chunk);
                res2.on('end', () => {
                    const match = data.match(/<meta content="(https:\/\/media\.tenor\.com\/[^"]+\.gif)" property="og:image"/);
                    resolve(match ? match[1] : `Redirected but no match: ${url}`);
                });
            });
            return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const match = data.match(/<meta content="(https:\/\/media\.tenor\.com\/[^"]+\.gif)" property="og:image"/);
            resolve(match ? match[1] : `No match for: ${url}`);
        });
    }).on('error', (e) => resolve(`Error: ${e.message}`));
});

Promise.all(urls.map(fetchUrl)).then(results => {
    console.log(JSON.stringify(results, null, 2));
});
