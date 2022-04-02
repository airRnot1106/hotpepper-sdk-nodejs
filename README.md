# hotpepper-sdk-nodejs

![npm (tag)](https://img.shields.io/npm/v/hotpepper-sdk/latest) [![npm](https://img.shields.io/badge/-Npm-CB3837.svg?logo=npm&style=popout)](https://www.npmjs.com/package/hotpepper-sdk)

## Install

```bash
npm install hotpepper-sdk
```

## Usage

```javascript
//cjs
const hotpepper = require('hotpepper-sdk');
//ts
import * as hotpepper from 'hotpepper-sdk';

(async () => {
    hotpepper.setApiKey('YOUR_API_KEY');

    const res = await hotpepper.gourmet().keyword('居酒屋').sake(1).search();
})();
```

## API

See [document](https://airrnot1106.github.io/hotpepper-sdk-nodejs/) and [official reference](https://webservice.recruit.co.jp/doc/hotpepper/reference.html).

## Issues

If you find a bug or problem, please open an issue!:bug:

## Author

-   Github: [airRnot1106](https://github.com/airRnot1106)
-   NPM: [airrnot1106](https://www.npmjs.com/~airrnot1106)
-   Twitter: [@airRnot1106](https://twitter.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/hotpepper-sdk-nodejs/blob/main/LICENSE) file for details.

<a href="http://webservice.recruit.co.jp/"><img src="http://webservice.recruit.co.jp/banner/hotpepper-m.gif" alt="ホットペッパー Webサービス" width="88" height="35" border="0" title="ホットペッパー Webサービス"></a>
<br>【画像提供：ホットペッパー グルメ】
