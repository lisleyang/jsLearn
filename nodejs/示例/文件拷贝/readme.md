* 方法一 : 使用readfileSync将文件全部读取到内存，在使用writeFileSync写入
* 方法二 : 使用createReadStream创建读取流，再拼接Buffer（读取流在`on(data)`的时候，就可以拿到Buffer）
* 方法三 : 使用封装好的pipe方法来读取Buffer 