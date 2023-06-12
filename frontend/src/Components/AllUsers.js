import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_uri } from "../utils/constants";
import { setUser } from '../utils/userSlice';

const AllUsers = () => {
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.user);

  const [username, setUsername] = useState("");

  const [allUsers, setAllUsers] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userStore) {
      if (userStore.user?.mobile?.length === 0) {
        navigate("/profile/:id");
      }
    }
  }, [userStore, navigate]);

  const searchUsers = (e) => {
    axios
      .post(`${base_uri}/getallusers`, { username })
      .then((res) => {
        // console.log(res);
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const followUser = (e, followingUserid) => {
    axios
      .post(`${base_uri}/followuser`, {
        curUserid: userStore.user._id,
        followingUserid,
      })
      .then((res) => {
        console.log(res);
        dispatch(setUser(res.data?.user));
        navigate('/allusers');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfollowUser = (e, unfollowingUserid) => {
    axios.post(`${base_uri}/unfollowuser`, {
      curUserid: userStore.user._id,
      unfollowingUserid
    })
    .then((res) => {
      console.log(res);
      dispatch(setUser(res.data?.user));
      navigate('/allusers');
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Sidebar />
      <div className=" ml-[17rem] mt-[4.5rem] w-[calc(100%_-_18rem)]">
        <div className="text-xl font-semibold w-full flex justify-center border border-gray-300 p-2 rounded-lg bg-gray-100">
          All Users
        </div>

        <div className="mt-2 flex justify-center p-2 rounded-l items-center">
          <div className="border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              name="username"
              id="username"
              className="p-2 rounded-lg outline-none"
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
                      userStore.user._id !== user._id &&
                      userStore.user.following.includes(user._id) ? (
                        <button onClick={(e) => {
                          unfollowUser(e, user._id);
                          --user.followers.length
                        }}>Unfollow</button>
                      ) : userStore.user._id !== user._id ? (
                        <button
                          onClick={(e) => {
                            ++user.followers.length
                            followUser(e, user._id);
                          }}
                        >
                          Follow
                        </button>
                      ) : null}
                    </div>

                    <p className="mt-3 text-gray-700 text-sm">
                      {user.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default AllUsers;
