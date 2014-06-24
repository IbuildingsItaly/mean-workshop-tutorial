Tutorial app for the MEAN Workshop
=======
MEAN Workshop application

The purpose of this app is to guide the user to learn the MEAN stack through a step-by-step development.
Every branch represents the state of the app, both for the back-end and the front-end.
The back-end is made with NodeJS, ExpressJS and Mongoose for MongoDB.
Any kind of generator was used to build the scaffolding structure.

So, the procedure is to switch from a branch to another and develop the app step-by-step, reaching the level situated in the next branch.

## Requirements
To use and work with the app, you need to have installed the following requirements:

 - [Ruby](https://www.ruby-lang.org) & [Compass](https://rubygems.org/gems/compass) (needed to compile sass sources)
 - [Python](https://www.python.org/) & a C++ compiler (needed to node-gyp to build some tools)
 - [NodeJS](http://nodejs.org/)
 - [MongoDB](http://www.mongodb.org/)
 - [Grunt](http://gruntjs.com/) (installed globally with npm. Needed to serve the front-end)

## Usage
Clone the repo:

```bash
$ git clone https://github.com/ibuildingsitaly/mean-workshop-tutorial
$ cd mean-workshop-tutorial
```

Install back-end dependencies:

```bash
$ cd api
$ npm install
$ cd ..
```

Install front-end dependencies:

```bash
$ cd app
$ npm install
$ bower install
$ cd ..
```

At this point, make sure you have launched your mongo server, then launch the back-end:

```bash
$ cd api
$ node index
```

From another shell, launch the front-end:

```bash
$ cd /path/to/repo/
$ cd app/
$ grunt serve
```

## Branches
 - master: it has the entire app
 - fe_0_base: it contains only the configuration for grunt and the index.html generated with [yeoman](http://yeoman.io/) [angular-generator](https://github.com/yeoman/generator-angular)
 - fe_1_login: it contains the login logic and the logic for the plans page
 - fe_2_plans: it contains the plans page logic and the logic for the single plan page
 - fe_3_single_plan: it contains the single plan logic and the base for the event page
 - fe_4_event: it contains the complete front-end app

## License
[**GPLv2**](https://github.com/ibuildingsitaly/mean-workshop-tutorial/LICENSE)