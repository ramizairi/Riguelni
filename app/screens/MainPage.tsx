import React, {  } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Import FIREBASE_DB and FIREBASE_AUTH from the configFirebase file
import GeminiChat from './chatBot'; // Import the GeminiChat component
import Task from './Task';
// Define the Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const MainPage = () => {

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  const _renderIcon = (routeName, selectedTab) => {
    let icon = '';

    switch (routeName) {
      case 'Tasks':
        icon = 'alarm-outline';
        break;
      case 'Chat Bot':
        icon = 'person-outline';
        break;
    }

    return (
      <Ionicons
        name={icon}
        size={25}
        color={routeName === selectedTab ? 'black' : 'gray'}
      />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shawdow}
      height={55}
      circleWidth={50}
      bgColor="white"
      initialRouteName="Tasks"
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircleUp}>
        <TouchableOpacity
          style={styles.button}
          onPress={(handleLogout)}
        >
          <Ionicons name={'log-out-outline'} color="gray" size={25} />
        </TouchableOpacity>
      </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBarExpo.Screen
        name="Tasks"
        position="LEFT"
        component={() => <Task navigation={undefined} />}
      />
      <CurvedBottomBarExpo.Screen
        name="Chat Bot"
        component={() => <GeminiChat />}
        position="RIGHT"
      />
    </CurvedBottomBarExpo.Navigator >
  );
};

export default MainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen2: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
