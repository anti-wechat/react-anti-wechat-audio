import React from 'react';
import PropTypes from 'prop-types';

class AntiWechatAudio extends React.PureComponent {
  static defaultProps = {
    src: null,
    loop: false,
    paused: true,
    autoplay: false,
    pauseWhenHide: true
  };

  static propTypes = {
    src: PropTypes.string.isRequired,
    loop: PropTypes.bool,
    paused: PropTypes.bool,
    autoplay: PropTypes.bool,
    pauseWhenHide: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.retryTimer = null;
  }

  componentDidMount() {
    if (this.props.autoplay || !this.props.paused) {
      if (window.WeixinJSBridge) {
        this._playAudio(true);
      } else {
        document.addEventListener('WeixinJSBridgeReady', this._play, false);
      }
    }

    document.addEventListener('visibilitychange', this._visChange, false);
  }

  componentWillUnmount() {
    document.removeEventListener('WeixinJSBridgeReady', this._play, true);
    document.removeEventListener('visibilitychange', this._visChange, false);
    this._clearRetryTimer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this._pause();
      } else {
        this._play();
      }
    }
  }

  _visChange = () => {
    if (document.hidden) {
      if (this.props.pauseWhenHide) {
        this._pause();
      }
    } else {
      this._playAudio(true);
    }
  };

  _clearRetryTimer = () => {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  };

  _playAudio = force => {
    if (!this.audioRef.paused) {
      return;
    }
    if (force) {
      window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
        this._play();
        this._clearRetryTimer();
        this.retryTimer = setTimeout(() => {
          if (this.audioRef.paused) {
            window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
              this._play();
            });
          }
        }, 300);
      });
    } else {
      this._play();
    }
  };

  _pause = () => {
    this.audioRef.pause();
  };

  _play = () => {
    this.audioRef.play();
  };

  render() {
    return (
      <audio
        ref={this.audioRef}
        src={this.props.src}
        loop={this.props.loop}
        className={this.props.className}
        style={this.props.style}
      />
    );
  }
}

export default AntiWechatAudio;
