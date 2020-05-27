import React from 'react';
import {Text, Button, View, StyleSheet} from 'react-native';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.props.navigation.navigate('Home')}
            title="Home"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this.props.navigation.navigate('ChangeBgOnImage')}
            title="Change Background On Image"
          />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20
  }
});

export default HomeScreen;