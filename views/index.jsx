var React = require('react');

export default class Index extends React.Component {
    render() {
        const { tools, space, memory } = this.props;
        return (
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <title>LumiBox</title>
                </head>

                <body>
                    <h1>LumiBox</h1>

                    <h3>Available Tools</h3>
                    <ul>
                        {tools
                            .filter(tool => tool.running)
                            .map(tool => (
                                <li>
                                    <a href="//{tool.name}.{boxDomain}">
                                        {tool.name}
                                    </a>
                                </li>
                            ))}
                    </ul>

                    <hr />

                    <h3>Manage Tools</h3>
                    <ul>
                        {tools
                            .filter(tool => tool.installed)
                            .map(tool => (
                                <li>
                                    <strong>{tool.name}</strong> ({tool.status})
                                    {tool.running ? (
                                        <a href="/{tool.name}/stop">[stop]</a>
                                    ) : (
                                        <a href="/{tool.name}/start">[start]</a>
                                    )}
                                    <a
                                        href="/{tool.name}/remove"
                                        onclick="return confirm('Remove {tool.name}? This can NOT be undone!')"
                                    >
                                        [remove]
                                    </a>
                                </li>
                            ))}
                    </ul>

                    <h3>Install Tool</h3>
                    <form
                        action="install"
                        method="post"
                        enctype="multipart/form-data"
                    >
                        <input type="file" name="fileToUpload" />
                        <br />
                        <input type="submit" />
                    </form>

                    <hr />

                    <h3>System</h3>

                    <h4>Disk Space</h4>
                    <pre>{space}</pre>

                    <h4>Memory</h4>
                    <pre>{memory}</pre>

                    <h4>Shutdown</h4>
                    <p>
                        To avoid data corruption, always shutdown before
                        unplugging the Box.
                    </p>
                    <form action="/shutdown" method="post">
                        <input
                            type="submit"
                            onclick="return confirm('Shutdown LumiBox?')"
                            value="shutdown"
                        />
                    </form>
                </body>
            </html>
        );
    }
}
