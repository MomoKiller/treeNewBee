


|=========================================================================================================|
|																										  |
|																										  |
|																										  |
|																										  |
|===============================  			JS  循环方法				   ===============================|
|																										  |
|																										  |
|																										  |
|																										  |
|=========================================================================================================|






http://developer.51cto.com/art/201511/496644.htm


var demoArr = ['Javascript', 'Gulp', 'CSS3', 'Grunt', 'jQuery', 'angular']; 
var demoObj = { 
    aaa: 'Javascript', 
    bbb: 'Gulp', 
    ccc: 'CSS3', 
    ddd: 'Grunt', 
    eee: 'jQuery', 
    fff: 'angular' 
}; 




//============== for ==============
a. 	for循环中的i在循环结束之后任然存在与作用域中，为了避免影响作用域中的其他变量，使用函数自执行的方式将其隔离起来()();
b. 	避免使用for(var i=0; i<demo1Arr.length; i++){} 的方式，这样的数组长度每次都被计算，效率低于上面的方式。
	也可以将变量声明放在for的前面来执行，提高阅读性
fn() {
	for(var i=0, len=demoArr.length; i<len; i++) { 
        if (i == 2) { 
            // return;   // 函数执行被终止 
            // break;    // 循环被终止 
            continue; // 循环被跳过 
        }; 
        console.log('demo1Arr['+ i +']:' + demo1Arr[i]); 
    } 
}



//============== for in ==============
a. 	在for循环与for in循环中，i值都会在循环结束之后保留下来。因此使用函数自执行的方式避免。
b.	使用return，break，continue跳出循环都与for循环一致，不过关于return需要注意，在函数体中，
	return表示函数执行终止，就算是循环外面的代码，也不再继续往下执行。而break仅仅只是终止循环，后面的代码会继续执行。
fn() {
	for(var i in demoArr) { 
        if (i == 2) { 
            return; // 函数执行被终止 
            // break;  // 循环被终止 
            // continue;  // 循环被跳过 
        }; 
        console.log('demoArr['+ i +']:' + demoArr[i]); 
    } 
    console.log('-------------'); 
}




//============== forEach ==============
a.	forEach无法遍历对象
b.	forEach无法在IE中使用，firefox和chrome实现了该方法
c.	forEach无法使用break，continue跳出循环，使用return时，效果和在for循环中使用continue一致
fn(){
	demoArr.forEach(function(e) { 
		if (e == 'CSS3') { 
			return;  // 循环被跳过 
			// break;   // 报错 
			// continue;// 报错 
		}; 
		console.log(e); 
	}) 
}


// 直接使用while 
(function() { 
    var i = 0, 
        len = demoArr.length; 
    while(i < len) { 
        if (i == 2) { 
            // return; // 函数执行被终止 
            // break;  // 循环被终止 
            // continue;  // 循环将被跳过，因为后边的代码无法执行，i的值没有改变，因此循环会一直卡在这里，慎用！！ 
        }; 
        console.log('demoArr['+ i +']:' + demoArr[i]); 
        i ++; 
    } 
    console.log('------------------------'); 
})(); 
 
// do while 
(function() { 
    var i = 0, 
        len = demo3Arr.length; 
    do { 
        if (i == 2) { 
            break; // 循环被终止 
        }; 
        console.log('demo2Arr['+ i +']:' + demo3Arr[i]); 
        i++; 
    } while(i<len); 
})(); 


//
$.each(demoArr, function(e, ele) {
    console.log(e, ele);
})



$(selecter).each
$('.list li').each(function(i, ele) { 
    console.log(i, ele); 
    // console.log(this == ele); // true 
    $(this).html(i); 
    if ($(this).attr('data-item') == 'do') { 
        $(this).html('data-item: do'); 
    }; 
}) 