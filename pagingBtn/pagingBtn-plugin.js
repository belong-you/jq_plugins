(function () {
    function PagingBtn (options) {
        this.dom = options.dom || '';
        this.nowPage = options.nowPage || 1;
        this.allPage = options.allPage || 10;
        this.showPage = options.showPage || 3;
        this.changePage = options.changePage || function () {}

        this.wrap = '';

        this.init = function () {
            this.fillHTML();
            this.bindEvent();
        }
    }
    // 渲染数组
    PagingBtn.prototype.renderArr = function () {
        let _now = this.nowPage, _all = this.allPage, _show = this.showPage, _arr = [];
        let _numArr = new Array(_all);
        let _showArr = new Array(_show);
        if(_show == _all - 2 || _all < 5){
            for (let i = 0; i < _numArr.length; i++) {
                _numArr[i] = i + 1;
            }
            _arr.unshift(_numArr);
        } else if (_show > _all - 2 || _now > _all) {
            console.warn('传入参数：nowPage 或 showPage 必须小于 allPage - 2');
            return false;
        } else if (_show < 3) {
            console.warn('大哥，_show 最小值为 3 ');
            return false;
        } else {
            // 逻辑很强，嫑瞎猜
            _arr = [1, '...', _all];
            if (_now >= _all - Math.ceil(_show / 2)) {
                for(let j = 0; j < _show; j++) {
                    _showArr[j] = j + (_all - _show);
                }
                _arr.splice(2, 0, _showArr);
            }else if (_now < _show) {
                for(let j = 0; j < _show; j++) {
                    _showArr[j] = j + 2;
                }
                _arr.splice(1, 0, _showArr)
            }else if (_now >= _show && _now < _all - Math.ceil(_show / 2)) {
                if(_now <= 4){
                    for(let j = 0; j < _show; j++) {
                        _showArr[j] = j + _now - Math.floor(_show / 2);
                    }
                    if(_showArr[0] > 2) {
                        _arr = [1, '...', '...', _all];
                        _arr.splice(2, 0, _showArr);
                    } else {
                        _arr.splice(1, 0, _showArr);
                    }
                }else {
                    _arr = [1, '...', '...', _all];
                    for(let j = 0; j < _show; j++) {
                        _showArr[j] = j + _now - Math.floor(_show / 2);
                    }
                    _arr.splice(2, 0, _showArr);
                }
            }
        }
        return _arr;
    }

    // 渲染dom结构
    PagingBtn.prototype.fillHTML = function () {
        this.dom.innerHTML = '';
        let arr = this.renderArr();
        // 数组降维
        let newArr = Array.prototype.concat.apply([], arr);

        let flag = document.createDocumentFragment();
        let btnLeft = '<span class="previous">上一页</sapn>';
        let btnRight = '<span class="next">下一页</sapn>';

        this.wrap = document.createElement('div');
        this.wrap.className = 'pageing-btn-plugin';

        this.wrap.innerHTML = btnLeft;
        let str = ``;
        for (let i = 0; i < newArr.length; i++) {
            str = `<span>${newArr[i]}</span>`;
            if(newArr[i] == '...') {
                str = `<em>${newArr[i]}</em>`;
            }
            if(newArr[i] == this.nowPage) {
                str = `<span class='active'>${newArr[i]}</span>`
            }
            this.wrap.innerHTML += str;
        }
        this.wrap.innerHTML += btnRight;

        flag.appendChild(this.wrap);
        this.dom.appendChild(flag);

    }

    // 点击事件
    PagingBtn.prototype.bindEvent = function () {
        let self = this;
        this.wrap.onclick = function (e) {
            let target = e.target;
            if(target.className == 'pageing-btn-plugin' || target.innerText == '...'){
                return false;
            }
            if (target.className == 'previous') {
                self.nowPage --;
                if(self.nowPage < 1){
                    self.nowPage = 1;
                }
                self.init();
                self.changePage(self.nowPage);
            }else if(target.className == 'next') {
                self.nowPage ++;
                if(self.nowPage > self.allPage){
                    self.nowPage = self.allPage;
                }
                self.init();
                self.changePage(self.nowPage);
            }else{
                let num = Number(target.innerText);
                self.nowPage = num;
                self.init();
                self.changePage(self.nowPage);
            }
            // console.log(self.nowPage)

        }
    }

    function pagingBtn (options) {
        let obj = new PagingBtn(options);
        obj.init();
    }
    window.pagingBtn = pagingBtn;
}())