import React from 'react';
import {useState} from "react";
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai";
import {Link} from "react-router-dom";
import OAuth from '../components/OAuth';
import {
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile
} from "firebase/auth"
import {db} from "../firebase"
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const {name, email, password} = formData;
  const navigate = useNavigate();
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
   }))
  }
  async function onSubmit(e){
    e.preventDefault();

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email, 
        password
        );

      updateProfile(auth.currentUser, {
          displayName: name
        });
      const user =  userCredential.user;
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign Up was successful!")
      navigate("/")
    } catch (error) {
      toast.error("Something went wrong with Signing Up")
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl ">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img 
          src="https://media.licdn.com/dms/image/C5603AQHRLF-coUTT8w/profile-displayphoto-shrink_800_800/0/1652663927640?e=2147483647&v=beta&t=OzJ0rkrdnFDWJRjbhgtGfXoT4lcgAw6yiersGVPFlbg" 
          alt="arthur fernandez" 
          className="w-full rounded-2xl" />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
          <input
             type="text"
             id="name" 
             value={name} onChange={onChange}
            placeholder="Full name"
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            <input
             type="email"
             id="email" 
             value={email} onChange={onChange}
            placeholder="Email address"
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />

            <div className="relative mb-6">
              <input
              type={showPassword ?  "text" : "password"} 
              id="password" 
              value={password} 
              onChange={onChange}
              placeholder="Password"
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out" 
              />


              {showPassword ? (
                <AiFillEyeInvisible
                 className="absolute right-3 top-3 text-xl cursor-pointer" 
                onClick={()=>setShowPassword((prevState)=>!prevState)}
                />
              ) : 
              <AiFillEye 
              className="absolute right-3 top-3 text-xl cursor-pointer" 
              onClick={()=>setShowPassword((prevState)=>!prevState)} 
              />}
            </div>

            <div 
            className="flex justify-between whitespace-nowrap text-sm sm:text-large">
              <p className="mb-6">
                Have have an account?
                <Link to="/sign-in" 
                className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1">
                  Sign In
                </Link>
              </p>
              <p>
                <Link to="/forgot-password"
                className="text-blue-600 hover:text-red-700 transition duration-200 ease-in-out"
                >Forgot password?</Link>
              </p>
            </div>
            <button
          type="submit"
          className="w-full bg-blue-600 text-white px-7 py-4 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            Sign Up
          </button>
          <div className="flex my-4 before:border-t before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}
