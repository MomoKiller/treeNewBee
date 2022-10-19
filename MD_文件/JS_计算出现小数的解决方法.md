


# 


> 项目开发过程中，常会遇到浮点数加、减、乘、除运算丢失精度问题。
> 以下是常规的解决方法

思路：
- 将小数化成整数后再作运算
- 避免方法中出现小数相乘


#### 1. 加法
- 转成整数相加
- `Math.pow(10, ... )` 为整数，与和相除不会丢失精度
```javascript
/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * @param num1 加数1
 * @param num2 加数2
 */
function numAdd(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	return (num1 * baseNum + num2 * baseNum) / baseNum;
};

```

#### 2. 减法
- 减数和被减数，小数最多位作为精度值
```javascript
/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * @param num1 被减数
 * @param num2 减数 
 */
function numSub(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	var precision;// 精度
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
	return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

```

#### 3. 乘法
- 转成整数相乘
- `Math.pow(10, ... )` 为整数， 与乘积相除不会丢失精度
```javascript
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * @param num1 被乘数
 * @param num2 乘数 
 */
function numMulti(num1, num2) {
	var baseNum = 0;
	try {
		baseNum += num1.toString().split(".")[1].length;
	} catch (e) {
	}
	try {
		baseNum += num2.toString().split(".")[1].length;
	} catch (e) {
	}
	return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};

```

#### 4. 除法
- 转成整数相除
- 必须使 `Math.pow(10, ... )` 结果为整数
- `num1` 小数位大于 `num2`, 商乘以 `Math.pow(10, baseNum2 - baseNum1)` 不会丢失精度
- `num1` 小数位小于 `num2`, 商除以 `Math.pow(10, baseNum2 - baseNum1)` 不会丢失精度

```javascript
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * @param num1 被除数
 * @param num2 除数 
 */
function numDiv(num1, num2) {
	var baseNum1 = 0, baseNum2 = 0;
	var baseNum3, baseNum4;
	try {
		baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
		baseNum1 = 0;
	}
	try {
		baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
		baseNum2 = 0;
	}
	
	/*
	with (Math) {
		baseNum3 = Number(num1.toString().replace(".", ""));
		baseNum4 = Number(num2.toString().replace(".", ""));
		return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
	}
	*/

	baseNum3 = Number(num1.toString().replace(".", ""));
	baseNum4 = Number(num2.toString().replace(".", ""));
	if( (baseNum2 - baseNum1) < 0){
		return (baseNum3 / baseNum4) / Math.pow(10, baseNum1 - baseNum2)
	}
	return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);

};
```

#### 5. 精度的究极解决方案
parseFloat((2134.76 + 516.19).toFixed(10))









