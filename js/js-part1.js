var currstateText = true;
function manageViewText(comm) {

    var tags = $('#resTable th:nth-child(1), #resTable td:nth-child(1), #resTable th:nth-child(2), #resTable td:nth-child(2)');
    if (comm) {
        currstateText = !currstateText;
    }
    if (currstateText) {
        tags.show();
    }
    else tags.hide();
}


$(function () {

    //setInterval(gettextformat, 500);

    //$('div.displaytext')[0].contentEditable = true;

    $('#displaytextcontainer').width($('.inputdata.inputtext').parent().width());

    $('#getcoding').click(
          getResult
        );
    $('#showonlytext').on('click', function (e) {
        e.preventDefault();
        manageViewText(true);

        e.stopPropagation();
    });
    $(".bottommenu input[type='radio']").change(
      function () {
          $('.inputdata.inputfile, #displaytextcontainer').hide();
          if (this.id == 'textinputradio') { $('#displaytextcontainer').show(); type = 1; }
          if (this.id == 'fileinputradio') { $('.inputdata.inputfile').show(); type = 2; }
      });


    $('body').on('click', '.managebutton', function () {
        $('.managebutton').removeClass('activemanage');
        $(this).addClass('activemanage');
        var context = $(this).attr('data-context')
        switch (context) {
            case 'good':
                dataoption = 1;
                break;
            case 'all':
                dataoption = 0;
                break;
        }
        getResult();

    });

    $('#resTable').on('click', 'tr', function () {
        $(this).children('td').css('overflow', 'auto').css('white-space', 'normal');

        textAreaAdjust($(this).find('.textresult')[0]);
    });


    $('#resTable').on('click', '.opercont', function (e) {

        e.stopPropagation();
        return false;
    });


    $('#resTable').on('click', '.toggle_textRes', function (e) {
        toggle_textRes(e.target);
        e.stopPropagation();
        return false;
    });

    $('#resTable').on('click', '.load_textRes', function (e) {

        var params = '';
        params = '?';
        params += 'option=' + dataoption;
        var coding = $($(this).parent().parent().parent().find('.encelem.dest')[0]).text();
        var srccoding = $($(this).parent().parent().parent().find('.encelem.src')[0]).text();
        var srcf = ($('#destCode').find('option:contains("' + srccoding + '")').val());
        var destf = ($('#destCode').find('option:contains("' + coding + '")').val());

        if (destf) params += '&' + 'destEncoding=' + destf;
        else return;
        params += '&fileres=1';
        var files = document.getElementById('uploadfile').files;
           
        {
            if (type==1 || window.FormData !== undefined) {

                if (type == 2) {
                    data = new FormData();
                    for (var x = 0; x < files.length; x++) {
                        if (files[x].size > 512000) {
                            alert('File can not be appload: Max file length is 500 Kbytes');
                            return;
                        }
                        data.append("file" + x, files[x]);
                    }
                }
                else {
                    data = { 'option': '1', 'srcEncoding': srcf, 'destEncoding': destf, 'text': text };
                }
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {


                        //  var bb = new BlobBuilder([this.response], { type: 'application/txt' });
                        // bb.append(); // Note: not xhr.responseText
                        //window.URL.createObjectURL(this.response);
                        //fileReader = new FileReader();
                        //fileReader.readAsDataURL(bb);

                        var blob = new Blob([this.response], { type: "text/plain;charset=utf-8" });

                        var filename = type==2? files[0].name: 'text.txt';

                        saveAs(blob, coding + "-UTF8" +filename);

                    }
                }
                if (type == 2)
                    xhr.open("POST", '@Url.Action("uploadtextfile", "text")' + params, true);
                if (type == 1)
                {
                    params += '&' + 'srcEncoding=' + srcf;
                      
                    xhr.open("POST", '/gettextdecoderdata' + params, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.setRequestHeader('X-Requested-With','XMLHttpRequest')
                xhr.responseType = 'blob';
                if (type == 1) {
                    xhr.send(JSON.stringify(data));
                } else { xhr.send(data); }
                e.stopPropagation();
                return false;
            }
        }
    });

    $('#resTable').on('post-body.bs.table', function (e) {
        manageViewText();
        return false;
    });


    $('body').on('click', '.encelem', function () {

        var elem = $(this);
        if (elem.hasClass('src')) {
            $('#srcCode').val($('#srcCode').find('option:contains("' + elem.text() + '")').val());
        }
        if (elem.hasClass('dest')) {

            $('#destCode').val($('#destCode').find('option:contains("' + elem.text() + '")').val());

        }
    })
});
