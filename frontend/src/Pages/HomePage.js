import React, { useState, useEffect } from 'react'
import Sidebar from '../Components/Sidebar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { base_uri } from '../utils/constants';
import moment from 'moment';

const HomePage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userStore = useSelector(store => store.user);

  const [posts, setPosts] = useState([]);
  const [commentPost, setCommentPost] = useState(null);

  const [addCommentModal, setAddCommentModal] = useState(false);

  const [comment, setComment] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    axios.get(`${base_uri}/checkauthuser`, { withCredentials: true, credentials: 'include' })
      .then((res) => {
        // console.log(res.data.user);
        dispatch(setUser(res.data?.user));
        // if(userStore) console.log(userStore);
      })
      .catch((err) => {
        console.log(err);
        // console.log(error.response.status);
        // console.log(error.response.data);
        navigate('/login');
      })
  }, [])

  useEffect(() => {
    if (userStore) {
      if (userStore.user?.mobile?.length === 0) {
        navigate(`/profile/${userStore.user._id}`);
        console.log("mobile not set");
      } else {
        console.log("mobile set");
        // get all the posts of the people that you are following
        if(userStore.user?._id) {
          axios.post(`${base_uri}/getallposts`, { userid: userStore.user._id })
            .then((res) => {
              console.log(res);
              setPosts(res.data.allPosts);
            })
            .catch((err) => {
              console.log(err);
            })
        }
      }
    }
  }, [userStore])

  const likePost = (postid) => {
    axios.post(`${base_uri}/likepost`, { postid, userid: userStore.user?._id })
      .then((res) => {
        console.log(res);
        dispatch(setUser(res.data?.user));
        console.log(userStore);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const unlikePost = (postid) => {
    axios.post(`${base_uri}/unlikepost`, { postid, userid: userStore.user?._id })
      .then((res) => {
        console.log(res);
        dispatch(setUser(res.data?.user));
        console.log(userStore);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const addComment = (e, postid) => {
    setAddCommentModal(false);
    axios.post(`${base_uri}/addcomment`, { postid, userid: userStore.user._id, data: comment, date: moment().format('MMMM Do YYYY, h:mm:ss a')})
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const [currComments, setCurrComments] = useState(null);

  const getComment = (e, postid) => {
    axios.post(`${base_uri}/getcomments`, {postid})
    .then((res) => {
      console.log(res);
      setCurrComments(res.data.comments);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Sidebar />
      <div className=' ml-[17rem] mt-[4.5rem] h-96 w-[calc(100%_-_18rem)]'>
        Your Feed

        {posts &&
          posts.slice(0).reverse().map((post) => {
            return (
              <div key={post._id}>
                {/* Post Card */}
                <div
                  className="flex bg-[#F8F8FF] shadow-lg rounded-lg w-full mt-4 border border-gray-200"
                  key={post._id}
                >
                  <div className="flex items-start px-4 py-6 w-full">
                    <img
                      className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                      src={post.createdBy.image}
                      alt="avatar"
                    />

                    <div className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                          {post.createdBy.username}{" "}
                        </h2>
                        <small className="text-sm text-gray-700">{new Date(post.createdAt).toString().substring(4, 24)}</small>
                      </div>

                      {/* <p className="text-gray-500 text-sm">
                        Joined: {userStore.user.joiningDate}{" "}
                      </p> */}

                      <p className="mt-3 text-gray-700 text-sm">
                        {post.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className='flex'>
                          <div className="flex text-gray-700 text-sm mr-3">
                            {
                              userStore && userStore.user?.postsLiked?.includes(post._id) ? (
                                <>
                                  <svg
                                    fill="red"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 mr-1"
                                    stroke="red"
                                    onClick={() => {
                                      post.likes.length = post.likes.length - 1;
                                      unlikePost(post._id);
                                    }}>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 mr-1"
                                    stroke="currentColor"
                                    onClick={() => {
                                      post.likes.length = post.likes.length + 1;
                                      likePost(post._id);
                                    }}>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                </>
                              )
                            }

                            <span>{post.likes.length}</span>
                          </div>
                          <div className="flex ml-4 text-gray-700 text-sm mr-8 cursor-pointer"
                            onClick={(e) => {
                              // setCurrentPost(post);
                              setShowCommentModal(true);
                              getComment(e, post._id);
                            }}>
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              className="w-5 h-5 mr-1"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                            </svg>
                            <span>{post.comments.length}</span>
                          </div>
                        </div>
                        <button className='mr-2'
                          onClick={(e) => {
                            setCommentPost(post);
                            setAddCommentModal(true);
                          }}>
                          Add Comment
                        </button>
                        {/* Modal for adding comment*/}
                        {addCommentModal ? (
                          <>
                            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                              <div className="relative w-[30rem] my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                  {/*header*/}
                                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">Add Comment</h3>
                                    <button
                                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                      onClick={() => setAddCommentModal(false)}
                                    >
                                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        ×
                                      </span>
                                    </button>
                                  </div>
                                  {/*body*/}
                                  <div className="relative px-4 flex-auto">
                                    <div className="flex mt-4">
                                      <div>
                                        <img src={commentPost.createdBy.image} alt="user" className="rounded-full h-14 w-14 border border-gray-200" />
                                      </div>

                                      <div className="flex flex-col">
                                        <span className="font-bold ml-4 text-lg">{commentPost.createdBy.username}</span>
                                        <span className="text-gray-400 ml-4 text-sm">{commentPost.description}</span>
                                      </div>
                                    </div>
                                    <textarea
                                      className="my-4 p-2 px-3 w-full text-slate-700 rounded-md leading-relaxed border border-gray-200 resize-none"
                                      placeholder="Add comment"
                                      name="description"
                                      rows="1"
                                      onChange={(e) => {
                                        setComment(e.target.value);
                                      }}
                                    ></textarea>
                                  </div>
                                  {/*footer*/}
                                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => setAddCommentModal(false)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={(e) => {
                                        ++commentPost.comments.length;
                                        addComment(e, commentPost._id);
                                      }}
                                    >
                                      Add Comment
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                          </>
                        ) : null}
                      </div>


                      {showCommentModal ? (
                        <>
                          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-[30rem] my-6 mx-auto max-w-3xl">
                              {/*content*/}
                              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                  <h3 className="text-3xl font-semibold">Comments</h3>
                                  <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setShowCommentModal(false)}
                                  >
                                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                      ×
                                    </span>
                                  </button>
                                </div>
                                {/*body*/}
                                <div className="relative px-4 flex-auto">
                                  {
                                    currComments &&
                                    currComments.slice(0).reverse().map((comment) => {
                                      return (
                                        <div className='flex py-3 items-center'>
                                          <img src={comment.createdBy.image} alt="user" className="rounded-full h-14 w-14 border border-gray-200" />
                                          <div className='flex flex-col ml-3 w-52'>
                                            <h1 className='text-lg font-semibold'>{comment.createdBy.username}</h1>
                                            <span className='text-sm text-gray-700'>{comment.data}</span>
                                          </div>
                                          <div>
                                            <span className='text-sm'>
                                              {comment.date}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  )
}

export default HomePage