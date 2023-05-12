const comments = [
  {
    id: 4,
    author: {
      name: "c3sar",
      slug: "c3sar",
      id: 3,
      created: "2023-05-05",
      last_login: "2023-05-05T23:22:28Z",
      description: "",
      profile_picture_url: null,
      num_unseen_notifications: 0,
    },
    likes: "0",
    is_liked_by_user: false,
    children: [
      {
        id: 5,
        author: {
          name: "c3sar",
          slug: "c3sar",
          id: 3,
          created: "2023-05-05",
          last_login: "2023-05-05T23:22:28Z",
          description: "",
          profile_picture_url: null,
          num_unseen_notifications: 0,
        },
        likes: "0",
        is_liked_by_user: false,
        children: [
          {
            id: 6,
            author: {
              name: "c3sar",
              slug: "c3sar",
              id: 3,
              created: "2023-05-05",
              last_login: "2023-05-05T23:22:28Z",
              description: "",
              profile_picture_url: null,
              num_unseen_notifications: 0,
            },
            likes: "0",
            is_liked_by_user: false,
            children: [],
            created: "2023-05-07T20:24:24.335562Z",
            text: "asd222222",
            depth: 2,
            post: 2,
            wall_user: null,
            parent: 5,
          },
        ],
        created: "2023-05-07T20:23:42.174235Z",
        text: "asd",
        depth: 1,
        post: 2,
        wall_user: null,
        parent: 4,
      },
    ],
    created: "2023-05-07T17:19:52.120075Z",
    text: "no juego nunca más contigo",
    depth: 0,
    post: 2,
    wall_user: null,
    parent: null,
  },
  {
    id: 2,
    author: {
      name: "c3sar",
      slug: "c3sar",
      id: 3,
      created: "2023-05-05",
      last_login: "2023-05-05T23:22:28Z",
      description: "",
      profile_picture_url: null,
      num_unseen_notifications: 0,
    },
    likes: "0",
    is_liked_by_user: false,
    children: [],
    created: "2023-05-07T13:55:22.881362Z",
    text: "qwe",
    depth: 0,
    post: 2,
    wall_user: null,
    parent: null,
  },
];

const getChildren = (comment) => {
  let comments = [];
  const getChildrenWraper = (c) => {
    if (c.children?.length > 0) {
      console.log("TRUE");
      comments.push(c);
      c.children.forEach((child) => getChildrenWraper(child));
    } else {
      comments.push(c);
      return comments;
    }
  };
  return getChildrenWraper(comment);
};

console.log(getChildren(comments[0]));
