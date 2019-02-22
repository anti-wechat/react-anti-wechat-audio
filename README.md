# react-anti-wechat-audio

## Why


## Install
```
npm i -S react-anti-wechat-audio
```

## Usage
```js
import React from 'react';
import AntiWechatAudio from 'react-anti-wechat-audio';

class App extends React.Component {
  state = {
    paused: true
  }

  render() {
    return (
      <div>
        <AntiWechatAudio 
          src="./path/to/audio.mp3"
          paused={this.state.paused}
          loop
          autoplay
          pauseWhenHide
        />
      </div>
    )
  }
}
```
