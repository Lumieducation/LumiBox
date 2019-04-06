# List Tools

## Scenarios

### No Tools

When I query

    /tools

Then expect

    response.body.json() == {tools:[]}

### Stopped Tools

Given 

    file('tools/my/tool/meta.json')
        .containingJson({name: 'My Tool'})

    file('tools/my/tool/status.sh')
        .containing('echo "0"')

    file('tools/other/tool/meta.json')
        .containingJson({name: 'Other Tool'})

    file('tools/other/tool/status.sh')
        .containing('echo "0"')

When I query

    /tools

Then expect

    response.body.json() == {tools:[
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
    ]}

### Tool with icon

Given 

    file('tools/my/tool/meta.json')
        .containingJson({
            name: 'My Tool',
            icon: 'icon.png'
        })

    file('tools/my/tool/status.sh')

When I query

    /tools

Then expect

    response.body.json().tools[0].icon == '//on.lumi.education/tools/my/icon.png'

### Serve Tool icon

Given 

    file('tools/my/tool/meta.json')
        .containingJson({
            name: 'My Tool',
            icon: 'icon.png'
        })

    file('tools/my/tool/status.sh')

    file('tools/my/tool/icon.png')
        .containing('an icon')

When I query

    /tools/my/icon.png

Then expect

    response.header.contentType == 'image/png'
    response.body == 'an icon'

### Running Tool

Given 

    file('tools/my/tool/meta.json')
        .containingJson({name: 'My Tool'})

    file('tools/my/tool/status.sh')
        .containing('echo "anything"')

    app.tools.my.started = true

When I query

    /tools

Then expect

    response.body.json().tools[0].state == 'running'

### Starting Tool

Given 

    file('tools/my/tool/meta.json')
        .containingJson({name: 'My Tool'})

    file('tools/my/tool/status.sh')
        .containing('echo "0"')

    app.tools.my.started = true

When I query

    /tools

Then expect

    response.body.json().tools[0].state == 'starting'

### Stopping Tool

Given 

    file('tools/my/tool/meta.json')
        .containingJson({name: 'My Tool'})

    file('tools/my/tool/status.sh')
        .containing('echo "anything"')

    app.tools.my.started = false

When I query

    /tools

Then expect

    response.body.json().tools[0].state == 'stopping'