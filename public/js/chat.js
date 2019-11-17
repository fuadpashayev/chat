$(function () {
    const
            messageArea = $('#messages'),
            messageBox = $('#message'),
            user = messageBox.attr('user'),
            socket = io.connect()
    ;

    $(document).on('click','#send',function(){
        let message = messageBox.val();
        socket.emit('send message',{user,message});
        messageBox.val('')
    });

    $(document).on('keydown',function (e) {
        if(!e.shiftKey && e.keyCode===13){
            e.preventDefault();
            $('#send').click();
        }
    });

    socket.on('new message',data => {
        let newMessage = `
		        <div class="message right">
		            <strong>${data.user}:</strong> ${data.message}
		        </div>
	        `;
        console.log(data);

        messageArea.append(newMessage);

        $('#messages').animate({
            scrollTop:$('#messages')[0].scrollHeight
        },1000)
    });
});