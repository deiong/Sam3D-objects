
// start.js
module.exports = {
    requires: {
        bundle: "ai",
    },
    daemon: true,
    run: [
        {
            method: "shell.run",
            params: {
                venv: "env",
                env: {},
                path: "app",
                message: "python app.py",  // Assumes you add app.py to app/ folder; otherwise, change to "jupyter notebook notebook/demo_single_object.ipynb" for manual use
                on: [{
                    "event": "/http:\/\/\\S+/",
                    "done": true
                }]
            }
        },
        {
            method: "local.set",
            params: {
                url: "{{input.event[0]}}"
            }
        }
    ]
}
