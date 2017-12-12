import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import Home from '../screens/home/Home';
import Assistant from '../screens/assistant/Assistant';
import NotesStack from './NotesStack';
import List from '../screens/shopping/List';
import RecipeStack from '../screens/shopping/RecipeStack';
import Calendar from '../screens/calendar/Calendar';
import Test from '../screens/test/Test';
import Settings from '../screens/settings/Settings';

export default NavTabs = TabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-home" size={28} color={tintColor} />
            )
        }
    },
    Assistant: {
        screen: RecipeStack,
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
    Shopping: {
        screen: List,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Ionicons name="md-cart" size={28} color={tintColor} />
            )
        }
    },
    //Calendar: {
    //    screen: Calendar,
    //    navigationOptions: {
    //        tabBarIcon: ({ tintColor }) => (
    //            <Ionicons name="md-calendar" size={28} color={tintColor} />
    //        )
    //    }
    //},
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
        activeTintColor: 'yellow',
        style: {
            backgroundColor: 'black'
        },
    },
});
