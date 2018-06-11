const rp = require('request-promise-native');
let moduleConfig = {
    knownMalwareList: [
        'a.out'
    ],
    analyserUrl: 'http://localhost:3008'
};
let classes = {};

const testProcess = (name, vector, analyserUrl) => {
    return rp(`${analyserUrl}/test?vector=${vector}`)
        .then(JSON.parse)
        .then((matches) => {
            if (Object.values(classes).includes(matches[0])) {
                console.warn(`Suspicious process: ${name}`);
            }
        });
};

const makeDecision = (name, vector) => {
    const {knownMalwareList, analyserUrl} = moduleConfig;
    vector = JSON.stringify(vector.concat((new Array(100 - vector.length)).fill(0)));
    if (knownMalwareList.includes(name)) {
        if (!classes[name] && Object.keys(classes).length) {
            classes[name] = Math.max(...Object.values(classes)) + 1;
        } else if (!Object.keys(classes).length) {
            classes[name] = 1;
        }
        return rp(`${analyserUrl}/train?vector=${vector}&malwareClass=${classes[name]}`)
        .then(() => testProcess(name, vector, analyserUrl))
        .catch(console.error);
    } else {
        return testProcess(name, vector);
    }
}

const controlCenter = (config) => {
    moduleConfig = Object.assign(moduleConfig, config);
    return {
        makeDecision
    }
}

module.exports = controlCenter;