# 以撒程序化交易接口 (2019.11月以后的同花顺版本)
本接口以第三方交易软件（同花顺）插件的方式运行，因此同花顺支持的券商都可以正常使用。
## 支持的券商列表
```
A 爱建证券 
C 财富证券 财达证券 长城国瑞证券 川财证券 长江证券 长城证券 财通证券 
D 东吴证券 东方证券 东兴证券 东北证券 东方财富证券 大同证券 德邦证券 东海证券 东莞证券 
F 方正证券 
G 国都证券 广州证券 国融证券 国联证券 国元证券 国开证券 国泰君安 国金证券 国盛证券 
H 华菁证券 华福证券 宏信证券 华融证券 华金证券 华创证券 华鑫证券 华龙证券 华林证券 恒泰证券 
J 江海证券 金元证券 
K 开源证券 
L 联讯证券 联储证券 
M 族证券 模拟炒股 民生证券 
P 平安证券 
S 申港证券 申万宏源(原申万) 首创证券 申万宏源(原宏源) 世纪证券 山西证券 上海证券 
T 天风证券 太平洋证券 
W 网信证券 万联证券 五矿证券 万和证券 
X 信达证券 西南证券 兴业证券 湘财证券 
Y 银河证券 银泰证券 
Z 中泰证券 中投证券 中天证券 中山证券 中银国际 中信浙江 中信证券 中金证券 中邮证券 中原证券 浙商证券
```
## 安装和使用
##### 1、将thstrade或haitong_release(海通)下载至您的电脑中;
##### 2、打开order_engine.ini
###### 填上已经开通的token,格式为(XXXXX为资金账号):
token=THS_XXXXX
注意：XXXXX可能是很长的试用账号
如果是海通证券，则：
token=HT_XXXXX
###### 如果有必要修改默认端口号,比如：
http_port=12960
##### 3、从桌面创建快捷方式，或者从ThsEngine.exe启动
##### 4、添加已经开通的券商和资金账号，并且登录，选择记住并且自动登录
##### 5、启动后会自动弹出一个小窗口，可以设置Rest服务端口号，也可以禁用服务，注意：
###### 接口服务开启的时候，界面不可操作，操作界面需要禁用接口！
## 交易接口API
##### 本接口以Rest服务的方式调用，Rest地址为：
http://localhost:12960,端口修改成你自己设定的；

##### 返回为json数据。
统一的错误格式：
```
{
   "msg" : "sample message",
   "status" : "ERROR"
}
status为ERROR
```
#### 委托下单
```
/placeorder?symbol=SZ002018&price=1.00&volume=100&type=B             // 普通账户
```
```
/placeorder?symbol=SZ002018&price=1.00&volume=100&type=B&credit=dbmr // 信用账号
```
```
symbol:证券代码，前缀 SH-上海，SZ-深圳
price: 委托价格,(普通账号：-1为市价委托)
volume:委托数量，单位股
type：委托方式，B-买，S-卖
credit: 担保品买入：dbmr, 担保品卖出dbmc, 融资买入:rzmr,融券卖出:rqmc,买券还券:mqhq,卖券还款:mqhk
```
返回值为Json格式
```
成功的格式：
{
   "order_id" : "xxxx", // 合同编号
   "status" : "OK"
}
```
#### 撤单
```
/cancelorder?orderid=xxx
```
返回值为Json格式

成功的格式：
```
{
   "msg" : "order_id",
   "status" : "OK"
}
```
#### 查询委托
```
/orders
```
成功的格式：
```
{
   "data" : [
      {
         "datetime" : "2018110523:08:52",       // 委托时间
         "dealt_amount" : 0.0,                  // 成交量
         "dealt_price" : 0.0,                   // 成交价
         "order_id" : "207",                    // 委托编号
         "order_price" : 2.6000000000000001,    // 委托价格
         "order_state" : "未报",                // 状态：未报，已报，已成，已撤。。。等
         "order_type" : "证券买入",              // 委托类型，买入/卖出
         "order_volume" : 100,                  // 委托数量，单位（股）
         "stock_account" : "A587641175",        // 股东账号  
         "stock_code" : "510050",               // 证券代码
         "stock_name" : "50ETF",                // 证券名称
         "stock_type" : "上海Ａ股"               // 证券类型
      }
   ],
   "status" : "OK"
}
```
#### 查询持仓
```
/positions
```
成功的格式：
```
{
   "data" : [
      {
         "cost_price" : 2.8279999999999998,     //成本价
         "cost_value" : 257.82999999999998,     //买入市值
         "curr_profit" : -23.399999999999999,   //浮盈
         "index" : 0,                           //序号
         "market" : "SH",                       //市场
         "market_value" : 259.39999999999998,   //当前市值
         "profit_ratio" : -8.2743990000000007,  //盈亏率
         "stock_code" : "510050",               //代码
         "stock_name" : "50ETF",                //名称
         "stock_type" : "上海Ａ股",              //股票类型
         "vol_actual" : 100,                    //实际数量
         "vol_evenup" : 100,                    //可卖数量
         "vol_hold" : 100,                      //持股数量
         "vol_remain" : 100                     //股票余额
      },
   ],
   "status" : "OK"
}
```
#### 查询资金账户
```
/account	
```
成功的格式：
```
{
   "data" : {
      "asset_account" : "5207707",           // 资金账号
      "free_amount" : "",                    // 资金余额
      "free_capital" : "-526.90",            // 可取金额
      "frozen_capital" : "",                 // 冻结金额
      "position_profit" : "-24.50",          // 持仓盈亏
      "stock_cw" : "0.00",                   // 
      "stock_market_value" : "526.90",       // 股票总市值
      "today_profit" : "------",             // 当日盈亏
      "total_asset" : "",                    // 总资产
      "total_capital" : ""                   // 可用金额
   },
   "status" : "OK"
}
```
