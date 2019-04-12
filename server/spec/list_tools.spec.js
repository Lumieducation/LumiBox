const tools = require('../src/domain/queries/tools');

let toolsDir, server, system, commands, files;

beforeEach(() => {
    toolsDir = 'tools/dir';
    server = new MockServer();
    system = {
        execute: command =>
            commands[command]
                ? Promise.resolve(commands[command])
                : Promise.reject('Command not found: ' + command
        ),
        readFile: file =>
            files[file]
                ? Promise.resolve(files[file])
                : Promise.reject('File not found: ' + file
        ),
        fileExists: file => Promise.resolve(file in files)
    };
});

class MockServer {
    constructor() {
        this.queries = {};
    }
    addQuery(key, query) {
        this.queries[key] = query;
    }
}

test('registers query', () => {
    const server = {
        addQuery: jest.fn()
    };
    const system = {
        execute: jest.fn().mockResolvedValue('\n'),
        readFile: jest.fn().mockResolvedValue('{}')
    };

    tools({ system }).installOn(server);
    expect(server.addQuery.mock.calls[0][0]).toBe('/tools');
});

test('no tools', () => {
    const system = {
        execute: jest.fn().mockResolvedValue('\n'),
        readFile: jest.fn().mockResolvedValue('{}')
    };

    tools({ system }).installOn(server);
    return expect(server.queries['/tools']()).resolves.toEqual({ tools: [] });
});

test('stopped tools', () => {
    commands = {
        'ls tools/dir': '\nmy\n\nother\n',
        'cd tools/dir/my && sh tool/status.sh': '0',
        'cd tools/dir/other && sh tool/status.sh': '0',
    };
    files = {
        'tools/dir/my/tool/meta.json': JSON.stringify({
            name: 'My Tool'
        }),
        'tools/dir/other/tool/meta.json': JSON.stringify({
            name: 'Other Tool'
        })
    };

    tools({ system, toolsDir }).installOn(server);
    return expect(server.queries['/tools']()).resolves.toEqual({
        tools: [
            {
                name: 'My Tool',
                status: 'stopped',
                url: '//my.on.lumi.education',
                icon: null
            },
            {
                name: 'Other Tool',
                status: 'stopped',
                url: '//other.on.lumi.education',
                icon: null
            }
        ]
    });
});

test('tool with icon', () => {
    commands = {
        'ls tools/dir': 'my',
        'cd tools/dir/my && sh tool/status.sh': '0'
    };
    files = {
        'tools/dir/my/tool/meta.json': JSON.stringify({
            name: 'My Tool',
            icon: 'icon.png'
        })
    };

    tools({ system, toolsDir }).installOn(server);
    return server.queries['/tools']().then(result =>
        expect(result.tools[0].icon).toEqual(
            '//on.lumi.education/tools/my/icon.png'
        )
    );
});

test('serve Tool icon', () => {
    commands = {
        'ls tools/dir': 'my',
        'cd tools/dir/my && sh tool/status.sh': '0'
    };
    files = {
        'tools/dir/my/tool/meta.json': JSON.stringify({
            name: 'My Tool',
            icon: 'icon.png'
        }),
        'tools/dir/my/icon.png': '<image_data>'
    };

    return tools({ system, toolsDir })
        .installOn(server)
        .then(() => {
            expect(Object.keys(server.queries)).toEqual([
                '/tools',
                '/tools/my/icon.png'
            ]);

            return server.queries['/tools/my/icon.png']().then(result =>
                expect(result).toEqual('<image_data>')
            );
        });
});

test('running Tool', () => {
    commands = {
        'ls tools/dir': 'my',
        'cd tools/dir/my && sh tool/status.sh': 'anything'
    };
    files = {
        'tools/dir/my/tool/meta.json': JSON.stringify({})
    };

    tools({ system, toolsDir }).installOn(server);
    return server.queries['/tools']().then(result =>
        expect(result.tools[0].status).toEqual('running')
    );
});
