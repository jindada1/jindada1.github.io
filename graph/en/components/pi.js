/**
 * 实验场景：圆周率 pi 的模拟
 */

Vue.component('gh-pi', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Parameters</el-divider>
                <kris-num-input title="number of points" v-model="experiment.pointNum" :step="100" :min="100" :max="10000"></kris-num-input>
                <kris-num-input title="radius of circle" v-model="radius" :step="10" :min="50"></kris-num-input>
                <kris-button title="run" :tips="tips" :click="run"></kris-button>
                
                <el-divider content-position="center">Result</el-divider>
                <kris-progress title="points inside the circle" :total="result.totalNum" :value="result.insideNum"></kris-progress>
                <kris-form-item title="estimated Pi" :value="result.pi"></kris-form-item>
                <kris-switch title="record result automatically" v-model="storeResult"></kris-switch>

                <el-divider content-position="center">History Results</el-divider>
                <kris-table v-model="historyResult" :summary="getSummary" :height="300"></kris-table>
                
                <el-divider content-position="center">Layout</el-divider>
                <kris-color-picker v-model="plotConfig.insideColor" title="color inside the circle"></kris-color-picker>
                <kris-color-picker v-model="plotConfig.outsideColor" title="color outside the circle"></kris-color-picker>
            </template>
            <template v-slot:right>
                <div class="graph-transparent-background graph-canvas-container">
                    <kris-canvas ref="playground" :width="radius * 2" :height="radius * 2"></kris-canvas>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-pi",
            updateLock: false,
            inited: false,
            experiment: {
                pointNum: 1000,
            },
            radius: 280,
            plotConfig: {
                insideColor: "#FF6D24",
                outsideColor: "#409EFF",
            },
            points: [],
            storageList: [
                "radius",
                "experiment",
                "plotConfig",
                "storeResult"
            ],
            result: {
                totalNum: 0,
                insideNum: 0,
                pi: "😀"
            },
            precise: 8,
            storeResult: false,
            historyResult: []
        }
    },
    watch: {
        experiment: {
            handler: function () {
                this.generatePoints();
                this.display();
            },
            deep: true
        },
        plotConfig: {
            handler: function () {
                this.display();
            },
            deep: true
        },
        radius() {
            Vue.nextTick(() => {
                this.generatePoints();
                this.display();
            })
        }
    },
    computed: {
        tips() {
            return 'run once'
        },
        getSummary() {
            let avg = "0";
            
            if (this.historyResult.length) {
                const values = this.historyResult.map(result => Number(result.pi));
                let sum = values.reduce((prev, curr) => {
                    return prev + curr
                }, 0);
                avg = (sum / this.historyResult.length).toFixed(this.precise).toString()
            }
            
            return {
                key: "Average",
                value: avg
            }
        }
    },
    methods: {
        run() {
            this.generatePoints();
            this.display()
        },
        generatePoints() {
            this.points.length = 0;
            for (let i = 0; i < this.experiment.pointNum; i++) {
                let x = Math.random() * this.radius * 2;
                let y = Math.random() * this.radius * 2;
                this.points.push([parseInt(x), parseInt(y)]);
            }
            this.count()
        },
        count() {
            const insides = this.points.filter(point => this.inside(point[0], point[1]));
            let result = {
                totalNum: this.experiment.pointNum,
                insideNum: insides.length,
                pi: (4 * insides.length / this.experiment.pointNum).toFixed(this.precise).toString()
            }
            this.result = result;
            if (this.storeResult) {
                this.historyResult.push(result)
            }
        },
        display() {
            if (this.updateLock) return;
            this.$refs.playground.refresh();
            for (const point of this.points) {
                let color = this.inside(point[0], point[1]) ? this.plotConfig.insideColor : this.plotConfig.outsideColor;
                this.$refs.playground.point(point[0], point[1], 3, color);
            }
            this.storeSettings();
        },
        inside(x, y) {
            let r = this.radius;
            let disq = Math.pow(x - r, 2) + Math.pow(y - r, 2);
            return disq < Math.pow(this.radius, 2)
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