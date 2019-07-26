export class arrayFun {

    // 扁平化--递归
    flatten(arr) {
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                res = res.concat(flatten(arr[i]));
            } else {
                res.push(arr[i]);
            }
        }
        return res;
    };


    // 去重--Object.keys();
    unique(arr) {
        let res = {};
        for (let i = 0; i < arr.length; i++) {
            res[arr[i]] = 0;
        }
        return Object.keys(res);
    };
    // 去重--新建数组
    uniqueRebuild(arr) {
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            if (res.indexOf(arr[i]) <= -1) {
                res.push(arr[i]);
            }
        }
        return res;
    };

    //  排序--冒泡排序
    sort(arr) {
        let temp;
        for (let i = 0; i < arr.length; i++) {
            temp = arr[i];
            for (let j = i; j < arr.length - 1; j++) {
                if (arr[i] > arr[j]) {
                    temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    };
    // 排序--插入排序
    sortInsert(arr) {
        let minIndex;
        let temp;
        for (let i = 0; i < arr.length; i++) {
            minIndex = i;
            for (let j = i; j < arr.length; j++) {
                if (arr[minIndex] > arr[j]) {
                    minIndex = j;
                }
            }
            temp = arr[i]; // 替换
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        return arr;
    };
}