var React = require('react');

export default class CaptivePortal extends React.Component {
    render() {
        return (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />

                    <link rel="stylesheet" href="/assets/bootstrap.min.css" />

                    <title>Welcome to LumiLand</title>
                </head>

                <body class="text-center">
                    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                        <main role="main" class="inner cover">
                            <h1 class="cover-heading">Welcome to LumiLand</h1>
                            <p class="lead">
                                Open this page in your browser and then
                            </p>
                            <p class="lead">
                                <a href="/" class="btn btn-lg btn-primary">
                                    Open LumiBox
                                </a>
                            </p>
                        </main>
                    </div>
                </body>
            </html>
        );
    }
}
