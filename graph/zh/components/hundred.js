/**
 * 实验场景：100次实验，成功次数的概率分布
 */
Vue.component('gh-hundred', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">实验设置</el-divider>
                <kris-tag-group v-model="experiment.probabilities" title="成功率数组" :min="0" :max="1"></kris-tag-group>
                <el-divider content-position="center">柱状图属性</el-divider>
                <kris-color-picker v-model="histogramConfig.barColor" title="填充颜色">
                </kris-color-picker>
                <kris-color-picker v-model="histogramConfig.barStrokeColor" title="边缘颜色">
                </kris-color-picker>
                <kris-num-input v-model="histogramConfig.height" title="图高度" :step="10"></kris-num-input>
                <kris-num-input v-model="histogramConfig.maxWidth" title="图最大宽度" :step="5"></kris-num-input>
                <kris-num-input v-model="histogramConfig.maxBarWidth" title="柱最大宽度" :step="2">
                </kris-num-input>
                <el-divider content-position="center">布局</el-divider>
                <kris-slider v-model="layout.rowDistance" :title="'行间距'"></kris-slider>
            </template>
            <template v-slot:right>
                <div class="graph-maze">
                    <div v-for="(row, r) in dataMaze" :key="r" class="graph-maze-row">
                        <div class="graph-maze-head"></div>
                        <div v-for="(graph, c) in row" :key="coordinateKey(r, c)"
                            class="graph-maze-element-container" v-bind:style="elementStyle">
                            <canvas v-bind:class="'graph-maze-element-' + getAlign(c, row)"
                                :id="coordinateKey(r, c)"></canvas>
                        </div>
                        <div class="graph-maze-head sticky-right">{{percentageFmt(experiment.probabilities[r])}}</div>
                    </div>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-hundred",
            updateLock: false,
            inited: false,
            dataMaze: [],
            experiment: {
                probabilities: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
                trials: 100
            },
            histogramConfig: {
                barColor: "#88C3FF",
                barStrokeColor: "#000000",
                height: 100,
                maxWidth: 1000,
                maxBarWidth: 10,
                axisXStep: 10,
                axisYStepNum: 0.05, // TODO:自适应高度
                padx: 50,
                pady: 16,
                axisXNum: true,
            },
            layout: {
                rowDistance: 10,
                marginX: 0,
            },
            storageList: [
                "histogramConfig",
                "experiment"
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
        getAlign(c, row) {
            if (c < (row.length - 1) / 2)
                return "left";
            else if (c === (row.length - 1) / 2)
                return "center";
            else
                return "right";
        },
        percentageFmt(f) {
            return ((f * 100).toFixed(2)).toString() + "%";
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
            for (let p of this.experiment.probabilities) {
                let row = []
                row.push({
                    datas: binominalExperience(this.experiment.trials, p)
                })
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