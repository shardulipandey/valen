import "./App.css";
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import img1 from './images/1.png';
import img2 from './images/2.png';
import img3 from './images/3.png';
import img4 from './images/4.png';
import music from './music/music.mp3';
import { Howl } from 'howler';
import { BsVolumeMuteFill, BsVolumeUpFill } from 'react-icons/bs';

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
  const [muted, setMuted] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const sound = new Howl({
      src: [music],
      autoplay: true,
      loop: true,
      volume: muted ? 0 : 1,
    });

    setSound(sound);

    return () => {
      sound.stop();
    };
  }, [muted]);

  const toggleMute = () => {
    setMuted(!muted);
    if (sound) {
      sound.volume(muted ? 0 : 1);
    }
  };

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);

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

  const images = [img1, img2, img3, img4];

  useEffect(() => {
    setNoButtonStyle({
      transform: "translate(0, 0)",
      transition: "transform 0.2s ease-in-out",
    });
  }, [questionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prevGlow) => !prevGlow);
    }, 500);
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

  // Render black screen with "Not available" message on mobile devices
  if (window.innerWidth < 768) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-800 via-pink-600 to-red-500 text-white text-center">
        <h1 className="text-4xl">Laptop mein kholo re</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 via-pink-600 to-red-500 text-white relative">
      <button
        className="text-white focus:outline-none absolute bottom-4 left-4"
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
            onClick={() => openModal("Babuuuuuuu....I loveeee youuuu sooo muchhhhh.....Bohot miss krte h tumkooooooo koochoo poochooo lulluuuu pulluuuu....Hum bohot jaldi milengeee jor se hug krna h tumkoooo....aur doggoo bohot achcha h...thankyouuuu shonaaa....i lovee youuuu bohot saaraa....❤️❤️❤️❤️❤️❤️ ")} // Add your message here 
          >
            Read Message
          </button>
          {showModal && (
             <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
             <div className="bg-white p-8 rounded-lg text-black max-w-md overflow-y-auto">
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
