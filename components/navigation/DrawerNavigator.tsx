import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../../app/index'; // Tu pantalla principal
import CustomSidebarMenu from './CustomSidebarMenu'; // Componente del sidebar
import CustomHeader from './CustomHeader';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
      screenOptions={{
        header: ({ navigation }) => (
          <CustomHeader navigation={navigation} />
        ),
      }}
    >
      <Drawer.Screen name="index" component={HomeScreen} options={{title:'Pantalla Principal'}}/>
      {/* Agrega más pantallas aquí */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

