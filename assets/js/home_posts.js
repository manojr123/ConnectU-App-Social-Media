{

    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        console.log('newPostForm',newPostForm.serialize());
        newPostForm.submit(function(e) {
            e.preventDefault();
            console.log('Preventing default');
            //data = new FormData(newPostForm);
            let newPostForm = $('#new-post-form');
            console.log('newPostForm',newPostForm.serialize());
    
            $.ajax ({
                type: 'post',
                url : '/posts/create',
                contentType: 'multipart/form-data',   
                processData: false,
                contentType: false,                
                // data : newPostForm.serialize(), // converts form data into JSON                
                data : new FormData(this),
                success : function(data) {
                    //  console.log('data.data.post', data.data.post);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);
                    //deletePost($(' .delete-post-button', newPost));
                    //deletePost($('.delete-post-button'));
                    console.log("newPost", newPost);
                    console.log(`li#post-${data.data.post._id}  .delete-post-button`);

                    console.log('li#post-'+data.data.post._id + '  .delete-post-button');
                    deletePost($('li#post-'+data.data.post._id + ' .delete-post-button'));    
                    //$('li#post-'+data.data.post._id + '  .delete-post-button').text("new text");
                    console.log('$ is : ', $('li#post-'+data.data.post._id + '  .delete-post-button') );

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();



                }, error : function (error) {
                    console.log('AJAX error' + error.responseText);

                }
            })


        })
    }
    // ${post.image} == undefined : ? <img src="${post.image}" height="250px" width="400px"  >

    // method to create a post in DOM
    let newPostDom = function (post) {
        // CHANGE :: show the count of zero likes on this post

        console.log('post' , post.content);
        console.log('post' , post.image);


        return $(`<li id ="post-${post._id}"> 
                <div class="postBody">

                    <div class="user-delete">                        
                       <strong class="user"> ${post.user.name} </strong>                     
                       <strong>
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                            </a>                            
                       </strong>

                        <span>                        
                        <a class="delete-post-button" href="/posts/destroy/<%= post.id %>" ><i class="fa-solid fa-trash-can"></i></a>
                        </span>
                    </div>

                    <div>
                        <span class="content">  <b>${post.content} </b> </span><br>
                    </div>

                    <div>
                        <img src="${post.image}" height="250px" width="400px">
                        <br>
                    </div>

                    
                    <div class="post-comments" >
                        <form id="post-${post._id}-comments-form"  action="/comments/create" method="POST"> 
                            <input type="text" name="content" placeholder ="Type here to add comment..." required>
                            <input type="hidden" name="post" value="${post._id}" >
                            <input type="submit" value="Add Comment"><br>
                        </form> 
                            
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}" >
                            </ul>
                        </div>
            
                    </div>
                  </div>
                </li>
    `)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink) {
        console.log('deleteLink :', deleteLink);
        $(deleteLink).click(function(e){
            console.log('deleteLink in click function:', deleteLink);

            console.log('Delete Post');
            e.preventDefault();
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function (data) {
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                }, error : function ( error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    createPost();
}
