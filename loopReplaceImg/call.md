- 参数配置：
```
    $('.wrapper').loopReplaceImgPlugin({
        list: $('.item'), // 必传参数
        type: 'fade', // 动画类型，默认淡入淡出
        isAuto: true,  // 是否自动轮播
        showChangeBtn: true,  // 显示左右轮换按钮
        showSpotBtn: true,  // 显示小圆点
        time: 3000,  // 轮换时间
        width: 500,  // 指定宽度
        height: 400,  // 指定高度
        direction: 'right',  // 默认轮换方向
        transition: 400  // 动画过渡时间
    });
```