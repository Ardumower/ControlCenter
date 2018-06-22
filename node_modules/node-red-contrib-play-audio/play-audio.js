/**
 * Copyright 2015 Lorentz Lasson
 * Copyright 2015, 2016 Lorentz Lasson, Dave Conway-Jones
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    var playaudionodeid;
    function PlayAudioNode(config) {
        RED.nodes.createNode(this,config);
        this.voice = config.voice || 0;
        var node = this;
        playaudionodeid = this.id;
        this.on('input', function(msg) {
            if (Buffer.isBuffer(msg.payload)) {
                RED.comms.publish("playaudio", msg.payload);
                node.status({fill:"blue",shape:"dot",text:"playAudio.status.playing"});
            }
            else if (typeof msg.payload === "string") {
                RED.comms.publish("playtts", node.voice+"#"+msg.payload);
                node.status({fill:"blue",shape:"dot",text:"playAudio.status.speaking"});
            }
        });
    }
    RED.nodes.registerType("play audio", PlayAudioNode);
    RED.httpAdmin.get("/playaudio", RED.auth.needsPermission('playaudio.read'), function(req,res) {
        var node = RED.nodes.getNode(playaudionodeid);
        if (node != null) { node.status({}); }
        res.json("OK");
    });
}
