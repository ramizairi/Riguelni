// * IMPORTS
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

// * TYPES
interface Props {
  onAddNewTask: () => void
}

// -< COMPONENT >-------------------------------------------------
export default function Footer({ onAddNewTask }: Props) {
  return (
    <View style={styles.footer}>
      {/* "ADD NEW TASK" BUTTON */}
      <TouchableOpacity style={styles.addNewTaskButton} onPress={onAddNewTask}>
        <View style={styles.plusIconContainer}>
          <Image
            source={require('../../assets/plus-icon.png')}
            style={styles.plusIcon}
          />
        </View>
        <Text style={styles.addNewTaskText}>New Task</Text>
      </TouchableOpacity>
    </View>
  )
}

// -< STYLES >----------------------------------------------------
const styles = StyleSheet.create({
  // * FOOTER
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'flex-start',
  },

  // * ADD NEW TASK BUTTON
  addNewTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingBottom: 20,
    paddingVertical: 10,
  },

  plusIconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    borderRadius: 20,
    position: 'relative',
    top: 1,
    marginRight: 10,
  },

  plusIcon: {
    width: 12,
    height: 12,
  },

  addNewTaskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
})
