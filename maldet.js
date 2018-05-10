const QueueBuilder = require('./src/queueBuilder');
const Gateway = require('./src/gateway');
const vectorize = require('./src/vectorize');

QueueBuilder.addHandler(async () => {
    const {queue} = QueueBuilder;
    try {
        const {pid, name} = queue.pop();
        console.error(pid, name);
        const gdbOutput = await Gateway.getProcessDump(pid, 1024);
        const cfg = await Gateway.getProcessCFG(gdbOutput);
        if (cfg) {
            console.log(vectorize(cfg.nodes));
        }
    } catch(e) {
        console.error(e);
    }
});

QueueBuilder.start({
    interval: 512,
    whitelist: ['a.out']
});
