
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import type { UserRole } from '../types';

export type RootStackParamList = {
  Home: {
    role: UserRole;
    uid: string;
    name: string;
    onSignOut: () => void;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  role: UserRole;
  uid: string;
  name: string;
  onSignOut: () => void;
};

export default function RootNavigator({
  role,
  uid,
  name,
  onSignOut,
}: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: '#FAF5EF',
          },
        }}
      >
        <Stack.Screen name="Home">
          {() => (
            <HomeScreen
              role={role}
              uid={uid}
              name={name}
              onSignOut={onSignOut}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
