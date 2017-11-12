# UNMAINTAINED. [vue-form-generator](https://github.com/icebob/vue-form-generator) is the successor.

# PropertiesJS [![NPM version](https://img.shields.io/npm/v/propertiesjs.svg)](https://www.npmjs.com/package/propertiesjs)
[![Build Status](https://travis-ci.org/icebob/propertiesjs.svg)](https://travis-ci.org/icebob/propertiesjs)
[![Dependency Status](https://img.shields.io/david/icebob/propertiesjs.svg)](https://david-dm.org/icebob/propertiesjs)
[![Codacy Badge](https://www.codacy.com/project/badge/7c7e3a15825f411f8dd395a8893fc08e)](https://www.codacy.com/app/mereg-norbert/propertiesjs)
[![Downloads](https://img.shields.io/npm/dt/propertiesjs.svg)](https://www.npmjs.com/package/propertiesjs)

PropertiesJS is a javascript property editor, written in [Coffeescript](http://coffeescript.org/).

## Demo
[Codepen demo #1](http://codepen.io/icebob/full/WvezpR/)

[![Screenshot](https://pbs.twimg.com/media/CC-6yPEWEAAf8ku.png)](http://codepen.io/icebob/full/WvezpR/)

[Codepen demo #2](http://codepen.io/icebob/full/ZGYMWx/)

[![Screenshot](https://pbs.twimg.com/media/CDq8pKxWYAAVm5v.png)](http://codepen.io/icebob/full/ZGYMWx/)

[Try it on the JSFiddle](https://jsfiddle.net/icebob/pk5vkgzp/)

## Features
- multiple object editing
- 12 editors
- live editing mode
- support validation
- change, save, validate event
- call object functions with buttons
- grouping
- ...etc

## Dependencies
- [jQuery](http://www.jquery.com)
- [Spectrum color picker (included)](https://bgrins.github.io/spectrum/)
- [Moment.js (included)](http://momentjs.com/)

## Installation
#### NPM
Installation uses the [npm](http://npmjs.org/) package manager. Just type the following command after installing npm.
```
$ npm install propertiesjs
```
#### Bower
```
$ bower install propertiesjs
```
#### Manual
Download zip package and unpack: 
```
https://github.com/icebob/propertiesjs/archive/master.zip
```


## Usage
Include jquery and properties.min.js file from dist folder:
```html
<script src="https://code.jquery.com/jquery-2.1.3.min.js" type="text/javascript"></script>  
<script src="dist/propertiesJS.min.js type="text/javascript""></script> 
```
Include properties.css style file from dist folder:
```html
<link rel="stylesheet" href="dist/propertiesJS.css">
```

## Test & contributing
We use [Gulp](www.gulpjs.com) to build and run tests.
##### Dependencies
- [NodeJS](http://nodejs.org)
- [gulp](http://gulpjs.com) ` npm install -g gulp`
- Python + Compass (for SASS files)

Clone this repository
``` 
$ git clone https://github.com/icebob/propertiesjs.git
```
Install npm dependencies:
```
$ npm install
```

To run tests
```
$ gulp test
```

To run build
```
$ gulp build
```

## License
PropertiesJS is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact

Copyright (C) 2015 Icebob

[![@icebob](https://img.shields.io/badge/github-icebob-green.svg)](https://github.com/icebob) [![@icebob](https://img.shields.io/badge/twitter-Icebobcsi-blue.svg)](https://twitter.com/Icebobcsi)
