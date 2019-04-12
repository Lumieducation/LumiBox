module.exports = ({ system, toolsDir }) => {
    const Tool = require('./Tool')({ system, toolsDir });

    class ToolRepository {
        constructor(system) {
            this._system;
        }

        tools() {
            return system
                .execute(`ls ${toolsDir}`)
                .then(output => output.split('\n').filter(s => s.length))
                .then(keys =>
                    Promise.all(
                        keys.map(key =>
                            readMetaFile(key).then(
                                meta =>
                                    new Tool(key, meta.name, meta.icon)
                            )
                        )
                    )
                );
        }

        install(toolFile) {}

        remove(tool) {}
    }

    const readMetaFile = toolKey =>
        system
            .readFile(`${toolsDir}/${toolKey}/tool/meta.json`)
            .then(JSON.parse)

    return ToolRepository;
};
