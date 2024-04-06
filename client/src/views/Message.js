import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import Navbar from "./NavbarHandlers.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../views/Message.css";

const Message = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("idToken");
  const [convos, setConvos] = useState([]);
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading projects

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
    <div>
      <Navbar />
      <div className="apply-form3">
        <div className="row justify-content-between align-items-center mb-5 left-margin">
          <div className="col-auto">
            <button className="btn btn-link" onClick={goBack}>
              <BsChevronLeft size={24} />
            </button>
          </div>
        </div>

        <h1 className="with-margin2">Lets Talk!</h1>
        <div>
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : convos.length > 0 ? (
            <div>
              <div className="menu">
                <div className="select">
                  <select
                    className="form-select text-uppercase listing"
                    multiple
                    aria-label="multiple select example"
                    onClick={(e) => navigate(`/messages/${e.target.value}`)}
                  >
                    {convos.map((talk) => (
                      <option
                        className="option"
                        value={talk.convoId}
                        key={talk.convoId}
                        title={talk.otherName}
                      >
                        {talk.otherName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chat-container">
                <div className="chat-messages" style={{alignItems:'center',justifyContent:'center'}}><h2>Choose a Convo To Show</h2></div>
                </div>
                
              </div>
              
            </div>
          ) : (
            <p>No conversations available!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
