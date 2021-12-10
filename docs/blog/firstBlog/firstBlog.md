1.last-child
```
    .ul li {    
         border: 1px solid red;
    }
    .ul li:last-child {    
         border: none;  
     }
```
  ul最后一个li元素无边框。

 2.:not()
```
    .ul li:not(:last-child) {    
         border: 1px solid red;
     }
```
  ul最后一个li元素无边框。

  两种作用一样的样式写法，第二种更语义化一些。