[3 Strand Code](https://three-strand-code.herokuapp.com)
=============

This is the landing page for 3 Strand Code.

## Install and run

**Clone**
1. `git clone git@github.com:3-strand-code/3-strand-code-website.git`
1. `cd 3-strand-code-website`

**Setup Environment Keys**
1. Request access to the Heroku app.
1. List keys with `heroku config --app three-strand-code`
1. Set **staging/test** keys only:
  1. `export TSC_KINVEY_STAGING_APP_KEY="appkey";`
  1. `export TSC_KINVEY_STAGING_APP_SECRET="appsecret";`
  1. `export TSC_KINVEY_STAGING_MASTER_SECRET="mastersecret";`
  1. `export TSC_STRIPE_TEST_PUBLISHABLE_KEY="key";`
  1. `export TSC_STRIPE_TEST_SECRET_KEY="key";`

**Start Server/Build**
1. `npm start` - Install dependencies and start dev server.
1. `gulp` - Start build and watchers.
1. [https://localhost:8000](https://localhost:8000) open in browser, **Note https:**.

## Development

1. Create a `feature/*` branch.
1. Start the server: `node web.js`
1. Start gulp: `gulp`
1. Hack commit/push
1. When done:
    1. Open a PR
    1. Deliver the Pivotal story

## Deploy

1. Request access to the Heroku app.
1. Add your ssh keys to Heroku.
1. Install the [Heroku toolbelt](https://toolbelt.heroku.com/).
1. Add the 3 Strand Code app as a git remote.
1. `git push heroku master`
