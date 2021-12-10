/**
 * chart.js v1.0.0
 * (c) 2021 Kris Huang
 * Released under the MIT License.
 */


/**
 * init canvas for histogram
 *
 * @param {HTMLCanvasElement} canvas - The canvas to draw histogram on
 * @param {dict} conf - Configurations of histogram
 */
function histogram(canvasElement, conf) {
    /**
     * default settings
     */
    var config = {
        barColor: "lightgray",
        barStrokeColor: "black",
        height: 180,
        maxWidth: 200,
        maxBarWidth: 30,
        padx: 2,
        pady: 4,
        precise: 0.0000001,
        axisX: true,
        axisXNum: false,
        axisXStep: 1,
        axisY: true,
        axisYNum: false,
        axisYStepNum: 1,
        tickMark: 4,
        tickNumFont: "12px serif"
    }

    for (var key in conf) {
        config[key] = key in config ? conf[key] : config[key];
    }

    var canvas = canvasElement;
    var context = canvas.getContext("2d");

    var cWidth = config["maxWidth"];
    var cHeight = config["height"];
    var barWidth = config["maxBarWidth"];

    var heightPerValue = 1;

    function max(array) {
        if (array.length === 0) return null;
        let max = array[0];
        for (val of array)
            max = val > max ? val : max
        return max
    }

    function drawLine(fromX, fromY, toX, toY) {
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
    }

    function init(data) {
        let barNum = data.datas.length;
        let innerWidth = cWidth - config["padx"] * 2;
        let innerHeight = cHeight - config["pady"] * 2;

        barWidth = parseInt(barNum * barWidth > innerWidth ? innerWidth / barNum : barWidth);
        innerWidth = parseInt(barNum * barWidth > innerWidth ? innerWidth : barWidth * barNum);
        cWidth = innerWidth + config["padx"] * 2;

        canvas.width = cWidth;
        canvas.height = cHeight;

        let maxValue = max(data.datas);
        heightPerValue = innerHeight / maxValue;
    }

    function drawAxisXTickNumber(num, x, y) {
        if (!config.axisXNum) return;
        context.font = config.tickNumFont;
        context.textAlign = "center";
        context.textBaseline = "top";
        context.fillText(num.toString(), x, y);
    }

    function drawAxisYTickNumber(num, x, y) {
        if (!config.axisXNum) return;
        context.font = config.tickNumFont;;
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText((num.toFixed(2)).toString(), x, y);
    }

    function drawAxis(data) {
        let strokeStyle = context.strokeStyle;
        let lineWidth = context.lineWidth;
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.translate(0.5, 0.5);
        if (config.axisX) {
            drawLine(config.padx, cHeight - config.pady, cWidth - config.padx, cHeight - config.pady)
            for (let i = 0; i < data.datas.length; i += config.axisXStep) {
                let x = config.padx + i * barWidth + barWidth / 2;
                drawLine(x, cHeight - config.pady, x, cHeight - config.pady + config.tickMark);
                drawAxisXTickNumber(i, x, cHeight - config.pady + config.tickMark);
            }
        }
        if (config.axisY) {
            drawLine(config.padx, config.pady, config.padx, cHeight - config.pady)
            let t = 0;
            while(mapY(t) > config.pady) {
                let y = mapY(t);
                drawLine(config.padx, y, config.padx - config.tickMark, y);
                drawAxisYTickNumber(t, config.padx - config.tickMark * 2, y)
                t += config.axisYStepNum
            }
        }
        context.translate(-0.5, -0.5);
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
    }

    function mapX(bar) {
        return config['padx'] + bar * barWidth;
    }

    function mapY(value) {
        return cHeight - config['pady'] - mapH(value);
    }

    function mapH(value) {
        return value > config.precise ? parseInt(value * heightPerValue) : 0;
    }

    function drawBars(data) {
        context.fillStyle = config["barColor"];
        context.strokeStyle = config["barStrokeColor"];
        values = data.datas;

        for (let [i, value] of values.entries()) {
            let w = barWidth - 1
            let h = mapH(value)
            let y = mapY(value)
            let x = mapX(i)
            if(h < 1) continue;
            context.strokeRect(x, y, w, h)
            context.fillRect(x, y, w, h);
        }
    }

    return {
        draw: function (data) {
            init(data);
            drawAxis(data);
            drawBars(data);
        }
    }
}
