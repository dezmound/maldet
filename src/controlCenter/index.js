const rp = require('request-promise-native');
let moduleConfig = {
    knownMalwareList: [
        'a.out'
    ],
    analyserUrl: 'http://localhost:3008'
};

const makeDecision = (name, vector) => {
    const {knownMalwareList, analyserUrl} = moduleConfig;
    vector = JSON.stringify(vector.concat((new Array(100 - vector.length)).fill(0)));
    if (knownMalwareList.includes(name)) {
        return rp(`${analyserUrl}/train?vector=${vector}&isMalware=1`)
        .then(() => true);
    } else {
        return rp(`${analyserUrl}/test?vector=${vector}`)
        .then(JSON.parse)
        .then((matches) => {
            if (matches[0] > matches[1]) {
                console.warn(`Suspicious process: ${name}`);
            }
        });
    }
}

const controlCenter = (config) => {
    moduleConfig = Object.assign(moduleConfig, config);
    return {
        makeDecision
    }
}

module.exports = controlCenter;