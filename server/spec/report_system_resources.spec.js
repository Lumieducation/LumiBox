const resources = require('../src/domain/queries/resources');

test('registers query', () => {
    const system = {
        setInterval: jest.fn()
    };
    const server = {
        addQuery: jest.fn()
    };

    resources({ system }).installOn(server);
    expect(server.addQuery.mock.calls[0][0]).toBe('/resources');
});

test('updates every 5 seconds', () => {
    const system = {
        setInterval: jest.fn(fn => (system.setInterval.fn = fn))
    };
    const server = {
        addQuery: jest.fn(),
        emitUpdate: jest.fn()
    };

    resources({ system }).installOn(server);

    expect(system.setInterval.mock.calls[0][1]).toBe(5000);
    expect(server.emitUpdate.mock.calls.length).toBe(0);

    system.setInterval.fn();

    expect(server.emitUpdate.mock.calls[0][0]).toBe('/resources');
});

test('reads used disk space', () => {
    let q;
    const system = {
        setInterval: jest.fn(),
        execute: jest
            .fn()
            .mockResolvedValue(
                'anything\nanything        12G   42G  6,9G  21% /'
            ),
        totalmem: jest.fn(),
        freemem: jest.fn()
    };
    const server = {
        queries: {},
        addQuery: jest.fn((_, query) => (q = query)),
        emitUpdate: jest.fn()
    };

    resources({ system }).installOn(server);

    return q()
        .then(result => {
            expect(result.disk).toEqual({
                used: '42G',
                total: '12G',
                percentage: '21%'
            });
        })
        .then(() => expect(system.execute.mock.calls).toEqual([['df -h /']]));
});

test('reads used memory', () => {
    let q;
    const system = {
        setInterval: jest.fn(),
        execute: jest.fn().mockResolvedValue('\n'),
        totalmem: jest.fn(() => 4000000000),
        freemem: jest.fn(() => 3000000000)
    };
    const server = {
        queries: {},
        addQuery: jest.fn((_, query) => (q = query)),
        emitUpdate: jest.fn()
    };

    resources({ system }).installOn(server);

    return q().then(result => {
        expect(result.memory).toEqual({
            used: '0.93GB',
            total: '3.73GB',
            percentage: '25%'
        });
    });
});
