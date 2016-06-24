; (function ($) {
    $.fn.extend({
        //placeholder
        placeholder: function () {
            return this.each(function () {
                if (!('placeholder' in document.createElement('input'))) {
                    var input = $(this),
                        parent = input.parent(),
                        text = input.attr('placeholder'),
                        height = input.outerHeight(),
                        width = input.outerWidth(),
                        placeholder = $('<span class="phTips">' + text + '</span>');

                    if (text) {
                        if (parent.css("position") != "absolute") {
                            parent.css({ "position": "relative" });
                        }
                        var tipsPosition = input.offset(),
                            parentPosition = parent.offset();
                        var diffPosition = {
                            left: tipsPosition.left - parentPosition.left,
                            top: tipsPosition.top - parentPosition.top
                        }

                        placeholder.css({
                            'margin-left': '8px',
                            'width': width,
                            'height': height,
                            'line-height': height + "px",
                            'text-align': "left",
                            'position': 'absolute',
                            'color': "#cecfc9",
                            'font-size': "12px",
                            "left": diffPosition.left,
                            "top": diffPosition.top
                        });
                        console.log(diffPosition);
                        placeholder.click(function () {
                            input.focus();
                        });
                        if (input.val() != "") {
                            placeholder.css({ display: 'none' });
                        } else {
                            placeholder.css({ display: 'inline' });
                        }
                        placeholder.insertAfter(input);
                        input.on("keyup blur", function () {
                            if ($(this).val() != "") {
                                placeholder.css({ display: 'none' });
                            } else {
                                placeholder.css({ display: 'inline' });
                            }
                        });
                    }
                }
            })
        }

    })
})(jQuery);

//获取url参数
function getUrlParam(name) {
    var _cpath = window.location.href;
    var _css = _cpath.indexOf('?');
    var url = "";
    if (_css > -1) { url = _cpath.substring(_css + 1); }
    var _jw = url.lastIndexOf('#');
    if (_jw > -1) { url = url.substring(0, _jw); }

    var sUrl = "?" + url;
    if (sUrl.indexOf(name) > -1) {
        var sReg = "(?:\\?|&){1}" + name + "=([^&]*)"
        var re = new RegExp(sReg, "gi");
        re.exec(sUrl);
        return RegExp.$1;
    }
    return "";
}

//选项卡切换
var tabChange = function (options) {
    var self = this, opts = [];
    this.init = function () {
        opts = {
            box: options.box,
            tab: options.tab,
            con: options.con,
            current: options.current,
            mouseEvent: options.mouseEvent == undefined ? "click" : options.mouseEvent.toLowerCase()
        }
        opts.tab.on(opts.mouseEvent, function () {
            var that = this;
            function extendFun() {
                self.changeCon(that)
            }
            if (opts.mouseEvent !== "click") {
                var timeDelay = setTimeout(extendFun, 200);
                $(that).mouseleave(function () { clearTimeout(timeDelay) })
            } else {
                extendFun()
            }
        })
    }
    this.changeCon = function (obj) {
        var index = opts.tab.index($(obj));
        opts.tab.removeClass(opts.current)
        $(obj).addClass(opts.current);
        opts.con.hide().eq(index).show();
    }
    this.init();
}

//按钮选中
var btnFocus = function (options) {
    var opts = [];
    this.init = function () {
        opts = {
            btn: options.btn,
            current: options.current,
            multiple: options.multiple || false
        }
        opts.btn.click(function () {
            if (opts.multiple) {
                $(this).toggleClass(opts.current);
            } else {
                opts.btn.removeClass(opts.current);
                $(this).addClass(opts.current);
            }
        })
    }
    this.init();
}

$(function () {
    $(":input[placeholder]").placeholder();
});