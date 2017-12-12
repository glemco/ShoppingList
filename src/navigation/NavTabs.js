import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import {StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/home/Home';
import Recipes from '../screens/shopping/RecipeStack';
import NotesStack from './NotesStack';
import List from '../screens/shopping/List';
import Calendar from '../screens/calendar/Calendar';
import Test from '../screens/test/Test';
import Settings from '../screens/settings/Settings';
import Styles from '../styles/StyleSheet';

export default NavTabs = ()=> TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-home" size={28} color={tintColor} />
            )
        }
    },
    Recipes: {
        screen: Recipes,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-color-wand" size={28} color={tintColor} />
            )
        }
    },
    Notes: {
        screen: NotesStack,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-copy" size={28} color={tintColor} />
            )
        }
    },
    List: {
        screen: List,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-cart" size={28} color={tintColor} />
            )
        }
    },
    Calendar: {
        screen: Calendar,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-calendar" size={28} color={tintColor} />
            )
        }
    },
    Test: {
        screen: Test,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-bug" size={28} color={tintColor} />
            )
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-settings" size={28} color={tintColor} />
            )
        }
    }
}, {
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
        activeTintColor: StyleSheet.flatten(Styles().title).color,
        style: Styles().tabBar,
    },
});
