import React from 'react';
import {Text, View, Button, StyleSheet, PermissionsAndroid, Platform, FlatList, TouchableOpacity, Image, ScrollView, SafeAreaView} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import { Overlay, Card, ListItem} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

const OPTIONS = [
  {
    id: '1',
    title: 'Grayscale',
  },
  {
    id: '2',
    title: 'Blur',
  },
  {
    id: '3',
    title: 'Remove',
  },
  {
    id: '4',
    title: 'Change',
  },
];

class ChangeBgOnImageScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cameraType: RNCamera.Constants.Type.back,
      imageEffect: '1',
      overlayVisible: false,
      cameraVisible: false,
    };
  }

  componentDidMount() {
    this.images = [
                    {id: 0, title: 'Forest', img: require('../images/forest.jpg')},
                    {id: 1, title: 'Building', img: require('../images/building.jpg')},
                    {id: 2, title: 'Eiffel Tower', img: require('../images/eiffeltower.jpg')},
                    {id: 3, title: 'Golden Gate Bridge', img: require('../images/goldengate.jpg')},
                    {id: 4, title: 'Taj Mahal', img: require('../images/tajmahal.jpg')},
                    {id: 5, title: 'Times Square', img: require('../images/timesquare.jpg')},
    ];
    console.log('images = ' + this.images);
  }

  onSelect(id)
  {
    this.setState({imageEffect: id});
    if(id == '4')
    {
      this.setState({overlayVisible: true});
    }
  }

  selectBackground(bgImg)
  {
    this.setState({selectedBgImg:bgImg.img, selectedBgIndex: bgImg.id, overlayVisible: false});
  }

  selectImage()
  {
    const options = {
      title: 'Select Photo',
    };
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('source==' + source.uri);
        this.processDocument(response.data, source.uri).then(() => console.log('Finished processing file.'));
      }
    });
  }

  openCamera()
  {
    this.setState({cameraVisible: true});
  }

  closeCamera()
  {
    this.setState({cameraVisible: false});
  }

  async resize(imageUri) {
    this.setState({
      resizedImageUri: imageUri,
    });
    // await ImageResizer.createResizedImage(imageUri, 200, 600, 'JPEG', 100)
    //   .then(({uri}) => {
    //     this.setState({
    //       resizedImageUri: uri,
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     return Alert.alert(
    //       'Unable to resize the photo',
    //       'Check the console for full the error message',
    //     );
    //   });
  }

  toggleOverlay = () => {
    this.setState({overlayVisible: false});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <Text>Effects : </Text>
        <FlatList
          data={OPTIONS}
          renderItem={({ item }) => (
            <TouchableOpacity
            onPress={() => this.onSelect(item.id)}
            style={[
              styles.item,
              { backgroundColor: (this.state.imageEffect === item.id) ? '#6e3b6e' : '#f9c2ff' },
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>          
          )}
          keyExtractor={item => item.id}
          horizontal = {true}
        />
        {this.state.selectedBgImg &&
          <Image 
          style={{width:50, height: 50}}
          source = {this.state.selectedBgImg}>
        </Image>
        }
        </View>
        <Overlay isVisible={this.state.overlayVisible} onBackdropPress={this.toggleOverlay}>
          <SafeAreaView>
          <ScrollView>
          <View>
            <Text style={styles.overlaytitle}>Select Background</Text>
            {this.images && this.images.map((item, key) =>
            <TouchableOpacity
              onPress={() => this.selectBackground(item)}>
            <Card
              title={item.title}
              image={item.img}
            >
            </Card>
            </TouchableOpacity>
            )}
          </View>
          </ScrollView>
          </SafeAreaView>
        </Overlay>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.selectImage()}
            title="Select Image from Gallery"
          />
          {! this.state.cameraVisible && 
          <Button
            onPress={() => this.openCamera()}
            title="Open Camera"
          />
          }
          {this.state.cameraVisible && 
          <Button
            onPress={() => this.closeCamera()}
            title="Close Camera"
          />
          }
          {this.state.cameraVisible && 
          <Button
            onPress={() => this.switchCameraType()}
            title="Switch Camera - Front / Back"
          />
          }
        </View>
        {this.state.cameraVisible && 
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.cameraType}
          flashMode={RNCamera.Constants.FlashMode.off}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          zoom={0}
        >
        </RNCamera>
        }
        {this.state.cameraVisible && 
        <View style={styles.buttonContainer}>
          <Button
            // onPress={() => this.processImage()}
            onPress={() => this.takePicture()}
            title="Process Image"
          />
        </View>
        }
        </View>
    );
  }

  switchCameraType()
  {
    if(this.state.cameraType == RNCamera.Constants.Type.front)
    {
      this.setState({
        cameraType: RNCamera.Constants.Type.back,
      });
    }
    else
    {
      this.setState({
        cameraType: RNCamera.Constants.Type.front,
      });
    }
  }

  takePicture = async () => {
    console.log("takePicture");
    if (this.camera) {
      const options = { quality: 0.5, base64: true, orientation: RNCamera.Constants.ORIENTATION_UP, forceUpOrientation: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      await this.resize(data.uri);
      let storagePermission = false;
      if(Platform.OS === 'android')
      {
        storagePermission = await this.requestExternalStoragePermission();
      }
      else
      {
        storagePermission = true;
      }
      console.log('this.state.resizedImageUri' + this.state.resizedImageUri);
      if(storagePermission)
      {
        CameraRoll.saveToCameraRoll(this.state.resizedImageUri);
      }
      this.processDocument(data.base64, this.state.resizedImageUri).then(() => console.log('Finished processing file.'));
    }
  };

  async processDocument(inputImage, localPath) {


    // const processed = await vision().textRecognizerProcessImage(localPath);

    // console.log('Found text in document: ', processed.text);

    // processed.blocks.forEach(block => {
    //   console.log('Found block with text: ', block.text);
    //   console.log('Confidence in block: ', block.confidence);
    //   console.log('Languages found in block: ', block.recognizedLanguages);
    // });

    this.props.navigation.navigate('MemoView', {
      displayText: 'Done',
      imageInput: inputImage,
      imagePath: localPath,
      imageEffect: this.state.imageEffect,
      bgImg: this.state.selectedBgIndex,
    });

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

  // processImage()
  // {
  //   // Local path to file on the device
  //   const localFile = `${utils.FilePath.PICTURES_DIRECTORY}/Wege_der_parlamentarischen_Demokratie.jpg`;
  //   //const localFile = 'Assets/Text1.jpg';
  //   console.log('file path:' + localFile);
  //   this.processDocument(localFile).then(() => console.log('Finished processing file.'));
  // }

 
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 5
  },
  listContainer: {
    margin: 5,
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 5,
    marginVertical: 3,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
  },
  overlaytitle: {
    fontWeight: "bold",
    marginVertical: 4,
    alignItems: 'center',
  },
});

export default ChangeBgOnImageScreen;