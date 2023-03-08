{
    let display_friend_requests = function () {
        let friendReqLink = $('#friend-requests');
        console.log('friendReqLink :', friendReqLink);

        friendReqLink.click (function(e) {
            //e.preventDefault();
            console.log('Preventing default : display_friend_requests');
            $.ajax ({
                type: 'get',
                url : '/friends/requests',                
                // data : newPostForm.serialize(), // converts form data into JSON                
                data : {},
                success : function(data) {
                    console.log('Success : received friend requests !')
                    console.log('Data', data);
                    console.log('data.data.friend_requests', data.data.friend_requests);
                    let friend_requests_panel = $('#friend-requests-panel');
                    
                    for ( u of data.data.friend_requests) {
                        console.log('ids', u._id);
                    }


                }, error : function (error) {
                    console.log('AJAX error' + error.responseText);

                }




            });
        });
    }


    display_friend_requests();
}