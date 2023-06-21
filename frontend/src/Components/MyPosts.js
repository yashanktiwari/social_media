import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_uri } from "../utils/constants";

const MyPosts = () => {
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.user);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // console.log(userStore);
    if (userStore) {
      if (userStore.user.mobile.length === 0) {
        navigate("/profile/:id");
      }
    }
  }, [userStore]);

  useEffect(() => {
    if (userStore.user?._id) {
      axios
        .get(`${base_uri}/getmyposts/${userStore.user._id}`)
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userStore]);

  const [currComments, setCurrComments] = useState(null);

  const [currLikes, setCurrLikes] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);

  const getComment = (e, postid) => {
    axios.post(`${base_uri}/getcomments`, { postid })
      .then((res) => {
        console.log(res);
        setCurrComments(res.data.comments);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const [showLikesModal, setShowLikesModal] = useState(false);

  const getLikes = (e, postid) => {
    axios.post(`${base_uri}/getlikes`, { postid })
      .then((res) => {
        setCurrLikes(res.data.likes)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <>
      <Sidebar />
      <div className=" ml-[17rem] mt-[4.5rem] h-fit p-4 w-[calc(100%_-_18rem)]">
        <div className="text-xl font-semibold w-full flex justify-center border border-gray-300 p-2 rounded-lg bg-gray-100">
          My Posts
        </div>
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
                      src={userStore.user.image}
                      alt="avatar"
                    />

                    <div className="w-full">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                          {userStore.user.username}{" "}
                        </h2>
                        <small className="text-sm text-gray-700">{new Date(post.createdAt).toString().substring(4, 24)}</small>
                      </div>

                      <p className="text-gray-500 text-sm">
                        Joined: {userStore.user.joiningDate.substring(0, 13)}{" "}
                      </p>

                      <p className="mt-3 text-gray-700 text-sm">
                        {post.description}
                      </p>

                      <div className="mt-4 flex items-center">
                        <div className="flex text-gray-700 text-sm mr-3 cursor-pointer"
                        onClick={(e) => {
                          setShowLikesModal(true);
                          getLikes(e, post._id);
                        }}>
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 mr-1"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{post.likes.length}</span>
                        </div>
                        <div className="flex ml-4 text-gray-700 text-sm mr-8 cursor-pointer"
                          onClick={(e) => {
                            setShowCommentModal(true);
                            getComment(e, post._id);
                          }}>
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-4 h-4 mr-1"
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
                        {/* <div className="flex mr-2 text-gray-700 text-sm mr-4">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 mr-1"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span>share</span>
                </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

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



        {showLikesModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-[30rem] my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Likes</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowLikesModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative px-4 flex-auto">
                    {
                      currLikes &&
                      currLikes.slice(0).reverse().map((user) => {
                        return (
                          <div className='flex py-3 items-center'>
                            <img src={user.image} alt="user" className="rounded-full h-14 w-14 border border-gray-200" />
                            <div className='flex flex-col ml-3 w-52'>
                              <h1 className='text-lg font-semibold'>{user.username}</h1>
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
    </>
  );
};

export default MyPosts;
