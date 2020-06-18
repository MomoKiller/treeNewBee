// 打开数据库
var requestDB = window.indexedDB.open('testDB', 1);

// 新建数据库-事件监听
var db;

requestDB.onsuccess = function (e) {
    db = requestDB.result;
    console.log('数据库打开成功');
};
requestDB.onerror = function (event) {
    console.log('数据库打开报错');
};

// 监听版本升级事件
// 新建数据库时也会触发
requestDB.onupgradeneeded = function (event) {
    console.log('数据库更新成功');

    db = event.target.result;
    // 新建数据库时-新建对象仓库（新建表）表名 'testTable'
    var objStore;
    // if (!db.objectStoreNames.contains('testTable')) {
        objStore = db.createObjectStore('testTable', { ketPath: 'id' });
        // 新建索引 名称 属性 配置对象
        objStore.createIndex('id', 'id', { unique: false });
        objStore.createIndex('name', 'name', { unique: false });
        objStore.createIndex('email', 'email', { unique: true });
    // }
}

// 新增数据
function add() {
    var transaction = db.transaction(['testTable'], 'readwrite');
    var objectStore = transaction.objectStore('testTable');
    var request = objectStore.add({ id: 1, name: '张三', age: 1, email: 'zhangsan@example.com' });

    request.onsuccess = function (event) {
        console.log('数据写入成功');
    };

    request.onerror = function (event) {
        console.log('数据写入失败');
    }
}

// add();

// 读取数据
function read() {
    var transaction = db.transaction(['testTable']);
    var objectStore = transaction.objectStore('testTable');
    var request = objectStore.get(1);

    request.onerror = function (event) {
        console.log('事务失败');
    };

    request.onsuccess = function (event) {
        if (request.result) {
            console.log('Name: ' + request.result.name);
            console.log('Email: ' + request.result.email);
        } else {
            console.log('未获得数据记录');
        }
    };
}

// read();

// 遍历数据
function readAll() {
    var transaction = db.transaction(['testTable']);
    var objectStore = transaction.objectStore('testTable');
    var request = objectStore.openCursor();

    request.onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            console.log('Id: ' + cursor.key);
            console.log('Name: ' + cursor.value.name);
            console.log('Email: ' + cursor.value.email);
            cursor.continue();
        } else {
            console.log('没有更多数据了！');
        }
    };
}

// readAll();

// 更新数据
function update() {
    var transaction = db.transaction(['testTable'], 'readwrite');
    var objectStore = transaction.objectStore('testTable');
    var request = objectStore.put({ id: 1, name: '李四', email: 'lisi@example.com' });

    request.onsuccess = function (event) {
        console.log('数据更新成功');
    };

    request.onerror = function (event) {
        console.log('数据更新失败');
    }
}

// update();

// 删除数据
function remove() {
    var transaction = db.transaction(['testTable'], 'readwrite');
    var objectStore = transaction.objectStore('testTable');
    var request = objectStore.delete(1);

    request.onsuccess = function (event) {
        console.log('数据删除成功');
    };
}

// remove();


