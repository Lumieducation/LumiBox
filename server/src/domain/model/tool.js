module.exports = ({ system }) => {
    class Tool {
        construct(key, name, iconFile) {
            this.key = key;
            this.name = name;

            this._iconFile = iconFile;
        }

        status() {
            return system
                .fileExists(`${toolsDir}/${tool.key}/__installing.lock`)
                .then(hasLock => {
                    if (hasLock) return Tool.status.installing;
                    return system
                        .execute(
                            `cd ${toolsDir}/${this.key} && sh tool/status.sh`
                        )
                        .then(status =>
                            status != '0'
                                ? Tool.status.running
                                : Tool.status.stopped
                        );
                });
        }

        start() {}

        stop() {}

        iconData() {}
    }

    Tool.status = {
        installing: 'installing',
        stopped: 'stopped',
        starting: 'starting',
        running: 'running',
        stopping: 'stopping'
    };

    return Tool;
};
