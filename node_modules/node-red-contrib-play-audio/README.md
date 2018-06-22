node-red-contrib-play-audio
===========================

<a href="http://nodered.org" target="_new">Node-RED</a> node to play audio from a raw audio buffer.

Works well together with the [Watson Text to Speech node](http://flows.nodered.org/node/node-red-node-watson),
using the WAV audio format.

It can also perform Text to Speech on strings if your browser has that capability.

## Requirements
Browser support for Web Audio API.

## Install

#### Local

Run the following command in your Node-RED user directory - typically `~/.node-red`

        npm install node-red-contrib-play-audio

#### Bluemix

The easiest method to install on Bluemix is to fork the starter code
<a href="https://github.com/node-red/node-red-bluemix-starter" target="_new">here</a>
and insert "node-red-contrib-play-audio" as a dependency in `package.json`


## Sample flow
http://flows.nodered.org/flow/2b6b1fa3ca62f36854ce
