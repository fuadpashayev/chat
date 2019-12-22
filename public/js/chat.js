function TextAreaResize(id) {
    var o = $(id);
    o.css("overflow-y", "hidden");

    function ResizeTextArea() {
        let scrollHeight = o[0].scrollHeight-3;
        let diffForMessageBoxArea = scrollHeight>=125?125:scrollHeight;
        diffForMessageBoxArea = (diffForMessageBoxArea-40)+95;
        o.css('height',scrollHeight);
        $('#messages').css('height',`calc(100vh - ${diffForMessageBoxArea}px)`);
    }

    o.on('change', function (e) {
        ResizeTextArea();
    });

    o.on('cut paste drop keydown', function (e) {
        window.setTimeout(ResizeTextArea, 0);
    });

    o.focus();
    o.select();
    ResizeTextArea();
}

function resetTextBox(){
    $('#message').css('height',`40px`).val('');
    $('#messages').css('height',`calc(100vh - 95px)`);
}


function scrollToBottom(messageArea,speed=700){
    messageArea.animate({
        scrollTop:messageArea[0].scrollHeight
    },speed)
}
var alert,windowFocused=true;
function messageAlertTitle(type='start'){
    let num = 1;
    if(type==='start'){
        alert = setInterval(function() {
            let message = num%2===0?"FX Social Network":"Yeni mesajınız var!!!";
            document.title = message;
            num++;
            if(windowFocused){
                clearInterval(alert);
                document.title = "FX Social Network";
            }
        }, 1500);
    }else if(type==='stop') clearInterval(alert);
}


$(window).on('focus blur',function(e){
    windowFocused = e.type==='focus';
});

function checkReadStatus(){
    $('.read-status').each(function(){
       let status = $(this).attr('inf');
       let $this = $(this);
       if(status==='sending'){
           setTimeout(function(){
               $this.attr('anime','');
               $this.attr('inf','sent');
               setTimeout(function(){$this.removeAttr('anime');},600);
               setTimeout(function(){
                   $this.attr('anime','');
                   $this.attr('inf','delivered');
                   setTimeout(function(){$this.removeAttr('anime');},600);
                   setTimeout(function(){
                       $this.attr('anime','');
                       $this.attr('inf','read');
                       setTimeout(function(){$this.removeAttr('anime');},600);
                   },750);
               },750);
           },750);
       }
    });
}



$(function () {
    const
            messageArea = $('#messages'),
            messageBox = $('#message'),
            user = messageBox.attr('user'),
            socket = io.connect(),
            userId = messageBox.attr("userId"),
            chatId = messageBox.attr("chatId"),
            alert = new Audio('/public/storage/audios/alert.mp3')
    ;

    TextAreaResize(messageBox);
    scrollToBottom(messageArea,0);

    $(document).on('click','#send',function(){
        let message = messageBox.val().trim();
        if(message.length){
            socket.emit('sendMessage',{message,chatId,userId});
            socket.emit('sendTyping',{chatId,userId,typing:false})
            resetTextBox();
        }
    });

    $(document).on('keydown',function (e) {
        if(!e.shiftKey && e.keyCode===13){
            e.preventDefault();
            $('#send').click();
        }
    });

    messageBox.on('input',function(){
        let typing = messageBox.val().trim().length > 0;
        socket.emit('sendTyping',{chatId,userId,typing})
    })

    socket.on('getTyping',data => {
       if(data.userId!==userId){
           $('.status').text(data.typing?'Yazır...':'Xətdə');
       }
    });

    socket.on('newMessage',data => {
        let lastMessageLeftOrRight = $('#messages .message:last-child').hasClass('left')?'left':'right';
        let newMessageLeftOrRight = data.userId==userId?'right':'left';
        let newMessage = `
            <div class="message ${newMessageLeftOrRight}" ${lastMessageLeftOrRight!==newMessageLeftOrRight?'arrowed':''}>
                ${data.message}
                <div class="message-info">
                    <div class="date">16:54</div>
                    ${newMessageLeftOrRight==='right'?`
                        <div class="read-status" inf="sending"></div>
                    `:''}
                </div>
            </div>
        `;
        if(newMessageLeftOrRight==='left'){
            alert.pause();
            alert.currentTime = 0.0;
            alert.play();
            messageAlertTitle();
        }
        messageArea.append(newMessage);
        scrollToBottom(messageArea);
        checkReadStatus();
    });


});