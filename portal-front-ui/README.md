<h1 align="center">门户产品化</h1>

## 文档预览使用说明
> 路由：/file-preview/index
> 参数：  
>   1、fileName  显示的文件名  JS中使用：encodeURIComponent编码  
>   2、filePath  预览的文件地址 JS中使用：encodeURIComponent编码  
> 示例：
<a href="http://localhost:8001/portal-ui/file-preview/index?fileName=%E9%99%84%E4%BB%B6-%E8%A1%A8%E5%8D%95.xlsx&filePath=http%3A%2F%2Ffile.chinayasha.com%2Fform%2F2019%2F03%2F05%2F8a8a8c1a6933afa401694cd4afd50f8f.docx">附件-表单.xlsx</a>


## 文档下载使用说明
> 路由：GET /rest/portal/file-operation/download
> 参数：  
>   1、fileName  显示的文件名  JS中使用：encodeURIComponent编码  
>   2、filePath  预览的文件地址 JS中使用：encodeURIComponent编码  
> 示例：
<a href="http://localhost:8001/portal-ui/file-preview/index?fileName=%E9%99%84%E4%BB%B6-%E8%A1%A8%E5%8D%95.xlsx&filePath=http%3A%2F%2Ffile.chinayasha.com%2Fform%2F2019%2F03%2F05%2F8a8a8c1a6933afa401694cd4afd50f8f.docx">附件-表单.xlsx</a>


## Templates

#### 组件命名说明
>组件，页面以大写开头
>model,service 驼峰命名
>路由全部小写，以中划线连接

>列表页面以 【List】结尾  
>弹出层全名 【Modal】结尾  
>详情页面以 【Detail】结尾  
>输入页面以 【Form】结尾

<a href="./src/pages/Workplace/Workplace.js">工作台</a>


src
  |-components
      |-GlobalFooter
      |-GlobalHeader
      |-Selector
          |-UserSelector
  |-models
      |-userInfo
      |-global
      |-list
      |-login
      |-project
      |-setting
      |-user 
  |-services
      |-api
      |-error
      |-hrService
      |-process
      |-processForm
      |-products
      |-user
  |-pages
      |-Workplace(工作台)
          |-models
              |-workplace.js
          |-components
              |-
          |-Workplace.js
      |-InforTech(IT服务)
          |-models
              |-inforTech.js
          |-components
              |-
          |-InforTech.js
      |-FncService(财务服务)
          |-models
              |-fncService.js
          |-components
              |-
          |-Workplace.js（考勤）
      |-News(财务服务)
          |-models
              |-news.js
          |-components
              |-
          |-News.js（考勤）
      |-HrService(主页面)
          |-models
              |-hrProcess.js
              |-hrService.js
              |-hrTrain.js
          |-comments(组件)
              |-HrBaseInfo(头像及用户基本信息组件)
              |-NewsNotice(新闻公告组件)
              |-SelfService(自助服务)
              |-HrRecruit(招聘)
              |-HrPerformance(绩效)
              |-HrTrain(培训)
          |-HrService(Hr服务)
              |-HrService.js(Hr服务主页面)
              |-HrService.less(Hr服务主页面)
      |-UserCenter(用户中心)
          |-models
              |-
          |-components
              |-
          |-Attendance.js（考勤）
          |-Performance.js （绩效）
          |-Train.js（培训）
      |-UserCenter(用户中心)
          |-models
              |-
          |-components
              |-
          |-Attendance.js（考勤）
          |-Performance.js （绩效）
          |-Train.js（培训）
      
       

## Usage

### Use bash

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

### Use by docker

```bash
# preview 
$ docker pull antdesign/ant-design-pro
$ docker run -p 80:80 antdesign/ant-design-pro
# open http://localhost

# dev 
$ npm run docker:dev

# build 
$ npm run docker:build


# production dev 
$ npm run docker-prod:dev

# production build 
$ npm run docker-prod:build
```

More instructions at [documentation](http://pro.ant.design/docs/getting-started).

## Browsers support

Modern browsers and IE11.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Use Ant Design Pro in your daily work.
- Submit [issues](http://github.com/ant-design/ant-design-pro/issues) to report bugs or ask questions.
- Propose [pull requests](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.
