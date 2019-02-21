---
## 新流程中心

#### 脚本说明
|参数位置|必选|可选参数|说明|
|:-------|:-----|:----- |:----- |
|1|true |[start/stop/restart/status]|/|
|2|false |[dev/test/prod]|(default:dev)|
|3|false |[debug]|开启debug 调试)|
示例
```
./flow-manager.sh start
./flow-manager.sh stop
./flow-manager.sh start test
./flow-manager.sh start test debug
```

