function fetchPosts() {
  var page = 1, finished, running, lastSorted = 'feed'

  $('.sort-btn').on('click', function() {
    // toggle active button
    $('.sort-btn').removeClass('active')
    $(this).addClass('active')

    // fetch sort order
    lastSorted = $(this).text().toLowerCase()
    finished = false

    // clear all posts before sorting
    $('#post').html('')
    getPosts(1, lastSorted)
  })

  function load(loaded) {
    $('#loader').remove()
    if(!loaded) {
      $('#posts').append(
        `
          <div id="loader" class="col-md-12 text-center">
            <br>
            <br>
            <img src="/images/loader.gif">
          </div>
        `
      )
    }
  }

  function getPosts(page = 1, sort = lastSorted) {
    if (running) {
      return
    }
    // load()
  
    if(finished) {
      return load(true)
    }
  
    var method = (page == 1) ? 'prepend' : 'append'
    running = true
  
    $.ajax(`/api/v1/posts?page=${page}&sort=${sort}`).done(function(posts) {
      running = false
      console.log(posts.length)
      posts.reverse()
  
      if(posts.length == 0 && page == 1) {
        finished = true
        $('#posts').append(
          `
          <div class="alert alert-dismissible alert-success">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Well done!</strong> You are all up to date!
          </div>
          `
        )
      } else if (post.length == 0 && page > 1) {
        load(true)
        return $(window).off('scroll')
      }
  
      posts.forEach((post) => {
        $('#post')[method](
          `
          <div class="gram-card">
            <div class="gram-card-header">
              <img src="${post.author.usertype == 'user' ? post.author.basic.picture : post.author.logo }" class="gram-card-user-image lozad">
              <a class="gram-card-user-name" href="/u/@${post.author.username}">${post.author.username}</a>
              <div class="dropdown gram-card-time">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  <i class="glyphicon glyphicon-option-vertical"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-right">
          `
          +
                (post.staticUrl ? `<li><a href=${post.staticUrl}<i class="fa fa-share"></i> View</a></li>` : ``)
          +
                (post.author.username == username ? 
                `
                <li><a href="/me/post/${post._id}"><i class="fa fa-cog"></i> Edit</a></li>
                <li><a href="/me/post/delete/${post._id}"><i class="fa fa-trash"></i> Delete</a></li>
                ` : ``)
          +
          `
                </ul>
              </div>
              <div class="time">${post.timeago}</div>
            </div>
            <br>
            <br>
            <div class="gram-card-image">
          `
          +
              (post.staticUrl 
                ? 
                (['png', 'jpg', 'gif', 'jpeg'].includes(post.type) 
                  ? `
                  <center>
                    <a href="${post.staticUrl}" class="progressive replace">
                      <img author="${post.author.username}" src="" id="${post.author.username}" class="post img-responsive lozad preview">
                    </a> 
                  </center>
                  ` 
                  : `
                  <center>
                    <video author="${post.author.username}" src="${post.staticUrl}" id="${post._id}" class="post img-responsive" controls></video>
                  </center>
                  `
                )
                : 
                ``
                )
          +
          `
            </div>
            <div class="gram-card-content">
              <p>
                <a class="gram-card-content-user" href="/u/@${post.author.username}">
                  ${post.author.username}
                </a>
                ${post.caption}
                <span class="label label-info">${post.category ? post.category : "Unknown"}</span>
              </p>
  
              <p class="comments">${post.comments.length} comment(s).</p>
              <br>
              <div class="comments-div" id="comments-${post._id}">
            `
            + post.comments.map(eachComment => {
              `
              <a class="user-comment" href="/u/@${comment.by}>
                @${comment.by}
              </a>
                ${c.text}
              <br>
              `
            }).join('')
            +
            `
              </div>
              <hr>
            </div>
            <div class="gram-card-footer">
              <button data=${JSON.stringify(post.likes)} 
                style="text-decoration: none; color: ${post.likes.find(x => x.username == $("#posts").attr("user-id")) ? "grey" : "#f0b91"}"
                class="footer-action-icons likes btn btn-link non-hoverable like-button-box" author="${post.author.username}" id="${post._id}-like"
              >
                <i class="glyphicon glyphicon-thumbs-up"></i> ${post.likes.length}
              </button>
  
              <input id="${post._id}" class="comments-input comment-input-box" author="${p.author.username}" type="text" id="comment" placeholder="Click enter to comment here..."/>
            </div>
          </div>
          `
        )
        // load(true)
        $(window).on('scroll', function() {
          if(finished) {
            return $(window).off(this)
          }
          if($(document).height - $(document).scrollTop < 1369) {
            page++;
            getPosts(page)
          }
        })
        $(".like-button-box").off("click")
        $(".like-button-box").on("click", likeByUsername)
  
        function likeByUsername() {
          var el = this
          var author = $(`#${this.username}`).attr("author")
          $.ajax({
            method: "POST",
            url: "/api/v1/like?cache=" + Math.random(),
            data: {
              _id: this.id.toString().split("-like")[0],
              author
            }
          }).done(function (data) {
            if (data.event) {
              $(el).html(
                $(el).html().split("</i>")[0] + data.amount
              )
              $(el).css("color", data.msg != "Liked!" ? "#f0b917" : "grey")
              show_notification(data.msg, "success")
            } else {
              show_notification(data.msg, "danger");
            }
          }).fail(function (error) {
            show_notification("Some error while liking the feed", "danger")
            console.log(error)
          })
        }
        $(".comment-input-box").off("keydown")
        $(".comment-input-box").on("keydown", commentByUsername)
  
        function commentByUsername() {
          if(!this.value) {
            return
          } else if(key.keyCode == 13 ) {
            var el = this
            $.ajax({
              method: "POST",
              url: "/api/v1/comment",
              data: {
                post_id: el.id,
                author: $(el).attr(author),
                text: el.value
              }
            }).done(function (data) {
              $("#comments-" + el.id).append(`
                <a class="user-comment" href="/u/@${data.by}">
                  @${data.by}
                </a> ${el.value}
                <br>
              `)
              el.value = ""
              show_notification("Comment added!", "success")
            }).fail(function(error) {
              show_notification("Some error while posting the comment.", "danger")
              console.log(error)
            })
          }
        }
      })
    })
  }
  getPosts()
}

fetchPosts()
