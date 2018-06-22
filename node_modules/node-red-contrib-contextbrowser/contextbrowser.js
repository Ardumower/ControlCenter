/**
 * Copyright 2017 Sebastian Barwe (sebastian.barwe@gmail.com)
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

module.exports = function (RED) {
  "use strict";

  function ContextBrowser(config) {
    
    if (this.context.keys === undefined) {
      RED.log.err("node-red-contrib-contextbrowser needs Node-RED 0.17+ or that you patch NR (see section Install in README.md).");
    }
    else
      RED.nodes.createNode(this, config);
  }

  RED.nodes.registerType("contextbrowser", ContextBrowser);

  // prepare context object for serialization
  function copycontext(context) {
    var t = {};
    var keys =  context.keys();
    var i = keys.length;
    var k, v, j;
    while (i--) {
      k = keys[i];
      if (k[0] == '_')
        continue;
      v = context.get(k);
      if (v && {}.toString.call(v) === '[object Function]')
        continue;

      try {
        j = JSON.stringify(v);
        t[k] = JSON.parse(j);
      } catch(err) {
        t[k] = "Exception: " + err;
      }
    }
    
    return t;
  }


  RED.httpAdmin.get("/contextbrowser/node/:id", RED.auth.needsPermission("contextbrowser.node.read"), function (req, res) {
    var node = RED.nodes.getNode(req.params.id);

    if (node != null) {
      try {
        res.json(copycontext(node.context()));
      } catch (err) {
        RED.log.warn("[contextbrowser] /contextbrowser/node/:id " + err);
        res.sendStatus(500);
      }
    } else {
      res.status(404).send("Node with id not found");
    }
  });



  RED.httpAdmin.get("/contextbrowser/flow/:id", RED.auth.needsPermission("contextbrowser.flow.read"), function (req, res) {
    var node = null;
    RED.nodes.eachNode(function (n) {
      if (node != null) return;
      if (n.z == req.params.id && n.type != "subflow" && n.type != "comment" && n.type != "link" && n.type != "config")
        node = RED.nodes.getNode(n.id);
    });

    if (node != null) {
      try {
        res.json(copycontext(node.context().flow));
      } catch (err) {
        RED.log.warn("[contextbrowser] /contextbrowser/flow/:id " + err);
        res.sendStatus(500);

      }
    } else {
      res.status(404).send('Flow context not found. Does the flow contain a node?');
    }
  });

  RED.httpAdmin.get("/contextbrowser/global", RED.auth.needsPermission("contextbrowser.global.read"), function (req, res) {
    var node = null;
    RED.nodes.eachNode(function (n) {
      if (node != null) return;
      if (n.type != "subflow" && n.type != "comment" && n.type != "link" && n.type != "config") {

        node = RED.nodes.getNode(n.id);

        if (node != null) {
          if (!node.context().global)
            node = null;
        }
      }
    });

    if (node != null) {
      try {
        res.json(copycontext(node.context().global));
      } catch (err) {
        RED.log.warn("[contextbrowser] /contextbrowser/global " + err);
        res.sendStatus(500);
      }
    } else {
      res.status(404).send("Global context not found. Is any node available?");
    }

  });

}