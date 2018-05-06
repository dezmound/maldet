const dictionary = require('./dictionary');

function arrayIndexOfArray (superset, subset) {
    return superset.findIndex((array) => {
        return !subset.some((e, i) => array[i] !== e);
    });
}

const vectorize = (nodes) => {
    let vertexDictionary = [];
    let vector = [];
    nodes.forEach((node) => {
        let nodeVector = new Array(dictionary.length).fill(0);
        let nodeIndex = null;
        dictionary.forEach((word, index) => {
            if (node.label.indexOf(word) >= 0) {
                nodeVector[index]++;
            }
        });
        if ((nodeIndex = arrayIndexOfArray(vertexDictionary, nodeVector)) >= 0) {
            vector[nodeIndex]++;
        } else {
            vertexDictionary.push(nodeVector);
            vector.push(1);
        }
    });
    return vector;
}

module.exports = vectorize;
