````
var sendAjax=function(option = 'GET',url = undefined,data){
	  let errorText = url ? undefined : '没有请求路径';
	  return errorText || new Promise(function(resolve,reject){
			      var xhr = new XMLHttpRequest();
			      xhr.open(option,url);
			      //xhr.responseType='json';
			      //xhr.setresponseHeader("Accept","application/jsonp");
			      xhr.send(data);
			      xhr.onreadystatechange=function(){
			      let {status,readyState} = xhr;
			      if(status==200&&readyState==4){
			        	var json=JSON.parse(xhr.responseText);
			        	resolve(json)
			      }else if(readyState==4&&status!=200){
			       		reject('error');
			      }
		    }
	  })
}
console.log(typeof sendAjax());
````