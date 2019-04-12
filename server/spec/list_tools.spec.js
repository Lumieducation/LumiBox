const tools = require('../src/domain/queries/tools');

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
    const server = new MockServer();
    const system = {
        execute: jest.fn().mockResolvedValue('\n'),
        readFile: jest.fn().mockResolvedValue('{}')
    };

    tools({ system }).installOn(server);
    return expect(server.query()).resolves.toEqual({ tools: [] });
});

test('stopped tools', () => {
    const toolsDir = 'tools/dir';
    const server = new MockServer();
    const system = {
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
    const commands = {
        'ls tools/dir': '\nmy\n\nother\n'
    };
    const files = {
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

test.todo('tool with icon');

test.todo('serve Tool icon');

test.todo('running Tool');
