

## 


## 1. elementUI 实现复杂表格
> 1. 表头由多行多列组成
> 2. 左侧和右侧部分列固定，中间部分为动态列
> 3. 表头合并列、合并行

最终效果图
![在这里插入图片描述](https://img-blog.csdnimg.cn/f9464124733f4bb898a2437b41f03291.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5ZOI6YeM55qu54m555eS,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


#### 1.1 表格实现 `HtML` 
```html
<el-table
  :data="tableData"
  style="width: 100%"
  ref="tableRef"
  :header-cell-style="rowspanStyle"
  >
  <!-- left -->
  <el-table-column label="label-left" width="300" fixed="left">
    <el-table-column label="left-label" width="300" fixed="left">
      <el-table-column label="left-label" width="300" fixed="left">
        <el-table-column label="A" prop="key1" width="100" fixed="left"></el-table-column>
        <el-table-column label="B" prop="key2" width="100" fixed="left"></el-table-column>
        <el-table-column label="C" prop="key3" width="100" fixed="left"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>
  <!-- center -->
  <el-table-column label="G" width="80" fixed="left">
    <el-table-column label="F" width="80" fixed="left">
      <el-table-column label="E" width="80" fixed="left">
        <el-table-column label="D/E" prop="key4" width="80" fixed="left"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>
  <el-table-column label="center-label-2">
    <el-table-column label="label-2">
      <el-table-column label="G">
        <el-table-column label="H" prop="key5" width="150"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>
  <el-table-column label="center-label-3">
    <el-table-column label="label-3">
      <el-table-column label="G">
        <el-table-column label="H" prop="key6" width="150"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>
  <el-table-column label="center-label-4">
    <el-table-column label="label-4">
      <el-table-column label="G">
        <el-table-column label="H" prop="key7" width="150"></el-table-column>
      </el-table-column>
    </el-table-column> 
  </el-table-column>
  <el-table-column label="center-label-3">
    <el-table-column label="label-3">
      <el-table-column label="G">
        <el-table-column label="H" prop="key6" width="150"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>

  <!-- right -->
  <el-table-column label="right-label" width="100" fixed="right">
    <el-table-column label="X" width="100" fixed="right">
      <el-table-column label="W" width="100" fixed="right">
        <el-table-column label="/" align="center" prop="key8" width="100" fixed="right"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table-column>
</el-table>
```

#### 1.2 表格实现 `javascript` 
```javascript
data() {
  return {
    tableData: [{
      key1: '2021-10-02',
      key2: '王小虎',
      key3: '上海',
      key4: '10',
      key5: '30',
      key6: 30,
      key7: 30,
      key8: '100%'
    }],
  }
},
methods: {
  rowspanStyle({row,column,rowIndex,columnIndex}) {
    this.$nextTick(() => {
      if(rowIndex === 0) {
        if(
          columnIndex === 0 
          || columnIndex == (row.length-1)
        ) {
          // fixed 固定表格，会在表格上方覆盖一层 相同结构的列
          // 因此 将覆盖的表格 列上也需添加 rowspan="3" 属性
          const domColumn = document.getElementsByClassName(column.id);
          for(let item of domColumn) {
            item.setAttribute("rowSpan",3);
          }
          return column;
        }
      }
      // fixed="right" 原表格和 覆盖层同时出现，将原表层内容隐藏
      if(rowIndex === 3 ){
        if(columnIndex === (row.length -1)) {
          console.log(document.getElementsByClassName(column.id));
          document.getElementsByClassName(column.id)[0].childNodes[0].style.visibility = "hidden"
        }
      }
    });
    // 最后一列设置 rowspan="3" 会空出两行，因此隐藏空出的两行
    if(rowIndex>0 && rowIndex < 3 ) {
      if(
        columnIndex ===0 
        || columnIndex === (row.length-1)
      ) {
        return {display:"none"} 
      }
    }
  },
}
```



#
### 2. elementUI 复杂表格实现原理

#### 2.1 普通表格合并行和列
合并行
```html
  <!-- 合并行 -->
  <table class="example-table">
    <tr>
      <td rowspan="2">A</td>
      <td>B</td>
    </tr>
    <tr>
      <td>D</td>
    </tr>
  </table>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/6ec815749d534c418ab1c242b0d3791d.png#pic_center)


合并列
```html
  <!-- 合并列 -->
  <table class="example-table">
    <tr>
      <td colspan="2">A</td>
    </tr>
    <tr>
      <td>C</td>
      <td>D</td>
    </tr>
  </table>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/040d88198fad44729759dec86d9aa198.png#pic_center)




#### 2.2 elementUI 官网表格合并行、列
> 官方样例中，**配送信息** 列实现了合并两行，**姓名** 行实现了合并两列。 
> 但从代码的实现方式来看，**只能实现简单的嵌套方式合并**。针对更复杂表格力不从心。
>
elementUI 官网复杂表格。
![在这里插入图片描述](https://img-blog.csdnimg.cn/dde38367c06946089c5f26c45ebd3f50.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5ZOI6YeM55qu54m555eS,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

elementUI 官网复杂表格代码。
```html
<!-- 合并行 -->
<el-table-column label="配送信息">
  <!-- 合并列 -->
  <el-table-column
    prop="name"
    label="姓名"
    width="120">
  </el-table-column>
  <el-table-column label="地址">
    <el-table-column
      prop="province"
      label="省份"
      width="120">
    </el-table-column>
    <el-table-column
      prop="city"
      label="市区"
      width="120">
    </el-table-column>
  </el-table-column>
</el-table-column>
```



#### 2.3 elementUI `<el-table-column>` 嵌套和 `rowspan` 动态设置来实现复杂表格
> 参考网上案例，并结合实际情况。可在 `header-cell-style` 回调中，对表格行进行渲染。

##### 2.3.1. 表格拆分成三部分实现。分别是 `left` `center` `right`
![在这里插入图片描述](https://img-blog.csdnimg.cn/f4203675e18a464ca84f3b9bf01142fd.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5ZOI6YeM55qu54m555eS,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

##### 2.3.2. `left` 部分实现
1. `<el-table-column>` 多层嵌套，达到以下效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/1f6c341248754503b2a75edc03385d7f.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5ZOI6YeM55qu54m555eS,size_11,color_FFFFFF,t_70,g_se,x_16#pic_center)

2. `header-cell-style` 回调中，第一行，第一列设置 `rowspan='3'`
3. `header-cell-style` 回调中，隐藏第一列的第二行和第三行（不影响 `center` 部分展示）。


##### 2.3.3. `center` 部分实现
1. `<el-table-column>` 多层嵌套，达到以下效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/bafbbf12b44e4498ab249841c3b2b551.png#pic_center)
2. 堆叠其余部分。


##### 2.3.4. `right` 部分实现和 `left` 部分相似。


#### 2.4 elementUI 复杂表格，固定列
> 当 <el-table-column> 设置 fixed 时，表格会在原表格的基础上再新增一个图层
> 图层属性大部分和原表格的相同，动态设置 rowspan  部分需要再新图层添加

具体实现方式
1. `<el-table-column>` 中设置 `fixed` 为 `true\left\right` 。并且设置 `width`
2. 子组件 `<el-table-column>` 内部同样设置 `fixed` 和 `width`
3. 如果父组件 `<el-table-column>` 有多列，则子 `<el-table-column>` width 之和为父组件的 `width`


#### 2.5 elementUI 复杂表格，`center` 部分动态列
> 实现相对比较简单。只要知道有多少列。通过 `v-for` 加载多个 `<el-table-column>` 即即可。


### 3. 参考资料
3. [elementUI 多级表头](https://element.eleme.cn/#/zh-CN/component/table)
1. [elementUI table 表头合并](https://blog.csdn.net/dashenanc/article/details/108055609)
2. [Element-ui table多级表头 fixed固定](https://blog.csdn.net/qq_42785284/article/details/116742396)

