### 关于二进制文件和文本文件

无论文本文件，还是二进制文件，都包含在广义的二进制文件内；

可以说文本文件是一种特殊的二进制文件。因为文本文件实际上的解释格式已经确定了：ASCII或者unicode编码。

对于文本文件，编辑器就可以读写。比如记事本、NotePad++、Vim等。二进制文件需要特别的解码器。比如bmp文件需要图像查看器，rmvb需要播放器……

文本工具打开一个文件的过程是怎样的呢？拿记事本来说，它首先读取文件物理上所对应的二进制比特流，然后按照你所选择的解码方式来解释这个流，然后将解释结果显示出来。一般来说，你选取的解码方式会是ASCII码形式（ASCII码的一个字符是８个比特），接下来，它8个比特8个比特地来解释这个文件流。例如对于这么一个文件流"01000000_01000001_01000010_01000011"(下划线''_''，为了增强可读性手动添加的)，第一个8比特''01000000''按ASCII码来解码的话，所对应的字符是字符''A''，同理其它3个8比特可分别解码为''BCD''，即这个文件流可解释成“ABCD”，然后记事本就将这个“ABCD”显示在屏幕上。

二进制文件的存取显然与文本文件的存取差不多，只是编／解码方式不同而已，也不再叙述。

如果一个文本文件只包含英文字符，比如Hello World，那无论用GBK编码或是UTF8编码读取这个文件都是没问题的。这是因为在这些编码下，ASCII0~128范围内字符都使用相同的单字节编码。

### Unicode

将世界上所有的符号都纳入其中。每一个符号都给予一个独一无二的编码，那么乱码问题就会消失。这就是 Unicode，就像它的名字都表示的，这是一种所有符号的编码。

需要注意的是，Unicode 只是一个符号集，它只规定了符号的二进制代码，却没有规定这个二进制代码应该如何存储。

### utf-8

UTF-8 就是在互联网上使用最广的一种 Unicode 的实现方式;

UTF-8 最大的一个特点，就是它是一种变长的编码方式。它可以使用1~4个字节表示一个符号，根据不同的符号而变化字节长度。这样节省了存储空间。

对于英语字母，UTF-8 编码和 ASCII 码是相同的。

## escape,encodeURI与encodeURIComponent

encodeURI和encodeURIComponent都是返回字符的utf-8形式(`不是编码，编码是变成字符的二进制形式`)，并且在每个字节面前加上`%`;

他俩的区别在于范围不同，encodeURI不会对一些特殊符号进行编码

```js
encodeURIComponent('http://')    //"http%3A%2F%2F"
encodeURI('http://')    //"http://"
```

escape()不能直接用于URL编码，它的真正作用是返回一个字符的Unicode编码值。比如"春节"的返回结果是%u6625%u8282，也就是说在Unicode字符集中，“春”是第6625个（十六进制）字符，“节”是第8282个（十六进制）字符。