/**
 * el-tools.js v1.2.0
 * @author Kris Huang
 * @wechat IsKrisHuang
 * 
 * 对 element-ui 控件的二层封装
 */

Vue.component('kris-layout', {
    template: `
    <div :style="{height: containerHeight}">
        <div class="container-left kris-scroll">
            <div class="control-panel">
                <slot name="left"></slot>
            </div>
        </div>
        <div class="container-right kris-scroll">
            <slot name="right"></slot>
        </div>
    </div>
    `,
    data() {
        return {
            windowHeight: window.innerHeight,
        }
    },
    computed: {
        containerHeight: function () {
            return (this.windowHeight - 70) + "px";
        }
    },
    methods: {
        loadData(component) {
            let configStr = localStorage.getItem(component.componentName);
            if (configStr === null) return;
            component.updateLock = true;

            let config = JSON.parse(configStr)
            for (const prop of component.storageList) {
                component.$data[prop] = config[prop]
            }

            Vue.nextTick(() => {
                component.updateLock = false;
            })
            console.log('loadData');
        }
    },
    mounted() {
        window.addEventListener("resize", (event) => {
            this.windowHeight = window.innerHeight;
        }, false);
    }
})

Vue.component('kris-color-picker', {
    template: `
        <div class="el-tools-item">
            <span class="el-tools-item-head"> {{title}} </span>
            <span class="el-tools-item-content-text" v-bind:style="'color: ' + color"> {{color}} </span>
            <el-color-picker v-model="color" @change="colorChanged"/>
        </div>
    `,
    props: {
        title: String,
        value: String
    },
    data() {
        return {
            color: this.value
        }
    },
    methods: {
        colorChanged(val) {
            this.$emit('input', val);
        }
    },
    watch: {
        value(value) {
            this.color = value;
        }
    }
})

Vue.component('kris-form-item', {
    template: `
        <div class="el-tools-item">
            <span class="el-tools-item-head"> {{title}} </span>
            <span class="el-tools-item-text"> {{value}} </span>
        </div>
    `,
    props: {
        title: {
            default: "Kris",
            type: String
        },
        value: {
            default: "cool",
            type: String
        }
    }
})

Vue.component('kris-slider', {
    template: `
        <div class="el-tools-item el-tools-item-col">
            <div>
                <span>{{title}}</span>
                <span style="float: right;">{{tips}}</span>
            </div>
            <el-slider v-model="sliderValue" @input="sliderValueChanging" :show-tooltip="false"
                :min="min" :max="max" :step="step">
            </el-slider>
        </div>
    `,
    props: {
        title: String,
        value: Number,
        min: {
            default: 1,
            type: Number
        },
        max: {
            default: 100,
            type: Number
        },
        step: {
            default: 1,
            type: Number
        },
        fix: {
            default: null,
            type: Number
        }
    },
    data() {
        return {
            sliderValue: this.value
        }
    },
    methods: {
        sliderValueChanging(val) {
            this.$emit('input', val);
        }
    },
    watch: {
        value(value) {
            this.sliderValue = value;
        }
    },
    computed: {
        tips() {
            if (this.fix) {
                return this.sliderValue.toFixed(this.fix);
            }
            return this.sliderValue
        }
    }
})

Vue.component('kris-progress', {
    template: `
        <div class="el-tools-item el-tools-item-col">            
            <div class="el-tools-item-text">
                <span>{{title}}</span>
                <span style="float: right;">{{value}} / {{total}}</span>
            </div>
            <el-progress :text-inside="textInside" :stroke-width="height" :percentage="percentage"></el-progress>
        </div>
    `,
    props: {
        title: {
            default: "kris",
            type: String
        },
        total: {
            default: 100,
            type: Number
        },
        value: {
            default: 0,
            type: Number
        },
        height: {
            default: 24,
            type: Number
        },
        textInside: {
            default: true,
            type: Boolean
        }
    },
    computed: {
        percentage() {
            if (this.total < 1) return 0;
            if (this.value > this.total) return 0;
            return parseInt(this.value * 100 / this.total);
        }
    }
})

Vue.component('kris-num-input', {
    template: `
        <div class="el-tools-item">
            <span class="el-tools-item-head">{{title}}</span>
            <el-input-number v-model="numValue" 
            @change="numValueChanged" :min="min" :max="max" :step="step"></el-input-number>
        </div>
    `,
    props: {
        title: String,
        value: Number,
        min: {
            default: 1,
            type: Number
        },
        step: {
            default: 1,
            type: Number
        },
        max: {
            default: Infinity,
            type: Number
        }
    },
    data() {
        return {
            numValue: this.value
        }
    },
    methods: {
        numValueChanged(val) {
            this.$emit('input', val);
        }
    },
    watch: {
        value(value) {
            this.numValue = value;
        }
    }
})

Vue.component('kris-tag-group', {
    template: `
        <div class="el-tools-item" style="display: flex">
            <span class="el-tools-item-head">{{title}}</span>
            <div style="text-align: right;">
                <el-tag :key="tag" v-for="tag in tags" closable :disable-transitions="false"
                    @close="handleClose(tag)" class="el-tools-item-tag">
                    {{tag}}
                </el-tag>
                <el-input v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm" @blur="handleBlur"
                    class="el-tools-item-tag-add el-tools-item-tag">
                </el-input>
                <el-button v-else size="small" @click="showInput" 
                    class="el-tools-item-tag-add el-tools-item-tag">+ Add </el-button>
            </div>
        </div>
    `,
    props: {
        title: String,
        value: Array,
        min: {
            default: -Infinity,
            type: Number
        },
        max: {
            default: Infinity,
            type: Number
        },
        sorted: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            tags: this.value,
            inputVisible: false,
            inputValue: ''
        }
    },
    methods: {
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.$emit('input', this.tags);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (this.isValid(inputValue)) {
                this.addValue(parseFloat(inputValue));
                this.$emit('input', this.tags);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        addValue(val) {
            this.tags.push(val);
            if (this.sorted) {
                this.tags.sort((a, b) => a - b);
            }
        },
        handleBlur() {
            this.inputVisible = false;
        },
        isValid(val) {
            let fval = parseFloat(val);
            if ((!fval && fval != 0) || fval < this.min || fval > this.max) {
                this.$message.error("输入应在范围 " + this.fmtRange() + " 内");
                return false;
            }
            if (this.tags.indexOf(fval) > -1) {
                this.$message.error("已存在：" + val);
                return false;
            }
            return true
        },
        fmtRange() {
            return "[" + (this.min === -Infinity ? "-∞" : this.min) + ", " + (this.max === Infinity ? "+∞" : this.max) + "]"
        },
    },
    watch: {
        value(value) {
            this.tags = value;
        }
    }
})

Vue.component('kris-num-input-range', {
    template: `
    <div class="el-tools-item">
        <span class="el-tools-item-head">{{title}}</span>
        <div class="el-tools-item-content">
            <el-input v-model="from" class="el-tools-item-tag" placeholder="1" size="medium"
                @keyup.enter.native="handleInputConfirm" @blur="handleBlur"></el-input>
            <span class="el-tools-item-content-text">—</span>
            <el-input v-model="to" class="el-tools-item-tag" placeholder="10" size="medium"
                @keyup.enter.native="handleInputConfirm" @blur="handleBlur"></el-input>
        </div>
    </div>
    `,
    props: {
        title: String,
        value: Array,
        min: {
            default: -Infinity,
            type: Number
        },
        max: {
            default: Infinity,
            type: Number
        }
    },
    data() {
        return {
            from: this.value[0],
            to: this.value[1],
        }
    },
    methods: {
        handleInputConfirm() {
            if (this.isValid(this.from) && this.isValid(this.to)) {
                this.from = parseInt(this.from);
                this.to = parseInt(this.to);
                this.tryEmit();
            }
        },
        handleBlur() {
            this.handleInputConfirm();
        },
        isValid(val) {
            let ival = parseInt(val);
            if ((!ival && ival != 0) || ival < this.min || ival > this.max) {
                this.$message.error("输入应在范围 " + this.fmtRange() + " 内");
                return false;
            }
            return true
        },
        fmtRange() {
            return "[" + (this.min === -Infinity ? "-∞" : this.min) + ", " + (this.max === Infinity ? "+∞" : this.max) + "]"
        },
        tryEmit() {
            if (this.from <= this.to) {
                this.$emit('input', [this.from, this.to]);
            }
            else
                this.$message.error("起点应该小于终点");
        }
    },
    watch: {
        value(value) {
            this.from = value[0];
            this.to = value[1];
        }
    }
})

Vue.component('kris-num-input-double', {
    template: `
    <div class="el-tools-item">
        <span class="el-tools-item-head">{{title}}</span>
        <div class="el-tools-item-content" style="font-size: 14px;">
            <span class="el-tools-item-content-text">{{names[0]}}</span>
            <el-input v-model="from" class="el-tools-item-tag" placeholder="0" size="small"
                @keyup.enter.native="handleInputConfirm" @blur="handleBlur"></el-input>
            <span class="el-tools-item-content-text">{{names[1]}}</span>
            <el-input v-model="to" class="el-tools-item-tag" placeholder="1" size="small"
                @keyup.enter.native="handleInputConfirm" @blur="handleBlur"></el-input>
        </div>
    </div>
    `,
    props: {
        title: String,
        names: Array,
        value: Array
    },
    data() {
        return {
            from: this.value[0],
            to: this.value[1],
        }
    },
    methods: {
        handleInputConfirm() {
            if (this.isValid(this.from) && this.isValid(this.to)) {
                this.from = parseFloat(this.from);
                this.to = parseFloat(this.to);
                this.$emit('input', [this.from, this.to]);
            }
        },
        handleBlur() {
            this.handleInputConfirm();
        },
        isValid(val) {
            let ival = parseFloat(val);
            if (!ival && ival != 0) {
                this.$message.error("输入不合法");
                return false;
            }
            return true
        }
    },
    watch: {
        value(value) {
            this.from = value[0];
            this.to = value[1];
        }
    }
})

Vue.component('kris-button', {
    template: `
    <div class="el-tools-item">
        <span class="el-tools-item-head"></span>
        <div class="el-tools-item-content">
            <el-tooltip slot="append" effect="light" :content="tips" placement="left">
                <el-button icon="el-icon-video-play" @click="click">{{title}}</el-button>
            </el-tooltip>
        </div>
    </div>
    `,
    props: {
        title: {
            type: String,
            default: "Kris"
        },
        tips: {
            type: String,
            default: "Kris is so cool. 😎"
        },
        click: {
            type: Function,
            default: () => { }
        }
    }
})

Vue.component('kris-switch', {
    template: `
    <div class="el-tools-item">
        <span class="el-tools-item-head">{{title}}</span>
        <div class="el-tools-item-content">
            <div style="margin: 10px 0">
                <el-switch v-model="active" @change="switched" :active-color="activeColor" :inactive-color="inactiveColor">
                </el-switch>
            </div>
        </div>
    </div>
    `,
    props: {
        title: String,
        value: Boolean
    },
    data() {
        return {
            active: this.value,
            activeColor: "#409EFF",
            inactiveColor: "#eeeeee",
        }
    },
    methods: {
        switched(val) {
            // console.log(val);
            this.$emit('input', val);
        }
    },
    watch: {
        value(value) {
            this.active = value;
        }
    }
})

Vue.component('kris-canvas', {
    template: `
        <canvas ref="canvas" :width="width" :height="height" class="graph-canvas"/>
    `,
    props: {
        width: {
            type: Number,
            default: 500
        },
        height: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            context: null,
            strokeStyle: "#000000",
            lineWidth: 1
        }
    },
    methods: {
        point(x, y, r = 2, lineColor = "#000000") {
            let color = this.context.fillStyle;
            this.context.beginPath();
            this.context.fillStyle = lineColor;
            this.context.arc(x, y, r, 0, Math.PI * 2, true);
            this.context.fill();
            this.context.fillStyle = color;
        },
        circle(x, y, r = 2, lineColor = "#000000") {
            let color = this.context.strokeStyle;
            this.context.beginPath();
            this.context.strokeStyle = lineColor;
            this.context.arc(x, y, r, 0, Math.PI * 2, true);
            this.context.stroke();
            this.context.strokeStyle = color;
        },
        line(fromX, fromY, toX, toY) {
            this.context.beginPath();
            this.context.moveTo(fromX, fromY);
            this.context.lineTo(toX, toY);
            this.context.stroke();
        },
        drawAxis() {
            let H = this.height;
            let W = this.width;
            let CH = parseInt(H / 2);
            let CW = parseInt(W / 2);
            this.line(0, CH, W, CH)
            this.line(CW, 0, CW, H)
            this.circle(CW, CH)
            this.circle(CW, CH, CW, "#aaaaaa")
        },
        refresh() {
            this.context.clearRect(0, 0, this.width, this.height);
            this.drawAxis()
        }
    },
    mounted() {
        this.context = this.$refs.canvas.getContext("2d");
        this.refresh()
    }
})

Vue.component('kris-table', {
    template: `
        <div class="el-tools-item el-tools-item-col">
            <div v-if="value.length > 0">
                <el-row class="kris-table-row kris-table-header" >
                    <el-col :span="7">总点数</el-col>
                    <el-col :span="7">圆内点数</el-col>
                    <el-col :span="10">圆周率估值</el-col>
                </el-row>
                <div class="kris-scroll-hidden kris-table-body" :style="'max-height:' + height + 'px'">
                    <el-row class="kris-table-row" v-for="(data, r) in rows" :key="r">
                        <el-col :span="7">{{data.totalNum}}</el-col>
                        <el-col :span="7">{{data.insideNum}}</el-col>
                        <el-col :span="10">{{data.pi}}</el-col>
                    </el-row>
                </div>
                <el-row class="kris-table-row">
                    <el-col :span="7">
                        <el-button type="text" @click="clear">清空记录</el-button>
                    </el-col>
                    <el-col :span="7">{{summary.key}}</el-col>
                    <el-col :span="10">{{summary.value}}</el-col>
                </el-row>
            </div>
            <div v-else class="kris-table-row" style="text-align: center; color: lightgray">
                暂无数据
            </div>
        </div>
    `,
    props: {
        value: Array,
        height: {
            type: Number,
            default: 400
        },
        summary: {
            type: Object,
            default: {
                key: "kris is",
                value: "cool 😎"
            }
        }
    },
    data() {
        return {
            rows: this.value
        }
    },
    methods: {
        clear() {
            this.rows = [];
            this.$emit('input', this.rows);
        }
    },
    watch: {
        value(value) {
            this.rows = value;
        }
    }
})

Vue.component('kris-user', {
    template: `
        <div>
            <span class="kris-icon-container" v-bind:style="
                    'color:' + iconColor + ';' +
                    'font-size:' + fontSize + 'px;'
                ">
                <i v-if="positive" class="el-icon-user"></i>
                <i v-else class="el-icon-user-solid"></i>
            </span>
            <div v-if="positive">诊断为阴性</div>
            <div v-else="positive">诊断为阳性</div>
        </div>
    `,
    props: {
        positive: {
            type: Boolean,
            default: false
        },
        diagnosed: {
            type: Boolean,
            default: false
        },
        highlight: {
            type: String,
            default: "#409EFF"
        },
        normal: {
            type: String,
            default: "#DDDDDD"
        },
        fontSize: {
            type: Number,
            default: 100
        }
    },
    computed: {
        iconColor: function () {
            return this.diagnosed ? this.highlight : this.normal;
        }
    },
})

Vue.component('kris-formula', {
    template: `
        <div>
            <span style="display: inline-block;">
                <div v-bind:style="'color:' + highlight + ';'"> {{core}} </div>
                <div> ————— </div>
                <div> <span v-bind:style="'color:' + highlight + ';'"> {{core}} </span> + {{other}} </div>
            </span>
            <span style="display: inline-block; line-height: 63px; vertical-align: bottom;"> = {{result}}</span>
        </div>
    `,
    props: {
        core: {
            type: Number,
            default: 1
        },
        other: {
            type: Number,
            default: 1
        },
        highlight: {
            type: String,
            default: "#409EFF"
        },
    },
    computed: {
        result() {
            return (100 * this.core / (this.core + this.other)).toFixed(3) + "%";
        }
    }
})

