const tools = require('../src/domain/queries/tools');

let toolsDir, server, system, commands, files;

beforeEach(() => {
    toolsDir = 'tools/dir';
    server = new MockServer();
    system = {
        execute: jest.fn(command =>
            commands[command]
                ? Promise.resolve(commands[command])
                : Promise.reject('Command not found: ' + command)
        ),
        readFile: jest.fn(file =>
            files[file]
                ? Promise.resolve(files[file])
                : Promise.reject('File not found: ' + file)
        )
    };
});

class MockServer {
    addQuery(_, query) {
        this.query = query;
    }
}

test('registers query', () => {
    const server = {
        addQuery: jest.fn()
    };

    tools({}).installOn(server);
    expect(server.addQuery.mock.calls[0][0]).toBe('/tools');
});

test('no tools', () => {
    const system = {
        execute: jest.fn().mockResolvedValue('\n'),
        readFile: jest.fn().mockResolvedValue('{}')
    };

    tools({ system }).installOn(server);
    return expect(server.query()).resolves.toEqual({ tools: [] });
});

test('stopped tools', () => {
    commands = {
        'ls tools/dir': '\nmy\n\nother\n'
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
    return expect(server.query()).resolves.toEqual({
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
        'ls tools/dir': 'my'
    };
    files = {
        'tools/dir/my/tool/meta.json': JSON.stringify({
            name: 'My Tool',
            icon: 'icon.png'
        })
    };

    tools({ system, toolsDir }).installOn(server);
    return server.query().then(result => 
        expect(result.tools[0].icon).toEqual('//on.lumi.education/tools/my/icon.png'))
});

test.todo('serve Tool icon');

test.todo('running Tool');
