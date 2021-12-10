/**
 * 模板组件
 */

Vue.component('gh-once', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Parameters</el-divider>
                <kris-tag-group v-model="experiment.probabilities" title="success rate : P" :min="0.001" :max="0.1"></kris-tag-group>
                <kris-num-input-range v-model="experiment.trialsRange" title="number of trials : N" :min="1"></kris-num-input-range>
            </template>
            <template v-slot:right>
                <div id="container" style="height: 100%">
                    <div :id="plotId" style="height: 100%">
                    </div>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-once",
            updateLock: false,
            inited: false,
            plotSize: {
                width: 1000,
                height: 600,
            },
            firstGetSize: true,
            experiment: {
                probabilities: [0.001, 0.25, 0.5, 0.075, 0.1],
                trialsRange: [1, 100]
            },
            storageList: [
                "experiment"
            ]
        }
    },
    watch: {
        experiment: {
            handler: function () {
                this.display();
            },
            deep: true
        },
    },
    computed: {
        plotId() {
            return this.componentName + "-plot";
        },
    },
    methods: {
        display() {
            if (this.updateLock) return;
            var data = this.experiment.probabilities.map(p => this.calcLine(p));
            Plotly.newPlot(this.plotId, data, {
                autosize: false,
                height: this.plotSize.height,
                width: this.plotSize.width
            });
            this.storeSettings()
        },
        calcLine(possibility) {
            let i = this.experiment.trialsRange[0]
            let x = [], y = []
            while (i < this.experiment.trialsRange[1]) {
                x.push(i)
                y.push(this.happenAtLeastOnce(possibility, i))
                i++;
            }
            return {
                x, y,
                type: 'scatter',
                name: 'p = ' + possibility.toString()
            };
        },
        happenAtLeastOnce(p, n) {
            return 1 - Math.pow((1 - p), n);
        },
        storeSettings() {
            localStorage.setItem(this.componentName, JSON.stringify(this.$data))
        },
        outputsize() {
            this.plotSize = {
                width: container.offsetWidth,
                height: container.offsetHeight * 0.75,
            }
            if (this.firstGetSize) {
                this.firstGetSize = false;
                this.display();
            }
        },
        init() {
            // console.log("init");
            if (this.inited) return;
            new ResizeObserver(this.outputsize).observe(container)
            this.inited = true;
        }
    },
    mounted() {
        this.$refs.frame.loadData(this);
    }
})