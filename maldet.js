const QueueBuilder = require('./src/queueBuilder');
const Gateway = require('./src/gateway');
const vectorize = require('./src/vectorize');
const {makeDecision} = require('./src/controlCenter')();
let timer = null;

QueueBuilder.addHandler(async () => {
    const {queue} = QueueBuilder;
    try {
        const {pid, name} = queue.pop();
        console.error(pid, name);
        const gdbOutput = await Gateway.getProcessDump(pid, 1024);
        const cfg = await Gateway.getProcessCFG(gdbOutput);
        if (cfg) {
            const vector = vectorize(cfg.nodes);
            console.log('Vector: ', vector);
            makeDecision(name, vector).then(() => {
                console.log('Is learned now');
            });
            timer || setTimeout(() => {
                makeDecision('blabla', vector).then(() => {
                    console.log('Is learned now');
                });
                timer = true;
            })
        }
    } catch(e) {
        console.error(e);
    }
});

QueueBuilder.start({
    interval: 2048,
    whitelist: ['a.out']
});
