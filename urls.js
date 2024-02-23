const fs = require('fs');
const axios = require('axios');
const { parse } = require('url');

async function downloadPage(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Couldn't download ${url}: ${error.message}`);
        return null;
    }
}

async function savePage(url, html) {
    const { hostname } = parse(url);
    const filename = `${hostname}.html`;

    try {
        await fs.promises.writeFile(filename, html);
        console.log(`Wrote to ${hostname}`);
    } catch (error) {
        console.error(`Error writing to ${filename}: ${error.message}`);
    }
}

async function processUrls(filename) {
    try {
        const data = await fs.promises.readFile(filename, 'utf-8');
        const urls = data.trim().split('\n');

        for (const url of urls) {
            const html = await downloadPage(url);
            if (html) {
                await savePage(url, html);
            }
        }
    } catch (error) {
        console.error(`Error reading file ${filename}: ${error.message}`);
        process.exit(1);
    }
}

if (process.argv.length !== 3) {
    console.error('Usage: node urls.js FILENAME');
    process.exit(1);
}

const filename = process.argv[2];
processUrls(filename);
