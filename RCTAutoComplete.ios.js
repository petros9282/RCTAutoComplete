var React = require("react");
var PropTypes = require("prop-types");
var { requireNativeComponent } = require("react-native");

var NativeAutoComplete = requireNativeComponent("RCTAutoComplete", null);

class RCTAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mostRecentEventCount: 0
    };
    this._getText = this._getText.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }
  _getText() {
    return typeof this.props.value === "string"
      ? this.props.value
      : this.props.defaultValue;
  }
  _onChange(event) {
    var text = event.nativeEvent.text;
    var eventCount = event.nativeEvent.eventCount;
    this.props.onChange && this.props.onChange(event);
    this.props.onChangeText && this.props.onChangeText(text);
    this.setState({ mostRecentEventCount: eventCount }, () => {
      // This is a controlled component, so make sure to force the native value
      // to match.  Most usage shouldn't need this, but if it does this will be
      // more correct but might flicker a bit and/or cause the cursor to jump.
      if (text !== this.props.value && typeof this.props.value === "string") {
        this.refs.input &&
          this.refs.input.setNativeProps({
            text: this.props.value
          });
      }
    });

    event.nativeEvent.possibleCompletionsForString &&
      this.props.onTyping &&
      this.props.onTyping(event.nativeEvent.possibleCompletionsForString);

    event.nativeEvent.didSelectAutoCompleteString &&
      this.props.onSelect &&
      this.props.onSelect(event.nativeEvent.didSelectAutoCompleteString);
  }

  _onFocus(event) {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  _onBlur(event) {
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  render() {
    var props = Object.assign({}, this.props);

    return (
      <NativeAutoComplete
        ref="autocomplete"
        {...props}
        onChange={this._onChange}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onSelectionChangeShouldSetResponder={() => true}
        text={this._getText()}
        mostRecentEventCount={this.state.mostRecentEventCount}
      />
    );
  }
}

RCTAutoComplete.PropTypes = {
  /**
   * If false, disables keyboard is hidden. The default value is true.
   */
  showKeyboard: PropTypes.bool,
  /**
   * If false, disables auto-correct. The default value is true.
   */
  autoCorrect: PropTypes.bool,
  /**
   * The string that will be rendered before text input has been entered
   */
  placeholder: PropTypes.string,
  /**
   * When the clear button should appear on the right side of the text view
   * @platform ios
   */
  clearButtonMode: PropTypes.oneOf([
    "never",
    "while-editing",
    "unless-editing",
    "always"
  ]),
  /**
   * If true, clears the text field automatically when editing begins
   * @platform ios
   */
  clearTextOnFocus: PropTypes.bool,
  /**
   * Determines which keyboard to open, e.g.`numeric`.
   *
   * The following values work across platforms:
   * - default
   * - numeric
   * - email-address
   */
  keyboardType: PropTypes.oneOf([
    // Cross-platform
    "default",
    "numeric",
    "email-address",
    // iOS-only
    "ascii-capable",
    "numbers-and-punctuation",
    "url",
    "number-pad",
    "phone-pad",
    "name-phone-pad",
    "decimal-pad",
    "twitter",
    "web-search"
  ]),
  /**
   * Determines how the return key should look.
   * @platform ios
   */
  returnKeyType: PropTypes.oneOf([
    "default",
    "go",
    "google",
    "join",
    "next",
    "route",
    "search",
    "send",
    "yahoo",
    "done",
    "emergency-call"
  ]),
  /**
   * If true, the keyboard disables the return key when there is no text and
   * automatically enables it when there is text. The default value is false.
   * @platform ios
   */
  enablesReturnKeyAutomatically: PropTypes.bool,
  /**
   * Can tell TextInput to automatically capitalize certain characters.
   *
   * - characters: all characters,
   * - words: first letter of each word
   * - sentences: first letter of each sentence (default)
   * - none: don't auto capitalize anything
   */
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  /**
   * Set the position of the cursor from where editing will begin.
   * @platorm android
   */
  textAlign: PropTypes.oneOf(["start", "center", "end"]),

  cellComponent: PropTypes.string,
  suggestions: PropTypes.array,
  autoCompleteFetchRequestDelay: PropTypes.number,
  maximumNumberOfAutoCompleteRows: PropTypes.number,
  showTextFieldDropShadowWhenAutoCompleteTableIsOpen: PropTypes.bool,
  autoCompleteTableViewHidden: PropTypes.bool,
  autoCompleteTableBorderColor: PropTypes.string,
  autoCompleteTableBorderWidth: PropTypes.number,
  autoCompleteTableBackgroundColor: PropTypes.string,
  autoCompleteTableCornerRadius: PropTypes.number,
  autoCompleteTableTopOffset: PropTypes.number,
  autoCompleteTableLeftOffset: PropTypes.number,
  autoCompleteTableSizeOffset: PropTypes.number,
  autoCompleteRowHeight: PropTypes.number,
  autoCompleteFontSize: PropTypes.number,
  autoCompleteRegularFontName: PropTypes.string,
  autoCompleteBoldFontName: PropTypes.string,
  autoCompleteTableCellTextColor: PropTypes.string,
  autoCompleteTableCellBackgroundColor: PropTypes.string,
  applyBoldEffectToAutoCompleteSuggestions: PropTypes.bool,
  reverseAutoCompleteSuggestionsBoldEffect: PropTypes.bool,
  disableAutoCompleteTableUserInteractionWhileFetching: PropTypes.bool
};

RCTAutoComplete.defaultProps = {
  showKeyboard: true,
  autoCorrect: false,
  clearTextOnFocus: true,
  showTextFieldDropShadowWhenAutoCompleteTableIsOpen: true,
  reverseAutoCompleteSuggestionsBoldEffect: false,
  autoCompleteTableViewHidden: false,
  applyBoldEffectToAutoCompleteSuggestions: false,
  enablesReturnKeyAutomatically: false,
  disableAutoCompleteTableUserInteractionWhileFetching: false,
  placeholder: "Search a name",
  clearButtonMode: "while-editing",
  returnKeyType: "go",
  textAlign: "center",
  autoCompleteTableTopOffset: 10,
  autoCompleteTableLeftOffset: 20,
  autoCompleteTableSizeOffset: 40,
  autoCompleteTableBorderColor: "lightblue",
  autoCompleteTableBackgroundColor: "azure",
  autoCompleteTableCornerRadius: 8,
  autoCompleteTableBorderWidth: 1,
  autoCompleteFontSize: 18,
  autoCompleteRegularFontName: "Helvetica Neue",
  autoCompleteBoldFontName: "Helvetica Bold",
  autoCompleteTableCellTextColor: "dimgray",
  autoCompleteRowHeight: 40,
  autoCompleteFetchRequestDelay: 100,
  maximumNumberOfAutoCompleteRows: 6
};

module.exports = RCTAutoComplete;
