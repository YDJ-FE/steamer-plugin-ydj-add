import Vue from 'components/base'
import { Component, Watch, Prop } from 'vue-property-decorator'
import template from './<% name %>.vue'


@Component({
    mixins: [template]
})
export default class <% Name %> extends Vue {
    msg = 'Welcome to Your Vue.js App'
}
