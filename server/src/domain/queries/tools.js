module.exports = ({ system, toolsDir }) => {
    const ToolsRepository = require('../model/ToolRepository')({
        system,
        toolsDir
    });

    const repository = new ToolsRepository();

    const installOn = server => {

        server.addQuery('/tools', () =>
            repository.tools().then(tools => ({
                tools: tools.map(tool => ({
                    name: tool.name,
                    url: `//${tool.key}.on.lumi.education`,
                    status: 'stopped',
                    icon: tool.icon ? `//on.lumi.education/tools/${tool.key}/${tool.icon}` : null
                }))
            })));

        return repository.tools().then(tools => tools.forEach(tool => {
            if (!tool.icon) return

            return server.addQuery(`/tools/${tool.key}/${tool.icon}`, () => 
                system.readFile(`${toolsDir}/${tool.key}/${tool.icon}`))
        }))
    }

    return {
        installOn
    };
};
