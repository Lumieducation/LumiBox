module.exports = ({ system }) => {

    const installOn = server => {
        server.addQuery('/resources', query);
        system.setInterval(() => server.emitUpdate('/resources'), 5000)
    }

    const query = () => Promise.all([readMemory(), readDisk()])
        .then(([memory, disk]) => ({
            date: new Date().toISOString(),
            disk,
            memory
        }))

    const readMemory = () =>
        Promise.resolve(memory(system.totalmem() - system.freemem(), system.totalmem()))

    const readDisk = () =>
        system.execute('df -h /')
            .then(parseSpace)

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

    return {
        installOn
    }
}