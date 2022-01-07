import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View,Dimensions } from "react-native";
const {width,height} = Dimensions.get('window');
const NormalAlert = (props) => {
  const modalVisible = props.modalVisible;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          props.setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitleText}>Thông báo</Text>
            <Text style={styles.modalText}>{props.content}</Text>
            <View
              style={styles.modalViewButton}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width:width/1.2,
    backgroundColor: "white",
    borderRadius: 20,
    padding:10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalViewButton:{
    borderTopWidth:0.5,
    width:'100%',
    borderTopColor:'#3333'
  },
  button: {
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#FFFF",
  },
  textStyle: {
    color: "#2196F3",
    fontWeight: "bold",
    textAlign: "center",
    fontSize:16
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:16,
    fontWeight: "500",
  },
  modalTitleText: {
    marginTop:10,
    marginBottom: 15,
    textAlign: "center",
    fontWeight:'800',
    color:'black',
    fontSize:16
  }
});

export default NormalAlert;