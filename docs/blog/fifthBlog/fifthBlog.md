1.Array.prototype添加要重新写的方法，参数为传入的回调函数，然后for循环this（this指向的传入的数组），后两个都基于.forEach，所以把.forEach放在第一个。

   
<pop/>

```javascript
 if(!Array.prototype.forEach){
            Array.prototype.forEach = function (callback) {
                    for(var i = 0;i < this.length; i ++){
                            callback(this[i],i,this);
                    };
            };
     };

    if(!Array.prototype.map){
            Array.prototype.map = function (callback) {
                    var returnArray = [];
                    this.forEach(function (item,index,array) {
                            returnArray.push(callback(item,index,array))
                    });
                    return returnArray;
            };
    };

    if(!Array.prototype.filter){
            Array.prototype.filter = function (callback) {
                    var returnArray = [];
                    this.forEach(function (item,index,array) {
                            if(callback(item,index,array)){
                                    returnArray.push(item);
                             };
                    });
                    return returnArray;
            };
    };
```

2.String.prototype增加一个回调方法，返回正则替换后的数据。

```javascript
	if(!String.prototype.trim){
	        String.prototype.trim = function () {
	                return this.replace(/(^[\s]+|[\s]+$)/g,'')
	        };
	};
```

end。



参考资料：[Array.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype)