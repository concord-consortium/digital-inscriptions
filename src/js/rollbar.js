const Rollbar = require("rollbar-browser");
const _rollbarConfig = {
    accessToken: "c747db43de964fdeb44be56fa4c379bc",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "development"
    }
};

export const rollbar = Rollbar.init(_rollbarConfig);