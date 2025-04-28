

# sortablejs + antd-menu 拖拽出重复 menu
> 导致这个现象的原因：sortablejs 直接操作的 dom 元素，绑定值需要手动更新
> menu 的绑定值触发组件重复渲染



## 组件中使用
```ts

const bdataMenu = ref([]);

const initMenuDrop = () => {
    sortableIns.value = Sortable.create(
        groupMenuRef.value?.querySelector('.ant-menu'),
        {
            handle: '.menu-item',
            animation: 150,
            onEnd: (evt: any) => {
                if (evt) {
                    const dataArray = [...bdataMenu.value];
                    dataArray.splice(oldIndex, 1)[0];
                    dataArray.splice(newIndex, 0, remoItem);
                    // 先清除原数据，页面加载完后重新赋值给变量
                    bdataMenu.value = [];
                    nextTick(() => {
                        bdataMenu.value = dataArray;
                    });
                }
            },
        },
    );
};

onMounted(() => {
    initMenuDrop();
});
```

## 解决方案
> 在 Sortable 回调中，先清除原数据，页面加载完后重新赋值给变量
