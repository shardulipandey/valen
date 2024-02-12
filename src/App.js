import "./App.css";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import img1 from './images/1.png';
import img2 from './images/2.png';
import img3 from './images/3.png';
import img4 from './images/4.png';
import music from './music/music.mp3'; // Import your music fil
import { Howl } from 'howler'; // Import Howl and Howler
import { BsVolumeMuteFill, BsVolumeUpFill } from 'react-icons/bs'; // Import volume icons

function App() {
  const [heartClicked, setHeartClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [noButtonStyle, setNoButtonStyle] = useState({
    transform: "translate(0, 0)",
    transition: "transform 0.2s ease-in-out",
  });
  const [glow, setGlow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [muted, setMuted] = useState(false); // State for mute/unmute
  const [sound, setSound] = useState(null); // State for Howl instance

  // Initialize Howl with the music file
  useEffect(() => {
    const sound = new Howl({
      src: [music],
      autoplay: true, // Autoplay the music when component mounts
      loop: true, // Loop the music
      volume: muted ? 0 : 1, // Set volume based on mute state
    });

    // Set Howl instance to state
    setSound(sound);

    // Cleanup function to stop the music when component unmounts
    return () => {
      sound.stop();
    };
  }, [muted]); // Run effect when mute state changes

  // Function to toggle mute/unmute state
  const toggleMute = () => {
    setMuted(!muted);
    if (sound) {
      // If sound instance exists, set volume based on new mute state
      sound.volume(muted ? 0 : 1);
    }
  };

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  }; 

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  const db = getFirestore(app);

  const questions = [
    "Hello, I am Shardulu.",
    "Why are you so cute?",
    "Why is your voice soo niceee?",
    "Why your smile is so beautiful?",
    "Do you love me?",
    "Why do you love me?",
    "Will you be my koocho poochoo forever?",
    "Happy Valentine's Day, babu!",
  ];

  const images = [img1, img2, img3, img4]; // Array of image paths

  useEffect(() => {
    setNoButtonStyle({
      transform: "translate(0, 0)",
      transition: "transform 0.2s ease-in-out",
    });
  }, [questionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prevGlow) => !prevGlow);
    }, 500); // Change the interval as per your requirement
    return () => clearInterval(interval);
  }, []);

  const getRandomCoordinate = () => {
    const getRandomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const x = getRandomInt(0, window.innerWidth - 1000);
    const y = getRandomInt(0, window.innerHeight - 400);
    return { x, y };
  };

  const handleClick = () => {
    setHeartClicked(true);
  };

  const handleProceed = () => {
    if (questionIndex === 5 && inputValue.length < 20) {
      setError(true);
    } else {
      save_message(questions[questionIndex], inputValue);
      setInputValue("");
      setError(false);
      if (questionIndex === 0 || questionIndex === 1 || questionIndex === 2 ||  questionIndex === 6) {
        setShowImage(true);
        setTimeout(() => {
          setShowImage(false);
          setQuestionIndex((prevIndex) => prevIndex + 1);
        }, 3000);
      } else {
        setQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  };
  
 
  const handleNoHover = () => {
    const randomCoordinate = getRandomCoordinate();
    setNoButtonStyle({
      transform: `translate(${randomCoordinate.x}px, ${randomCoordinate.y}px)`,
      transition: "transform 0.2s ease-in-out",
    });
  };

  const save_message = async (message_text, answer_text) => {
    let timeStamp = Date.now();
    await setDoc(doc(db, "valen", message_text), {
      time: new Date(timeStamp),
      message_text: message_text,
      answer_text: answer_text,
    });
  };

  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 via-pink-600 to-red-500 text-white relative"> {/* Added relative positioning */}
      <button // Mute/Unmute button
        className="text-white focus:outline-none absolute bottom-4 left-4" // Positioned at bottom-left corner
        onClick={toggleMute}
      >
        {muted ? <BsVolumeMuteFill size={24} /> : <BsVolumeUpFill size={24} />}
      </button>

      {questionIndex === 7 ? (
        <>
          <div className="relative">
            <div className={`card bg-white bg-opacity-70 p-6 rounded-md shadow-lg text-3xl text-red-500 font-bold relative ${glow ? 'glow' : ''}`}>
              {questions[questionIndex]}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150">
              <div className="animate-pulse">
                <button
                  className="text-4xl text-red-500 focus:outline-none transform scale-125"
                  onClick={handleClick}
                >
                  ❤️
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform text-xl">
            Ab soch kyaa rahe ho, kissu karo naa
          </div>
          <button
            className="bg-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded absolute bottom-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform text-sm hover:bg-gray-300 hover:text-black shadow-lg"
            onClick={() => openModal("hhhhhhhhhhhhhhhhhhhhhhh")}
          >
            Read Message
          </button>
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
              <div className="bg-white p-8 rounded-lg text-black">
                <p>{modalMessage}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white bg-opacity-70 p-6 rounded-md shadow-lg text-2xl text-center w-96">
          {!heartClicked ? (
            <div className="flex items-center justify-center mb-8">
              <div className="animate-bounce">
                <button
                  className="text-9xl text-red-500 focus:outline-none transform hover:scale-110 transition-transform"
                  onClick={handleClick}
                >
                  ❤️
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-black">{questions[questionIndex]}</p>
              {questionIndex === 0 ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-110"
                  onClick={handleProceed}
                >
                  Enter
                </button>
              ) : null}
              {questionIndex === 5 ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="border border-gray-300 p-2 mt-2 focus:outline-none text-black placeholder-gray-400"
                      placeholder="Batao Batao !! "
                    />
                    {error && (
                      <p className="text-red-500 mt-2 text-sm">
                        Bas Itna hi pyaar karte ho mujhse? 😢
                        <br />
                        20 characters bhi nahi likh sakte?
                      </p>
                    )}
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-110"
                    onClick={handleProceed}
                  >
                    Next
                  </button>
                </>
              ) : null}
              {questionIndex === 1 || questionIndex === 2 || questionIndex === 3 ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="border border-gray-300 p-2 mt-2 focus:outline-none text-black placeholder-gray-400"
                      placeholder="Batao Batao !!"
                    />
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700 transition-transform transform hover:scale-110"
                    onClick={handleProceed}
                  >
                    Next
                  </button>
                </>
              ) : null}

              {questionIndex > 3 && questionIndex !== 5 ? (
                <div className="">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700 transition-transform transform hover:scale-110"
                    onClick={handleProceed}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-transform transform hover:scale-110"
                    style={noButtonStyle}
                    onMouseEnter={handleNoHover}
                  >
                    No
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}

{showImage && (
  <img
    src={questionIndex===6 ?images[3]: images[questionIndex]}
    alt={`Image ${questionIndex}`}
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg border-1 border-yellow-500 glow"
    style={{ width: '600px', height: '600px', borderRadius: '10px' }}
  />
)}

      <footer className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform ">
        Created with love ❤️
      </footer>
    </div>
  );

}

export default App;
