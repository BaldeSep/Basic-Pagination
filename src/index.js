import React from "react";
import ReactDom from "react-dom";

function Post(props) {
  return (
    <div>
      <h2>{props.postTitle}</h2>
      <p>{props.postBody}</p>
    </div>
  );
}

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsResource: "https://jsonplaceholder.typicode.com/posts",
      totalShown: 10,
      pageNumber: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getNumberOfPages(total, limit) {
    return Math.ceil(total / limit);
  }

  getPosts() {
    fetch(this.state.postsResource)
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.forEach(post => {
          this.addPosts(post);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  addPosts(post) {
    let posts = [...this.state.posts];
    posts.push({
      postTitle: post.title,
      postBody: post.body,
      id: post.id
    });
    this.setState({
      posts
    });
  }

  handleClick(e) {
    let newPageNumber = parseInt(e.target.textContent);
    this.setState({
      pageNumber: newPageNumber
    });
  }

  generatePaginationButtons(howMany) {
    let buttons = [];
    for (let i = 0; i < howMany; i++) {
      buttons.push(
        <button key={i} onClick={this.handleClick}>
          {i + 1}
        </button>
      );
    }
    return buttons;
  }

  getPostStartIndex() {
    return (this.state.pageNumber - 1) * this.state.totalShown;
  }

  getPostsEndIndex() {
    return this.getPostStartIndex() + this.state.totalShown;
  }

  getPostList() {
    let posts = this.state.posts.slice(
      this.getPostStartIndex(),
      this.getPostsEndIndex()
    );

    return posts;
  }

  componentDidMount() {
    this.getPosts();
  }

  handleChange(e) {
    this.setState({ totalShown: parseInt(e.target.value), pageNumber: 1 });
  }

  render() {
    return (
      <div>
        <p>Total Number of Posts: {this.state.posts.length}</p>
        <p>
          Total Number of Pages:
          {this.getNumberOfPages(
            this.state.posts.length,
            this.state.totalShown
          )}
        </p>
        <p>Current Page: {this.state.pageNumber}</p>
        <div>
          {this.generatePaginationButtons(
            this.getNumberOfPages(
              this.state.posts.length,
              this.state.totalShown
            )
          )}
        </div>
        <select value={this.state.totalShown} onChange={this.handleChange}>
          <option value="10">Show 10</option>
          <option value="20">Show 20</option>
          <option value="30">Show 30</option>
          <option value="40">Show 40</option>
          <option value="50">Show 50</option>
          <option value="100">Show 100</option>
        </select>
        {this.getPostList().map(post => (
          <Post
            key={post.id}
            postTitle={post.postTitle}
            postBody={post.postBody}
          />
        ))}
      </div>
    );
  }
}

ReactDom.render(<Posts />, document.getElementById("root"));
