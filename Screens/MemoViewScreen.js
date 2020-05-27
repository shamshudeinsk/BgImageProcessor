import React from 'react';
import {Image, Button, View, StyleSheet, Text, ScrollView, SafeAreaView, ActivityIndicator, PermissionsAndroid, Platform} from 'react-native';
import Share from 'react-native-share';
import Base64 from "../Utils/Base64";
import CameraRoll from "@react-native-community/cameraroll";
import ViewShot from "react-native-view-shot";

const URL = "http://192.168.1.7:8080";

class MemoViewScreen extends React.Component {

  constructor(props) {
    super(props);

    console.log('navigation=' + this.props.navigation);
    console.log('route' + this.props.route);
    console.log('route params' + this.props.route.params);
    console.log('imagePath' + this.props.route.params.imagePath);
    console.log('imageEffect' + this.props.route.params.imageEffect);
    console.log('bgImg' + this.props.route.params.bgImg);
    const base64Str = "data:image/jpeg;base64,";

    this.state = {
      imagePath: this.props.route.params.imagePath,
      imageInput: base64Str + this.props.route.params.imageInput,
      imageEffect: this.props.route.params.imageEffect,
      bgImg: this.props.route.params.bgImg,
    };
  }

  async componentDidMount()
  {
    console.log('componentDidMount');
    if(this.state.imagePath)
    {

      // Image.getSize(this.state.imagePath, (width, height) => {this.setState({width, height})});
      const res = await this.applyEffectOnImage(this.state.imageEffect, this.state.imagePath, this.state.bgImg);

      let storagePermission = false;
      if(Platform.OS === 'android')
      {
        storagePermission = await this.requestExternalStoragePermission();
      }
      else
      {
        storagePermission = true;
      }
      if(storagePermission)
      {
        CameraRoll.saveToCameraRoll(res, 'photo');
      }
      this.setState({imageOutput: res});
    }
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'BgImageProcessor App Storage Permission',
          message: 'BgImageProcessor App needs access to your storage ' +
            'so you can save your photos',
        },
      );
      return granted;
    } catch (err) {
      console.error('Failed to request permission ', err);
      return null;
    }
  };

  share = async () => {
    this.refs.viewShot.capture().then(uri => {
      console.log("Screenshot Captured at: ", uri);
      let storagePermission = false;
      if(Platform.OS === 'android')
      {
        storagePermission = this.requestExternalStoragePermission();
      }
      else
      {
        storagePermission = true;
      }
      if(storagePermission)
      {
        CameraRoll.saveToCameraRoll(uri);
      }
      let shareOptions = {
        title: 'Background Change',
        message: "Check out this photo!",
        url: uri,
        subject: "Check out this photo!"
      };
      console.log('social', Share);
      Share.open(shareOptions)
      .then((res) => console.log('res:', res))
      .catch(err => console.log('err', err));
  });
}

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
          <View>
            <Button 
                onPress={() => {
                  setTimeout(() => {
                    this.share();
                  }, 300);
                }}
                title="Share">
            </Button>
          </View>
          <ViewShot ref="viewShot">
          <Image 
            style={{width:400, height: 300}}
            source = {{uri: this.state.imageInput}}>
          </Image>
          <View style={styles.buffer}></View>
          <Text>CortexMind - BgImageProcessor</Text>
          {! this.state.imageOutput &&
           <ActivityIndicator size="large" color="#0000ff" />
          }
          {this.state.imageOutput &&
          <Image 
            style={{width:400, height: 300}}
            source = {{uri: this.state.imageOutput}}>
          </Image>
          }
          </ViewShot>
        </ScrollView>
      </SafeAreaView>
    );
  }

  async applyEffectOnImage(imageEffect, imageURI, bgImg) {
    let endPoint = URL;
    if(imageEffect == '1')
    {
      endPoint = URL + "/imagebg/grayscale";
    }
    else if(imageEffect == '2')
    {
      endPoint = URL + "/imagebg/blur";
    }
    else if(imageEffect == '3')
    {
      endPoint = URL + "/imagebg/remove";
    }
    else if(imageEffect == '4')
    {
      endPoint = URL + "/imagebg/change";
    }
    const formData = new FormData();
    formData.append("data", {
      uri: imageURI,
      name: "photo",
      type: "image/jpg",
    });
    formData.append("bgimg", this.state.bgImg);
    console.log('calling service:' + endPoint);
  
    const resp = await fetch(endPoint, {
        method: "POST",
      body: formData,
    }).then(async (res) => {
      console.log("> converting...");
      // console.log(res);
      const buffer = await res.arrayBuffer();
      const base64Flag = "data:image/png;base64,";
      const imageStr = this.arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
      // return res;
    });
  
    return resp;
  }

  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return Base64.btoa(binary);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  scrollView: {
    marginHorizontal: 5,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buffer: {
    padding: 5
  }
});

export default MemoViewScreen;