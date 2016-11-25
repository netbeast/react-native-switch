import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'


const CONTAINER_WIDTH = 55
const CIRCLE_RADIUS = 25
const INACTIVE_OFFSET = CONTAINER_WIDTH - CIRCLE_RADIUS - 2

export class Switch extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
    activeText: PropTypes.string,
    inActiveText: PropTypes.string,
    backgroundActive: PropTypes.string,
    backgroundInactive: PropTypes.string,
    value: PropTypes.bool,
    circleActiveColor: PropTypes.string,
    circleInActiveColor: PropTypes.string,
  }

  static defaultProps = {
    value: false,
    onValueChange: () => null,
    disabled: false,
    activeText: '',
    inActiveText: '',
    backgroundActive: 'rgb(143, 255, 160)',
    backgroundInactive: 'rgb(204, 205, 210)',
    circleActiveColor: 'white',
    circleInActiveColor: 'white'
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: props.value,
      transformSwitch: new Animated.Value(props.value ? 0 : -INACTIVE_OFFSET),
      backgroundColor: new Animated.Value(props.value ? CONTAINER_WIDTH : -CONTAINER_WIDTH),
      circleColor: new Animated.Value(props.value ? CONTAINER_WIDTH : -CONTAINER_WIDTH)
    }

    this.handleSwitch = this.handleSwitch.bind(this)
    this.animateSwitch = this.animateSwitch.bind(this)
  }

  handleSwitch() {
    const { value } = this.state
    const { onValueChange, disabled } = this.props
    if (disabled) {
      return
    }

    this.animateSwitch(!value, () => {
      this.setState({ value: !value }, () => onValueChange(this.state.value))
    })
  }

  animateSwitch(value, cb = () => {}) {
    Animated.parallel([
      Animated.spring(this.state.transformSwitch, {
        toValue: value ? 0 : -INACTIVE_OFFSET,
        duration: 200
      }),
      Animated.timing(this.state.backgroundColor, {
        toValue: value ? CONTAINER_WIDTH : -CONTAINER_WIDTH,
        duration: 200
      }),
      Animated.timing(this.state.circleColor, {
        toValue: value ? CONTAINER_WIDTH : -CONTAINER_WIDTH,
        duration: 200
      })
    ]).start(cb)
  }

  componentWillReceiveProps (nextProps) {
    const { disabled } = this.props
    if (disabled) {
      return
    }
    this.animateSwitch(nextProps.value, () => {
      this.setState({ value: nextProps.value })
    })
  }

  render() {
    const { transformSwitch, backgroundColor, circleColor } = this.state

    const {
      backgroundActive,
      backgroundInactive,
      circleActiveColor,
      circleInActiveColor,
      activeText,
      inActiveText,
      style
    } = this.props

    const interpolatedColorAnimation = backgroundColor.interpolate({
      inputRange: [-CONTAINER_WIDTH, CONTAINER_WIDTH],
      outputRange: [backgroundInactive, backgroundActive]
    })

    const interpolatedCircleColor = circleColor.interpolate({
      inputRange: [-CONTAINER_WIDTH, CONTAINER_WIDTH],
      outputRange: [circleInActiveColor, circleActiveColor]
    })
    return (
      <View style={style}>
        <TouchableWithoutFeedback onPress={this.handleSwitch}>
          <Animated.View
            style={[
              styles.container,
              { backgroundColor: interpolatedColorAnimation }
            ]}
          >
            <Animated.View
              style={[
                styles.animatedContainer,
                { transform: [{ translateX: transformSwitch }] },
              ]}
            >
              <Text style={[styles.text, styles.inactiveText, styles.textPaddingRight]}>
                {activeText}
              </Text>
              <Animated.View style={[styles.circle, { backgroundColor: interpolatedCircleColor }]} />
              <Text style={[styles.text, styles.active, styles.textPaddingLeft]}>
                {inActiveText}
              </Text>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}
// 51 / 31

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: 'black',
    elevation: 3,
    overflow: 'hidden'
  },
  animatedContainer: {
    flex: 1,
    width: 1.5 * CONTAINER_WIDTH,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_RADIUS - 2,
    height: CIRCLE_RADIUS - 2,
    borderRadius: 14,
    backgroundColor: 'white',
    zIndex: 10,
    elevation: 3
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent'
  },
  textPaddingRight: {
    paddingRight: 5
  },
  textPaddingLeft: {
    paddingLeft: 5
  }
})
