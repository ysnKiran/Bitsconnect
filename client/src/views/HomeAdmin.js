import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../views/HomePage.css";
import "../views/nav.css";
import Navbar from "./AdminNavbar.js";
import "../views/global.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { BsSliders } from "react-icons/bs";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import UsersByDevice from "../components/UsersByDevice.js";
import SmallStats from "../components/SmallStats.js";
import UsersOverview from "../components/UsersOverview.js";








  const HomeAdmin = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem("idToken");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
      datasets: [
        {
          hoverBorderColor: "#ffffff",
          data: [2, 3, 1],
          backgroundColor: [
            "rgba(0,123,255,0.9)",
            "rgba(0,123,255,0.5)",
            "rgba(0,123,255,0.3)",
          ],
        },
      ],
      labels: ["below 10000", "10000-50000", "above 50000"],
    });
  
    const chartOptions = {
      responsive: true,
      legend: {
        position: "top"
      },
      elements: {
        line: {
          // A higher value makes the line look skewed at this ratio.
          tension: 0.3
        },
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: false,
            ticks: {
              callback(tick, index) {
                // Jump every 7 values on the X axis labels to avoid clutter.
                return index % 7 !== 0 ? "" : tick;
              }
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              suggestedMax: 45,
              callback(tick) {
                if (tick === 0) {
                  return tick;
                }
                // Format the amounts using Ks for thousands.
                return tick > 999 ? `${(tick / 1000).toFixed(1)}K` : tick;
              }
            }
          }
        ]
      },
      hover: {
        mode: "nearest",
        intersect: false
      },
      tooltips: {
        custom: false,
        mode: "nearest",
        intersect: false
      }
    };

    const smallStats = [
      {
        label: "Project Listings",
        value: "2,39",
        percentage: "4.7%",
        increase: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "6", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(0, 184, 216, 0.1)",
            borderColor: "rgb(0, 184, 216)",
            data: [1, 2, 1, 3, 5, 4, 7],
          },
        ],
      },
      {
        label: "Avg Applications per project",
        value: "24",
        percentage: "12.4",
        increase: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "6", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(23,198,113,0.1)",
            borderColor: "rgb(23,198,113)",
            data: [1, 2, 3, 3, 3, 4, 4],
          },
        ],
      },
      {
        label: "Avg Duration of a project",
        value: "4 weeks",
        percentage: "3.8%",
        increase: false,
        decrease: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "4", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255,180,0,0.1)",
            borderColor: "rgb(255,180,0)",
            data: [2, 3, 3, 3, 4, 3, 3],
          },
        ],
      },
      {
        label: "Avg selections per project",
        value: "3",
        percentage: "2.71%",
        increase: false,
        decrease: true,
        chartLabels: [4, null, 4, 4, 6, null, null],
        attrs: { md: "4", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255,65,105,0.1)",
            borderColor: "rgb(255,65,105)",
            data: [1, 7, 1, 3, 1, 4, 8],
          },
        ],
      },
      {
        label: "Avg Pay range for projects",
        value: "15,400",
        percentage: "2.4%",
        increase: false,
        decrease: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { md: "4", sm: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgb(0,123,255,0.1)",
            borderColor: "rgb(0,0,0)",
            data: [3, 2, 3, 2, 4, 5, 4],
          },
        ],
      },
    ];
    
    
    const goBack = () => {
    navigate("/home");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    displayDetails();
  }, []);

  const displayDetails = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/reviews`, {
        headers: {
          authorization: `${id}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setReports(response.data);
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
      });
  };

  const DonzoReport = (prj_id) => {
    // For Reporting ki dekhliya bhai
    
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/${prj_id}/complete`,
        {
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      )
      .then((response) => {
        displayDetails();
        console.log("Donzo");
      })
      .catch((error) => {
        console.error("Error sending user data to backend:", error);
        toast.error('Error', {
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
    
  };


 
  return (
    <div>
      <Navbar />
      <div className="apply-form3">
        <h1 className="with-margin1">Project Analytics</h1>

        <Container fluid className="main-content-container px-4">
          {/* Page Header */}
          <Row noGutters className="page-header py-4">
            {/* <PageTitle title="Blog Overview" subtitle="Dashboard" className="text-sm-left mb-3" /> */}
          </Row>

          {/* Small Stats Blocks */}
          <Row>
            {smallStats.map((stats, idx) => (
              <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                <SmallStats
                  id={`small-stats-${idx}`}
                  variation="1"
                  chartData={stats.datasets}
                  chartLabels={stats.chartLabels}
                  label={stats.label}
                  value={stats.value}
                  percentage={stats.percentage}
                  increase={stats.increase}
                  decrease={stats.decrease}
                />
              </Col>
            ))}
          </Row>

          <Row>
            {/* Users Overview */}
            <Col lg="8" md="12" sm="12" className="mb-4">
              <UsersOverview
                title="Users Overview"
                chartData={chartData}
                chartOptions={chartOptions}
              />
            </Col>

            {/* Users by Device */}
            <Col lg="4" md="6" sm="12" className="mb-4">
              <UsersByDevice chartData={chartData} />
            </Col>
          </Row>

          <div className="size2">
            {loading ? (
              <div className="spinner-container">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="project-container3">
                <ul className="project-list3">
                  {reports.length > 0 ? (
                    reports.map((prj) => (
                      <div key={prj._id} className="project-item4">
                        <div className="project-item-content3">
                          <h5 style={{ fontSize: "1.2rem" }}>{prj.report}</h5>
                          <p style={{ fontSize: "1.2rem" }}>
                            <b>By</b>: {prj.user_name}
                          </p>
                        </div>
                        <div className="project-actions">
                          <button
                            className="apply-btn1"
                            onClick={() => DonzoReport(prj._id)}
                          >
                            Donzo
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1></h1>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};



export default HomeAdmin;