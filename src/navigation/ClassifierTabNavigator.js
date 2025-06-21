// FILE: src/navigation/ClassifierTabNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ListManagerScreen from '../screens/settings/ListManagerScreen';
import { colors } from '../utils/styles';

const Tab = createMaterialTopTabNavigator();

export default function ClassifierTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="PaymentPurposes" 
        component={ListManagerScreen}
        options={{ title: 'Paskirtys' }}
        initialParams={{ listKey: 'mokejimoPaskirtisOptions', setListKey: 'setMokejimoPaskirtisOptions' }} 
      />
      <Tab.Screen 
        name="InvoiceTypes" 
        component={ListManagerScreen}
        options={{ title: 'Rūšys' }}
        initialParams={{ listKey: 'rusysOptions', setListKey: 'setRusysOptions' }} 
      />
      <Tab.Screen 
        name="InvoiceStatuses" 
        component={ListManagerScreen}
        options={{ title: 'Būsenos' }}
        initialParams={{ listKey: 'busenaOptions', setListKey: 'setBusenaOptions' }} 
      />
    </Tab.Navigator>
  );
}