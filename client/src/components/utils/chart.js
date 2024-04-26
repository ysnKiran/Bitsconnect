import { Chart, PieController, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';

class LineWithLineController extends LineController {
  draw(ease) {
    super.draw(ease);

    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      const activePoint = this.chart.tooltip._active[0];
      const { ctx } = this.chart;
      const { x } = activePoint.element;
      const topY = this.chart.scales.y.top;
      const bottomY = this.chart.scales.y.bottom;

      // Draw the line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#ddd';
      ctx.stroke();
      ctx.restore();
    }
  }
}

LineWithLineController.id = 'lineWithLine';
LineWithLineController.defaults = {
  // Define any default options for the LineWithLine controller
};

// Register the custom controller
Chart.register(LineWithLineController);

// Register other controllers, elements, and plugins
Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default Chart;