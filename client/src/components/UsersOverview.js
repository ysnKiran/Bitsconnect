import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import RangeDatePicker from "../components/common/RangeDatePicker";
import  Chart  from '../components/utils/chart';

class UsersOverview extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { chartData, chartOptions } = this.props;


  
    const BlogUsersOverview = new Chart(this.canvasRef.current, {
      type: "lineWithLine",
      data: chartData,
      options: chartOptions
    });
  
    // Check if the dataset and data exist before accessing them
    const datasets = BlogUsersOverview.data.datasets;
    if (datasets && datasets.length > 0) {
      const dataset = datasets[0];
      const data = dataset.data;
  
      if (data && data.length > 0) {
        const firstPoint = BlogUsersOverview.getDatasetMeta(0).data[0];
        const lastPoint = BlogUsersOverview.getDatasetMeta(0).data[data.length - 1];
  
        if (firstPoint && firstPoint._model) {
          firstPoint._model.radius = 0;
        }
  
        if (lastPoint && lastPoint._model) {
          lastPoint._model.radius = 0;
        }
      }
    }
  
    // Render the chart.
    BlogUsersOverview.render();
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Project Listings</h6>
        </CardHeader>
        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            <Col sm="6" className="d-flex mb-2 mb-sm-0">
              <RangeDatePicker />
            </Col>
            <Col>
              <Button
                size="sm"
                className="d-flex btn-white ml-auto mr-auto ml-sm-auto mr-sm-0 mt-3 mt-sm-0"
              >
                View Full Report &rarr;
              </Button>
            </Col>
          </Row>
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersOverview.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

// UsersOverview.defaultProps = {
//   title: "Users Overview",
//   chartData: {
//     labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
//     datasets: [
//       {
//         label: "Current Month",
//         fill: "start",
//         data: [
//           500,
//           800,
//           320,
//           180,
//           240,
//           320,
//           230,
//           650,
//           590,
//           1200,
//           750,
//           940,
//           1420,
//           1200,
//           960,
//           1450,
//           1820,
//           2800,
//           2102,
//           1920,
//           3920,
//           3202,
//           3140,
//           2800,
//           3200,
//           3200,
//           3400,
//           2910,
//           3100,
//           4250
//         ],
//         backgroundColor: "rgba(0,123,255,0.1)",
//         borderColor: "rgba(0,123,255,1)",
//         pointBackgroundColor: "#ffffff",
//         pointHoverBackgroundColor: "rgb(0,123,255)",
//         borderWidth: 1.5,
//         pointRadius: 0,
//         pointHoverRadius: 3
//       },
//       {
//         label: "Past Month",
//         fill: "start",
//         data: [
//           380,
//           430,
//           120,
//           230,
//           410,
//           740,
//           472,
//           219,
//           391,
//           229,
//           400,
//           203,
//           301,
//           380,
//           291,
//           620,
//           700,
//           300,
//           630,
//           402,
//           320,
//           380,
//           289,
//           410,
//           300,
//           530,
//           630,
//           720,
//           780,
//           1200
//         ],
//         backgroundColor: "rgba(255,65,105,0.1)",
//         borderColor: "rgba(255,65,105,1)",
//         pointBackgroundColor: "#ffffff",
//         pointHoverBackgroundColor: "rgba(255,65,105,1)",
//         borderDash: [3, 3],
//         borderWidth: 1,
//         pointRadius: 0,
//         pointHoverRadius: 2,
//         pointBorderColor: "rgba(255,65,105,1)"
//       }
//     ]
//   }
// };

export default UsersOverview;
