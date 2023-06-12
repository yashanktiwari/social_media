import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../utils/userSlice";
import { base_uri } from "../utils/constants";
import {toast} from 'react-toastify';

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [uploadImage, setUploadImage] = useState("");

  const userStore = useSelector((store) => store.user);

  const inputRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(userStore.user.username);
    setEmail(userStore.user.email);
    setDescription(userStore.user.description);
    setMobile(userStore.user.mobile);
    setGender(userStore.user.gender);

  }, [userStore]);

  function handleImageSubmission(e) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      // Checking if the file is an image or not
      setFiletoBase(image);
      setImage(URL.createObjectURL(image));
    }
  }

  const setFiletoBase = (file) => {
    const reader = new FileReader();
    // Reader is reading the file
    reader.readAsDataURL(file);
    // Once the reading is completed, onloadend is triggered
    reader.onloadend = () => {
      setUploadImage(reader.result);
    };
  };

  const updateProfile = (e) => {
    e.preventDefault();
    if(gender.length == 0 || mobile.length == 0) {
      return toast.error("Please fill all the mandatory fields");
    }
    toast.success("Updating profile");
    axios
      .patch(`${base_uri}/updateprofile/${userStore.user._id}`, {
        username,
        email,
        description,
        mobile,
        gender,
        uploadImage,
        public_id: userStore.user.public_id
      })
      .then((res) => {
        dispatch(setUser(res.data?.user));
        toast.success("Profile updated successfully");
      })
      .catch((err) => {
        toast.error("Some error occurred while updating the profile");
        // console.log(err.response.status);
        // console.log(err.response.data);
      });
  };

  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    axios.post(`${base_uri}/getfollows`, { userid: userStore.user._id })
      .then((res) => {
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  return (
    <>
      <Sidebar />
      <div className=" ml-[17rem] mt-[4.5rem]  h-96 w-[calc(100%_-_18rem)]">
        <div className="flex justify-around py-3 px-12 items-center">
          <div className="flex flex-col items-center">
            <span className="text-lg text-gray-600 py-1 cursor-pointer"
              onClick={(e) => {
                setShowFollowerModal(true);
              }}>
              {followers.length} Followers
            </span>
            <span className="text-lg text-gray-600 py-1 cursor-pointer"
            onClick={(e) => {
              setShowFollowingModal(true);
            }}>
              {following.length} Following
            </span>
          </div>
          {image.length === 0 ? (
            <img
              src={userStore.user.image}
              className="w-32 h-32 rounded-full cursor-pointer border border-gray-200"
              alt="user"
              onClick={() => {
                inputRef.current.click();
              }}
            />
          ) : (
            <img
              src={image}
              className="w-32 h-32 rounded-full cursor-pointer border border-gray-200"
              alt="user"
              onClick={() => {
                inputRef.current.click();
              }}
            />
          )}
          <div>
            <span>Joined: {userStore.user.joiningDate}</span>
          </div>
        </div>
        <input
          type={"file"}
          ref={inputRef}
          accept={"image/png, image/jpg"}
          className={"hidden"}
          onChange={handleImageSubmission}
        />

        <form className="mt-6">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="username"
              id="username"
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-gray-900 border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 peer"
              placeholder=" "
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <label
              htmlFor="username"
              className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Username*
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none text-gray-900 border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 peer"
              placeholder=" "
              required
              value={email}
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address*
            </label>
          </div>
          {/* <div className="relative z-0 w-full mb-6 group">
            <input
              type="password"
              name="floating_password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div> */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="description"
              id="description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <label
              htmlFor="description"
              className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Description
            </label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            {/* <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_first_name"
                id="floating_first_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_first_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
            </div> */}
            {/* <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_last_name"
                id="floating_last_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_last_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last name
              </label>
            </div> */}
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                name="mobile"
                id="mobile"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
              <label
                htmlFor="mobile"
                className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Mobile*
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="gender"
                id="gender"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              />
              <label
                htmlFor="gender"
                className="peer-focus:font-medium absolute text-sm text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Gender*
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={updateProfile}
          >
            Update
          </button>
        </form>


        {showFollowerModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-[30rem] my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Followers</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowFollowerModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative px-4 flex-auto">
                    {
                      userStore &&
                      followers.map((follower) => {
                        return (
                          <div className='flex py-3 items-center'>
                            <img src={follower.image} alt="user" className="rounded-full h-14 w-14 border border-gray-200" />
                            <div className='flex flex-col ml-3 w-52'>
                              <h1 className='text-lg font-semibold'>{follower.username}</h1>
                              <span className='text-sm text-gray-700'>{follower.description}</span>
                            </div>
                            <div>
                              {/* <span className='text-sm'>
                                {comment.date}
                              </span> */}
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


{showFollowingModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-[30rem] my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Following</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowFollowingModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative px-4 flex-auto">
                    {
                      userStore &&
                      following.map((following) => {
                        return (
                          <div className='flex py-3 items-center'>
                            <img src={following.image} alt="user" className="rounded-full h-14 w-14 border border-gray-200" />
                            <div className='flex flex-col ml-3 w-52'>
                              <h1 className='text-lg font-semibold'>{following.username}</h1>
                              <span className='text-sm text-gray-700'>{following.description}</span>
                            </div>
                            <div>
                              {/* <span className='text-sm'>
                                {comment.date}
                              </span> */}
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

export default UserProfile;
