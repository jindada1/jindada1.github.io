/**
 * 实验场景：联合概率密度
 */

Vue.component('gh-jointdensity', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Range of X, Y</el-divider>
                <kris-num-input-range v-model="range.x" title="X："></kris-num-input-range>
                <kris-num-input-range v-model="range.y" title="Y："></kris-num-input-range>
                
                <el-divider content-position="center">Gaussian</el-divider>
                <kris-num-input-double v-model="gaussian.x" :names="gaussian.names" title="X：">
                </kris-num-input-double>
                <kris-num-input-double v-model="gaussian.y" :names="gaussian.names" title="Y：">
                </kris-num-input-double>
                
                <el-divider content-position="center">Slice</el-divider>
                <kris-switch title="slice on hover" v-model="showSlice"></kris-switch>

                <el-divider content-position="center">Plot</el-divider>
                <kris-slider v-model="plotConfig.precise" title="smoothing accuracy" :min="0.01" :max="0.2" :step="0.01">
                </kris-slider>
                <kris-color-picker v-model="plotConfig.maxColor" title="color of max value"></kris-color-picker>
                <kris-color-picker v-model="plotConfig.minColor" title="color of min value"></kris-color-picker>
                <kris-switch title="perspective" v-model="isPerspective"></kris-switch>
                
                <el-divider content-position="center">Initial Eye</el-divider>
                <kris-slider v-model="eye.x" title="X" :min="-2" :max="2" :step="0.1"></kris-slider>
                <kris-slider v-model="eye.y" title="Y" :min="-2" :max="2" :step="0.1"></kris-slider>
                <kris-slider v-model="eye.z" title="Z" :min="-2" :max="2" :step="0.1"></kris-slider>
            </template>
            <template v-slot:right>
                <div style="height: 100%; display:flex;">
                    <div :id="plot3D()" style="height: 100%; width:60%;"></div>
                    <div style="height: 100%; width:40%;">
                        <div :id="plot2D('xoz')" style="height: 50%;"></div>
                        <div :id="plot2D('yoz')" style="height: 50%;"></div>
                    </div>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-jointdensity",
            updateLock: false,
            inited: false,
            xyzSurface: {},
            xozCurve: {},
            yozCurve: {},
            xozArea: {},
            yozArea: {},
            range: {
                x: [-4, 4],
                y: [-4, 4]
            },
            gaussian: {
                names: ["avg", "std"],
                x: [0, 1],
                y: [0, 1]
            },
            plotConfig: {
                precise: 0.1,
                minColor: "#D9ECFF",
                maxColor: "#409EFF",
            },
            slices: {
                x: 0,
                y: 0,
            },
            eye: {
                x: 1.87,
                y: 0.88,
                z: 0.64
            },
            isPerspective: true,
            showSlice: true,
            firstRender: true,
            storageList: [
                "plotConfig",
                "range",
                "gaussian",
                "slices",
                "eye",
                "isPerspective"
            ],
        }
    },
    watch: {
        plotConfig: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        range: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        gaussian: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        slices: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        eye: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        isPerspective(val) {
            this.display();
        },
        showSlice() {
            this.display();
        }
    },
    methods: {
        plot3D() {
            return this.componentName + "-plot3D";
        },
        plot2D(id) {
            return this.componentName + "-plot2D-" + id;
        },
        layout2D(title, xtitle) {
            return {
                title: {
                    text: title,
                    font: {
                        size: 14
                    },
                },
                xaxis: {
                    title: xtitle
                },
                yaxis: {
                    title: 'N',
                    range: [0, this.jointGaussian(this.gaussian.x[0], this.gaussian.y[0])]
                },
            }
        },
        layout3D() {
            return {
                scene: {
                    camera: {
                        eye: this.eye,
                        projection: {
                            type: this.isPerspective ? "perspective" : "orthographic"
                        }
                    },
                    xaxis: {
                        showspikes: false,
                        spikesides: false
                    },
                    yaxis: {
                        showspikes: false,
                        spikesides: false
                    },
                    zaxis: {
                        showspikes: false,
                        spikesides: false
                    }
                },
                hoverinfo: 'skip',
                hovermode: false,
            }
        },
        curve(name) {
            return {
                x: [],
                y: [],
                mode: 'lines',
                name
            }
        },
        surface() {
            return {
                x: [],
                y: [],
                z: [],
                type: 'surface',
                colorscale: [[0, this.plotConfig.minColor], [1, this.plotConfig.maxColor]],
                colorbar: {
                    ticklabelposition: "inside"
                },
                showscale: false,
                contours: {
                    x: {
                        highlight: true,
                        highlightcolor: "blue",
                        width: 4 
                    },
                    y: {
                        highlight: true,
                        highlightcolor: "red",
                        width: 4 
                    },
                    z: { highlight: false }
                },
                opacity: 1
            }
        },
        render() {
            let xozTitle = `slice on x = ${this.slices.x.toFixed(5)}，area is ${this.xozArea.toFixed(5)}`
            let yozTitle = `slice on y = ${this.slices.y.toFixed(5)}，area is ${this.yozArea.toFixed(5)}`
            if (this.firstRender) {
                Plotly.newPlot(this.plot3D(), [this.xyzSurface], this.layout3D());
                this.bindHoverEvent(this.plot3D());
                Plotly.newPlot(this.plot2D('xoz'), [this.xozCurve], this.layout2D(xozTitle, "y"));
                Plotly.newPlot(this.plot2D('yoz'), [this.yozCurve], this.layout2D(yozTitle, "x"));
                this.firstRender = false;
            }
            Plotly.react(this.plot3D(), [this.xyzSurface], this.layout3D());
            Plotly.react(this.plot2D('xoz'), [this.xozCurve], this.layout2D(xozTitle, "y"));
            Plotly.react(this.plot2D('yoz'), [this.yozCurve], this.layout2D(yozTitle, "x"));
            this.storeSettings()
        },
        bindHoverEvent(name) {
            var myPlot = document.getElementById(name)
            myPlot.on('plotly_hover', (data) => {
                this.slices.x = data.points[0].x
                this.slices.y = data.points[0].y
            })
        },
        rangeToArray(range, step = 1) {
            var arr = [];
            for (let num = range[0]; num < range[1]; num += step) {
                arr.push(num);
            }
            return arr;
        },
        jointGaussian(x, y) {
            return Gaussian(this.gaussian.x[0], this.gaussian.x[1]).get(x) * Gaussian(this.gaussian.y[0], this.gaussian.y[1]).get(y);
        },
        sliceX(x) {
            let curve = this.curve(`x = ${x}`);
            curve.line = {
                color: "blue",
            }
            let area = 0;
            for (let y = this.range.y[0]; y < this.range.y[1]; y += this.plotConfig.precise) {
                let z = this.jointGaussian(x, y);
                curve.x.push(y)
                curve.y.push(z)
                area += this.plotConfig.precise * z
            }
            this.xozArea = area;
            this.xozCurve = curve;
        },
        sliceY(y) {
            let curve = this.curve(`y = ${y}`);
            curve.line = {
                color: "red",
            }
            let area = 0;
            for (let x = this.range.x[0]; x < this.range.x[1]; x += this.plotConfig.precise) {
                let z = this.jointGaussian(x, y);
                curve.x.push(x);
                curve.y.push(z)
                area += this.plotConfig.precise * z
            }
            this.yozArea = area
            this.yozCurve = curve
        },
        calcSurface() {
            let surface = this.surface();
            surface.x = this.rangeToArray(this.range.x, this.plotConfig.precise)
            surface.y = this.rangeToArray(this.range.y, this.plotConfig.precise)
            surface.z = [];
            for (let y of surface.y) {
                let rowx = []
                for (let x of surface.x) {
                    rowx.push(this.jointGaussian(x, y));
                }
                surface.z.push(rowx);
            }
            this.xyzSurface = surface;
        },
        calculateData() {
            if (this.showSlice) {
                this.sliceX(this.slices.x);
                this.sliceY(this.slices.y);
            }
            this.calcSurface();
        },
        display() {
            if (this.updateLock) return;
            this.calculateData();
            Vue.nextTick(() => {
                this.render();
            })
        },
        storeSettings() {
            localStorage.setItem(this.componentName, JSON.stringify(this.$data))
        },
        init() {
            if (this.inited) return;
            this.display();
            this.inited = true;
        }
    },
    mounted() {
        this.$refs.frame.loadData(this);
    }
})