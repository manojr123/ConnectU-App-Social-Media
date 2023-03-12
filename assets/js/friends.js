{
    let display_friend_requests = function () {
        let friendReqLink = $('#friend-requests-link');
        
        console.log('friendReqLink :', friendReqLink);

        friendReqLink.click (function(e) {
            e.preventDefault();
            $('#feed-posts').remove();

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
                    let friend_requests_panel = $(` 
                                                    <section id="friend-requests-panel">
                                                    <br><br><br>
                                                        <h4> All Friend Requests </h4>
                                                        <div id="friend-requests" >
                                                        </div>
                                                    </section>
                                                    `);

                    $('#center-panel').append(friend_requests_panel);

                    let friend_requests_container = $('#friend-requests');
                    
                    if (data.data.friend_requests.length == 0 ) {
                        $(friend_requests_container).html("There are currently no friend requests !");
                        return;
                    }

                    for ( friend_req of data.data.friend_requests) {
                        // Add a friend request to DOM
                        let friendReq = addFriendRequestToDom(friend_req)
                        console.log('friendReq',friendReq);
                        // Append to the div #friend-requests container
                        $('#friend-requests').append(friendReq);

                        addConfirmLink(`#friend-request-${friend_req._id} .friend-request-confirm`, friend_req._id );
                        addDeleteLink(`#friend-request-${friend_req._id} .friend-request-delete`, friend_req._id );

                    }

                    for ( u of data.data.friend_requests) {
                        console.log('ids', u._id);
                    }


                }, error : function (error) {
                    console.log('AJAX error' + error.responseText);

                }




            });
        });
    }

const addFriendRequestToDom = function (friend) {
    console.log('addFriendRequestToDom:friend', friend);

    return $(`
                <div class="friend-request" id ="friend-request-${friend._id}">
                    <img src ="avatar" height="125px" width = "100px">
                    <a href="/users/profile/<%= u.id %>">${friend.name} </a>
                    <button class ="friend-request-confirm"> Confirm</button>
                    <button class ="friend-request-delete"> Delete</button>
                </div>  
    
    `);

}




const addConfirmLink = function (button, friendId) {
    console.log('addConfirmLink ');
    console.log('addConfirmLink button',button);
    console.log('addConfirmLink friendId',friendId);
    console.log('$button',$(button));
    $(button).click ( function (e) { 
        console.log('Friend : confirm clicked');
        //let URL = "/friends/requests/" + "?id=" + friendId + "&action=confirm";
        //let URL = "/friends/requests/" +  friendId + "/confirm";
        let URL = "/friends/accept/" +  friendId;
        console.log('URL', URL);
        let mydata = {id : friendId, action :"confirm" };

        $.ajax({
            type : 'get',
            url : URL,
            dataType: "json",
            success : function (data) {
                console.log(data);
                //$(`#post-${data.data.post_id}`).remove();
            }, error : function ( error) {
                console.log('AJAX error',error.responseText);
            }
        })




    })

}
const addDeleteLink = function (button, friendId) {
    console.log('addDeleteLink ');
    console.log('addDeleteLink button',button);
    console.log('addDeleteLink friendId',friendId);
    console.log('$button',$(button));
    $(button).click ( function (e) { 
        console.log('Friend : delete clicked');




    })

}

    display_friend_requests();
}