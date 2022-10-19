#### jq 文件上传
> - 文件上传使用 "multipart/form-data" 格式参数
> - 文件二进制流存放在 formData 实例中作为参数提交


``` javascript
var fileCard = $('.file_img input')[2];
fileCard.onchange = function() {
  var f = this.files[0];
  var fileMaxsize = 1024*1024*4;
  if(f.size > fileMaxsize){
    $.toast('身份证照片不可大于4M','text');
    return false;
  }

  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };

  let formData = new FormData();
  formData.append("file", f);
  $.ajax({
    method: 'POST',
    url: '/upload/ajax_uploadfile',
    data: formData,
    contentType: false,
    processData: false,
    success: function(res) {

      // 文件上传成功后回显
      console.log(res)
      $('.card_img').attr('src',res.filepath).css({'z-index':9,'width':'2rem','height':'2rem'})
      $('input[name="card_img"]').val(res.filepath)
    }
  })
}
```

