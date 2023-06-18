import { Dimensions } from "react-native";
// get a cat fact from the cat api
export const getCatFact = async () => {
    // get dimensions of the window
    const width = Math.floor(Dimensions.get('window').width * 0.9);
    // get a random cat image from the cat api
    const response = await fetch(`https://cataas.com/cat?json=true&?width=${width}&height=${width}`);
    const data = await response.json();
    return data;
}