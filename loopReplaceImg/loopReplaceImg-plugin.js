(function () {
   /**
    * 构造参数对象，配置对象
    * @param {object} options 
    * @param {Element} wrap 父级包裹DOM
    */
    function LoopReplaceImg (options, wrap) {
        // 传入参数对象，防止报错
        this.list = options.list || [];  // 轮播图的内容
        this.type = options.type || 'fade';  // 动画类型
        this.isAuto = options.type == undefined ? true : options.isAuto;  // 是否自动轮播
        this.showChangeBtn = options.showChangeBtn == undefined ? true : options.showChangeBtn;  // 显示左右轮换按钮
        this.showSpotBtn = options.showSpotBtn == undefined ? true : options.showSpotBtn;  // 显示小圆点
        this.time = options.time || 3000;  // 轮换时间
        this.width = options.width || $(wrap).width();  // 指定宽度
        this.height = options.height || $(wrap).height();  // 指定高度
        this.direction = options.direction || 'right';  // 默认轮换方向
        this.transition = options.transition || 400;  // 动画过渡时间

        // 基本配置
        this.num = this.list.length;  // 传入图片或容器的长度
        this.wrap = wrap || $('body');
        this.index = 0;
        this.timer = null;  // 定时器
        this.lock = true;  // 加锁，防止动画延迟

        // 初始化，调用函数集
        this.init = () => {
            this.createElement();  // 创建dom结构
            this.initStyle();  // 渲染样式
            this.bindEvent();  // 添加事件
            this.autoChange();  // 自动轮播
        }
    }

    // 添加Dom结构
    LoopReplaceImg.prototype.createElement = function () {
        let oLoopReplaceImg = $("<div class='loop-replace-img'></div>"),
            oImgsWrap = $("<ul class='imgs-wrapper'></ul>"),
            oSpot = $("<ul class='spot'></ul>"),
            oBtn = $("<div class='btn btn-left'>&lt;</div><div class='btn btn-right'>&gt;</div>");
        for (let i = 0; i < this.num; i ++) {
            oImgsWrap.append($("<li></li>"));
            oSpot.append($("<li></li>"));
        }
        this.list.detach();
        oLoopReplaceImg.append(oImgsWrap)
                       .append(oSpot)
                       .append(oBtn)
                       .appendTo(this.wrap);
        for (let i = 0; i < this.num; i++) {
            $('.loop-replace-img .imgs-wrapper li', this.wrap).eq(i).append(this.list[i]);
        }
        if (this.type === 'animate') {
            $('.loop-replace-img .imgs-wrapper li', this.wrap).eq(0).clone(true)
                                                              .appendTo(oImgsWrap);
        }
    }

    // 渲染样式
    LoopReplaceImg.prototype.initStyle = function () {
        $('.loop-replace-img', this.wrap).css({width: this.width, height: this.height});
        if (this.type === 'animate') {
            $('.loop-replace-img .imgs-wrapper', this.wrap).css({width: this.width * (this.num + 1), position: 'absolute'})
                                                           .find('li').css({float: 'left', width: this.width, height: this.height});
            $('.loop-replace-img .spot li', this.wrap).eq(this.index).addClass('active');
        } else {
            $('.loop-replace-img .imgs-wrapper li', this.wrap).css({width: this.width, height: this.height, position: 'absolute'}).hide()
                                                              .eq(this.index).show();
            $('.loop-replace-img .spot li', this.wrap).eq(this.index).addClass('active');
        }
        if (this.showChangeBtn == false) {
            $('.loop-replace-img .btn', this.wrap).hide();
        }
        if (this.showSpotBtn == false) {
            $('.loop-replace-img .spot', this.wrap).hide();
        }
    }

    // 事件
    LoopReplaceImg.prototype.bindEvent = function () {
        let self = this;
        $('.loop-replace-img .btn-right', this.wrap).on('click', () => {
            this.bindEventRight();
        });
        $('.loop-replace-img .btn-left', this.wrap).on('click', () => {
            this.bindEventLeft();
        });
        $('.loop-replace-img .spot', this.wrap).on('click', function (e) {
            self.index = $(e.target).index();
            self.change();
        });
        $('.loop-replace-img .btn, .loop-replace-img .spot', this.wrap).on('mousemove', () => {
            clearInterval(this.timer);
        }).on('mouseout', () => {
            self.timer = setInterval(() => {
                if (this.direction === 'left') {
                    this.bindEventLeft();
                }else {
                    this.bindEventRight();
                }
            }, this.time)
        })
    }
    LoopReplaceImg.prototype.bindEventRight = function () {
        this.index ++;
        if (this.type === 'fade') {
            this.index === this.num  && (this.index = 0);
        }else if (this.type === 'animate' && this.index == this.num + 1){
            $('.loop-replace-img .imgs-wrapper', this.wrap).css({left:0})
            this.index = 1;
        }
        this.change();
    }
    LoopReplaceImg.prototype.bindEventLeft = function () {
        if (this.type === 'fade') {
            this.index === 0 && (this.index = this.num);
        }else if (this.type === 'animate' && this.index == 0) {
            $('.loop-replace-img .imgs-wrapper', this.wrap).css({left: -this.width * this.num})
            this.index = this.num;
        }
        this.index --;
        this.change();
    }

    // 样式变更
    LoopReplaceImg.prototype.change = function () {
        if (this.type === 'animate') {
            if (this.lock == false) {
                return false;
            }
            this.lock = false;
            $('.loop-replace-img .imgs-wrapper', this.wrap).animate({left: -this.width * this.index}, this.transition, () => this.lock = true);  // 设置动画
        } else {
            $('.loop-replace-img .imgs-wrapper li', this.wrap).fadeOut(this.transition).eq(this.index).fadeIn(this.transition);
        }
        $('.loop-replace-img .spot li', this.wrap).removeClass('active').eq(this.index % this.num).addClass('active');  // 小圆点
    }
    
    // 自动轮播
    LoopReplaceImg.prototype.autoChange = function () {
        if (this.isAuto == false) {
            return false;
        }
        this.timer = setInterval(() => {
            if (this.direction === 'left') {
                this.bindEventLeft();
            }else {
                this.bindEventRight();
            }
        }, this.time);
    }

    $.fn.extend({
        loopReplaceImgPlugin (options) {
            let obj = new LoopReplaceImg(options, this);
            obj.init();
        }
    });
}())