/**
 * 模板组件
 */

Vue.component('gh-template', {
    template: `
        <kris-layout ref="frame">
            <template v-slot:left>

            </template>
            <template v-slot:right>
                <div>
                </div>
            </template>
        </kris-layout>
    `,
    data() {
        return {
            componentName: "gh-en-template",
            updateLock: false,
            inited: false
        }
    },
    watch: {
    },
    computed: {
    },
    methods: {
        display() {
            
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