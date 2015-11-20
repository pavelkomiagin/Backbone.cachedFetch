[![License](https://img.shields.io/npm/l/backbone.cachedfetch.svg)](https://img.shields.io/npm/l/backbone.cachedfetch.svg)
[![Version](https://img.shields.io/npm/v/backbone.cachedfetch.svg)](https://img.shields.io/npm/v/backbone.cachedfetch.svg)
[![Downloads](https://img.shields.io/npm/dm/backbone.cachedfetch.svg)](https://img.shields.io/npm/dm/backbone.cachedfetch.svg)
[![Downloads](https://img.shields.io/npm/dt/backbone.cachedfetch.svg)](https://img.shields.io/npm/dt/backbone.cachedfetch.svg)

# Backbone.cachedFetch

Simple methods for fetching Backbone.Model or Backbone.Collection and caching it in LocalStorage. It's available to set expiration time.

## Usage

Include Backbone.cachedFetch after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.cachedFetch.js"></script>
```

Use `cachedFetch()` method instead of `fetch()`. Send optional `expireTime` to define how long this cache should be considered valid (3600000 ms = 1 hour by default).
If there is a valid cache, the collection will be created from it. Otherwise it will be requested from the server:

```javascript
myModel.cachedFetch();
myCollection.cachedFetch({}, { expireTime: 720000 });
```

### NodeJS

Install using `npm install backbone.cachedfetch`

## License

Licensed under MIT license

Copyright (c) 2015 Pavel Komiagin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
