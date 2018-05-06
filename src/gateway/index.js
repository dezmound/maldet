const rp = require('request-promise-native');

const gdbUrl = (pid, bytes = 20) => `http://localhost:3000/process/${pid}/runtime-info?bytes=${bytes}`;
const cfgUrl = () => `http://localhost:3027/cfg`;

const requestBaseOptions = {
    method: 'PUT'
};

class Gateway {
    static getProcessDump(pid, bytes) {
        const requestOptions = Object.assign(requestBaseOptions, {
            url: gdbUrl(pid, bytes)
        });
        return rp(requestOptions).then((body) => {
            return body;
        }).catch((err) => {
            console.error(err);
        });
    }
    static getProcessCFG(gdbOutput) {
        const requestOptions = Object.assign(requestBaseOptions, {
            url: cfgUrl(),
            body: {
                path: gdbOutput,
                formatter: 'gdb'
            },
            json: true
        });
        return rp(requestOptions).then((body) => {
            return body;
        }).catch((err) => {
            console.error(err);
        });
    }
}

module.exports = Gateway;