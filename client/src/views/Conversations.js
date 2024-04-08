import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../views/Message.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";

const Conversations = () => {
  const { convo_id, recipientName } = useParams();
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading convos
  const [myId, setMyId] = useState();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [loadMsg, setLoadMsg] = useState(true);
  const [isCssLoaded, setIsCssLoaded] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCssLoad = () => {
    setIsCssLoaded(true);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  };

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/conversations`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        setConvos(response.data);
        console.log(response.data);
        // Find the conversation with matching convo_id
        const matchedConvo = response.data.find(
          (convo) => convo.convoId === convo_id
        );

        if (matchedConvo) {
          // Set myId from the matched conversation
          setMyId(matchedConvo.myId);
          console.log(matchedConvo.myId);
        }
        setLoading(false); // Turn off loading spinner when projects are fetched
      })
      .catch((error) => {
        setLoading(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
        toast.error("Error Fetching Projects", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      });

    // Messages for the convo_id
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/conversations/messages/${convo_id}`,
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        // Simulate loading for 1 second
        setTimeout(() => {
          setMessages(response.data);
          console.log("Messages:", response.data);
          setLoadMsg(false); // Turn off loading spinner when projects are fetched
        }, 500); // 1 second delay
      })
      .catch((error) => {
        setLoading(false); // Turn off loading spinner in case of error
        if (error.response.status === 401) {
          console.log("Unauth");
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching projects:", error);
        toast.error("Error Fetching Projects", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getConvo = (convo_id, recipientName) => {
    console.log("Convo clicked: ", convo_id);
    // Fetch messages for the selected conversation
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/conversations/messages/${convo_id}`,
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        setMessages(response.data); // Update messages with the fetched data
        setLoadMsg(false); // Turn off loading spinner
      })
      .catch((error) => {
        // Handle error...
      });

    // navigate to Apply page with Id as params
    navigate(`/messages/${convo_id}/${recipientName}`);
  };

  const postNewMessage = (e) => {
    // Handle submitting the message
    console.log("I am here");
    e.preventDefault();
    console.log("I am there");
    console.log(e.target.value);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/conversations/messages/newMessage`,
        { sender: myId, content: inputValue, conversation_id: convo_id },
        {
          headers: {
            authorization: `${id}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setMessages(response.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("Unauth");
          toast.error("Logged Out", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
          localStorage.clear();
          navigate("/");
        }
        console.error("Error fetching data:", error);
        toast.error("Already Applied", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      })
      .finally(() => {
        // Reset the input field after submitting
        setInputValue("");
        scrollToBottom(); // Scroll to bottom after new message is posted
      });

    // Reset the input field after submitting
    setInputValue("");
  };

  return (
    <div>
      <Navbar />
      <div className="apply-form4">
        {/* <div className="row justify-content-between align-items-center mb-5 left-margin">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>

        <h1 className="with-margin2">Let's Talk!</h1> */}

        {loading ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="menu">
            <div className="select">
              <select
                className="form-select text-uppercase listing"
                multiple
                aria-label="multiple select example"
                onClick={(e) => getConvo(e.target.value, e.target.title)}
              >
                {convos.map((talk) => (
                  <option
                    className="option"
                    value={talk.convoId}
                    key={talk.convoId}
                    title={talk.otherName}
                  >
                    <div className="option-content">
                      <span>{talk.otherName}</span>
                    </div>
                  </option>
                ))}
              </select>
            </div>
            {loadMsg ? (
              <div className="chat-container">
                <div
                  className="chat-messages"
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="chat-container">
                {loadMsg ? (
                  <div
                    className="chat-messages"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="chat-header">
                      <div className="avatar">
                        {convos.length > 0 &&
                          convos[0].otherName.charAt(0).toUpperCase()}
                      </div>
                      {/*convos.map((talk) => (
                      <option
                        className="recipient-info"
                        value={talk.convoId}
                        key={talk.convoId}
                        title={talk.otherName}
                      >
                        <div className="recipient-info">
                          <span>{talk.otherName}</span>
                        </div>
                      </option>
                    ))*/}
                      {
                        <div className="recipient-info">
                          <span>{recipientName}</span>
                        </div>
                      }
                    </div>
                    <div className="chat-messages">
                      {messages.map((message) => {
                        const messageTime = new Date(message.timestamp);
                        const formattedDate = messageTime.toLocaleDateString();
                        const formattedTime = messageTime.toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        );

                        return (
                          <div
                            key={message._id}
                            className={`message-container ${
                              message.sender === myId ? "sender" : "receiver"
                            }`}
                          >
                            {/* <p className="recipient-name">
                          {message.sender === myId
                            ? "You"
                            : message.recipient_name}
                        </p> */}
                            <div className="message">
                              <p className="message-content">
                                {message.content}
                              </p>
                              <p className="message-timestamp">
                                {formattedDate} - {formattedTime}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                    <form className="message-input">
                      <div className="input-container">
                        <input
                          type="text"
                          placeholder="Type your message here..."
                          value={inputValue}
                          onChange={handleInputChange}
                          className="message-text-input"
                        />

                        <button
                          type="submit"
                          onClick={postNewMessage}
                          className="send-button"
                          disabled={!inputValue}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
