const QueueBuilder = require('./src/queueBuilder');
const Gateway = require('./src/gateway');
const vectorize = require('./src/vectorize');

const normilizeIds = (graph) => {
    let minId = Number.MAX_VALUE;
    graph.nodes.forEach((node) => {
        minId = Math.min(+node.id, minId);
    });
    graph.nodes = graph.nodes.map((node) => {
        node.id -= minId - 1;
        node.id += "";
        return node;
    });
    return graph;
}

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
    interval: 512
});
