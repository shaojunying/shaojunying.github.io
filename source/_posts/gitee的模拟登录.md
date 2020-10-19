---
title: gitee的模拟登录
date: 2020-10-07 16:29:16
tags:
- 爬虫
---

看了[自动部署Gitee Pages脚本](https://github.com/yanglbme/gitee-pages-action),分析并模拟Gitee Pages登录


<!-- more -->

## 分析POST请求

```
encrypt_key: password
utf8: ✓
authenticity_token: jyna10uRx6nksFsKrOXOGlTaH1en+FjlrfBunGv6j5M=
redirect_to_url: 
user[login]: shaojunying
encrypt_data[user[password]]: Yb5KLQgGxbEM8M3kVn00yVuNJwjQ4vWjYjPbJj1O9wh5au1cXd1eVb+WJkOfWfio4q/2t7mOVCpH70cv5NtrNPw5ZW4lkj/JJOt3L9w6P4RU3tQpB4fqofP/j5BhU1C4FJLpylSENdMj2Lf5S5PUTA18QF1ykrpaqgKqrejZtRE=
user[remember_me]: 0
```

上面是login的post请求中的form-data,分析可知`user[login]`表示的是用户名,而`encrypt_data[user[password]]`是加密之后的密码,需要在之前的页面中找encrypt_data.

在network中全局搜索encrypt_data,发现请求`https://assets.gitee.com/assets/encrypt-b4407d80fc0fd4eb67c8709f21684588.js`包含encrypt_data关键字,下面是定位到的代码段,在注释中对代码进行分析.

```js
$(function() {
    if (window.gon && window.gon.encrypt && window.gon.encrypt.enabled) {
        var t = new window.JSEncrypt
          , e = window.gon.encrypt.separator
          , i = window.gon.encrypt.password_key
          , r = $("meta[name=csrf-token]")[0].content
          , n = '<input type="hidden" name="encrypt_key">'
          , s = '<input type="hidden" name="encrypt_data[$name]">';
        // 遍历每一个设置了属性 data-encrypt="true"的form,对其中的password加密
        $("form[data-encrypt=true]").each(function() {
            var o = $(this)
              , h = $(n)
              , a = o.data("key");
            switch (a) {
            case "password":
                // i是public_key,通过查询可知定义在get https://gitee.com/login请求中
                t.setPublicKey(i),
                // h是一个新的隐式input,之后内容是<input type="hidden" name="encrypt_key" value="password">
                h.val(a);
                break;
            default:
                return
            }
            o.prepend(h),
            $("[data-encrypt=true]", o).each(function() {
                // 加密表单中需要加密的项

                // 表单项对应的元素,一般为input
                var i = $(this)
                    // 表单项的名字
                  , n = i.attr("name")
                  // 为加密后的元素创建一个表单项(之后提交时将作为请求参数)
                  // <input type="hidden" name="encrypt_data[user[password]]" value="*****">
                  , o = $(s.replace("$name", n));
                i.before(o),
                // 监听要加密的表单项,一旦发生变化就修改加密之后的元素值
                i.change(function() {
                    // r是X-CSRF-Token,get登录页面时可以得到该值
                    // e是分隔符,也是在get登录页面时获取
                    // i是用户输入的原始密码
                    // 之后将三者拼接并为加密之后的结果创建新input
                    var n = t.encrypt(r + e + i.val());
                    o.val(n),
                    i.removeAttr("name")
                })
            })
        })
    }
});
```

## 分析登录的get请求

```html
<meta content="authenticity_token" name="csrf-param" />
<!-- 就是post需要的X-CSRF-Token -->
<meta content="dBWUUHIYc94LTKTOEnAZkxvyntZgqFN5cNli2S9DLUQ=" name="csrf-token" />

<link href="https://assets.gitee.com/assets/application-f5fd3f1c2641f843a7ce17e94fa11583.css" media="all" rel="stylesheet" />
<script>
// separator,password_key都在这里面可以找到
//<![CDATA[
window.gon = {};gon.locale="zh-CN";gon.sentry_dsn=null;gon.baidu_register_hm_push=null;gon.info={"controller_path":"sessions","action_name":"new","current_user":false};gon.tour_env={"current_user":null,"action_name":"new","original_url":"http://gitee.com/login","controller_path":"sessions"};gon.yunpian_key=false;gon.encrypt={"enabled":true,"separator":"$gitee$","password_key":"-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIrn+WB2Yi4ABAL5Tq6E09tumY\nqVTFdpU01kCDUmClczJOCGZriLNMrshmN9NJxazpqizPthwS1OIK3HwRLEP9D3GL\n7gCnvN6lpIpoVwppWd65f/rK2ewv6dstN0fCmtVj4WsLUchWlgNuVTfWljiBK/Dc\nYkfslRZzCq5Fl3ooowIDAQAB\n-----END PUBLIC KEY-----\n"};
```

## Python模拟页面的登录请求

网页中使用的是JSEncrypt库,而python中使用的库是rsa.
- 通过[博客](https://www.jianshu.com/p/7a4645691c68)可知可以使用`public_key = rsa.PublicKey.load_pkcs1_openssl_pem(PUBLIC_KEY.encode())`函数设置公钥.
- 通过[博客](https://blog.csdn.net/Enderman_xiaohei/article/details/89325747)可知,可以使用
    ```python
    data = "rtU/xUiVseZhYLnpC6UncwKVba6aUQEC9II7OnLgLpQ=" + "$gitee$" + "password"
    data = rsa.encrypt(data.encode(), public_key)
    data = base64.b64encode(data).decode()
    ```
    的方法获取加密之后的字符串.其余的直接使用requests库发送相应的请求即可

## 代码
最后的代码如下所示
```python
import base64
import rsa

PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIrn+WB2Yi4ABAL5Tq6E09tumY" \
             "\nqVTFdpU01kCDUmClczJOCGZriLNMrshmN9NJxazpqizPthwS1OIK3HwRLEP9D3GL\n7gCnvN6lpIpoVwppWd65f" \
             "/rK2ewv6dstN0fCmtVj4WsLUchWlgNuVTfWljiBK/Dc\nYkfslRZzCq5Fl3ooowIDAQAB\n-----END PUBLIC KEY-----\n "
public_key = rsa.PublicKey.load_pkcs1_openssl_pem(PUBLIC_KEY.encode())
data = "rtU/xUiVseZhYLnpC6UncwKVba6aUQEC9II7OnLgLpQ=" + "$gitee$" + "ddfbhjvdbghd"
data = rsa.encrypt(data.encode(), public_key)
data = base64.b64encode(data).decode()

print(data)
```
有些变量在这里被写死了,实际需要通过get请求获取,稍加修改即可.