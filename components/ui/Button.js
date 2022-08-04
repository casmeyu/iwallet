import { Text, TouchableHighlight } from 'react-native';

const Button = (props) => {
    const { text, f, styles } = props

    return (
        <TouchableHighlight style={styles.button} onPress={() => f()}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableHighlight>
    )
}

export default Button