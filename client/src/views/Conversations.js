import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../views/Message.css";

const Conversations = () => {
  const { convo_id } = useParams();
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading projects
  const [myId, setMyId] = useState();

  const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

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
        setMessages(response.data);
        console.log("Messages:", response.data);
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
  }, []);

  const getConvo = (convo_id) => {
    console.log("Convo clicked: ", convo_id);
    // navigate to Apply page with Id as params
    navigate(`/messages/${convo_id}`);
  };

  return (
    <div className="chat-container">
      <Navbar />
      <div className="apply-form3">
        <div className="row justify-content-between align-items-center mb-5 left-margin">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>

        <h1 className="with-margin2">Let's Talk!</h1>

        {loading ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div className="menu">
            <div>
              <select
                className="form-select text-uppercase listing"
                multiple
                aria-label="multiple select example"
                onClick={(e) => navigate(`/messages/${e.target.value}`)}
              >
                {convos.map((talk) => (
                  <option
                    value={talk.convoId}
                    key={talk.convoId}
                    title={talk.otherName}
                  >
                    {talk.otherName}
                  </option>
                ))}
              </select>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${
                    message.sender === myId ? "sender" : "receiver"
                  }`}
                >
                  {console.log("MyId: ", message.myId)}
                  <p className="message-content">{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
