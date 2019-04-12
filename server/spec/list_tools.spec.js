const tools = require('../src/domain/queries/tools')

class MockServer {
    addQuery(_, query) {
        this.query = query
    }
}

test('registers query', () => {
    const server = {
        addQuery: jest.fn(),
    }

    tools({}).installOn(server)
    expect(server.addQuery.mock.calls[0][0]).toBe('/tools')
});

test('no tools', () => {
    const server = new MockServer;
    const system = {
        execute: jest.fn().mockResolvedValue('foo'),
        readFile: jest.fn().mockResolvedValue('{}')
    }

    tools({ system }).installOn(server)
    return expect(server.query()).resolves.toEqual({ tools: [] })
})

test('stopped tools', () => {
    const toolsDir = 'tools/dir'
    const server = new MockServer;
    const system = {
        execute: jest.fn().mockResolvedValue('foo'),
        readFile: jest.fn().mockResolvedValue('{}')
    }

    tools({ system, toolsDir }).installOn(server)
    return expect(server.query()).resolves.toEqual({
        tools: [
            {
                name: 'My Tool',
                state: 'stopped',
                url: '//my.on.lumi.education',
                icon: null
            },
            {
                name: 'Other Tool',
                state: 'stopped',
                url: '//other.on.lumi.education',
                icon: null
            }
        ]
    })
})