/**
 * 实验场景：二项分布基础概念
 */
Vue.component('gh-binomial', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Parameters</el-divider>
                <kris-tag-group v-model="experiment.probabilities" title="success rates" :min="0" :max="1"></kris-tag-group>
                <kris-num-input-range v-model="experiment.trialsRange" title="range of trail times" :min="1"></kris-num-input-range>
                <el-divider content-position="center">Histogram</el-divider>
                <kris-color-picker v-model="histogramConfig.barColor" title="filling color"></kris-color-picker>
                <kris-color-picker v-model="histogramConfig.barStrokeColor" title="border color"></kris-color-picker>
                <kris-num-input v-model="histogramConfig.height" title="height" :step="10"></kris-num-input>
                <kris-num-input v-model="histogramConfig.maxWidth" title="max width" :step="5"></kris-num-input>
                <kris-num-input v-model="histogramConfig.maxBarWidth" title="bar max width" :step="2"></kris-num-input>
                <el-divider content-position="center">Layout</el-divider>
                <kris-slider v-model="layout.rowDistance" title="row margin"></kris-slider>
                <kris-slider v-model="layout.marginX" title="col margin"></kris-slider>
            </template>
            <template v-slot:right>
                <div class="graph-maze">
                    <div class="graph-maze-row graph-maze-sticky-head-top">
                        <div class="graph-maze-head sticky-left"></div>
                        <div v-for="(p, c) in experiment.probabilities" class="graph-maze-element-container" v-bind:style="elementStyle">
                            <div v-bind:style="'text-align: ' + getAlign(c)">
                                {{p}}
                            </div>
                        </div>
                    </div>
                    <div v-for="(row, r) in dataMaze" :key="r" class="graph-maze-row">
                        <div class="graph-maze-head sticky-left">{{r + experiment.trialsRange[0]}}</div>
                        <div v-for="(graph, c) in row" :key="coordinateKey(r, c)"
                            class="graph-maze-element-container" v-bind:style="elementStyle">
                            <canvas v-bind:class="'graph-maze-element-' + getAlign(c)" :id="coordinateKey(r, c)"></canvas>
                        </div>
                    </div>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-binomial",
            updateLock: false,
            inited: false,
            dataMaze: [],
            experiment: {
                probabilities: [0.125, 0.25, 0.5, 0.75, 0.875],
                trialsRange: [1, 8]
            },
            histogramConfig: {
                barColor: "#88C3FF",
                barStrokeColor: "#000000",
                height: 180,
                maxWidth: 200,
                maxBarWidth: 30,
                axisY: false,
            },
            layout: {
                marginX: 10,
                rowDistance: 10,
            },
            storageList: [
                "experiment",
                "histogramConfig"
            ]
        }
    },
    watch: {
        histogramConfig: {
            handler: function () {
                this.render(this.histogramConfig);
            },
            deep: true
        },
        experiment: {
            handler: function () {
                this.display();
            },
            deep: true
        },
    },
    computed: {
        elementStyle: function () {
            return {
                margin: this.layout.rowDistance + "px " + this.layout.marginX + "px"
            }
        },
    },
    methods: {
        coordinateKey(r, c) {
            return this.componentName + r.toString() + "," + c.toString();
        },
        getAlign(c) {
            let p = this.experiment.probabilities[c]
            if (p < 0.5)
                return "left";
            else if (p === 0.5)
                return "center";
            else
                return "right";
        },
        render(config = {}) {
            for (let [r, row] of this.dataMaze.entries()) {
                for (let [c, data] of row.entries()) {
                    histogram(document.getElementById(this.coordinateKey(r, c)), config).draw(data);
                }
            }
            this.storeSettings()
        },
        calculateData() {
            var data = [];
            for (let trial = this.experiment.trialsRange[0]; trial <= this.experiment.trialsRange[1]; trial++) {
                let row = []
                for (let p of this.experiment.probabilities) {
                    row.push({
                        datas: binominalExperience(trial, p)
                    })
                }
                data.push(row);
            }
            return data;
        },
        display() {
            if (this.updateLock) return;
            this.dataMaze = this.calculateData();
            Vue.nextTick(() => {
                this.render(this.histogramConfig);
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