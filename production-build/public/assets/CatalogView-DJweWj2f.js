import{a as e,o as t,t as n}from"./ripple-BzAJXmiW.js";import{$t as r,Bt as i,C as a,Gt as o,It as s,Jt as c,Lt as l,O as u,Pt as d,Q as f,Rt as p,Ut as ee,V as m,Wt as h,Xt as g,Yt as _,Zt as v,an as y,cn as b,en as x,fn as S,in as C,jt as w,k as T,kt as te,ln as E,n as ne,o as D,on as O,pt as k,qt as A,r as j,s as M,sn as N,zt as P}from"./index-Cc2HlpY5.js";import{n as F,t as re}from"./pb-BwI9rXVw.js";import{t as I}from"./notificationStore-BPhNP9n-.js";import{t as L}from"./button-DZ6geBHL.js";import{t as R}from"./tag-DUM_NpTb.js";import{a as z,i as B}from"./select-CKByBaSV.js";import{n as ie,t as V}from"./column-DG25vGms.js";import{i as ae,n as oe,r as H}from"./radiobutton-B-GlE8wQ.js";import{n as se,t as ce}from"./DsConfirmDialog-rJCFHViw.js";import{t as U}from"./chevronleft-B7LJGxyC.js";var W=D.extend({name:`tabview`,style:`
    .p-tabview-tablist-container {
        position: relative;
    }

    .p-tabview-scrollable > .p-tabview-tablist-container {
        overflow: hidden;
    }

    .p-tabview-tablist-scroll-container {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tabview-tablist-scroll-container::-webkit-scrollbar {
        display: none;
    }

    .p-tabview-tablist {
        display: flex;
        margin: 0;
        padding: 0;
        list-style-type: none;
        flex: 1 1 auto;
        background: dt('tabview.tab.list.background');
        border: 1px solid dt('tabview.tab.list.border.color');
        border-width: 0 0 1px 0;
        position: relative;
    }

    .p-tabview-tab-header {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        border-style: solid;
        border-width: 0 0 1px 0;
        border-color: transparent transparent dt('tabview.tab.border.color') transparent;
        color: dt('tabview.tab.color');
        padding: 1rem 1.125rem;
        font-weight: 600;
        border-top-right-radius: dt('border.radius.md');
        border-top-left-radius: dt('border.radius.md');
        transition:
            color dt('tabview.transition.duration'),
            outline-color dt('tabview.transition.duration');
        margin: 0 0 -1px 0;
        outline-color: transparent;
    }

    .p-tabview-tablist-item:not(.p-disabled) .p-tabview-tab-header:focus-visible {
        outline: dt('focus.ring.width') dt('focus.ring.style') dt('focus.ring.color');
        outline-offset: -1px;
    }

    .p-tabview-tablist-item:not(.p-highlight):not(.p-disabled):hover > .p-tabview-tab-header {
        color: dt('tabview.tab.hover.color');
    }

    .p-tabview-tablist-item.p-highlight > .p-tabview-tab-header {
        color: dt('tabview.tab.active.color');
    }

    .p-tabview-tab-title {
        line-height: 1;
        white-space: nowrap;
    }

    .p-tabview-next-button,
    .p-tabview-prev-button {
        position: absolute;
        top: 0;
        margin: 0;
        padding: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('tabview.nav.button.background');
        color: dt('tabview.nav.button.color');
        width: 2.5rem;
        border-radius: 0;
        outline-color: transparent;
        transition:
            color dt('tabview.transition.duration'),
            outline-color dt('tabview.transition.duration');
        box-shadow: dt('tabview.nav.button.shadow');
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-tabview-next-button:focus-visible,
    .p-tabview-prev-button:focus-visible {
        outline: dt('focus.ring.width') dt('focus.ring.style') dt('focus.ring.color');
        outline-offset: dt('focus.ring.offset');
    }

    .p-tabview-next-button:hover,
    .p-tabview-prev-button:hover {
        color: dt('tabview.nav.button.hover.color');
    }

    .p-tabview-prev-button {
        left: 0;
    }

    .p-tabview-next-button {
        right: 0;
    }

    .p-tabview-panels {
        background: dt('tabview.tab.panel.background');
        color: dt('tabview.tab.panel.color');
        padding: 0.875rem 1.125rem 1.125rem 1.125rem;
    }

    .p-tabview-ink-bar {
        z-index: 1;
        display: block;
        position: absolute;
        bottom: -1px;
        height: 1px;
        background: dt('tabview.tab.active.border.color');
        transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
    }
`,classes:{root:function(e){return[`p-tabview p-component`,{"p-tabview-scrollable":e.props.scrollable}]},navContainer:`p-tabview-tablist-container`,prevButton:`p-tabview-prev-button`,navContent:`p-tabview-tablist-scroll-container`,nav:`p-tabview-tablist`,tab:{header:function(e){var t=e.instance,n=e.tab,r=e.index;return[`p-tabview-tablist-item`,t.getTabProp(n,`headerClass`),{"p-tabview-tablist-item-active":t.d_activeIndex===r,"p-disabled":t.getTabProp(n,`disabled`)}]},headerAction:`p-tabview-tab-header`,headerTitle:`p-tabview-tab-title`,content:function(e){var t=e.instance,n=e.tab;return[`p-tabview-panel`,t.getTabProp(n,`contentClass`)]}},inkbar:`p-tabview-ink-bar`,nextButton:`p-tabview-next-button`,panelContainer:`p-tabview-panels`}}),G={name:`TabView`,extends:{name:`BaseTabView`,extends:e,props:{activeIndex:{type:Number,default:0},lazy:{type:Boolean,default:!1},scrollable:{type:Boolean,default:!1},tabindex:{type:Number,default:0},selectOnFocus:{type:Boolean,default:!1},prevButtonProps:{type:null,default:null},nextButtonProps:{type:null,default:null},prevIcon:{type:String,default:void 0},nextIcon:{type:String,default:void 0}},style:W,provide:function(){return{$pcTabs:void 0,$pcTabView:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`update:activeIndex`,`tab-change`,`tab-click`],data:function(){return{d_activeIndex:this.activeIndex,isPrevButtonDisabled:!0,isNextButtonDisabled:!1}},watch:{activeIndex:function(e){this.d_activeIndex=e,this.scrollInView({index:e})}},mounted:function(){console.warn(`Deprecated since v4. Use Tabs component instead.`),this.updateInkBar(),this.scrollable&&this.updateButtonState()},updated:function(){this.updateInkBar(),this.scrollable&&this.updateButtonState()},methods:{isTabPanel:function(e){return e.type.name===`TabPanel`},isTabActive:function(e){return this.d_activeIndex===e},getTabProp:function(e,t){return e.props?e.props[t]:void 0},getKey:function(e,t){return this.getTabProp(e,`header`)||t},getTabHeaderActionId:function(e){return`${this.$id}_${e}_header_action`},getTabContentId:function(e){return`${this.$id}_${e}_content`},getTabPT:function(e,t,n){var r=this.tabs.length,i={props:e.props,parent:{instance:this,props:this.$props,state:this.$data},context:{index:n,count:r,first:n===0,last:n===r-1,active:this.isTabActive(n)}};return A(this.ptm(`tabpanel.${t}`,{tabpanel:i}),this.ptm(`tabpanel.${t}`,i),this.ptmo(this.getTabProp(e,`pt`),t,i))},onScroll:function(e){this.scrollable&&this.updateButtonState(),e.preventDefault()},onPrevButtonClick:function(){var e=this.$refs.content,t=T(e),n=e.scrollLeft-t;e.scrollLeft=n<=0?0:n},onNextButtonClick:function(){var e=this.$refs.content,t=T(e)-this.getVisibleButtonWidths(),n=e.scrollLeft+t,r=e.scrollWidth-t;e.scrollLeft=n>=r?r:n},onTabClick:function(e,t,n){this.changeActiveIndex(e,t,n),this.$emit(`tab-click`,{originalEvent:e,index:n})},onTabKeyDown:function(e,t,n){switch(e.code){case`ArrowLeft`:this.onTabArrowLeftKey(e);break;case`ArrowRight`:this.onTabArrowRightKey(e);break;case`Home`:this.onTabHomeKey(e);break;case`End`:this.onTabEndKey(e);break;case`PageDown`:this.onPageDownKey(e);break;case`PageUp`:this.onPageUpKey(e);break;case`Enter`:case`NumpadEnter`:case`Space`:this.onTabEnterKey(e,t,n);break}},onTabArrowRightKey:function(e){var t=this.findNextHeaderAction(e.target.parentElement);t?this.changeFocusedTab(e,t):this.onTabHomeKey(e),e.preventDefault()},onTabArrowLeftKey:function(e){var t=this.findPrevHeaderAction(e.target.parentElement);t?this.changeFocusedTab(e,t):this.onTabEndKey(e),e.preventDefault()},onTabHomeKey:function(e){var t=this.findFirstHeaderAction();this.changeFocusedTab(e,t),e.preventDefault()},onTabEndKey:function(e){var t=this.findLastHeaderAction();this.changeFocusedTab(e,t),e.preventDefault()},onPageDownKey:function(e){this.scrollInView({index:this.$refs.nav.children.length-2}),e.preventDefault()},onPageUpKey:function(e){this.scrollInView({index:0}),e.preventDefault()},onTabEnterKey:function(e,t,n){this.changeActiveIndex(e,t,n),e.preventDefault()},findNextHeaderAction:function(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1]?e:e.nextElementSibling;return t?u(t,`data-p-disabled`)||u(t,`data-pc-section`)===`inkbar`?this.findNextHeaderAction(t):f(t,`[data-pc-section="headeraction"]`):null},findPrevHeaderAction:function(e){var t=arguments.length>1&&arguments[1]!==void 0&&arguments[1]?e:e.previousElementSibling;return t?u(t,`data-p-disabled`)||u(t,`data-pc-section`)===`inkbar`?this.findPrevHeaderAction(t):f(t,`[data-pc-section="headeraction"]`):null},findFirstHeaderAction:function(){return this.findNextHeaderAction(this.$refs.nav.firstElementChild,!0)},findLastHeaderAction:function(){return this.findPrevHeaderAction(this.$refs.nav.lastElementChild,!0)},changeActiveIndex:function(e,t,n){!this.getTabProp(t,`disabled`)&&this.d_activeIndex!==n&&(this.d_activeIndex=n,this.$emit(`update:activeIndex`,n),this.$emit(`tab-change`,{originalEvent:e,index:n}),this.scrollInView({index:n}))},changeFocusedTab:function(e,t){if(t&&(m(t),this.scrollInView({element:t}),this.selectOnFocus)){var n=parseInt(t.parentElement.dataset.pcIndex,10),r=this.tabs[n];this.changeActiveIndex(e,r,n)}},scrollInView:function(e){var t=e.element,n=e.index,r=n===void 0?-1:n,i=t||this.$refs.nav.children[r];i&&i.scrollIntoView&&i.scrollIntoView({block:`nearest`})},updateInkBar:function(){var e=this.$refs.nav.children[this.d_activeIndex];this.$refs.inkbar.style.width=T(e)+`px`,this.$refs.inkbar.style.left=a(e).left-a(this.$refs.nav).left+`px`},updateButtonState:function(){var e=this.$refs.content,t=e.scrollLeft,n=e.scrollWidth,r=T(e);this.isPrevButtonDisabled=t===0,this.isNextButtonDisabled=parseInt(t)===n-r},getVisibleButtonWidths:function(){var e=this.$refs;return[e.prevBtn,e.nextBtn].reduce(function(e,t){return t?e+T(t):e},0)}},computed:{tabs:function(){var e=this;return this.$slots.default().reduce(function(t,n){return e.isTabPanel(n)?t.push(n):n.children&&n.children instanceof Array&&n.children.forEach(function(n){e.isTabPanel(n)&&t.push(n)}),t},[])},prevButtonAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.previous:void 0},nextButtonAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.next:void 0}},directives:{ripple:n},components:{ChevronLeftIcon:U,ChevronRightIcon:H}};function K(e){"@babel/helpers - typeof";return K=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},K(e)}function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?q(Object(n),!0).forEach(function(t){Y(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Y(e,t,n){return(t=le(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function le(e){var t=ue(e,`string`);return K(t)==`symbol`?t:t+``}function ue(e,t){if(K(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(K(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var de=[`tabindex`,`aria-label`],fe=[`data-p-active`,`data-p-disabled`,`data-pc-index`],pe=[`id`,`tabindex`,`aria-disabled`,`aria-selected`,`aria-controls`,`onClick`,`onKeydown`],me=[`tabindex`,`aria-label`],he=[`id`,`aria-labelledby`,`data-pc-index`,`data-p-active`];function ge(e,t,n,a,o,s){var c=r(`ripple`);return _(),i(`div`,A({class:e.cx(`root`),role:`tablist`},e.ptmi(`root`)),[l(`div`,A({class:e.cx(`navContainer`)},e.ptm(`navContainer`)),[e.scrollable&&!o.isPrevButtonDisabled?O((_(),i(`button`,A({key:0,ref:`prevBtn`,type:`button`,class:e.cx(`prevButton`),tabindex:e.tabindex,"aria-label":s.prevButtonAriaLabel,onClick:t[0]||=function(){return s.onPrevButtonClick&&s.onPrevButtonClick.apply(s,arguments)}},J(J({},e.prevButtonProps),e.ptm(`prevButton`)),{"data-pc-group-section":`navbutton`}),[v(e.$slots,`previcon`,{},function(){return[(_(),p(x(e.prevIcon?`span`:`ChevronLeftIcon`),A({"aria-hidden":`true`,class:e.prevIcon},e.ptm(`prevIcon`)),null,16,[`class`]))]})],16,de)),[[c]]):P(``,!0),l(`div`,A({ref:`content`,class:e.cx(`navContent`),onScroll:t[1]||=function(){return s.onScroll&&s.onScroll.apply(s,arguments)}},e.ptm(`navContent`)),[l(`ul`,A({ref:`nav`,class:e.cx(`nav`)},e.ptm(`nav`)),[(_(!0),i(d,null,g(s.tabs,function(t,n){return _(),i(`li`,A({key:s.getKey(t,n),style:s.getTabProp(t,`headerStyle`),class:e.cx(`tab.header`,{tab:t,index:n}),role:`presentation`},{ref_for:!0},J(J(J({},s.getTabProp(t,`headerProps`)),s.getTabPT(t,`root`,n)),s.getTabPT(t,`header`,n)),{"data-pc-name":`tabpanel`,"data-p-active":o.d_activeIndex===n,"data-p-disabled":s.getTabProp(t,`disabled`),"data-pc-index":n}),[O((_(),i(`a`,A({id:s.getTabHeaderActionId(n),class:e.cx(`tab.headerAction`),tabindex:s.getTabProp(t,`disabled`)||!s.isTabActive(n)?-1:e.tabindex,role:`tab`,"aria-disabled":s.getTabProp(t,`disabled`),"aria-selected":s.isTabActive(n),"aria-controls":s.getTabContentId(n),onClick:function(e){return s.onTabClick(e,t,n)},onKeydown:function(e){return s.onTabKeyDown(e,t,n)}},{ref_for:!0},J(J({},s.getTabProp(t,`headerActionProps`)),s.getTabPT(t,`headerAction`,n))),[t.props&&t.props.header?(_(),i(`span`,A({key:0,class:e.cx(`tab.headerTitle`)},{ref_for:!0},s.getTabPT(t,`headerTitle`,n)),S(t.props.header),17)):P(``,!0),t.children&&t.children.header?(_(),p(x(t.children.header),{key:1})):P(``,!0)],16,pe)),[[c]])],16,fe)}),128)),l(`li`,A({ref:`inkbar`,class:e.cx(`inkbar`),role:`presentation`,"aria-hidden":`true`},e.ptm(`inkbar`)),null,16)],16)],16),e.scrollable&&!o.isNextButtonDisabled?O((_(),i(`button`,A({key:1,ref:`nextBtn`,type:`button`,class:e.cx(`nextButton`),tabindex:e.tabindex,"aria-label":s.nextButtonAriaLabel,onClick:t[2]||=function(){return s.onNextButtonClick&&s.onNextButtonClick.apply(s,arguments)}},J(J({},e.nextButtonProps),e.ptm(`nextButton`)),{"data-pc-group-section":`navbutton`}),[v(e.$slots,`nexticon`,{},function(){return[(_(),p(x(e.nextIcon?`span`:`ChevronRightIcon`),A({"aria-hidden":`true`,class:e.nextIcon},e.ptm(`nextIcon`)),null,16,[`class`]))]})],16,me)),[[c]]):P(``,!0)],16),l(`div`,A({class:e.cx(`panelContainer`)},e.ptm(`panelContainer`)),[(_(!0),i(d,null,g(s.tabs,function(t,n){return _(),i(d,{key:s.getKey(t,n)},[!e.lazy||s.isTabActive(n)?O((_(),i(`div`,A({key:0,id:s.getTabContentId(n),style:s.getTabProp(t,`contentStyle`),class:e.cx(`tab.content`,{tab:t}),role:`tabpanel`,"aria-labelledby":s.getTabHeaderActionId(n)},{ref_for:!0},J(J(J({},s.getTabProp(t,`contentProps`)),s.getTabPT(t,`root`,n)),s.getTabPT(t,`content`,n)),{"data-pc-name":`tabpanel`,"data-pc-index":n,"data-p-active":o.d_activeIndex===n}),[(_(),p(x(t)))],16,he)),[[w,e.lazy?!0:s.isTabActive(n)]]):P(``,!0)],64)}),128))],16)],16)}G.render=ge;var _e=D.extend({name:`tabpanel`,classes:{root:function(e){return[`p-tabpanel`,{"p-tabpanel-active":e.instance.active}]}}}),X={name:`TabPanel`,extends:{name:`BaseTabPanel`,extends:e,props:{value:{type:[String,Number],default:void 0},as:{type:[String,Object],default:`DIV`},asChild:{type:Boolean,default:!1},header:null,headerStyle:null,headerClass:null,headerProps:null,headerActionProps:null,contentStyle:null,contentClass:null,contentProps:null,disabled:Boolean},style:_e,provide:function(){return{$pcTabPanel:this,$parentInstance:this}}},inheritAttrs:!1,inject:[`$pcTabs`],computed:{active:function(){return k(this.$pcTabs?.d_value,this.value)},id:function(){return`${this.$pcTabs?.$id}_tabpanel_${this.value}`},ariaLabelledby:function(){return`${this.$pcTabs?.$id}_tab_${this.value}`},attrs:function(){return A(this.a11yAttrs,this.ptmi(`root`,this.ptParams))},a11yAttrs:function(){return{id:this.id,tabindex:this.$pcTabs?.tabindex,role:`tabpanel`,"aria-labelledby":this.ariaLabelledby,"data-pc-name":`tabpanel`,"data-p-active":this.active}},ptParams:function(){return{context:{active:this.active}}}}};function ve(e,t,n,r,a,o){var s,c;return o.$pcTabs?(_(),i(d,{key:1},[e.asChild?v(e.$slots,`default`,{key:1,class:E(e.cx(`root`)),active:o.active,a11yAttrs:o.a11yAttrs}):(_(),i(d,{key:0},[!((s=o.$pcTabs)!=null&&s.lazy)||o.active?O((_(),p(x(e.as),A({key:0,class:e.cx(`root`)},o.attrs),{default:y(function(){return[v(e.$slots,`default`)]}),_:3},16,[`class`])),[[w,(c=o.$pcTabs)!=null&&c.lazy?!0:o.active]]):P(``,!0)],64))],64)):v(e.$slots,`default`,{key:0})}X.render=ve;var ye=D.extend({name:`textarea`,style:`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-textarea p-component`,{"p-filled":t.$filled,"p-textarea-resizable ":n.autoResize,"p-textarea-sm p-inputfield-sm":n.size===`small`,"p-textarea-lg p-inputfield-lg":n.size===`large`,"p-invalid":t.$invalid,"p-variant-filled":t.$variant===`filled`,"p-textarea-fluid":t.$fluid}]}}}),be={name:`BaseTextarea`,extends:z,props:{autoResize:Boolean},style:ye,provide:function(){return{$pcTextarea:this,$parentInstance:this}}};function Z(e){"@babel/helpers - typeof";return Z=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Z(e)}function xe(e,t,n){return(t=Se(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Se(e){var t=Ce(e,`string`);return Z(t)==`symbol`?t:t+``}function Ce(e,t){if(Z(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(Z(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var Q={name:`Textarea`,extends:be,inheritAttrs:!1,observer:null,mounted:function(){var e=this;this.autoResize&&(this.observer=new ResizeObserver(function(){requestAnimationFrame(function(){e.resize()})}),this.observer.observe(this.$el))},updated:function(){this.autoResize&&this.resize()},beforeUnmount:function(){this.observer&&this.observer.disconnect()},methods:{resize:function(){if(this.$el.offsetParent){var e=this.$el.style.height,t=parseInt(e)||0,n=this.$el.scrollHeight;t&&n<t?(this.$el.style.height=`auto`,this.$el.style.height=`${this.$el.scrollHeight}px`):(!t||n>t)&&(this.$el.style.height=`${n}px`)}},onInput:function(e){this.autoResize&&this.resize(),this.writeValue(e.target.value,e)}},computed:{attrs:function(){return A(this.ptmi(`root`,{context:{filled:this.$filled,disabled:this.disabled}}),this.formField)},dataP:function(){return t(xe({invalid:this.$invalid,fluid:this.$fluid,filled:this.$variant===`filled`},this.size,this.size))}}},we=[`value`,`name`,`disabled`,`aria-invalid`,`data-p`];function Te(e,t,n,r,a,o){return _(),i(`textarea`,A({class:e.cx(`root`),value:e.d_value,name:e.name,disabled:e.disabled,"aria-invalid":e.invalid||void 0,"data-p":o.dataP,onInput:t[0]||=function(){return o.onInput&&o.onInput.apply(o,arguments)}},o.attrs),null,16,we)}Q.render=Te;var Ee={class:`catalog-view`},De={class:`view-header`},$={class:`card mt-4`},Oe={class:`flex justify-content-between align-items-center`},ke={class:`p-input-icon-left`},Ae={class:`flex align-items-center gap-2`},je={class:`font-bold`},Me={class:`field mb-3`},Ne={key:0,class:`p-error`},Pe={class:`field mb-3`},Fe={class:`field mb-4`},Ie={class:`field-checkbox`},Le={class:`field`},Re={key:0,class:`p-error`},ze=j(o({__name:`CatalogView`,setup(e){let t=ne(),n=I(),r=re(),a=s(()=>r?.role===`admin`),o=N([]),u=N(!0),d=N({global:{value:null,matchMode:M.CONTAINS}}),f=N(!1),m=N(!1),g=N(null),v=N(!1),x=N(!1),w=N(!1),T=N(``),D=N({id:``,nombre:``,tipo:`Salon Físico`,precio_base:0,activo:!0}),k=N(`{}`),A=e=>e.toLocaleString(`es-MX`,{style:`currency`,currency:`MXN`}),j=e=>e.includes(`Salon`)?`pi pi-building`:e.includes(`Pantalla`)?`pi pi-desktop`:e.includes(`Cartelera`)?`pi pi-image`:`pi pi-map`,z=e=>e.includes(`Salon`)?`info`:e.includes(`Pantalla`)?`success`:e.includes(`Cartelera`)?`warning`:`secondary`,H=async()=>{if(t.activeTenant?.id){u.value=!0;try{o.value=await F.collection(`espacios`).getFullList({filter:`tenant = "${t.activeTenant?.id}"`,sort:`-created`})}catch(e){console.error(e)}finally{u.value=!1}}};C(()=>t.activeTenant?.id,()=>{H()}),c(()=>{H()});let U=()=>{D.value={id:``,nombre:``,tipo:`Salon Físico`,precio_base:0,activo:!0},k.value=`{
  "aplica_premontaje": false
}`,v.value=!1,x.value=!1,f.value=!0},W=e=>{D.value={id:e.id,nombre:e.nombre,tipo:e.tipo,precio_base:e.precio_base,activo:e.activo},k.value=JSON.stringify(e.config_b2b||{},null,2),v.value=!0,x.value=!1,f.value=!0},K=()=>{f.value=!1,x.value=!1,T.value=``},q=async()=>{if(x.value=!0,T.value=``,!D.value.nombre)return;let e={};try{e=JSON.parse(k.value||`{}`)}catch{T.value=`Formato JSON inválido. Verifique la sintaxis.`;return}w.value=!0;try{let n={tenant:t.activeTenant?.id,nombre:D.value.nombre,tipo:D.value.tipo,precio_base:D.value.precio_base,activo:D.value.activo,config_b2b:e};v.value?await F.collection(`espacios`).update(D.value.id,n):await F.collection(`espacios`).create(n),K(),H()}catch(e){console.error(e)}finally{w.value=!1}},J=e=>{g.value=e,m.value=!0},Y=async()=>{if(g.value)try{await F.collection(`espacios`).delete(g.value.id),H(),n.addNotification({type:`success`,message:`Espacio eliminado`,domainEvent:`SPACE_DELETED`})}catch(e){console.error(e),n.addNotification({type:`error`,message:`Error al eliminar`,domainEvent:`SPACE_DELETE_FAILED`})}};return(e,t)=>(_(),i(`div`,Ee,[l(`div`,De,[t[9]||=l(`div`,null,[l(`h1`,{class:`title`},`Catálogo de Espacios`),l(`p`,{class:`subtitle`},`Gestión de inventario físico y publicitario`)],-1),a.value?(_(),p(b(L),{key:0,label:`Nuevo Espacio`,icon:`pi pi-plus`,onClick:U,class:`p-button-primary`})):P(``,!0)]),l(`div`,$,[h(b(ie),{value:o.value,paginator:!0,rows:10,dataKey:`id`,loading:u.value,filters:d.value,"onUpdate:filters":t[1]||=e=>d.value=e,filterDisplay:`menu`,globalFilterFields:[`nombre`,`tipo`],responsiveLayout:`scroll`,emptyMessage:`No se encontraron espacios.`},{header:y(()=>[l(`div`,Oe,[l(`span`,ke,[t[10]||=l(`i`,{class:`pi pi-search`},null,-1),h(b(B),{modelValue:d.value.global.value,"onUpdate:modelValue":t[0]||=e=>d.value.global.value=e,placeholder:`Buscar espacio...`},null,8,[`modelValue`])])])]),default:y(()=>[h(b(V),{field:`nombre`,header:`Nombre del Espacio`,sortable:``},{body:y(e=>[l(`div`,Ae,[l(`i`,{class:E([j(e.data.tipo),`text-primary text-xl`])},null,2),l(`span`,je,S(e.data.nombre),1)])]),_:1}),h(b(V),{field:`tipo`,header:`Tipo`,sortable:``},{body:y(e=>[h(b(R),{severity:z(e.data.tipo),value:e.data.tipo},null,8,[`severity`,`value`])]),_:1}),h(b(V),{field:`precio_base`,header:`Precio Base`,sortable:``},{body:y(e=>[ee(S(A(e.data.precio_base)),1)]),_:1}),h(b(V),{field:`activo`,header:`Estado`,sortable:``},{body:y(e=>[h(b(R),{severity:e.data.activo?`success`:`danger`,value:e.data.activo?`Activo`:`Inactivo`},null,8,[`severity`,`value`])]),_:1}),a.value?(_(),p(b(V),{key:0,header:`Acciones`,exportable:!1,style:{"min-width":`8rem`}},{body:y(e=>[h(b(L),{icon:`pi pi-pencil`,class:`p-button-rounded p-button-text p-button-success mr-2`,onClick:t=>W(e.data)},null,8,[`onClick`]),h(b(L),{icon:`pi pi-trash`,class:`p-button-rounded p-button-text p-button-danger`,onClick:t=>J(e.data)},null,8,[`onClick`])]),_:1})):P(``,!0)]),_:1},8,[`value`,`loading`,`filters`])]),h(b(se),{visible:f.value,"onUpdate:visible":t[7]||=e=>f.value=e,header:v.value?`Editar Espacio`:`Nuevo Espacio`,modal:!0,class:`p-fluid`,style:{width:`600px`}},{footer:y(()=>[h(b(L),{label:`Cancelar`,icon:`pi pi-times`,class:`p-button-text`,onClick:K}),h(b(L),{label:`Guardar`,icon:`pi pi-check`,class:`p-button-primary`,onClick:q,loading:w.value},null,8,[`loading`])]),default:y(()=>[h(b(G),null,{default:y(()=>[h(b(X),{header:`Información General`,value:`0`},{default:y(()=>[l(`div`,Me,[t[11]||=l(`label`,{for:`nombre`},`Nombre`,-1),h(b(B),{id:`nombre`,modelValue:D.value.nombre,"onUpdate:modelValue":t[2]||=e=>D.value.nombre=e,modelModifiers:{trim:!0},required:`true`,autofocus:``},null,8,[`modelValue`]),x.value&&!D.value.nombre?(_(),i(`small`,Ne,`El nombre es requerido.`)):P(``,!0)]),l(`div`,Pe,[t[13]||=l(`label`,{for:`tipo`},`Tipo de Espacio`,-1),O(l(`select`,{"onUpdate:modelValue":t[3]||=e=>D.value.tipo=e,id:`tipo`,class:`p-inputtext p-component custom-select`},[...t[12]||=[l(`option`,{value:`Salon Físico`},`Salón Físico`,-1),l(`option`,{value:`Cartelera`},`Cartelera Publicitaria`,-1),l(`option`,{value:`Pantalla Digital`},`Pantalla Digital`,-1),l(`option`,{value:`Explanada`},`Explanada / Abierto`,-1)]],512),[[te,D.value.tipo]])]),l(`div`,Fe,[t[14]||=l(`label`,{for:`precio_base`},`Precio Base (MXN)`,-1),h(b(ae),{inputId:`precio_base`,modelValue:D.value.precio_base,"onUpdate:modelValue":t[4]||=e=>D.value.precio_base=e,mode:`currency`,currency:`MXN`,locale:`es-MX`},null,8,[`modelValue`])]),l(`div`,Ie,[h(b(oe),{inputId:`activo`,modelValue:D.value.activo,"onUpdate:modelValue":t[5]||=e=>D.value.activo=e,binary:!0},null,8,[`modelValue`]),t[15]||=l(`label`,{for:`activo`,class:`ml-2`},`Espacio Activo (Disponible para Cotizar)`,-1)])]),_:1}),h(b(X),{header:`Configuración B2B (Avanzado)`,value:`1`},{default:y(()=>[t[16]||=l(`p`,{class:`text-sm text-slate-500 mb-3`},` Configura reglas de negocio en formato JSON para este espacio (ej. reglas de premontaje, horas extra, bloqueos de días). `,-1),l(`div`,Le,[h(b(Q),{modelValue:k.value,"onUpdate:modelValue":t[6]||=e=>k.value=e,rows:`10`,class:`font-mono text-sm`,placeholder:`{\\n  "aplica_premontaje": true,\\n  "premontaje_pct": 25\\n}`},null,8,[`modelValue`]),T.value?(_(),i(`small`,Re,S(T.value),1)):P(``,!0)])]),_:1})]),_:1})]),_:1},8,[`visible`,`header`]),h(ce,{visible:m.value,"onUpdate:visible":t[8]||=e=>m.value=e,title:`Eliminar Espacio`,message:`¿Está seguro de eliminar el espacio ${g.value?.nombre}?`,onConfirm:Y},null,8,[`visible`,`message`])]))}}),[[`__scopeId`,`data-v-5e74364c`]]);export{ze as default};