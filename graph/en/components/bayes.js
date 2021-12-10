/**
 * 实验场景：贝叶斯
 */

Vue.component('gh-bayes', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Parameters</el-divider>
                <kris-num-input title="total" v-model="experiment.total" :step="100" :min="0"></kris-num-input>
                <kris-num-input title="positive" v-model="experiment.positive" :step="5" :min="0" :max="experiment.total"></kris-num-input>
                <div style="margin: 20px 0 0 0;"></div>
                <kris-slider title="probability of true negative" v-model="experiment.NN" :min="0" :max="1" :step="0.01" :fix="precise"></kris-slider>
                <kris-form-item title="probability of false negative" :value="NP.toString()"></kris-form-item>
                <div style="margin: 20px 0 0 0;"></div>
                <kris-slider title="probability of true positive" v-model="experiment.PP" :min="0" :max="1" :step="0.01" :fix="precise"></kris-slider>
                <kris-form-item title="probability of false positive" :value="PN.toString()"></kris-form-item>
                <kris-button title="start" tips="simulate according to above params" :click="display"></kris-button>
            
                <el-divider content-position="center">Layout</el-divider>
                <kris-color-picker v-model="plotConfig.positiveColor" title="truly positive color"></kris-color-picker>
                <kris-color-picker v-model="plotConfig.unPositiveColor" title="truly negative color"></kris-color-picker>
                <kris-color-picker v-model="plotConfig.emulateBarColor" title="simulation result color"></kris-color-picker>
                <kris-color-picker v-model="plotConfig.theoryBarColor" title="theoretical result color"></kris-color-picker>
                <kris-slider v-model="plotConfig.barWidth" title="bar height" :min="10" :max="100" :step="1"></kris-slider>
                <kris-slider v-model="plotConfig.maxBarHeight" title="bar max width" :min="100" :max="600" :step="10"></kris-slider>
            </template>
            <template v-slot:right>
                <el-row class="kris-icons-row">
                    <el-col :span="12"> Truly Positive </el-col>
                    <el-col :span="12"> Truly Negative </el-col>
                </el-row>
                <el-row class="kris-icons-row">
                    <el-col v-for="(dp, index) in order" :key="index" :span="6">
                        <kris-user :diagnosed="dp[0]" :positive="dp[1]" 
                            :highlight="plotConfig.positiveColor" 
                            :normal="plotConfig.unPositiveColor">
                        </kris-user>
                    </el-col>
                </el-row>
                <el-row class="kris-icons-row">
                    <el-col :span="6" v-for="(res, i) in result" :key="i"> {{res[0]}} / {{res[1]}} </el-col>
                </el-row>
                <el-row class="kris-icons-row" :style="'height:'+ plotConfig.maxBarHeight +'px'">
                    <el-col :span="6" v-for="(h, index) in barHeights" :key="index">
                        <div class="kris-multibar-col">
                            <div class="kris-col-bar" :style="
                                'height:'+ h[0] +'px;' +  
                                'background-color:'+ plotConfig.emulateBarColor + ';' + 
                                'width:' + plotConfig.barWidth + 'px'
                            "></div>
                            <div class="kris-col-bar" :style="
                                'height:'+ h[1] +'px;' +  
                                'background-color:'+ plotConfig.theoryBarColor + ';' + 
                                'width:' + plotConfig.barWidth + 'px'
                            "></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="result.length" class="kris-icons-row">
                    <el-col :span="12"> 
                        <div style="margin: 16px 0;"> Probability of True Positive </div>
                        <kris-formula :core="result[1][0]" :other="result[3][0]" :highlight="plotConfig.positiveColor"></kris-formula>
                    </el-col>
                    <el-col :span="12"> 
                        <div style="margin: 16px 0;"> Probability of False Negative</div>
                        <kris-formula :core="result[0][0]" :other="result[2][0]" :highlight="plotConfig.positiveColor"></kris-formula>
                    </el-col>
                </el-row>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-bayes",
            updateLock: false,
            inited: false,
            experiment: {
                total: 1000,    // 一共 N 个人
                positive: 100,  // 其中有 K 个阳性
                NN: 0.9,        // 实际是阴性诊断成阴性的概率
                PP: 0.9,        // 实际是阳性诊断成阳性的概率
            },
            plotConfig: {
                positiveColor: "#409EFF",
                unPositiveColor: "#005F08",
                barWidth: 40,
                maxBarHeight: 300,
                emulateBarColor: "#925500",
                theoryBarColor: "#4B0070"
            },
            order: [
                [true, true],
                [true, false],
                [false, true],
                [false, false],
            ],
            precise: 2,
            emulateResult: [],
            theoryResult: [],
            storageList: [
                "experiment",
                "plotConfig"
            ],
        }
    },
    watch: {
        experiment: {
            handler: function () {
                if (this.experiment.total < this.experiment.positive) {
                    this.experiment.positive = this.experiment.total;
                }

                this.display();
            },
            deep: true
        },
        plotConfig: {
            handler: function () {
                if (this.updateLock) return;
                this.storeSettings();
            },
            deep: true
        }
    },
    computed: {
        barHeights() {
            let TMV = Math.max(...this.theoryResult);
            // 所有结果的最大值
            let MV = TMV;
            // 柱状图的最大高度
            let MH = this.plotConfig.maxBarHeight;
            let ERes = this.emulateResult.map(num => parseInt(MH * num / MV));
            let TRes = this.theoryResult.map(num => parseInt(MH * num / MV));
            return this.enumerate(ERes, TRes)
        },
        result() {
            return this.enumerate(this.emulateResult, this.theoryResult);
        },
        NN() { return this.experiment.NN.toFixed(this.precise) },
        NP() { return (1 - this.experiment.NN).toFixed(this.precise) },  // 实际是阴性但诊断成阳性的概率
        PP() { return this.experiment.PP.toFixed(this.precise) },
        PN() { return (1 - this.experiment.PP).toFixed(this.precise) },  // 实际是阳性但诊断成阴性的概率
    },
    methods: {
        enumerate(arr1, arr2) {
            let res = []
            if (arr1.length === arr2.length) {
                for (let i = 0; i < arr1.length; i++) {
                    res.push([arr1[i], arr2[i]])
                }
            }
            return res;
        },
        display() {
            if (this.updateLock) return;
            this.emulate();
            this.storeSettings();
        },
        emulate() {
            // N 个人
            let N = this.experiment.total;
            // K 个阳性
            let K = this.experiment.positive;

            // 试图诊断阴性
            let NNums = this.divide(K, this.NN)
            // 试图诊断阴性
            let PNums = this.divide(N - K, this.PP)
            this.emulateResult = [NNums[1], NNums[0], ...PNums];

            // 计算理论值
            this.theoryResult = [
                K * this.NP,
                K * this.experiment.NN,
                (N - K) * this.experiment.PP,
                (N - K) * this.PN
            ].map((res) => res.toFixed(0));
        },
        divide(num, p) {
            let hit = 0
            for (let i = 0; i < num; i++) {
                hit += Math.random() < p
            }
            return [hit, num - hit]
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