/**
 * 实验场景：捡纸币
 */
Vue.component('kris-paper-money', {
    template: `
        <div class="graph-paper-money">
            <div class="graph-paper-money-inner">
                <span>{{value}}</span>
                <div class="graph-paper-money-center">
                    <img src="./static/images/timo.png">
                </div>
                <span>{{value}}</span>
            </div>
        </div>
    `,
    props: {
        value: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {

        }
    },
    methods: {

    }
})

Vue.component('gh-papermoney', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>
                <el-divider content-position="center">Parameters</el-divider>
                <kris-tag-group v-model="experiment.values" title="纸币面值" :min="0"></kris-tag-group>
                <kris-num-input title="纸币数量" v-model="experiment.paperNum"></kris-num-input>
                <el-divider content-position="center">策略选择</el-divider>
            </template>
            <template v-slot:right>
                <div>
                    <kris-paper-money v-for="(value, i) in money" :key="i" :value="value"></kris-paper-money>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-papermoney",
            updateLock: false,
            inited: false,
            experiment: {
                values: [1, 2, 5, 10, 20, 50, 100],
                paperNum: 100
            },
            money: []
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
    },
    methods: {
        display() {
            if (this.updateLock) return;
            this.money.length = 0;
            for (let _ = 0; _ < this.experiment.paperNum; _++) {
                let i = Math.floor(Math.random() * this.experiment.values.length);
                this.money.push(this.experiment.values[i])
            }
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