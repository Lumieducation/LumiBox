module.exports = ({ system }) => {
    const ToolsRepository = require('../model/tools_repository')({ system });

    const repository = new ToolsRepository();

    const installOn = server =>
        server.addQuery('/tools', () =>
            repository.tools().then(() => ({ tools: [] }))
        );

    return {
        installOn
    };
};
