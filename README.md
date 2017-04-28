# digitial-inscriptsions.

A collaborative CMP learning space.


## Working with this project:

1. Prerequisits: Install [`yarn`](https://yarnpkg.com/en/) and [`npm`](https://www.npmjs.com/)
if they are not already installed  your development system.  Also install `live-server` using `npm install -g live-server`
2. Install dependencies by running `yarn` in this directory.
3. Start `webpack-dev-server`
4. Open [http://localhost:8080/](http://localhost:8080/) note: `127.0.0.1` will not work at the moment, because it isn't a white-listed host on the firebase site.
5. Work.

## How is it deployed?
When commits are pushed to gitbhub, travis runs the deployment script found in `./deploy/s3_deploy.sh`.
It will use configuration data from `./deploy/s3_website.yml`.
Ultimately deployments end up at `http://digital-inscriptions.concord.org/branch/[barnchname]/index.html` for example:
(http://digital-inscriptions.concord.org/branch/master/index.html)[http://digital-inscriptions.concord.org/branch/master/index.html].

In the special case of the `production` branch, the deployment will be made to http://digital-inscriptions.concord.org/index.html



## Libraries used:
* [Firebase](https://firebase.google.com/) is used for storing data and sending messages.
* [React](https://facebook.github.io/react/) is the javascript view engine developed by Facebook.
* [mobx](https://github.com/mobxjs/mobx) helps with passing state changes through components.
* [Matrial-UI](www.material-ui.com) is a react widget set developed by Google.

## Misc:
* [typscrtipt](https://www.typescriptlang.org/) type support for better tooling and fewer bugs in your javascript.
* [eslint](http://eslint.org/)

