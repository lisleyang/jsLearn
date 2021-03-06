* 散列后的数据可以快速插入和取用；
* 在散列上插入，删除和取用数据非常快，但是查找数据效率却非常低下，比如查找一组数据中的最大值和最小值；
* javascript散列基于数组设计，理想情况下散列函数会将每一个键值映射为唯一的数组索引，数组长度有限制，更现实的策略是将键均匀分布；

## 散列关键概念定义

1. 数组长度是预先设定的，可以随时增加，所有元素根据和该元素对应的键，保存数组特定位置
2. 即使使用高效的散列函数，仍然存在两个键值相同的情况，这种现象称为“碰撞”；
3. 数组的长度应该是一个质数，所有的策略都基于碰撞；
4. 开链法：两个键相同保存位置一样。开辟第二数组，也称第二个数组为链。
5. 线性探测法属于开放寻址散列，查找散列位置，如果当前位置没有，继续寻找下一个位置。存储数据较大较合适。
6. 数据大小>=1.5*数据（开链法），数组大小>=2*数据(线性探测法)