## WCA Knowledge Gap Map

Gap Map chart for Knowledge Resources with Knowledge Products Tracker.
[Gap Map on xDesk](https://xdesk.ifad.org/sites/pa/tools/gapmap)

### Install
```
1- git clone https://github.com/supertrip86/gapmap
2- npm install
3- npm run start
```

### Usage
```
This web application ONLY leverages SharePoint lists and libraries in its own site collection via REST API.

For development and testing outside SharePoint: 

- in /src/index.js, comment out SP variables 
- in /src/index.js, uncomment all links to /dist/api

To produce bundle js and css files:
```
npm run bundle
```

To produce production js and css files (bundled and minified)
```
npm run compress
```
