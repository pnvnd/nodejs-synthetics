let $secure = process.env; // comment out when testing in New Relic

const got = require('got');

const username = 'pnvnd'
const repository = 'nodejs-synthetics'

// Function to recursively flatten nested objects
function flattenObject(obj, prefix = '') {
    const flattened = {};

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively flatten nested objects
            const nested = flattenObject(obj[key], `${prefix}${key}_`);
            Object.assign(flattened, nested);
        } else {
            // Add non-object properties to the flattened object with prefix
            flattened[`${prefix}${key}`] = obj[key];
        }
    }

    return flattened;
}

async function getGithubRepo() {
    const url = `https://api.github.com/repos/${username}/${repository}`;
    let resp = await got(url);

    if (resp.statusCode == 200) {
        let data = JSON.parse(resp.body);

        // Flatten the data object
        const flattenedData = flattenObject(data);

        // Remove fields ending with "_url"
        for (const key in flattenedData) {
            if (key.endsWith('_url')) {
                delete flattenedData[key];
            }
            // Set each field and value using $util.insights.set()
            $util.insights.set(key, flattenedData[key]);
        }

        console.log(flattenedData);


    } else {
        console.log(resp.body);
    }
}

getGithubRepo();