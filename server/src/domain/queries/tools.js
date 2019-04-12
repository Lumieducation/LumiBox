module.exports = ({ system, toolsDir }) => {
    const ToolsRepository = require('../model/ToolRepository')({
        system,
        toolsDir
    });

    const repository = new ToolsRepository();

    const installOn = server =>
        server.addQuery('/tools', () =>
            repository.tools().then(tools => ({
                tools: tools.map(tool => ({
                    name: tool.name,
                    url: `//${tool.key}.on.lumi.education`,
                    status: 'stopped',
                    icon: null
                }))
            }))
        );

    return {
        installOn
    };
};
