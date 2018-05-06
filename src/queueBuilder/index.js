const {snapshot} = require('process-list');
const defaultOptions = {
    interval: 100,
    fields: [
        'pid',
        'name',
        'threads',
        'pmem',
        'vmem',
        'cpu',
        'stime'
    ],
    whitelist: [
        'a.out'
    ]
};

let queue = [];
let timer = null;
let userHanders = [];
let moduleOptions = null;

class QueueBuilder {
    static start(options) {
        moduleOptions = Object.assign(defaultOptions, options);
        const {interval, fields} = defaultOptions;
        const _processWorker = () => {
            timer = setTimeout(_processWorker, interval);
            snapshot(...fields)
            .then(this.onGetProcessInfo.bind(this))
            .catch((error) => {
                console.error(error);
            })
        };
        timer = setTimeout(_processWorker, interval);
    }
    static stop() {
        clearTimeout(timer);
    }
    static rebuildQuery(tasks) {
        const {whitelist} = moduleOptions;
        this.queue = tasks.filter(
            (task) => whitelist.includes(task.name)
        ).sort((taskA, taskB) => {
            return taskA.cpu - taskB.cpu;
        });
    }
    static onGetProcessInfo(tasks) {
        this.rebuildQuery(tasks);
        userHanders.forEach((handler) => {
            handler();
        });
    }
    static addHandler(handler) {
        userHanders.push(handler);
    }
}

module.exports = QueueBuilder
