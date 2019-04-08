module.exports = ({system, server}) => {

    server.addQuery('/resources', () =>
        system.execute('df -h /')
            .then(parseSpace)
            .then(disk => Promise.resolve(({
                date: new Date().toISOString(),
                memory: memory(system.totalmem() - system.freemem(), system.totalmem()),
                disk
            }))));


    system.setInterval(() => server.emitUpdate('/resources'), 5000)
}

const parseSpace = space => {
    const parts = space.split('\n')[1].replace(/\s+/g, ' ').split(' ');
    return {
        used: parts[2],
        total: parts[1],
        percentage: parts[4]
    }
}

const memory = (used, total) => ({
    used: GB(used),
    total: GB(total),
    percentage: Math.round(used / total * 100) + '%'
})
const GB = n => Math.round((n / (1024 * 1024 * 1024)) * 100) / 100 + 'GB';