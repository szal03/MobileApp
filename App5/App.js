import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Switch,
  Button,
  ImageBackground,
  TouchableOpacity,
  VirtualizedList,
  FlatList,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation'
import Geocoder from 'react-native-geocoder';

//co sekunde w api generujw nowe słowo

const someWords = [
  {
    id: 1,
    word: 'Deracinate',
    definition: 'To root up ',
    pronunciation: 'Terasinate',
  },
  {
    id: 2,
    word: 'Azuline',
    definition: 'Blue  ',
    pronunciation: 'Asuline',
  },
  {
    id: 3,
    word: 'Ontocyclic',
    definition: 'Returning to an infantile state or character in old age  ',
    pronunciation: 'Ontosklik',
  },
  {
    id: 4,
    word: 'Traulism',
    definition: 'Stammering  ',
    pronunciation: 'Traulism',
  },
];
const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <View style={styles.todaysWordStyle}>
        <Text style={styles.wordStyle}>{item.word}</Text>
        <Text>
          <Text style={styles.bold}>definition:</Text> {item.definition}
        </Text>
        <Text>
          <Text style={styles.bold}>pronunciation:</Text>
          {item.pronunciation}
        </Text>
      </View>
    </TouchableOpacity>
);

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [showCards, setShowCards] = useState(false);
  const [dataApi, setdataApi] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showTodaysWord, setShowTodaysWord] = useState(false);
  const [ready, setReady] = useState(false);
  const [positionLat, setPositionLat] = useState( 0);
  const [positionLng,setPositionLng ]=useState(0);
  const [error, setError] = useState(0);
  const [city, setCity]=useState('');
  const [subLocality, setSubLocality]=useState('');
  const [area, setArea] = useState('');
  const [country, setCountry]=useState('');
  const [toggleLocation, setToggleLocation]=useState(false);

  const handleColorChange = () => {
    setShowTodaysWord(!showTodaysWord);
    updateWords();
  };

  const handleShowCards = () => {
    setShowCards(!showCards);
  };
  const renderItem = ({ item }) => {
    const color = isEnabled ? '#FFD1B7' : '#D3D9E7';
    const backgroundColor = item.id === selectedId ? color : 'transparent';
    return (
        <Item
            item={item}
            onPress={() => setSelectedId(item.id)}
            style={{ backgroundColor }}
        />
    );
  };

  useEffect(() => {
    fetch('https://random-words-api.vercel.app/word')
        .then((response) => response.json())
        .then((json) => setdataApi(json))
        .catch((error) => console.error(error));
  }, []);

  const updateWords = () => {
    const actualDataLength = someWords.length;
    const sameWord = someWords.filter((elem) => elem.word === dataApi[0].word);
    if (sameWord.length === 0) {
      const newData = {
        id: actualDataLength + 1,
        word: dataApi[0].word,
        definition: dataApi[0].definition,
        pronunciation: dataApi[0].pronunciation,
      };
      someWords.push(newData);
    }
  };

  const handleLocation = () =>{
      setToggleLocation(!toggleLocation);
      if(toggleLocation){
          Geolocation.getCurrentPosition(info => (console.log(info), setPositionLat(info.coords.latitude), setPositionLng(info.coords.longitude)));
          console.log(positionLat);
          console.log(positionLng);
          const currentPosition = {
              lat: positionLat,
              lng: positionLng,
          };
          setTimeout(() => {
              Geocoder.geocodePosition(currentPosition).then(res => {
                  console.log(res);
                  console.log(res[0].adminArea);
                  setCity(res[0].locality);
                  setSubLocality(res[0].subLocality);
                  setCountry(res[0].country);

              })
                  .catch(err => console.log(err));
              console.log('Hello, World!');
          }, 1000);
          setReady(true);

      };
      };



  return (
      <>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
            source={require('./imgs/background.png')}
            style={styles.image}>
          <SafeAreaView>
            <View>
              <Text style={showCards ? styles.headerWithCards : styles.header}>
                Step to learn
              </Text>
            </View>
            <View
                style={
                  showCards
                      ? styles.stickyButtonContainer
                      : styles.normalButtonContainer
                }>
              <Button
                  color="#FFD1B7"
                  title={showCards ? 'Hide Cards!' : 'Show Cards to Learn!'}
                  onPress={handleShowCards}
              />
            </View>

            {showCards ? (
                <View style={styles.switchButton}>
                  <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor="#f4f3f4"
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                  />
                </View>
            ) : null}
            {showCards ? null : (
                <View style={styles.normalButtonContainer}>
                  <View style={styles.TopMargin}>
                      <Button
                      color="#FFD1B7"
                      title="Show todays word!"
                      onPress={handleColorChange}
                  /></View><View style={styles.TopMargin}>
                    <Button color="#FFD1B7" title="location" onPress={handleLocation} />
                </View>

                </View>
            )}
            {showTodaysWord && !showCards ? (
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollViewHorizontal}>
                <View style={styles.todaysWordStyle}>
                  <Text style={styles.wordStyle}>{dataApi[0].word}</Text>
                  <Text>
                    <Text style={styles.bold}>definition:</Text>{' '}
                    {dataApi[0].definition}
                  </Text>
                  <Text>
                    <Text style={styles.bold}>pronunciation:</Text>
                    {dataApi[0].pronunciation}
                  </Text>
                </View>
                </ScrollView>
            ) : null}
            {showCards ? (
                <View>
                  <Text>Your words to learn!</Text>
                </View>
            ) : null}
            {showCards ? (
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}>
                  <FlatList
                      data={someWords}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      extraData={selectedId}
                  />
                </ScrollView>
            ) : null}
              {ready && toggleLocation && !showCards && !showTodaysWord? <View style={styles.todaysWordStyle}>
                  <Text >Your location: <Text style={styles.bold}>{city} {subLocality}, {country}</Text></Text>

              </View>:null}
          </SafeAreaView>
        </ImageBackground>
      </>
  );
};

const styles = StyleSheet.create({

    scrollViewHorizontal:{
        backgroundColor: 'transparent',
    },
  scrollView: {
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  body: {
    fontFamily: 'Arial',
    backgroundColor: Colors.black,
    opacity: 0.5,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  header: {
    marginTop: 20,
    fontFamily: 'arial',
    fontSize: 28,
    fontWeight: '800',
    justifyContent: 'flex-start',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  headerWithCards: {
    fontWeight: '600',
    fontFamily: 'arial',
    fontSize: 24,
  },
  item: {
    backgroundColor: 'transparent',
    height: 200,
    justifyContent: 'center',
      paddingTop: 0,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  stickyButtonContainer: {
    position: 'absolute',
    right: 130,
    top: 15,
  },
  normalButtonContainer: {
    justifyContent: 'center',
    position: 'relative',
    marginTop: 20,
    marginRight: 40,
    marginLeft: 40,
    height: 50,
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  image: { flex: 1 },
  todaysWordStyle: {
    backgroundColor: '#fff',
    textAlign: 'center',
    padding: 25,
    margin: 12,
      marginTop: 50,
  },
  wordStyle: {
    fontSize: 24,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  switchButton: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
    TopMargin:{
      marginTop: 20,
    }
});

export default App;
