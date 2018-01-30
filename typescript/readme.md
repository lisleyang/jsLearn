**jQuery拓展插件声明文件**

```javascript
/*这是$.myPlugin静态方法的拓展*/

interface MyPlugin {
    settings: MyPluginSettings;
    
    (behavior: 'enable'): JQuery;
    (settings?: MyPluginSettings): JQuery;
}

interface MyPluginSettings {
    title?: string;
}

interface JQueryStatic {
    myPlugin: MyPlugin;
}

$.myPlugin({title:'asd'})

/*这是$().实例方法的拓展*/
interface JQuery{
    cxCalendar():void
}
$("#box").cxCalendar()
```