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



$(function () {
    const
            messageArea = $('#messages'),
            messageBox = $('#message'),
            user = messageBox.attr('user'),
            socket = io.connect(),
            userId = messageBox.attr("userId"),
            chatId = messageBox.attr("chatId")
    ;

    TextAreaResize(messageBox);

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
       if(data.userId!=userId){
           $('.status').text(data.typing?'Yazır...':'Online');
       }
    });
    socket.on('newMessage',data => {
        let newMessage = `
		        <div class="message ${data.userId==userId?'right':'left'}">
		            ${data.message}
		        </div>
	        `;
        messageArea.append(newMessage);
        messageArea.animate({
            scrollTop:messageArea[0].scrollHeight
        },1000)
    });
});