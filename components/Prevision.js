import { Image, StyleSheet, Text, View } from "react-native";

function Prevision({ myPrevision }) {
  return (
    <View
      style={[
        styles.mx5,
        styles.py15,
        styles.px30,
        styles.flexDirectionColumn,
        styles.bgGrey,
        styles.alignItemsCenter,
      ]}
    >
      <Text style={[styles.text18, styles.textBold, styles.textCapitalize]}>
        {new Date(myPrevision.dt_txt).toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
        })}
      </Text>
      <Image
        source={{
          uri: `http://openweathermap.org/img/wn/${myPrevision.weather[0].icon}@4x.png`,
        }}
        style={{ height: 100, width: 100 }}
      ></Image>
      <Text style={[styles.textDark2, styles.text24, styles.textBold]}>
        {Math.floor(myPrevision.main.temp)} <Text>°C</Text>
      </Text>
    </View>
  );
}

export default Prevision;

const styles = StyleSheet.create({
  textBold: {
    fontWeight: "bold",
  },
  textCapitalize: {
    textTransform: "capitalize",
  },
  text18: {
    fontSize: 18,
  },
  text24: {
    fontSize: 24,
  },
  textDark2: {
    color: "#222222",
  },
  mx5: {
    marginHorizontal: 5,
  },
  px30: {
    paddingHorizontal: 30,
  },
  py15: {
    paddingVertical: 15,
  },
  flexDirectionColumn: {
    flexDirection: "column",
  },
  bgGrey: {
    backgroundColor: "lightgrey",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
});
