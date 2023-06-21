import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_uri } from "../utils/constants";
import { setUser } from '../utils/userSlice';
import { Tab } from '@headlessui/react';

const AllUsers = () => {
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.user);

  const [username, setUsername] = useState("");

  const [allUsers, setAllUsers] = useState([]);

  const [followerRequests, setFollowerRequests] = useState([]);
  const [followingRequests, setFollowingRequests] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userStore) {
      if (userStore.user?.mobile?.length === 0) {
        navigate("/profile/:id");
      }
    }
    console.log(userStore);
  }, [userStore, navigate]);

  const searchUsers = (e) => {
    axios
      .post(`${base_uri}/getallusers`, { username })
      .then((res) => {
        console.log(res.data);
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const sendFollowUserRequest = (e, followingUserid) => {
    axios
      .post(`${base_uri}/sendfollowrequest`, {
        senderid: userStore.user._id,
        recieverid: followingUserid,
      })
      .then((res) => {
        dispatch(setUser(res.data?.user));
        // navigate('/allusers');
        // console.log(userStore);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios.post(`${base_uri}/getrequests`, { userid: userStore.user._id })
      .then((res) => {
        console.log(res);
        setFollowerRequests(res.data?.followerRequests);
        setFollowingRequests(res.data?.followingRequests);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const getRequests = (e) => {
    axios.post(`${base_uri}/getrequests`, { userid: userStore.user._id })
      .then((res) => {
        console.log(res);
        setFollowerRequests(res.data?.followerRequests);
        setFollowingRequests(res.data?.followingRequests);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const unfollowUser = (e, unfollowingUserid) => {
    axios.post(`${base_uri}/unfollowuser`, {
      curUserid: userStore.user._id,
      unfollowingUserid
    })
      .then((res) => {
        // console.log(res);
        dispatch(setUser(res.data?.user));
        // navigate('/allusers');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const cancelFollowRequest = (e, followingUserid) => {
    axios.post(`${base_uri}/cancelfollowrequest`, { senderid: userStore.user._id, recieverid: followingUserid })
      .then((res) => {
        dispatch(setUser(res.data?.user));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const acceptFollowRequest = (e, requestUserid) => {
    axios.post(`${base_uri}/acceptfollowrequest`, { senderid: requestUserid, recieverid: userStore.user._id })
      .then((res) => {
        dispatch(setUser(res.data?.user));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const rejectFollowRequest = (e, requestUserid) => {
    axios.post(`${base_uri}/rejectfollowrequest`, { senderid: requestUserid, recieverid: userStore.user._id })
      .then((res) => {
        dispatch(setUser(res.data?.user));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <>
      <Sidebar />
      <div className=" ml-[17rem] mt-[4.5rem] w-[calc(100%_-_18rem)]">


        <Tab.Group>
          <Tab.List className="w-full flex justify-between">
            <Tab className={({ selected }) => classNames(
              'w-[50%] border border-black flex justify-center p-2 rounded-lg mr-1',
              selected ? 'bg-gray-200' : 'bg-white'
            )}>
              All Users
            </Tab>
            <Tab className={({ selected }) => classNames(
              'w-[50%] border border-black flex justify-center p-2 rounded-lg mr-1',
              selected ? 'bg-gray-200' : 'bg-white'
            )}
            onClick={getRequests}
            >
              {`Follow requests`}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {/* This is all users section */}

              <div className="mt-4 text-xl font-semibold w-full flex justify-center border border-gray-300 p-2 rounded-lg bg-gray-100">
                All Users
              </div>

              <div className="mt-2 flex justify-center p-2 rounded-l items-center">
                <div className="border border-gray-300 justify-between flex rounded-lg p-2 w-[40rem]">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="p-2 rounded-lg outline-none w-[100rem]"
                    placeholder="Search for users..."
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <button className="p-2" onClick={searchUsers}>
                    Search
                  </button>
                </div>
              </div>

              {
                allUsers.length !== 0 ? (
                  <>
                    {allUsers &&
                      allUsers.map((user) => {
                        return (
                          <div
                            className="flex bg-[#F8F8FF] shadow-lg rounded-lg w-full mt-4 border border-gray-200"
                            key={user._id}
                          >
                            <div className="flex items-start px-4 py-6 w-full">
                              <img
                                className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                src={user.image}
                                alt="avatar"
                              />

                              <div className="w-full">
                                <div className="flex items-center justify-between w-full">
                                  <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                                    {user.username}{" "}
                                  </h2>
                                  <small className="text-sm text-gray-700 -mt-6">
                                    Joined 12 Sept, 2012
                                  </small>
                                </div>

                                <div className="flex w-full justify-between">
                                  <p className="text-gray-500 text-sm">
                                    {/* Joined 12 SEP 2012.{" "} */}
                                    {`${user.followers.length} Followers | ${user.following.length} Following`}
                                  </p>
                                  {
                                    userStore.user?._id !== user._id && userStore.user?.following.includes(user._id) ? (
                                      <button onClick={(e) => {
                                        unfollowUser(e, user._id);
                                        --user.followers.length
                                      }}>Unfollow</button>
                                    ) : userStore.user?._id !== user._id && userStore.user?.followingRequests.includes(user._id) ? (
                                      <div>
                                        <button onClick={(e) => {
                                          cancelFollowRequest(e, user._id)
                                        }}>Cancel follow request</button>
                                      </div>
                                    ) : userStore.user?._id !== user._id ? (
                                      <button
                                        onClick={(e) => {
                                          sendFollowUserRequest(e, user._id);
                                        }}
                                      >
                                        Follow
                                      </button>
                                    ) : null
                                  }
                                </div>

                                <p className="mt-3 text-gray-700 text-sm">
                                  {user.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : null
              }

            </Tab.Panel>
            <Tab.Panel>

              <Tab.Group className={'w-full mt-4'} as={'div'}>
                <Tab.List>
                  <div className="w-full flex justify-center">
                    <Tab className={({ selected }) => classNames(
                      'w-[40%] border border-black flex justify-center p-2 rounded-lg mr-1',
                      selected ? 'bg-gray-200' : 'bg-white'
                    )}>
                      {`Follow request sent (${followingRequests.length})`}
                    </Tab>
                    <Tab className={({ selected }) => classNames(
                      'w-[40%] border border-black flex justify-center p-2 rounded-lg mr-1',
                      selected ? 'bg-gray-200' : 'bg-white'
                    )}>
                      {`Follow request recieved (${followerRequests.length})`}
                    </Tab>
                  </div>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <span>Follow request sent</span>
                    {
                      followingRequests.length === 0 ? (
                        <div>
                          No Following requests sent
                        </div>
                      ) : (
                        followingRequests.map((user) => {
                          // console.log(user._id);
                          return (
                            <div
                              className="flex bg-[#F8F8FF] shadow-lg rounded-lg w-full mt-4 border border-gray-200"
                              key={user._id}
                            >
                              <div className="flex items-start px-4 py-6 w-full">
                                <img
                                  className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                  src={user.image}
                                  alt="avatar"
                                />

                                <div className="w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                                      {user.username}{" "}
                                    </h2>
                                    <small className="text-sm text-gray-700 -mt-6">
                                      Joined 12 Sept, 2012
                                    </small>
                                  </div>

                                  <div className="flex w-full justify-between">
                                    <p className="text-gray-500 text-sm">
                                      {/* Joined 12 SEP 2012.{" "} */}
                                      {`${user.followers.length} Followers | ${user.following.length} Following`}
                                    </p>

                                    <div>
                                      <button onClick={(e) => {
                                        let idx;
                                        followingRequests.forEach((tempuser, i) => {
                                          if (tempuser._id === user._id) {
                                            idx = i;
                                          }
                                        })
                                        followingRequests.splice(idx, 1);
                                        cancelFollowRequest(e, user._id)
                                      }}>Cancel follow request</button>
                                    </div>

                                  </div>

                                  <p className="mt-3 text-gray-700 text-sm">
                                    {user.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )
                    }
                  </Tab.Panel>
                  <Tab.Panel>
                    <span>Follow request recieved</span>
                    {
                      followerRequests.length === 0 ? (
                        <div>
                          No Follow requests recieved
                        </div>
                      ) : (
                        followerRequests.map((user) => {
                          return (
                            <div
                              className="flex bg-[#F8F8FF] shadow-lg rounded-lg w-full mt-4 border border-gray-200"
                              key={user._id}
                            >
                              <div className="flex items-start px-4 py-6 w-full">
                                <img
                                  className="w-12 h-12 rounded-full object-cover mr-4 shadow"
                                  src={user.image}
                                  alt="avatar"
                                />

                                <div className="w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <h2 className="text-lg font-semibold text-gray-900 -mt-1">
                                      {user.username}{" "}
                                    </h2>
                                    <small className="text-sm text-gray-700 -mt-6">
                                      Joined 12 Sept, 2012
                                    </small>
                                  </div>

                                  <div className="flex w-full justify-between">
                                    <p className="text-gray-500 text-sm">
                                      {/* Joined 12 SEP 2012.{" "} */}
                                      {`${user.followers.length} Followers | ${user.following.length} Following`}
                                    </p>
                                    <div>
                                      <button className="mr-2 bg-green-600 px-3 py-1 rounded-lg text-white" onClick={(e) => {
                                        acceptFollowRequest(e, user._id);
                                        let idx;
                                        followerRequests.forEach((tempuser, i) => {
                                          if (tempuser._id === user._id) {
                                            idx = i;
                                          }
                                        })
                                        followerRequests.splice(idx, 1);
                                      }}>
                                        Accept
                                      </button>
                                      <button className="ml-2 bg-red-600 px-3 py-1 rounded-lg text-white" onClick={(e) => {
                                        rejectFollowRequest(e, user._id);
                                        let idx;
                                        followerRequests.forEach((tempuser, i) => {
                                          if (tempuser._id === user._id) {
                                            idx = i;
                                          }
                                        })
                                        followerRequests.splice(idx, 1);
                                      }}>
                                        Reject
                                      </button>
                                    </div>
                                    {/* {
                                    userStore.user?._id !== user._id && userStore.user?.following.includes(user._id) ? (
                                      null
                                    ) : userStore.user?._id !== user._id && userStore.user?.followingRequests.includes(user._id) ? (
                                      <div>
                                        <button onClick={(e) => {
                                          cancelFollowRequest(e, user._id)
                                        }}>Cancel follow request</button>
                                      </div>
                                    ) : null
                                  } */}
                                  </div>

                                  <p className="mt-3 text-gray-700 text-sm">
                                    {user.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )
                    }
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>

            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>






      </div>
    </>
  );
};

export default AllUsers;
