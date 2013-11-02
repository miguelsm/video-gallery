## Video Gallery

(Work-in-progress) Web application for managing a video gallery/portfolio.

__[Demo](http://video-gallery.herokuapp.com/#/admin/videos)__ -
Tested on Chrome and Firefox.

The API is built on Node.js with [Express.js](http://expressjs.com) and uses
MongoDB as a document store. The client app is built with
[Angular.js](http://angularjs.org) using the [Yeoman](http://yeoman.io)
workflow.

### Features:
* Administration panel.
* Responsive video grid.
* Sortable videos using drag and drop.
* Add videos from YouTube.
* Video tagging.
* Show/hide videos.

### TODO:
* Support more video hosting services.
* Add user accounts.

### Installation:

```
# npm install -g yo
app/$ npm install
public/$ npm install
public/$ bower install
```

### Configuration:
```
$ vim app/config/env/development.json
$ vim public/Gruntfile.js (edit ngconstant configuration)
```

### Running:
```
$ app/NODE_ENV=development PORT=3000 node app.js
$ public/grunt server
$ xdg-open http://localhost:9000/#/admin/videos
```
