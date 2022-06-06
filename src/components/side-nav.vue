<script>
import MetisMenu from "metismenujs/dist/metismenujs";

//import { menuItems } from "./menu";

/**
 * Sidenav component
 */
export default {
    data() {
        return {
            menuItems: [],
            menuData: null,
            menuStore: JSON.parse(localStorage.getItem('menu')),
        };
    },
    mounted() {
        this.loadMenu()
        // eslint-disable-next-line no-unused-vars
        var menuRef = new MetisMenu("#side-menu");
        var links = document.getElementsByClassName("side-nav-link-ref");
        var matchingMenuItem = null;
        const paths = [];
    
        for (var i = 0; i < links.length; i++) {
            paths.push(links[i]["pathname"]);
        }
        var itemIndex = paths.indexOf(window.location.pathname);
        if (itemIndex === -1) {
            const strIndex = window.location.pathname.lastIndexOf("/");
            const item = window.location.pathname.substr(0, strIndex).toString();
            matchingMenuItem = links[paths.indexOf(item)];
        } else {
            matchingMenuItem = links[itemIndex];
        }

        if (matchingMenuItem) {
            matchingMenuItem.classList.add("active");
            var parent = matchingMenuItem.parentElement;

            /**
             * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
             * We should come up with non hard coded approach
             */
            if (parent) {
                parent.classList.add("mm-active");
                const parent2 = parent.parentElement.closest("ul");
                if (parent2 && parent2.id !== "side-menu") {
                    parent2.classList.add("mm-show");

                    const parent3 = parent2.parentElement;
                    if (parent3) {
                        parent3.classList.add("mm-active");
                        var childAnchor = parent3.querySelector(".has-arrow");
                        var childDropdown = parent3.querySelector(".has-dropdown");
                        if (childAnchor) childAnchor.classList.add("mm-active");
                        if (childDropdown) childDropdown.classList.add("mm-active");

                        const parent4 = parent3.parentElement;
                        if (parent4 && parent4.id !== "side-menu") {
                            parent4.classList.add("mm-show");
                            const parent5 = parent4.parentElement;
                            if (parent5 && parent5.id !== "side-menu") {
                                parent5.classList.add("mm-active");
                                const childanchor = parent5.querySelector(".is-parent");
                                if (childanchor && parent5.id !== "side-menu") {
                                    childanchor.classList.add("mm-active");
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    methods: {
        loadMenu() {
          console.log(this.menuStore.length) // eslint-disable-line
        },
        /**
         * Returns true or false if given menu item has child or not
         * @param item menuItem
         */
        hasItems(item) {
            return item.subItems !== undefined ? item.subItems.length > 0 : false;
        },
        hasMenu(item) {
            return item.menus !== undefined ? item.menus.length > 0 : false;
        },
        hasSubMenu(item) {
            return item.subMenus !== undefined ? item.subMenus.length > 0 : false;
        },

        toggleMenu(event) {
            event.currentTarget.nextElementSibling.classList.toggle("mm-show");
        },
    },
};
</script>

<template>
<!-- ========== Left Sidebar Start ========== -->

<!--- Sidemenu -->
<div id="sidebar-menu">
    <!-- Left Menu Start -->
    <ul id="side-menu" class="metismenu list-unstyled">
        <template v-for="item1 in menuStore">
            <li class="menu-title"  :key="item1.id">
                {{ item1.description }}
            </li>
            <li v-for="(item2, index) of item1.menus" :key="`${item1.id}-${index}`">
              <a  href="javascript:void(0);" class="is-parent" :class="{ 'has-arrow': !item2.badge, 'has-dropdown': item2.badge }">
                <i :class="`bx ${item2.icon}`" v-if="item2.icon"></i>
                <span>{{ $t(item2.description) }}</span>
              </a>
                <ul v-if="hasSubMenu(item2)" class="sub-menu" aria-expanded="false">
                    <li v-for="(subitem, index1) of item2.subMenus" :key="index1">
                        <router-link :to="subitem.url" v-if="!hasSubMenu(subitem)" class="side-nav-link-ref">{{ subitem.description }}</router-link>
                        <a v-if="hasSubMenu(subitem)" class="side-nav-link-a-ref has-arrow" href="javascript:void(0);">{{ subitem.description }}</a>
                        <ul v-if="hasSubMenu(subitem)" class="sub-menu mm-collapse" aria-expanded="false">
                            <li v-for="(subSubitem, index) of subitem.subItems" :key="index">
                                <router-link :to="subSubitem.link" class="side-nav-link-ref">{{ $t(subSubitem.label) }}</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </template>
    </ul>
</div>
<!-- Sidebar -->
</template>