import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,
    Container,Header,Aside,Main,
    Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,
    Table,TableColumn,Scrollbar,Select,Option,Row,Col,Tooltip,
    Pagination,Dialog,Transfer,Switch,RadioGroup,RadioButton} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)
/*把弹框组件全局挂载 通过$message使用*/
Vue.prototype.$message=Message

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Scrollbar)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Transfer)
Vue.use(Switch)
Vue.use(RadioGroup)
Vue.use(RadioButton)
