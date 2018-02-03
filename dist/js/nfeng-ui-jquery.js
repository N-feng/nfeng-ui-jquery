/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "9eb513c479d14b8f2ca1"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	ievs: (function getInternetExplorerVersion() {
		var rv = null, ua, re;
		if (navigator.appName === 'Microsoft Internet Explorer') {
			ua = navigator.userAgent;
			re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null)
				rv = parseFloat(RegExp.$1);
		} else if (navigator.appName === 'Netscape') {
			ua = navigator.userAgent;
			re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null)
				rv = parseFloat(RegExp.$1);
		}
		return parseInt(rv);
	})(),
	animateEnd	  : 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	transitionEnd : 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
	animateEndShim: function (el, fn, animateDisable) {
		if (this.ievs < 10 || animateDisable) {
			fn();
		} else {
			el.on(this.animateEnd, fn);
		}
	},
	transitionEndShim: function (el, fn, animateDisable) {
		if (this.ievs < 10 || animateDisable) {
			fn();
		} else {
			el.on(this.transitionEnd, fn);
		}
	},
	throttle: function (func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function () {
			previous = options.leading === false ? 0 : new Date().getTime();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;;
		};
		return function () {
			var now = new Date().getTime();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		}
	}
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
    // 日期显示格式
    format: function(date, fmt) {
        fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
        if (typeof date === 'string') {
            date = new Date(date.replace(/-/g, '/'))
        }
        if (typeof date === 'number') {
            date = new Date(date)
        }
        var o = {
            'M+': date.getMonth() + 1,
            'D+': date.getDate(),
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        var week = {
            '0': '\u65e5',
            '1': '\u4e00',
            '2': '\u4e8c',
            '3': '\u4e09',
            '4': '\u56db',
            '5': '\u4e94',
            '6': '\u516d'
        }
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt;
    },
    // 是否相同的
    isEqual: function(src, desc) {
        return (
            src.getFullYear() === desc.getFullYear() &&
            src.getMonth() === desc.getMonth() &&
            src.getDate() === desc.getDate()
        );
    },
    getFirstDayOfMonth: function(month, year) {
        return new Date(year, month, 1)
    },
    getLastDayOfMonth: function(month, year) {
        return new Date(year, month + 1, 0)
    },
    calcAllDate: function(month, year) {
        let firstDate = this.getFirstDayOfMonth(month, year)
        let lastDate = this.getLastDayOfMonth(month, year).getDate()
        let dayOfFirstDate = firstDate.getDay()
        let afterPadNum = 42 - dayOfFirstDate - lastDate
        let dateArr = []
        for (let i = 0; i < dayOfFirstDate; i++) {
            dateArr[dayOfFirstDate - i - 1] = new Date(year, month, -i)
        }
        for (let i = 0; i < lastDate; i++) {
            dateArr.push(new Date(year, month, i + 1))
        }
        for (let i = 0; i < afterPadNum; i++) {
            dateArr.push(new Date(year, month + 1, i + 1))
        }
        return dateArr
    },
    getRangeYear: function(date) {
        let currentYear = date.getFullYear()
        let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
        let startYear = currentYear - digitOfCurrentYear;
        return [startYear, startYear + 11]
    },
    getRangeDecade: function(date) {
        let currentDecade = date.getFullYear()
        let digitOfCurrentDecade = Number(currentDecade.toString().substr(-2));
        let startDecade = currentDecade - digitOfCurrentDecade;
        return [startDecade, startDecade + 119]
    },
    iso8601Week: function(date) {
        let time, checkDate = new Date(date);

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

        time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },
    // 知道年份、周数，星期   求日期
    dateFromWeek: function(date) {
        let parts = date.match(/\d+/g);
        let year = parts[0];
        let week = parts[1];
        let day = parts[2] == 0 ? 7 : parts[2];
        let years = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let leapYears = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        let correct = new Date(new Date(new Date(year).setMonth(0)).setDate(4)).getDay() + 3;
        let totalDays = week * 7 + day * 1 - correct;
        let days = [];
        let diff = 0;
        let month = -1;
        let _date = -1;

        //判断是否为闰年，针对2月的天数进行计算
        if (Math.round(year / 4) == year / 4) {
            days = leapYears;
        } else {
            days = years;
        }

        for (let i = 1; i < days.length; i++) {
        	if (check(totalDays, days[i - 1], days[i])) {
        		month = i - 1;
        		_date = totalDays - days[month];
        	}
        }

        //参数str判断的字符串 m最小值 n最大值
        function check(str, m, n) {
            if (str>m&&str<=n) {
            	return true;
            } else {
            	return false;
            }
        }

        if (month === -1) {	
        	_date = totalDays - days[11];
        	return new Date(year+'-'+month+'-'+_date);
        } else {
        	return new Date(year+'-'+month+'-'+_date);
        }

    },
    convert: function(d) {
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function(a, b) {
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

let Utils = {
	// 获取tableFixed thead
	getTableFixedThead: function ($tableHeader, thIndex) {
		let html = '<thead><tr>';
		$.each($tableHeader.find('th').slice(0, thIndex + 1), function (index, item) {
			html += '<th class="sorting">'+
						$(item).html()+
						'<div class="unlock uk-icon-unlock">'+
						'</div>'+
					'</th>';
		});
		html += '</tr></thead>';
		return html;
	},
	// 获取tableFixed tbody
	getTableFixedTBody: function ($tableBody, thIndex) {
		let html = '<tbody>';
		$.each($tableBody.find('tr'), function (index, item) {
			html += '<tr class="'+$(item).attr('class')+'">';
			$.each($(item).find('td').slice(0, thIndex + 1), function (key, value) {
				if ($(value).html() === '') {
					html += '<td>&nbsp;</td>';
				} else {
					html += '<td>'+$(value).html()+'</td>';
				}
			});
			html += '</tr>';
		});
		html += '</tbody>';
		return html;
	},
	// 获取tableFixed colgroup
	getTableHeaderColgroup: function ($tableHeader, thIndex) {
		let html = '<colgroup>';
		for (let i = 0; i < thIndex + 1; i++) {
			html += '<col style="width: '+ $tableHeader.find('th').eq(i).outerWidth() +'px;">';
		}
		html += '</colgroup>';
		return html;
	},
	// 获取tableFixed width
	getTableFixedWidth: function ($tableHeader, thIndex) {
		let width = 0;
		for (let i = 0; i < thIndex + 1; i++) {
			width += $tableHeader.find('th').eq(i).outerWidth();
		}
		return width;
	},
	/**
	 * 数字格式转换成千分位
	 *@param{Object}num
	 */
	commafy: function (num){
		if ((num+"").trim() == "") {
	    return "";
	  }
	  if (isNaN(num)){
	    return "";
	  }
		num = num + "";
    var re = /(-?\d+)(\d{3})/;
    while (re.test(num)){
      num = num.replace(re,"$1,$2")
    }
	  return num;
	},
	/**
	 * 去除千分位
	 *@param{Object}num
	 */
	delcommafy: function (num){
	  return num.replace(/,/gi,'');
	},
	// desc降序
	order: function (arr, key, desc) {
		var orderfn;
    if (arr.length < 2) {
      return;
    }
    if (isNaN(arr[0][key])) {
      //字符串类型
      orderfn = this.orderString;
    } else {
      //数字类型
      orderfn = this.orderNumber;
    }
    arr.sort(function (a, b) {
      var _a = a[key], _b = b[key];
      if (desc) {
        _a = b[key];
        _b = a[key];
      }
      return orderfn(_a, _b);
    });
    return arr;
	},
	//数字排序
  orderNumber: function (a, b) {
    return a - b;
  },
	//字符串排序
  orderString: function (a, b) {
    var titleA = a.toLowerCase(), titleB = b.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  }
}

module.exports = Utils

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);

var NUI = {};

// 注入到jQuery原型对象
$.each([
	__webpack_require__(5),
	__webpack_require__(10),
	__webpack_require__(15),
	__webpack_require__(19),
	__webpack_require__(23),
	__webpack_require__(27),
	__webpack_require__(33)
], function (index, component) {
	if (typeof component === 'object' && !NUI[component]) {
		$.extend(NUI, component);
	}
});

// 注入到jQuery全局对象
$.each([
	__webpack_require__(37),
	__webpack_require__(38),
	__webpack_require__(39),
], function (index, component) {
	$.extend(component);
});

// 调用插件
$.fn.NUI = function () {
	var arg = arguments;
	var component = NUI[arguments[0]];
	if (component) {
		arg = Array.prototype.slice.call(arg, 1);
		return component.apply(this, arg);
	} else {
		$.error('Method ' + arguments[0] + ' does not exist on jQuery.NUI Plugin');
		return this;
	}
};

__webpack_require__(40);
__webpack_require__(41);
__webpack_require__(42);

__webpack_require__(43);
__webpack_require__(44);

__webpack_require__(45);
__webpack_require__(46);
__webpack_require__(47);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(50);
__webpack_require__(51);
__webpack_require__(52);
__webpack_require__(53);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

let commonUtils = __webpack_require__(0);
let Utils = __webpack_require__(1);
let Store = __webpack_require__(6);
let Render = __webpack_require__(7);
let View = __webpack_require__(8);
let Event = __webpack_require__(9);

// event name space
let ENP = {
	click : 		'click.datepick',
	focus : 		'focus.datepick',
	mouseover:  'mouseover.datepick',
	mouseleave: 'mouseleave.datepick'
}

function datepick(options, selector) {
	let defaults = {
        container         : 'body',
		initDate      	  : new Date(),
		currentView   	  : 'date',
		currentToday      : true,
		type          	  : $(selector).data('type') || 'month',    //  week,  month,  year
		minDate		  	  : '1990-00-00',
		maxDate		  	  : '2019-10-10',
		format		  	  : 'YYYY-MM-DD hh:mm:ss',
		locales		  	  : {
			weekName   	  : ['日', '一', '二', '三', '四', '五', '六'],
			monthName 	  : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
		},
		hideClass     	  : 'datepick-hidden',
		animateEnterClass : 'slideDown-enter-active',
		animateLeaveClass : 'slideDown-leave-active',
		range : $(selector).data('range') || false,
		selectMonth: function () {},
		weeks: function () {}
	}
	let _this = this;
	_this.$el = $(selector);
	_this.config = $.extend({}, defaults, options);

	// _this.value = new Date(_this.$el[0].value).toString() === 'Invalid Date' ? _this.config.initDate : new Date(_this.$el[0].value);
	_this.currentView = _this.config.currentView;
	Store.call(_this, _this.config.initDate);
	Render.call(_this, _this.config);

	_this.init();
}

datepick.prototype = Object.create(Store.prototype);

$.extend(datepick.prototype, Render.prototype);

$.extend(datepick.prototype, View);

datepick.prototype.constructor = datepick;

datepick.prototype.init = function () {
	let _this = this;

	_this.bindEvent();
	_this.bindEventHeader();
	_this.bindEventBody();
}

datepick.prototype.bindEvent = function () {
	let _this = this;
	let $context = _this.$container;
	let config = _this.config;

	_this.$container.on(ENP.click, function (event) {
		event.stopPropagation();
	});

	_this.$el.on(ENP.click, function (event) {
		if ($context.hasClass(config.hideClass) && $(event.target)[0] === _this.$el[0]) {
			_this._d = new Date(this.value).toString() === 'Invalid Date' ? _this.config.initDate : new Date(this.value);
			let mode = {
				date   : 'updateDateView',
				month  : 'updateMonthView',
				year   : 'updateYearView'
			}
			Event[mode[config.type]].call(_this, this.value, event);
			_this.show();
		}
	});

	// 鼠标放到表单的时候icon交互
	_this.$el.on(ENP.mouseover, function () {
		if($(this).val()) {
			$(this).addClass('active');
			_this.$clear.removeClass('hide');
		}
	});

	_this.$el.on(ENP.mouseleave, function () {
		$(this).removeClass('active');
	});

	_this.$clear.on(ENP.mouseover, function () {
		_this.$el.addClass('active');
	});

	_this.$clear.on(ENP.mouseleave, function () {
		_this.$el.removeClass('active');
	});

	_this.$clear.on(ENP.click, function () {
		_this.$el.val('');
		_this.$el.attr('data-value', '');
		_this.value = '';
		_this.$clear.addClass('hide');
	});

	commonUtils.animateEndShim($context, function () {
		if ($context.hasClass('slideDown-leave-active')) {
			$context.removeClass('slideDown-leave-active').addClass('datepick-hidden');
		}
	});
}

datepick.prototype.bindEventHeader = function () {
  let _this = this;
  let $context = _this.$container;

	$context.on(ENP.click, '.btn-next-month', function (event) {
    event.preventDefault();
    Event.updateDateView.call(_this, _this._nM, event);
  });

  $context.on(ENP.click, '.btn-prev-month', function (event) {
    event.preventDefault();
    Event.updateDateView.call(_this, _this._pM, event);
  });

	$context.on(ENP.click, '.btn-next-year', function(event) {
		event.preventDefault();
		let currentView = _this.currentView;
		if (currentView === 'year') {
			let rangeYear = Utils.getRangeYear(_this._d)
			let nextTenYear = new Date(new Date().setFullYear(rangeYear[0] + 10))
			Event.updateYearView.call(_this, nextTenYear, event)
		} else {
			Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._nY, event)
		}
	});

	$context.on(ENP.click, '.btn-prev-year', function (event) {
		event.preventDefault();
		let currentView = _this.currentView;
		if (currentView === 'year') {
			let rangeYear = Utils.getRangeYear(_this._d)
			let prevTenYear = new Date(new Date().setFullYear(rangeYear[0] - 10))
			Event.updateYearView.call(_this, prevTenYear, event)
		} else {
			Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._pY, event);
		}
	});

	$context.on(ENP.click, '.btn-next-decade', function(event) {
		event.preventDefault();
		let currentView = _this.currentView;
		let rangeYear = Utils.getRangeYear(_this._d);
		let nextHundredYear = new Date(new Date().setFullYear(rangeYear[0] + 100));
		Event.updateDecadeView.call(_this, nextHundredYear, event);
	});

	$context.on(ENP.click, '.btn-prev-decade', function (event) {
		event.preventDefault();
		let currentView = _this.currentView;
		let rangeYear = Utils.getRangeYear(_this._d);
		let prevHundredYear = new Date(new Date().setFullYear(rangeYear[0] - 100));
		Event.updateDecadeView.call(_this, prevHundredYear, event);
	});

	$context.on(ENP.click, '.btn-call-month', function (event) {
    event.preventDefault();
    Event.updateMonthView.call(_this, _this._d, event);
  });

  $context.on(ENP.click, '.btn-call-year', function (event) {
    event.preventDefault();
    Event.updateYearView.call(_this, _this._d, event);
  });

  $context.on(ENP.click, '.btn-call-decade', function (event) {
    event.preventDefault();
    Event.updateDecadeView.call(_this, _this._d, event);
  });
}

datepick.prototype.bindEventBody = function () {
  let _this = this;
  let $context = _this.$container;

	$context.on(ENP.click, '.datepick-date td:not(.disabled) a', $.proxy(Event.selectDay, _this));
	$context.on(ENP.click, '.datepick-month td:not(.disabled) a', $.proxy(Event.selectMonth, _this));
	$context.on(ENP.click, '.datepick-year td:not(.disabled) a', $.proxy(Event.selectYear, _this));
	$context.on(ENP.click, '.datepick-decade td:not(.disabled) a', $.proxy(Event.selectDecade, _this));
}

$('body').on(ENP.click, function (event) {
	let $target = $(event.target);
	if ($target.data().datepick) {
		$target.data().datepick.$container.siblings('.datepick-container').removeClass('slideDown-enter-active').addClass('datepick-hidden');
	} else {
		$.each($('.datepick-container'), function (index, item) {
			if (!$(item).hasClass('datepick-hidden')) {
				$(item).removeClass('slideDown-enter-active').addClass('slideDown-leave-active');
			}
		});
	}
});

module.exports = {
	datepick: function (options) {
		return this.each(function (index, el) {
			$(el).data('datepick', new datepick(options, el));
		});
	}
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function Store(date) {
	let _this = this;
	_this.defaults = {
		// 今天
    _d  : new Date(date || new Date()),
    // 明天
    _nd : _this.modifyDate(_this._d, 1),
    // 下个月
    _nM : _this.modifyMonth(_this._nd, 1),
    // 明年
    _nY : _this.modifyYear(_this._nd, 1),
    // 昨天
    _pd : _this.modifyDate(_this._d, -1),
    // 上个月
    _pM : _this.modifyMonth(_this._pd, -1),
    // 上一年
    _pY : _this.modifyYear(_this._pd, -1)
	}
	_this.update(date)
}

Store.prototype.update = function (date) {
	let _this = this
	_this._d = new Date(date);
	_this._nd = _this.modifyDate(_this._d, 1);
	_this._nM = _this.modifyMonth(_this._nd, 1);
	_this._nY = _this.modifyYear(_this._nd, 1);
	_this._pd = _this.modifyDate(_this._d, -1);
	_this._pM = _this.modifyMonth(_this._pd, -1);
	_this._pY = _this.modifyYear(_this._d, -1);
}

Store.prototype.modifyDate = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setDate(initDate.getDate() + num))
}

Store.prototype.modifyMonth = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setMonth(initDate.getMonth() + num))
}

Store.prototype.modifyYear = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setFullYear(initDate.getFullYear() + num))
}

module.exports = Store

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(1)

function Render(config) {
	this.config = config;
	this.$container = $('<div class="datepick-container datepick-hidden"></div>');
	this.$left = $('<div class="datapick-left"></div>');
	this.renderInit();
}

Render.prototype.renderInit = function () {
	this.renderIcon();
	this.initHeader();
	this.initDate();
	this.initMonth();
  	this.initYear();
  	this.initDecade();
	$(this.config.container).append(this.$container);
}

Render.prototype.renderIcon = function () {
	let _this = this;
	let $el = _this.$el;

	$el.after('<span class="datepick-icon"></span>');
	$el.after('<i class="anticon anticon-cross-circle datepick-clear"></i>');
	_this.$clear = $el.siblings('.datepick-clear').addClass('hide');
}

Render.prototype.initHeader = function () {
	this.$headerView = $('<div class="datepick-header"/>');
	this.$container.append(this.$headerView);
	this.renderHeader();
}

Render.prototype.renderHeader = function () {
	let currentView = this.currentView;
	let getRangeYear = Utils.getRangeYear(this._d);
	let getRangeDecade = Utils.getRangeDecade(this._d);
	let strCenter = {
		date   : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>&nbsp;&nbsp;<a href="javascript:;" class="btn-call-month">'+(this._d.getMonth() + 1)+' 月</a>',
		month  : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>',
		year   : '<a href="javascript:;" class="btn-call-decade">'+getRangeYear[0]+'年 ~ '+(getRangeYear[1]-2)+'年</a>',
		decade : getRangeDecade[0]+'年 ~ '+(getRangeDecade[1]-20)+'年',
		week   : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>&nbsp;&nbsp;<a href="javascript:;" class="btn-call-month">'+(this._d.getMonth() + 1)+' 月</a>'
	}
	let yearControl = currentView === 'decade' ? 
		'<a href="javascript:;" class="btn-prev-decade"></a><a href="javascript:;" class="btn-next-decade"></a>' : 
		'<a href="javascript:;" class="btn-prev-year"></a><a href="javascript:;" class="btn-next-year"></a>';
	let monthControl = currentView === 'date' ? 
		'<a href="javascript:;" class="btn-prev-month"></a><a href="javascript:;" class="btn-next-month"></a>' : '';

	let templateHeader = yearControl + monthControl + '<div class="datepick-header-center">'+strCenter[currentView]+'</div>';
	this.$headerView.html(templateHeader);
  	this.$prevYear = this.$container.find('.btn-prev-year');
  	this.$nextYear = this.$container.find('.btn-next-year');
  	this.$prevMonth = this.$container.find('.btn-prev-month');
  	this.$nextMonth = this.$container.find('.btn-next-month');
}

Render.prototype.initDate = function () {
	this.$dateView = $('<table class="datepick-date"/>');
	this.$container.append(this.$dateView);
	this.renderDate(this.config.initDate);
}

Render.prototype.renderDate = function (date) {
	let _this = this;
	let _date = new Date(date);
	let month = _date.getMonth();
	let year = _date.getFullYear();
	let dates = Utils.calcAllDate(month, year);
	let str = '';
	let minDate = new Date(_this.config.minDate);
	let maxDate = new Date(_this.config.maxDate);

	// 星期渲染
	str += '<tr>'
	$.each(this.config.locales.weekName, function (index, value) {
    str += '<td data-id="' + index + '">' + value + '</td>'
  })
  str += '</tr>'

	$.each(dates, function (index, dateItem) {
		let isCurrentDate = Utils.isEqual(new Date(), dateItem) ? ' current-date' : '';
		let currentDate = Utils.format(dateItem, _this.config.format);
		let disabledDate = Utils.compare(dateItem, minDate) === -1 || Utils.compare(dateItem, maxDate) === 1 ? ' disabled' : '';
		let whichMonth = dateItem.getMonth() > month ? 'next-month' : dateItem.getMonth() < month ? 'prev-month' : 'current-month';
		let checked = Utils.isEqual(new Date(_this.value), dateItem) ? ' checked' : '';
		if (index % 7 === 0) {
			str += '<tr>'
		}
		str += '<td class="'+whichMonth+isCurrentDate+disabledDate+checked+'" title="'+currentDate+'"><a href="javascript:;">'+dateItem.getDate()+'</a></td>';
		if (index % 7 === 6) {
			str += '</tr>'
		}
	})

	this.$dateView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initMonth = function () {
	this.$monthView = $('<table class="datepick-month datepick-hidden"/>');
	this.$container.append(this.$monthView)
	this.renderMonth()
}

Render.prototype.renderMonth = function (date) {
	let _this = this;
	let str = '';
	let _date = new Date(date) || _this._d;
	let monthName = _this.config.locales.monthName;
	let minDate = new Date(_this.config.minDate);
	let maxDate = new Date(_this.config.maxDate);
	let value = new Date(_this.value);

	for (let i = 0; i < 12; i ++) {
		let thisDate = new Date(_date.setMonth(i));
		let currentDate = Utils.format(thisDate, _this.config.format);
		let disabledDate = Utils.compare(thisDate, minDate) === -1 || Utils.compare(thisDate, maxDate) === 1 ? 'disabled' : '';
		let isCurrentMonth = _this.config.currentToday && new Date().getMonth() === _date.getMonth() && new Date().getFullYear() === _date.getFullYear() ? ' current-month' : '';
		let checked = new Date(value).getMonth() === i && new Date(value).getFullYear() === _date.getFullYear() ? 'checked' : '';
		if (i % 3 === 0) {
			str += '<tr>'
		}
		str += '<td class="'+disabledDate+checked+isCurrentMonth+'" title="'+currentDate+'"><a href="javascript:;">'+monthName[i]+'</a></td>'
		if (i % 3 === 2) {
			str += '</tr>'
		}
	}

	this.$monthView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initYear = function () {
  this.$yearView = $('<table class="datepick-year datepick-hidden"/>');
  this.$container.append(this.$yearView)
  this.renderYear()
}

Render.prototype.renderYear = function (date) {
  let _this = this;
  let str = '';
  let _date = new Date(date) || _this._d;
  let currentYear = _date.getFullYear()
  let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
  let startYear = currentYear - digitOfCurrentYear;
  let value = new Date(_this.value);

  for (let i = 0; i < 12; i++) {
    let year = startYear + i - 1;
    let isCurrentYear = _this.config.currentToday && new Date().getFullYear() === year ? ' current-year' : '';
    let currentYear = Utils.format(new Date(new Date().setFullYear(year)), _this.config.format);
    let checked = new Date(value).getFullYear() === year ? ' checked' : '';
    let lastyear = i === 0 || i === 11 ? ' last-year' : '';
    if (i % 3 === 0) {
      str += '<tr>'
    }
    str += '<td class="'+isCurrentYear+checked+lastyear+'" title="'+currentYear+'"><a href="javascript:;">'+year+'</a></td>'
    if (i % 3 === 2) {
      str += '</tr>'
    }
  }
  this.$yearView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initDecade = function () {
  this.$decadeView = $('<table class="datepick-decade datepick-hidden"/>');
  this.$container.append(this.$decadeView)
  this.renderDecade()
}

Render.prototype.renderDecade = function (date) {
  let _this = this;
  let str = '';
  let _date = new Date(date) || _this._d;
  let currentYear = _date.getFullYear();
  let digitOfCurrentYear = Number(currentYear.toString().substr(-2));
  let startYear = currentYear - digitOfCurrentYear;

  for (let i = 0; i < 12; i++) {
  	// 每个开始年份
    let decade = startYear + i * 10 - 10;
    let currentYear = Utils.format(new Date(new Date().setFullYear(decade + 1)), _this.config.format);
    let diff = new Date(_date).getFullYear() - decade;
    let checked = diff >= 0 && diff <= 9 ? ' checked' : '';
    let isCurrentDecade = _this.config.currentToday && new Date().getFullYear() - decade >= 0 && new Date().getFullYear() - decade <= 9 ? ' current-decade' : '';
    let decadeName = decade+'-'+(decade+9);
    let lastdecade = i === 0 || i === 11 ? ' last-decade' : '';
    if (i % 3 === 0) {
      str += '<tr>'
    }
    str += '<td class="'+isCurrentDecade+checked+lastdecade+'" title="'+currentYear+'"><a href="javascript:;">'+decadeName+'</a></td>'
    if (i % 3 === 2) {
      str += '</tr>'
    }
  }
  this.$decadeView.html('<tbody>' + str + '</tbody>');
}

module.exports = Render

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
	showMonthView: function () {
		let _this = this;
		let config = _this.config;
		_this.currentView = 'month';
		_this.$dateView.addClass(config.hideClass);
		_this.$yearView.addClass(config.hideClass);
		_this.$monthView.removeClass(config.hideClass);
    _this.$decadeView.addClass(config.hideClass);
		_this.renderHeader();
	},
	showDateView: function () {
		let _this = this;
		let config = _this.config;
    _this.currentView = 'date';
    _this.$dateView.removeClass(config.hideClass);
    _this.$yearView.addClass(config.hideClass);
    _this.$monthView.addClass(config.hideClass);
    _this.$decadeView.addClass(config.hideClass);
    _this.renderHeader();
	},
	showYearView() {
    let _this = this;
		let config = _this.config;
    _this.currentView = 'year';
    _this.$dateView.addClass(config.hideClass);
    _this.$monthView.addClass(config.hideClass);
    _this.$yearView.removeClass(config.hideClass);
    _this.$decadeView.addClass(config.hideClass);
    _this.renderHeader();
  },
	showDecadeView() {
    let _this = this;
		let config = _this.config;
    _this.currentView = 'decade';
    _this.$dateView.addClass(config.hideClass);
    _this.$monthView.addClass(config.hideClass);
    _this.$yearView.addClass(config.hideClass);
    _this.$decadeView.removeClass(config.hideClass);
    _this.renderHeader();
  },
	show: function () {
		let _this = this;
		let matrix = _this.$el[0].getBoundingClientRect();
		let _x = matrix.left;
		let _y = matrix.top + matrix.height;
		_this.$container.css({
			left : _x,
			top  : _y
		}).removeClass('datepick-hidden').addClass('slideDown-enter-active').removeClass('slideDown-leave-active');
	},
	hide: function () {
		let _this = this;
		let config = _this.config;
		_this.$container.removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
	}
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(1);
let Event = {
    updateDateView: function (date, event, $selector) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;

        _this.update(_date);
        _this.renderDate(_date, $selector);
        _this.showDateView(_date);
    },
    updateMonthView: function (date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;

        _this.update(_date);
        _this.renderMonth(_date);
        _this.showMonthView(_date);
    },
    updateYearView(date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;
        _this.update(_date);
        _this.renderYear(_date);
        _this.showYearView(_date);
    },
    updateDecadeView(date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;
        _this.update(_date);
        _this.renderDecade(_date);
        _this.showDecadeView(_date);
    },
    selectDecade: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let _date = new Date($td.attr('title'));

        _this.update(_date);
        _this.renderYear(_date);
        _this.showYearView(_date);
    },
    selectYear(event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let _date = new Date($td.attr('title'));
        _this.update(_date);
        _this.renderMonth(_date);
        if (_this.config.type === 'year') {
            Event.checked.call(_this, event, config.format.substring(0, 4));
            _this.hide();
        } else {
            _this.showMonthView(_date);
        }
    },
    selectMonth: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let date = new Date($td.attr('title'));

        _this.update(date);
        _this.renderDate(date);
        if (_this.config.type === 'month') {
            Event.checked.call(_this, event, config.format.substring(0, 7));
            _this.config.selectMonth();
            _this.hide();
        } else {
            _this.showDateView();
        }
    },
    selectDay: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let date = new Date($td.attr('title'));

        _this.update(date);
        _this.renderDate(date);
        if (_this.config.type === 'date') {
            Event.checked.call(_this, event, config.format.substring(0, 10));
            _this.config.weeks(Utils.iso8601Week(date));
            _this.hide();
        }
    },
    checked: function (event, fmt) {
        let _this = this;
        _this.value = $(event.target).parent('td').attr('title');
        _this.$el.val(fmt ? Utils.format(_this.value, fmt) : _this.value);
        // $(document).trigger('click.datepick')
    }
}

module.exports = Event


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

let multiUtils = __webpack_require__(11)
let Render = __webpack_require__(12)
let View = __webpack_require__(13)
let Event = __webpack_require__(14)
let Utils = __webpack_require__(0)
let isSafari = (function () {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') > -1 ? false : true;
  }
})();
let defaults = {
  searchable        : true,
  input             : '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
  data              : [],
  limitCount        : Infinity,
  hideClass         : 'hide',
  animateEnterClass : 'slideDown-enter-active',
  animateLeaveClass : 'slideDown-leave-active',
  choice            : function () {}
}
let ENP = {
  click   : 'click.multiSelect',
  focus   : 'focus.multiSelect',
  keydown : 'keydown.multiSelect',
  keyup   : 'keyup.multiSelect'
}

function multiSelect (options, selector) {
  let _this = this
  _this.$select = $(selector).wrapAll('<div class="dropdown-multiple"></div>');
  _this.$container = $(selector).parent('.dropdown-multiple');
  _this.placeholder = _this.$select.attr('placeholder');
  _this.config = $.extend({}, defaults, options);
  _this.isLabelMode = _this.config.multipleMode === 'label';
  _this.name = [];
  _this.isSingleSelect = !_this.$select.prop('multiple');
  _this.init();
}

$.extend(multiSelect.prototype, multiUtils);

$.extend(multiSelect.prototype, Render);

$.extend(multiSelect.prototype, View);

$.extend(multiSelect.prototype, Event);

multiSelect.prototype.init = function () {
  let _this = this;
  let _config = _this.config;
  let $container = _this.$container;
  _this.$select.hide();

  if (_config.data.length === 0) {
    _config.data = _this.selectToObject(_this.$select);
  }
  let processResult = _this.objectToSelect(_config.data);
  _this.name = processResult[1];
  _this.selectAmount = processResult[2];
  _this.$select.html(processResult[0]);
  _this.renderSelect();
  _this.changeStatus(_config.disabled ? 'disabled' : _config.readonly ? 'readonly' : false);
}

multiSelect.prototype.changeStatus = function (status) {
  let _this = this;
  if (status === 'readonLy') {
    _this.unbindEvent();
  } else if (status === 'disabled') {
    _this.$select.prop('disabled', true);
    _this.unbindEvent();
  } else {
    _this.$select.prop('disabled', false);
    _this.bindEvent();
  }
}

multiSelect.prototype.bindEvent = function () {
  let _this = this;
  let config = _this.config;
  let $container = _this.$container;
  let openHandle = isSafari ? ENP.click : ENP.focus;

  $container.on(ENP.click, function (event) { event.stopPropagation(); });
  $container.on(ENP.click, '.del', $.proxy(_this.del, _this));

  if(_this.isLabelMode) {} else {
    $container.on(openHandle, '.dropdown-display', $.proxy(_this.show, _this));
    $container.on(openHandle, '.dropdown-clear-all', $.proxy(_this.clearAll, _this));
  }

  $container.on(ENP.keyup, 'input', $.proxy(this.search, _this));

  $container.on(ENP.click, '[tabindex]', $.proxy(_this.isSingleSelect ? _this.singleChoose : _this.multiChoose, _this));

  $(config.container).on(ENP.click, function (event) {
    _this.hide();
  });

  Utils.animateEndShim($container.find('.dropdown-main'), function () {
    if ($container.find('.dropdown-main').hasClass(config.animateLeaveClass)) {
      $container.find('.dropdown-main')
        .removeClass(config.animateLeaveClass)
        .addClass(config.hideClass);
    }
  });

}

$(document).on(ENP.click, function (event) {
  let $target = $(event.target);
  if ($('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').find('.dropdown-main').hasClass('slideDown-enter-active')) {
    $('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').find('.dropdown-main').removeClass('slideDown-enter-active').addClass('slideDown-leave-active');
  }
});

module.exports = {
	multiSelect: function (options) {
		return this.each(function (index, el) {
			$(el).data('multiSeletct', new multiSelect(options, el));
		});
	}
}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

let multiUtils = {
  selectToDiv: function (str) {
    let result = str || '';
    result = result.replace(/<select[^>]*>/gi, '<ul>').replace('</select','</ul');
    result = result.replace(/<\/optgroup>/gi, '');
    result = result.replace(/<optgroup[^>]*>/gi, function(matcher) {
      let groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher);
      let groupId = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(matcher);
      return '<li class="dropdown-group" data-group-id="'+groupId[1] || ''+'">'+groupName[1] || ''+'</li>';
    });
    result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
      let value = /value="?([\w\u4E00-\u9FA5\uF900-\uFA2D]+)"?/.exec(matcher);
      let name = />(.*)<\//.exec(matcher);
      let isSelected = matcher.indexOf('selected') > -1 ? true : false;
      let isDisabled = matcher.indexOf('disabled') > -1 ? true : false;
      // return `<li ${isDisabled ? ' disabled' : ' tabindex="0"'} data-value="${value[1] || ''}" class="dropdown-option ${isSelected ? 'dropdown-chose' : ''}">${name[1] || ''}</li>`;
      return '<li '+(isDisabled ? " disabled" : " tabindex='0'")+' data-value="'+value[1]+'" class="dropdown-option'+(isSelected ? " dropdown-chose" : "")+'">'+name[1]+'</li>'
    });
    return result;
  },
  createTemplate: function () {
    let isLabelMode = this.isLabelMode;
    let searchable = this.config.searchable;
    let templateSearch = searchable ? `<span class="dropdown-search">${this.config.input}</span>` : '';
    return isLabelMode ?
      `<div class="dropdown-display-label">
        <div class="dropdown-chose-list">${templateSearch}</div>
      </div>
      <div class="dropdown-main ${this.config.hideClass}">{{ul}}</div>` :
      `<a href="javascript:;" class="dropdown-display">
        <span class="dropdown-chose-list"></span>
        <a href="javascript:;" class="dropdown-clear-all">\xD7</a>
      </a>
      <div class="dropdown-main ${this.config.hideClass}">${templateSearch}{{ul}}</div>`;
  },
  selectToObject: function (el) {
    let $select = el;
    let result = [];
    function readOption(key, el) {
      let $option = $(el);
      this.id = $option.prop('value');
      this.name = $option.text();
      this.disabled = $option.prop('disabled');
      this.selected = $option.prop('selected');
    }
    $.each($select.children(), function (key, el) {
      let tmp = {};
      let tmpGroup = {};
      let $el = $(el);
      if (el.nodeName === 'OPTGROUP') {
        tmpGroup.groupId = $el.data('groupId');
        tmpGroup.groupName = $el.attr('label');
        $.each($el.children(), $.proxy(readOption, tmp));
        $.extend(tmp, tmpGroup);
      } else {
        $.each($el, $.proxy(readOption, tmp));
      }
      result.push(tmp);
    });
    return result;
  },
  objectToSelect: function (data) {
    let map = {};
    let result = '';
    let name = [];
    let selectAmount = 0;
    if (!data || !data.length) {
      return false;
    }
    $.each(data, function (index, val) {
      let hasGroup = val.groupId;
      let isDisabled = val.disabled  ? ' disabled' : '';
      let isSelected = val.selected && !isDisabled ? ' selected' : '';
      let temp = `<option${isDisabled}${isSelected} value="${val.id}">${val.name}</option>`;
      if (isSelected) {
        name.push(`<span class="dropdown-selected">${val.name}<i class="del" data-id="${val.id}"></i></span>`);
        selectAmount++;
      }
      if (hasGroup) {
        if (map[val.groupId]) {
          map[val.grounpId] += temp;
        } else {
          map[val.groupId] = val.groupName + '&janking&' + temp;
        }
      } else {
        map[index] = temp;
      }
    });
    $.each(map, function (index, val) {
      let option = val.split('&janking&');
      if (option.length === 2) {
        let groupName = option[0];
        let items = option[1];
        result += `<optgroup label="${groupName}" data-group-id="${index}">${items}</optgroup>`;
      } else {
        result += val;
      }
    });
    return [result, name, selectAmount];
  },
  maxItemAlert: function () {
    let _dropdown = this;
    let _config = _dropdown.config;
    let $el = _dropdown.$el;
    let $alert = $el.find('.dropdown-maxItem-alert');
    clearTimeout(_dropdown.maxItemAlertTimer);

    if ($alert.length === 0) {
      $alert = $(`<div class="dropdown-maxItem-alert">最多可选择${_config.limitCount}个</div>`);
    }

    $el.append($alert);
    _dropdown.maxItemAlertTimer = setTimeout(function () {
      $el.find('.dropdown-maxItem-alert').remove();
    }, 1000);
  }
}

module.exports = multiUtils

/***/ }),
/* 12 */
/***/ (function(module, exports) {

let Render = {
  renderSelect: function () {
    let _this = this;
    let $container = _this.$container;
    let $select = _this.$select;
    let template = _this.createTemplate.call(_this).replace('{{ul}}', _this.selectToDiv($select.prop('outerHTML')));
    
    $container.append(template).find('ul').removeAttr('style class');
  
    _this.$choseList = $container.find('.dropdown-chose-list');
  
    if (!_this.isLabelMode) {
      _this.$choseList.html($('<span class="placeholder"></span>').text(_this.placeholder));
    }
  
    _this.$choseList.prepend(_this.name.join(''));
  
  }
}

module.exports = Render

/***/ }),
/* 13 */
/***/ (function(module, exports) {

let action = {
  del: function (event) {
    let _dropdown = this;
    let $target = $(event.target);
    let id = $target.data('id');
    $.each(_dropdown.name, function (key, value) {
      if (value.indexOf('data-id="' + id + '"') !== -1) {
        _dropdown.name.splice(key, 1);
        return false;
      }
    });

    $.each(_dropdown.config.data, function (key, item) {
      if (item.id === id) {
        item.selected = false;
        return false;
      }
    });

    _dropdown.selectedAmount--;
    _dropdown.$container.find('[data-value="' + id + '"]').removeClass('dropdown-chose');
    _dropdown.$container.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected');
    $target.closest('.dropdown-selected').remove();

    return false;
  },
  show: function () {
    let _this = this;
    let config = _this.config;
    let $container = _this.$container;
    $container.find('.dropdown-main').removeClass(config.hideClass+' '+config.animateLeaveClass).addClass(config.animateEnterClass);
  },
  hide: function () {
    let _this = this;
    let config = _this.config;
    let $container = _this.$container;
    $container.find('.dropdown-main').removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
  },
  clearAll: function () {
    this.$choseList.find('.del').each(function (index, el) {
      $(el).trigger('click');
    });
    this.$container.find('.dropdown-display').removeAttr('title');
    return false;
  }
}
module.exports = action

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

let utils = __webpack_require__(0)
let action = {
  singleChoose: function (event) {
    let _this = this;
    let _config = _this.config;
    let $container = _this.$container;
    let $select = _this.$select;
    let $target = $(event.target);
    let value = $target.data('value');
    let hasSelected = $target.hasClass('dropdown-chose');

    _this.name = [];

    if ($target.hasClass('dropdown-chose')) {
      return false;
    }

    $container.removeClass('active').find('li').not($target).removeClass('dropdown-chose');

    $target.toggleClass('dropdown-chose');

    $.each(_config.data, function (key, item) {
      item.selected = false;
      if ('' + item.id === '' + value) {
        item.selected = hasSelected ? 0 : 1;
        if (item.selected) {
          _this.name.push(`<span class="dropdown-selected">${item.name}</i></span>`);
        }
      }
    });

    $select.find('option[value="' + value + '"]').prop('selected', true);

    _this.name.push(`<span class="placeholder">${_this.placeholder}</span>`);

    _this.$choseList.html(_this.name.join(''));
    _this.hide();
  },
  multiChoose: function (event) {
    let _dropdown = this;
    let _config = _dropdown.config;
    let $select = _dropdown.$select;
    let $target = $(event.target);
    let value = $target.data('value');
    let hasSelected = $target.hasClass('dropdown-chose');
    let selectedName = [];

    if (hasSelected) {
      $target.removeClass('dropdown-chose');
      _dropdown.selectAmount--;
    } else {
      if (_dropdown.selectAmount < _config.limitCount) {
        $target.addClass('dropdown-chose');
        _dropdown.selectAmount++;
      } else {
        _dropdown.maxItemAlert.call(_dropdown);
        return false;
      }
    }

    _dropdown.name = [];

    $.each(_config.data, function (key, item) {
      if (('' + item.id) === ('' + value)) {
        item.selected = hasSelected ? false : true;
      }
      if (item.selected) {
        selectedName.push(item.name);
        _dropdown.name.push(`<span class="dropdown-selected">${item.name}<i class="del" data-id="${item.id}"></i></span>`);
      }
    });

    $select.find('option[value="' + value + '"]').prop('selected', hasSelected ? false : true);

    _dropdown.$choseList.find('.dropdown-selected').remove();
    _dropdown.$choseList.prepend(_dropdown.name.join(''));
    _dropdown.$container.find('.dropdown-display').attr('title', selectedName.join(','))
    _config.choice.call(_dropdown, event);

  },
  search: utils.throttle(function (event) {

    let _dropdown = this;
    let _config = _dropdown.config;
    let $container = _dropdown.$container;
    let $input = $(event.target);
    let intputValue = $input.val();
    let data = _dropdown.config.data;
    let result = [];

    if (event.keyCode > 36 && event.keyCode < 41) {
      return;
    }

    $.each(data, function (key, value) {
      if (value.name.toLowerCase().indexOf(intputValue) > -1 || ('' + value.id) === '' + intputValue) {
        result.push(value);
      }
    });

    $container.find('ul').html(_dropdown.selectToDiv(_dropdown.objectToSelect(result)[0]) || _config.searchNoData);

  }, 300)
}

module.exports = action

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

let commonUtils = __webpack_require__(0);
let Utils = __webpack_require__(16);
let View = __webpack_require__(17);
let Event = __webpack_require__(18);

let ENP = {
  click : 'click.layer'
}

function Layer (options, selector) {
  let defaults = {
    container         : 'body',
    boxType           : 'layer',
    content           : '',
    dynamic           : false,
    animateEnterClass : 'slideDown-enter-active',
    animateLeaveClass : 'slideDown-leave-active',
    hideClass         : 'hide',
    offsetWidth       : 'auto',
    offsetHeight      : 'auto',
    allHandle         : '.btn-all',
    reverHandle       : '.btn-rever',
    confirmHandle     : '.btn-confirm',
    closeHandle       : '.btn-close',
    confirmCall       : function () {}
  };
  let _this = this;
  _this.$selector = $(selector);
  _this.config = $.extend({}, defaults, options);
  _this.init();
}

$.extend(Layer.prototype, View);

Layer.prototype.init = function () {
  let _this = this;
  let config = _this.config;
  let template = Utils.createTemplate(config);
  let $selector = _this.$selector = _this.$selector.length ? _this.$selector : $(template);
  let $content = $selector.find('.' + config.boxType + '-content');
  let layerWidth = Number($selector.data('width')) || config.offsetWidth;
  let layerHeight = Number($selector.data('height')) || config.offsetHeight;

  if (!config.dynamic) {
    $selector.appendTo(config.container);
  }

  $content.css({
    width: layerWidth,
    height: layerHeight
  });
  config.width = $selector.width();
  $selector.addClass('hide');
  $selector.data('layer', _this);
  _this.bindEvent();

};

Layer.prototype.bindEvent = function () {
  let _this = this;
  let $selector = _this.$selector;
  let config = _this.config;

  $selector.on(ENP.click, function (event) { event.stopPropagation(); });

  $selector.on(ENP.click, config.allHandle, function (event) {
    Event.selectAll.call(_this, event);
  });

  $selector.on(ENP.click, config.reverHandle, function (event) {
    Event.selectRever.call(_this, event);
  });

  $selector.on(ENP.click, config.closeHandle, $.proxy(_this.hideDialog, _this));
  
  $(config.container).on(ENP.click, function (event) {
    if(_this.$selector.hasClass(config.hideClass) 
      && $(event.target)[0] === $(config.target)[0]) {
      _this.showDialog();
    } else {
      _this.hideDialog();
    }
  });

  commonUtils.animateEndShim(_this.$selector, function () {
    if (_this.$selector.hasClass(config.animateLeaveClass)) {
      _this.$selector
        .removeClass(config.animateLeaveClass)
        .addClass(config.hideClass);
    }
  });
  
};

module.exports = {
  Layer: function (options) {
    return new Layer(options, this);
  }
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

let layerUtils = {
  createTemplate: function (config) {
    let boxType = config.boxType;
    return `<div class="${boxType}-box">
      <div class="${boxType}-content">${config.content}</div>
    </div>`;
  }
}

module.exports = layerUtils


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {
  showLayer: function (cutto) {
    let _this = this;
  },
  showDialog: function () {
    let _this = this;
    let config = _this.config;
    let $target = $(config.target)[0];
    let matrix = $target.getBoundingClientRect();
    let triangleHeight = _this.$selector.find('.triangle').height();
    let _x = matrix.left - config.width + $target.offsetWidth;
    let _y = matrix.top + matrix.height + triangleHeight;
    _this.$selector.css({
      left  : _x,
      right : 'auto',
      top   : _y
    }).removeClass(config.hideClass)
    .addClass(config.animateEnterClass)
    .removeClass(config.animateLeaveClass);

    // _this.bindEvent();
  },
  hideDialog: function () {
    let _this = this;
    let config = _this.config;
    _this.$selector
        .removeClass(config.anmateEnterClass)
        .addClass(config.animateLeaveClass);
  }
}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

let Event = {
	selectAll: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $selector = _this.$selector;
		$selector.find('.checkbox label').find('input').prop('checked', true);
	},
	selectRever: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $selector = _this.$selector;
		$selector.find('.checkbox label').find('input').each(function (index, el) {
			$(el).prop('checked', !el.checked);
		});
	}
}

module.exports = Event


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(20)
let View = __webpack_require__(21)
let Event = __webpack_require__(22)
let defaults = {
	collections  	  : [],
	strategy 	 	  : Utils.GLOB_STRATEGY,
	errorClass 	 	  : '.validate-error',
	infoClass 	 	  : '.validate-info',
	successClass 	  : '.validate-success',
	animateEnterClass : 'zoomTop-enter-active'
}

let EVENT_SPACE = {
	event  : 'event.validate',
	change : 'change.validate',
	blur   : 'blur.validate'
}

function Validate (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend(true, {}, defaults, options);
	_this.cache = {};
	_this.errors = {};
	_this.init();
}

$.extend(Validate.prototype, Utils);

$.extend(Validate.prototype, View);

$.extend(Validate.prototype, Event);

Validate.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	if (config.collections.length === 0) {
		return false;
	}
	_this.add();
}

Validate.prototype.add = function (config) {
	let _this = this;
	let collections = config || _this.config.collections;

	for (let i in collections) {
		let target = _this.$selector.find('[data-required="' + collections[i].required + '"]');
		let msg = "cannot find element by data-required=\"" + collections[i].required + "\"";
		target.length ? _this.mapping(collections[i]) : _this.errorPrompt(msg);
	}

	if (config) {
		$.merge(_this.config.collections, config);
	}

	_this.bindEvent();
}

Validate.prototype.mapping = function (collection) {
	let $dom = this.$selector.find('[data-required=' + collection.required + ']');

	let $context = $dom.parents(collection.context).eq(0);
	let msg = "{context:\"" + collection.context + "\"} is invalid, it may prevent the triggering event";
	$context.length ? '' : this.errorPrompt(msg);

	if (this.cache[collection.required]) {
		return false;
	}

	$.extend(true, this.cache, (function () {
		let item = {};
		item[collection.required] = {
			matches    : {},
			self 	   : $dom,
			context    : $context,
			infoMsg    : collection.infoMsg || '',
			collection : collection
		}
		$.extend(true, item[collection.required].matches, collection.matches);
		return item;
	}()));
}

Validate.prototype.bindEvent = function () {
	let _this = this;
	let $selector = _this.$selector;
	let handleArr = _this.hander.call(_this);
	let changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file'];

	$.each(handleArr, function (index, item) {
		let $target = $selector.find(item);
		let type, requiredName;

		if ($target[0] === void 0) {
			return;
		}

		type = $target[0].type;

		requiredName = item.replace('[', '').replace(']', '').split('=')[1];

		if ($target.data(EVENT_SPACE.event)) {
			return;
		}

		if ($.inArray(type, changeHandleArr) !== -1) {
			$target.on(EVENT_SPACE.change, { self: _this }, _this.changeEmitter)
			$target.data(EVENT_SPACE.event, true);
			return;
		}

		if (!_this.cache[requiredName].collection.unblur) {
			$target.on(EVENT_SPACE.blur, $.proxy(_this.blurEmitter, _this));
		}

	});
};

Validate.prototype.verify = function(glob, eventName) {
	let $this = $(this);
	let collection = glob.cache[$this.data('required')];
	let matches = collection.matches;
	let status = false;

	$.each(matches, function(name, params) {
		let result = glob.config.strategy[name].call(collection, params);
		status = result === void(0) ? 1 : 2;
		$this.data('validataStatus', status);
		glob.message(status, collection, name);
		return status === 2 ? false : true;
	});

	$this.trigger('validate.' + eventName, collection);

	return status;
};

module.exports = {
	Validate: function (options) {
		return new Validate(options, this);
	}
}

/***/ }),
/* 20 */
/***/ (function(module, exports) {

let valiUtils = {
	GLOB_STRATEGY: {
        isNonEmpty: function(params) {
            var $target = this.self;
            var value = $target[0].value;
            if ($.trim(value).length === 0) {
                return false;
            }
        },
        minLength: function(params) {
            //大于
            if (this.self[0].value.length < params.minLength) {
                return false;
            }
        },
        maxLength: function(params) {
            //小于
            if (this.self[0].value.length < params.maxLength) {
                return false;
            }
        },
        birthdayRange: function(params) {
            //生日范围
            var val = this.self[0].value;
            var min = params.range[0];
            var max = params.range[1];
            if (val < min || val > max) {
                return false;
            }
        },
        isBirthday: function(params) {
            //是否为生日
            if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
                return false;
            }
        },
        isMobile: function(params) {
            //是否为手机号码
            if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
                return false;
            }
        },
        isEmail: function(params) {
            //是否为邮箱
            if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
                return false;
            }
        },
        between: function(params) {
            var $target = this.self;
            var length = this.self[0].value.length;
            var min = params.range[0];
            var max = params.range[1];
            if (length < min || length > max) {
                return false;
            }

        },
        //纯英文
        onlyEn: function(params) {
            if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                return false;
            }
        },
        //纯中文
        onlyZh: function(params) {
            if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                return false;
            }
        },
        //非整数
        notInt: function(params) {
            if (/^[0-9]*$/.test(this.self[0].value)) {
                return false;
            }
        },
        //数字包含小数
        onlyNum: function(params) {
            if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
                return false;
            }
        },
        //整数
        onlyInt: function(params) {
            if (!/^[0-9]*$/.test(this.self[0].value)) {
                return false;
            }
        },
        //至少选中一项 radio || checkbox
        isChecked: function(params) {
            var result = void(0);
            this.self.each(function(index, el) {
                result = el.checked;
                return result ? false : true;
            });
            return result ? void(0) : false;
        },
        //昵称
        isNickname: function(params) {
            if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                return false;
            }
        }
    }
}

module.exports = valiUtils


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	message: function (status, cache, matchesName) {
		let className, contextClass, msg, $target, $msgEl, errors = this.errors;

		switch (status) {
			case 0: 
				className = this.config.infoClass;
				msg = cache.infoMsg;
				break;
			case 1:
				className = this.config.successClass;
				msg = '';
				break;
			case 2: 
				className = this.config.errorClass;
				msg = cache.matches[matchesName].errMsg;
				break;
		}

		errors[cache.collection.required] = status === 2 ? msg : '';

		if (!this.config.errorClass) {
			return false;
		}
		contextClass = ['info', 'success', 'error'];
		$msgEl = this.config.globalMessage ? $(this.config.globalMessage) : cache.context;
		className = className.replace(/\./g, ' ').slice(1);
		$msgEl.removeClass('validate-conetext-info validate-context-success validate-context-error')
			.addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
		$target = $('<div class="validate-message ' + ('.' + className === this.config.errorClass ? className + ' zoomTop-enter' : className) + '">' + msg + '</div>');
		$msgEl.append($target);
		console.log('.' + className === this.config.errorClass)
		
		let errorClass = this.config.errorClass;
		let animateEnterClass = this.config.animateEnterClass;

		$msgEl.find(errorClass).addClass(animateEnterClass)
		setTimeout(function () {
			$msgEl.find(errorClass).removeClass('zoomTop-enter')

			setTimeout(function () {
				$msgEl.find(errorClass).addClass('zoomTop-enter')
			}, 3000)
		}, 300);
	},
    errorPrompt: function (msg) {
    	if (window.console === 0) {
    		console.warn(msg)
    	} else {
    		throw msg
    	};
    }
}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

let Event = {
    hander: function () {
    	let queue = [];
    	let collections = this.cache;
    	for (var name in collections) {
    		queue.push('[data-required=' + name + ']');
    	}
    	return queue;
    },
    changeEmitter: function (event) {
    	let _this = event.data.self;
    	_this.verify.call(this, _this, 'change');
    },
	blurEmitter: function (event) {
		let _this = this;
        let $this = $(event.target);
        let requiredName = $this.data('required');
        let delay = _this.cache[requiredName].collection.delay;
        if (delay) {
            clearTimeout($this.data('delay'));
            $this.data('delay', setTimeout(function () {
                _this.verify(_this, 'blur');
            }));
            return false;
        }

        _this.verify.call(event.target, _this, 'blur');
	}
}

module.exports = Event


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(24);
let View = __webpack_require__(25);
let Event = __webpack_require__(26);
let defaults = {
	container : 'body',
	height 	  : 'auto',
	hideClass : 'hide'
};

let EVENT_SPACE = {
	scroll : 'scroll.fixedBox'
};

function fixedBox (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);
	_this.init();
}

$.extend(fixedBox.prototype, View);

$.extend(fixedBox.prototype, Event);

fixedBox.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	let template = Utils.createTemplate.call(_this);
	let $selector = _this.$selector = _this.$selector.length ? _this.$selector : $(template);
	let $content = _this.$selector.find('.fixed-content');
	let _width = Number($selector.data('width')) || config.width;
	let _height = Number($selector.data('height')) || config.height;

	$selector.appendTo(config.container);
	$content.css({
		height : _height 
	});
	_this.top = _this.config.target.offset().top;
	$selector.addClass(config.hideClass);
	$selector.data('fixedBox', _this);
	_this.bindEvent();
};

fixedBox.prototype.bindEvent = function () {
	let _this = this;
	let config = _this.config;
	
	$(config.container).on(EVENT_SPACE.scroll, $.proxy(_this.scrollJudge, _this));
};

module.exports = {
	fixedBox: function (options) {
		return new fixedBox(options, this);
	}
}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

let fixedBoxUtils = {
	createTemplate: function () {
		return `<div class="fixed-box">
			<div class="fixed-content">${this.config.content}</div>
		</div>`;
	}
}

module.exports = fixedBoxUtils 


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = {
	show: function () {
		let _this = this;
		let config = _this.config;
		// let $target = $(config.target)[0];
		// let matrix = $target.getBoundingClientRect();
		// let _left = matrix.x;
		// let _right = $(window).width() - matrix.x - matrix.width;

		// _this.$selector.css({
		// 	left  : _left,
		// 	right : _right
		// }).removeClass(config.hideClass);
		_this.$selector.removeClass(config.hideClass);
	},
	hide: function () {
		let _this = this;
		let config = _this.config;

		_this.$selector.addClass(config.hideClass);
	}
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

let Event = {
	scrollJudge: function () {
		let _this = this;
		let config = _this.config;
		
		config.target.offset().top < 0 ? _this.show.call(_this) : _this.hide.call(_this);
	}
}

module.exports = Event


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

let commonUtils = __webpack_require__(0);
let Utils = __webpack_require__(28);
let Store = __webpack_require__(29);
let Render = __webpack_require__(30);
let View = __webpack_require__(31);
let Event = __webpack_require__(32);
let ENP = {
	resize: 'resize.scrollbar'
}
let defaults = {
	browser: {
		data: {
			index: 0,
			name: 'scrollbar'
		},
		macosx: /mac/i.test(navigator.platform),
		mobile: /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent),
		overlay: null,
		scroll: null,
		scrolls: [],
		webkit: /webkit/i.test(navigator.userAgent) && !/edge\/\d+/i.test(navigator.userAgent)
	},
	autoScrollSize: true,
	ignoreMobile: false,
	onScroll: null,
	autoScrollHeight: true
}

function scrollbar (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);
	_this.namespace = '.scrollbar_' + _this.config.browser.data.index++;
	_this.scrollx = {};
	_this.scrolly = {};

	if (!_this.config.browser.scroll) {
		_this.config.browser.overlay = Utils.isScrollOverlaysContent(_this.config.browser);
		_this.config.browser.scroll = Utils.getBrowserScrollSize(_this.config.browser);
	}

	_this.init();

	_this.$selector.data(_this.config.browser.data.name, this);
}

$.extend(scrollbar.prototype, Store);

$.extend(scrollbar.prototype, Render);

$.extend(scrollbar.prototype, View);

$.extend(scrollbar.prototype, Event);

scrollbar.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	let $selector = _this.$selector;
	let browser = config.browser;
	let offset = {x: _this.scrollx, y: _this.scrolly};
	let namespace = _this.namespace;

	if ((browser.mobile && config.ignoreMobile)
		|| (browser.overlay && config.ignoreOverlay)
		|| (browser.macosx && !browser.webkit)
		) {
		return false;
	}

	if (!_this.wrapper) {
		_this.renderWrapper();
		_this.showWrapper();
		_this.showContent();

		_this.renderScrolls();
		_this.updateScrolls();

		_this.bindEvent();
	}
		
};

scrollbar.prototype.bindEvent = function () {
	let _this = this;
	let $selector = _this.$selector;
	let namespace = _this.namespace;
	let scrolls = {x: _this.scrollx, y: _this.scrolly};

	$selector.on('scroll' + namespace, $.proxy(_this.roll, _this));
	$.each(scrolls, function (direction, scroll) {
		let scrollOffset = (direction === 'x') ? 'scrollLeft' : 'scrollTop';
		scroll.scroll.bar.on('mousedown' + namespace, function (event) {
			let eventPosition = event[(direction === 'x') ? 'pageX' : 'pageY'];
			let initOffset = $selector[scrollOffset]();
			scroll.scroll.bar.addClass('active');

			$(document).on('mousemove' + namespace, function (event) {
				event && event.preventDefault();
				let diff = parseInt((event[(direction === 'x') ? 'pageX' : 'pageY'] - eventPosition) / scroll.kx, 10);
				$selector[scrollOffset](initOffset + diff);
			});
		
			$(document).on('blur' + namespace, function () {
				$(document).add('body').off(namespace);
				scroll.scroll.bar.removeClass('active');
			});

			$(document).on('mouseup' + namespace, function () {
				$(document).add('body').off(namespace);
				scroll.scroll.bar.removeClass('active');
			});
		});
	});
};

scrollbar.prototype.updateSize = function () {
	let _this = this;
	let scrolls = {x: _this.scrollx, y: _this.scrolly};
	let config = _this.config;

	if (!_this.wrapper) {return;}
	if (config.autoScrollHeight) {
		_this.content.removeAttr('style');
		_this.showContent();
	}
	_this.updateScrolls();
	$.each(scrolls, function (direction, scroll) {
		let size = scroll.size;
		let visible = scroll.visible;
		let scrollClass = 'scroll-visible';

		scroll.isVisible = (size - visible) > 1;
		if (scroll.isVisible) {
			scroll.scroll.addClass(scrollClass);
		} else {
			scroll.scroll.removeClass(scrollClass);
		}
	});
}

scrollbar.prototype.destroy = function () {
	let _this = this;
	let $selector = _this.$selector;

	if (!_this.wrapper) {return;}

	let scrollLeft = $selector.scrollLeft();
	let scrollTop = $selector.scrollTop();
	let wrapperClass = _this.wrapper.attr('class');
	let namespace = _this.namespace;

	$selector.insertBefore(_this.wrapper)
		.removeAttr('style')
		.removeClass().addClass(wrapperClass).removeClass('scroll-wrapper scroll-textarea')
		.off(namespace)
		.scrollLeft(scrollLeft)
		.scrollTop(scrollTop);

	_this.scrollx.scroll.removeClass('scroll-visible').find('div').andSelf().off(namespace);
	_this.scrolly.scroll.removeClass('scroll-visible').find('div').andSelf().off(namespace);

	_this.wrapper.remove();
	_this.wrapper = undefined;
}

module.exports = {
	scrollbar: function (options) {
		return new scrollbar(options, this);
	}
}


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = {
	isScrollOverlaysContent: function (browser) {
		let scrollSize = this.getBrowserScrollSize(browser, true);
		return !(scrollSize.height || scrollSize.width);
	},
	getBrowserScrollSize: function (browser, actualSize) {
		if (browser.webkit && !actualSize) {
			return {
				height: 0,
				widht: 0
			}
		}
		if (!browser.data.outer) {
			let css = {
				"border": "none",
				"box-sizing": "content-box",
				"height": "200px",
				"margin": "0",
				"padding": "0",
				"width": "200px"
			};
			browser.data.inner = $('<div>').css($.extend({}, css));
			browser.data.outer = $('<div>').css($.extend({
				"left": "-1000px",
				"overflow": "scroll",
				"position": "absolute",
				"top": "-1000px"
			}, css)).append(browser.data.inner).appendTo('body');
		}

		browser.data.outer.scrollLeft(1000).scrollTop(1000);

		return {
			"height": Math.ceil((browser.data.outer.offset().top - browser.data.inner.offset().top) || 0),
			"width": Math.ceil((browser.data.outer.offset().left - browser.data.inner.offset().left) || 0)
		};
	}
}

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = {
	updateScrolls: function () {
		let _this = this;
		let config = _this.config;
		let $selector = _this.$selector;
		let wrapper = _this.wrapper;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function (direction, scroll) {
			let cssOffset = (direction === 'x') ? 'left' : 'top';
			let cssOuterSize = (direction === 'x') ? 'outerWidth' : 'outerHeight';
			let cssScrollSize = (direction === 'x') ? 'scrollWidth' : 'scrollHeight';
			let cssSize = (direction === 'x') ? 'width' : 'height';

			let $size = scroll.scroll.size;

			let offset = parseInt($selector.css(cssOffset), 10) || 0;
			let size = $selector.prop(cssScrollSize);
			let visible = ((direction === 'x') ? wrapper.width() : wrapper.height()) + offset;
			let scrollSize = $size[cssOuterSize]() + (parseInt($size.css(cssOffset), 10) || 0);

			scroll.offset = offset;
			scroll.size = size;
			scroll.visible = visible;
			scroll.scrollbarSize = parseInt(scrollSize * visible / size, 10);
			scroll.kx = ((scrollSize - scroll.scrollbarSize) / (size - visible)) || 1;
			// scroll.maxScrollOffset = size - visible;
		});

		_this.showScrolls();
	}
}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

let Render = {
	renderWrapper: function () {
		let _this = this;
		let $selector = _this.$selector;

		_this.wrapper = $('<div>')
			.addClass($selector.attr('class'))
			.addClass('scroll-wrapper')
			.insertBefore($selector).append($selector);

		if ($selector.is('textarea')) {
			_this.content = $('<div>').insertBefore($selector).append($selector);
			_this.content.addClass('scroll-content');
			_this.wrapper.addClass('scroll-textarea');
			$selector.removeClass().addClass('scroll-hide');
		} else {
			_this.content = $selector.removeClass().addClass('scroll-content scroll-hide');
		}
	},
	renderScrolls: function () {
		let _this = this;
		let $selector = _this.$selector;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function(direction, scroll) {
			let size = direction == "x" ? $selector.prop('scrollWidth') : $selector.prop('scrollHeight');
			let visible = direction == "x" ? _this.wrapper.width() : _this.wrapper.height();
			let scrollClass = 'scroll-visible';

			scroll.scroll = _this.scrollTemplate().addClass('scroll-' + direction);
			scroll.isVisible = (size - visible) > 1;
			if (scroll.isVisible) {
				scroll.scroll.addClass(scrollClass);
			}
		});
	},
	scrollTemplate: function () {
		let _this = this;
		let $selector = _this.$selector;
		let scroll = $([
			'<div class="scroll-element">',
				'<div class="scroll-outer">',
					'<div class="scroll-size"></div>',
					'<div class="scroll-track"></div>',
					'<div class="scroll-bar"></div>',
				'</div>',
			'</div>'
		].join('')).appendTo(_this.wrapper);
		$.extend(scroll, {
			bar: scroll.find('.scroll-bar'),
			size: scroll.find('.scroll-size'),
			track: scroll.find('.scroll-track')
		});
		return scroll;
	}
}

module.exports = Render


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = {
	showWrapper: function () {
		let _this = this;
		let $selector = _this.$selector;
		let position = $selector.css('position') == 'absolute' ? 'absolute' : 'relative';
		_this.wrapper.css({
			'position': position,
			'overflow': 'hidden'
		});
	},
	showContent: function () {
		let _this = this;
		let config = _this.config;
		let $selector = _this.$selector;

		let offset = parseInt($selector.css('top'), 10) || 0;
		let visible = _this.wrapper.height() + offset;
		let size = $selector.prop('scrollHeight');

		if ($selector.is('textarea') || size < visible) {
			_this.content.css({
				"height": (visible + config.browser.scroll.height) + 'px',
				"max-height": "none"
			});
		} else {
			_this.content.css({
				"max-height": (visible + config.browser.scroll.height) + 'px'
			});
		}
	},
	showScrolls: function () {
		let _this = this;
		let config = _this.config;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function (direction, scroll) {
			let cssSize = (direction === 'x') ? 'width' : 'height';

			if (config.autoScrollSize) {
				scroll.scroll.bar.css(cssSize, scroll.scrollbarSize + 'px');
			}
		});
	}
}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

let Event = {
	roll: function () {
		let _this = this;
		let $selector = _this.$selector;
		let left = $selector.scrollLeft() * _this.scrollx.kx + 'px';
		let top = $selector.scrollTop() * _this.scrolly.kx + 'px';

		_this.scrollx.isVisible && _this.scrollx.scroll.bar.css('left', left);
		_this.scrolly.isVisible && _this.scrolly.scroll.bar.css('top', top);
	}
}

module.exports = Event


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(2);
let View = __webpack_require__(34);
let Event = __webpack_require__(35);
let Render = __webpack_require__(36);

// event name space 
let ENP = {
	mouseover: 'mouseover.table',
	mouseleave: 'mouseleave.table',
	scroll: 'scroll.table',
	click: 'click.table',
	blur: 'blur.table'
}

function table (options, selector) {
	let defaults = {
		maxHeight: false,
		tableLock: $(selector).attr('data-tableLock') || 'true',
		tableEdit: $(selector).attr('data-tableEdit') || 'false',
		tableSort: $(selector).attr('data-tableSort') || 'false',
		tableAjax: $(selector).attr('data-tableAjax') || 'false',
		tableAjaxUrl: $(selector).attr('data-tableAjaxUrl') || '',
		tableCollapsed: $(selector).attr('data-tableCollapsed') || '',
		childrenClass: '.children-class',
		tableAjaxSuccess: function () {},
		tableCollBeforeSend: function () {},
		tableCollSuccess: function () {}
	}
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);

	_this.$tableHeader = _this.$selector.find('.table-header');
	_this.$tableBody = _this.$selector.find('.table-body');

	Render.call(_this, _this.config);
	
	_this.init();
}

// 继承方法
$.extend(table.prototype, View);

// $.extend(table.prototype, Event);

$.extend(table.prototype, Render.prototype);

// 初始化
table.prototype.init = function () {
	let _this = this;
	let config = _this.config;

	_this.updateBodyMaxHeight();

	_this.bindEvent();

	if (config.tableLock === 'true') {
		// _this.renderTableFixed();
		_this.bindEventTableFixed();
		// _this.renderTableHeaderLock();
	}
}

// 绑定事件
table.prototype.bindEvent = function () {
	let _this = this;
	let config = _this.config;
	let $selector = _this.$selector;
	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;

	$tableBody.on(ENP.scroll, function (event) {
		$tableHeader.scrollLeft($(this).scrollLeft());
	});

	if (config.tableLock === 'true') {
		$tableHeader.on(ENP.mouseover, 'th', function (event) { $(this).addClass('active') });
		$tableHeader.on(ENP.mouseleave, 'th', function (event) { $(this).removeClass('active') });

		$tableHeader.on(ENP.click, '.lock', $.proxy(_this.splitTable, _this));
	}

	$selector.on(ENP.mouseover, 'tbody tr', function (event) {
		Event.mouseoverTr.call(_this, event);
	});
	$selector.on(ENP.mouseleave, 'tbody tr', function (event) {
		Event.mouseleaveTr.call(_this, event);
	});

	// 展开、收起  二级列表
	$selector.on(ENP.click, '.J-collapsed', $.proxy(_this.showAdjective, _this));

	// 表格 单个td 可编辑
	if (config.tableEdit === 'true') {
		$selector.on(ENP.click, '.table-edit-text', function (event) {
			let $target = $(event.target);
			let text = $target.text();
			_this.showEditInput(Utils.delcommafy(text), event);
		});
		$selector.on(ENP.blur, '.table-edit-input', function (event) {
			Event.editInputBlur.call(_this, event);
		});
	}

	// 表格 排序功能开启
	if (config.tableSort === 'true') {
		$selector.on(ENP.click, '.sorting .table-sort, .sorting_desc .table-sort', function (event) {
			Event.sortFn.call(_this, event, false);
		});
		$selector.on(ENP.click, '.sorting_asc .table-sort', function (event) {
			Event.sortFn.call(_this, event, true);
		});
	}

	// 表格 展开功能开启
	if (config.tableCollapsed === 'true') {
		$selector.on(ENP.click, '.table-collapsed', function (event) {
			Event.collapsed.call(_this, event);
		});
		$selector.on(ENP.click, '.table-expanded', function (event) {
			Event.expanded.call(_this, event);
		});
	}
		
};

// 绑定固定表格事件
table.prototype.bindEventTableFixed = function () {
	let _this = this;

	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;
	let $tableFixed = _this.$tableFixed;

	$tableFixed.find('.table-body').on(ENP.mouseover, function () {
		$tableFixed.find('.table-body').on(ENP.scroll, function () {
			$tableBody.scrollTop($(this).scrollTop());
		});
		$tableBody.off(ENP.scroll);
	});

	$tableBody.on(ENP.mouseover, function () {
		$tableBody.on(ENP.scroll, function (event) {
			$tableHeader.scrollLeft($(this).scrollLeft());
			$tableFixed.find('.table-body').scrollTop($(this).scrollTop());
		});
		$tableFixed.find('.table-body').off(ENP.scroll);
	});

	$tableFixed.on(ENP.mouseover, 'th', function (event) { $(this).addClass('active') });
	$tableFixed.on(ENP.mouseleave, 'th', function (event) { $(this).removeClass('active') });

	$tableFixed.on(ENP.click, '.unlock', function (event) {
		Event.selectThUnlock.call(_this, event);
	});
}

module.exports = {
	table: function (options) {
		return new table(options, this);
	}
}


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = {
	// 更新 body-table 尺寸
	updateBodyMaxHeight: function (height) {
		let _this = this;
		let config = _this.config;
		let maxHeight = height || config.maxHeight;
		let $tableBody = _this.$tableBody;

		if (!maxHeight) {return;}
		$tableBody.css({
			'max-height': maxHeight
		});
	},
	// 展示 、 刷新  fixed-table  尺寸
	showTableFixed: function (tableFixedWidth) {
		let _this = this;
		let config = _this.config;
		let $tableHeader = _this.$tableHeader;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let maxHeight = $tableBody.height();
		let maxWidth = $tableBody.width();

		if (tableFixedWidth) {
			$tableFixed.css('max-width', maxWidth > tableFixedWidth ? tableFixedWidth : maxWidth);
		}

		if ($tableFixed && $tableFixed.find('tr').length) {
			$tableFixed.removeClass('hide');
			$tableFixed.find('.table-body').css('max-height', maxHeight);
			$tableFixed.find('.table-body').scrollTop($tableBody.scrollTop());
		}
			
	},
	showAdjective: function (event) {
		let _this = this;
		let $target = $(event.target);
		let url = $target.data('url');

		console.log(url)
	},
	showEditInput: function (value, event) {
		let _this = this;
		let $target = $(event.target);

		$target.addClass('hide');
		$target.siblings('.table-edit-input').removeClass('hide');
		$target.siblings('.table-edit-input').find('input').val(value).trigger('focus.table');
	},
	showEditText: function (value, event) {
		let _this = this;
		let $target = $(event.target);
		let $input = $target.parent('.table-edit-input');
		let $text = $input.siblings('.table-edit-text');

		$input.addClass('hide');
		$text.removeClass('hide');
		$text.text(value);
	},
	// 显示已展开按钮
	showExpanded: function (trIndex, event) {
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-expanded').removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-expanded').removeClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).removeClass('hide');
	},
	// 隐藏未展开按钮
	hideCollapsed: function (trIndex, event) {
    let _this = this;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
	},
	// 显示未展开按钮
	showCollapsed: function (trIndex, event) {
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').removeClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-expanded').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-expanded').addClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).addClass('hide');
	},
	// 显示排序按钮
	sortView: function (event) {
		let $target = $(event.target);
		let $th = $target.parent('th');
		
		if ($th.hasClass('sorting')) {
			$th.removeClass('sorting').addClass('sorting_asc');
		} else if ($th.hasClass('sorting_asc')) {
			$th.addClass('sorting_desc').removeClass('sorting_asc');
		} else if ($th.hasClass('sorting_desc')) {
			$th.addClass('sorting_asc').removeClass('sorting_desc');
		}

		$th.siblings().removeClass('sorting_asc sorting_desc').addClass('sorting');
	}
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(2);
let Event = {
	// 选择锁定
	selectThLock: function (event) {
		let _this = this;
		let config = _this.config;

		_this.splitTable(event);
	},
	// 选择解锁
	selectThUnlock: function (event) {
		let _this = this;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		// console.log($target)
		let thIndex = $target.parent('th').index();
		let thLength = $target.parent('th').parent('tr').find('th').length;

		let width = 0;
		for (let i = 0; i < thIndex; i++) {
			width += $target.parent('th').parent('tr').find('th').eq(i).outerWidth();
		}

		$tableFixed.css('max-width', width);
		
		// $.each($tableFixed.find('tr'), function (index, item) {
		// 	$(item).find('td').slice(thIndex, thLength).remove();
		// 	$(item).find('th').slice(thIndex, thLength).remove();
		// });
	},
	// 显示同行
	mouseoverTr: function (event) {
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		let index;

		if ($target.is('td')) {
			index = $target.parent().index();
			$tableBody.find('tbody').find('tr').eq(index).addClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).addClass('active') : '';
		} else {
			index = $target.parentsUntil('tr').parent().index();
			$tableBody.find('tbody').find('tr').eq(index).addClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).addClass('active') : '';
		}
	},
	// 隐藏同行
	mouseleaveTr: function (event) {
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		let index;

		if ($target.is('td')) {
			index = $target.parent().index();
			$tableBody.find('tbody').find('tr').eq(index).removeClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).removeClass('active') : '';
		} else {
			index = $target.parentsUntil('tr').parent().index();
			$tableBody.find('tbody').find('tr').eq(index).removeClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).removeClass('active') : '';
		}
	},
	editInputBlur: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $target = $(event.target);
		let value = $target.val();
		let $text = $target.parent('.table-edit-input').siblings('.table-edit-text');
		let json = JSON.parse($text.attr('data-params'));
		let _url = $text.attr('data-url');
		let str = '';

		json['value'] = value;

		// 必须参数demo:<span class="table-edit-text" data-url="" data-params="{}">num like: 9999</span>
		if (_url === '') {
            let valueText = Utils.commafy(parseInt(value)) === '' ? '-' : Utils.commafy(parseInt(value));
            _this.showEditText(valueText, event);
            return;
		}
		
		$.ajax({
			url: _url,
			type: 'post',
			data: json,
			dataType: 'json'
		}).then(function (res) {
			if (res.status) {
				let valueText = Utils.commafy(parseInt(value)) === '' ? '-' : Utils.commafy(parseInt(value));
				_this.showEditText(valueText, event);
			} else {
				_this.showEditText('error', event);
			}
		});
	},
	sortFn: function (event, isDown) {
		event && event.preventDefault();
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tr = $tableBody.find('tr');
		let $th = $(event.target).parent('th');
		let index = $th.attr('data-index') - 1;
		let sortJson = [];
		// 切换class
		_this.sortView.call(_this, event);
		// 渲染排序所需的json
		$.each($tr, function (_index, el) {
			let _temp = {};
			_temp.index = _index;
			if ($th.attr('data-commafy') === 'true') {
				_temp.value = $(el).find('td').eq(index).text().trim();
			} else {
				_temp.value = $(el).find('td').eq(index).text().trim();
			}
			sortJson.push(_temp);
		});
		// 排序
		sortJson = Utils.order(sortJson, 'value', isDown);
		// 渲染排序好的html
		_this.sortRender.call(_this, sortJson);

		// 固定表格还没渲染
	},
	collapsed: function (event) {
		event && event.preventDefault();
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;
    
		let $target = $(event.target);
		let _url = $target.attr('data-url');
		let $tr = $target.parent('td').parent('tr');
		let trIndex = $tr.index();

		config.tableCollBeforeSend.call(_this, trIndex, event);
		_this.hideCollapsed.call(_this, trIndex, event);

		if ($tr.nextUntil('tr'+config.childrenClass).length) {
			config.tableCollSuccess.call(_this, trIndex, event);
			_this.showExpanded.call(_this, trIndex, event);
			return false;
		}

		$.ajax({
			url: _url,
			type: 'get'
		}).then(function (res) {
			if (res.status) {
				$tableFixed.find('tbody').find('tr').eq(trIndex).after(res.html);
				$tableBody.find('tbody').find('tr').eq(trIndex).after(res.html);
				config.tableCollSuccess.call(_this, trIndex, event);
				_this.showExpanded.call(_this, trIndex, event);
			}
		});
	},
	expanded: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $target = $(event.target);
		let $tr = $target.parent('td').parent('tr');
		let trIndex = $tr.index();

		_this.showCollapsed.call(_this, trIndex, event);
	}
}

module.exports = Event


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

let Utils = __webpack_require__(2);

function Render (config) {
	this.config = config;
	this.renderInit();
};

Render.prototype.renderInit = function () {
	if (this.config.tableLock === 'true') {
		this.renderTableFixed();
		this.renderTableHeaderLock();
	}
	if (this.config.tableEdit === 'true') {
		this.renderTableTdEdit();
	}
	if (this.config.tableAjax === 'true') {
		this.renderTableBodyAmount();
	}
	if (this.config.tableCollapsed === 'true') {
		this.renderTableCollapsed();
	}
}

// 渲染固定表格
Render.prototype.renderTableFixed = function () {
	let _this = this;
	let $selector = _this.$selector;

	let $tableFixed = _this.$tableFixed = $([
			'<div class="table-fixed hide">',
				'<div class="table-header">',
					'<table class="table table-striped table-bordered table-hover table-data">',
					'</table>',
				'</div>',
				'<div class="table-body scroll-hide">',
					'<table class="table table-striped table-bordered table-hover table-data">',
					'</table>',
				'</div>',
			'</div>'
		].join(''));

	$selector.append($tableFixed);
}

// 渲染头部表格 锁
Render.prototype.renderTableHeaderLock = function () {
	let _this = this;
	let $tableHeader = _this.$tableHeader;

	let html = '<div class="lock uk-icon-lock" title="固定列"></div>';

	$.each($tableHeader.find('th'), function (index, item) {
		$(item).append(html);
	});
}

// 分割表格
Render.prototype.splitTable = function (event) {
	let _this = this;
	let $selector = _this.$selector;
	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;
	let $tableFixed = _this.$tableFixed;
	let $target = $(event.target);
	let $th = $target.parent('th');
	let thIndex = $th.index();

	// 清空固定表格
	$tableFixed.find('.table-header').find('table').html('');
	$tableFixed.find('.table-body').find('table').html('');

	// 复制tableHeader thead
	let htmlThead = Utils.getTableFixedThead($tableHeader, thIndex);
	$tableFixed.find('.table-header').find('table').append(htmlThead);

	// 复制tableBody tbody
	let htmlTbody = Utils.getTableFixedTBody($tableBody, thIndex);
	$tableFixed.find('.table-body').find('table').append(htmlTbody);

	// 复制colgroup 到各表
	let htmlColgroup = Utils.getTableHeaderColgroup($tableHeader, thIndex); 
	$tableFixed.find('table').prepend(htmlColgroup);

	// 显示tableFixed width
	let tableFixedWidth = Utils.getTableFixedWidth($tableHeader, thIndex);
	_this.showTableFixed(tableFixedWidth);
}

Render.prototype.renderTableTdEdit = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;

	$.each($tableBody.find('.table-edit-text'), function (index, item) {
		let $target = $(item);
		let maxlength = $target.attr('data-maxlength') ? $target.attr('data-maxlength') : 7;
		$target.after('<div class="table-edit-input hide"><input type="text" class="form-control" style="height:18px;margin:-1px 0;padding: 0 7px;" maxlength="'+maxlength+'"></div>');
	});
}

Render.prototype.renderTableBodyAmount = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;
	let config = _this.config;
	let _url = config.tableAjaxUrl;

	$.ajax({
		url: _url,
		type: 'get'
	}).then(function (res) {
		$tableBody.find('table').prepend(res);
		config.tableAjaxSuccess.call(_this);
	})
}

Render.prototype.renderTableCollapsed = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;

	$.each($tableBody.find('.table-collapsed'), function (index, item) {
		let $target = $(item);
		$target.after('<span class="loading"></span>');
		$target.after('<span class="table-expanded hide"></span>');
	});
}

Render.prototype.sortRender = function (sortJson) {
	let _this = this;
	let $tableBody = _this.$tableBody;
	let $tbody = $tableBody.find('tbody');
	let $tr = $tableBody.find('tr');
	let html = $tbody.clone().html('');
	$.each(sortJson, function (index, item) {
		html.append($tr.eq(item.index).clone());
	})
	$tbody.replaceWith(html);
}

module.exports = Render

/***/ }),
/* 37 */
/***/ (function(module, exports) {

var o = $({});

module.exports = {
	sub: function () {
		o.on.apply(o, arguments);
	},
	unsub: function () {
		o.off.apply(o, arguments);
	},
	pub: function () {
		o.trigger.apply(o, arguments);
	}
}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

let defaults = {
  display: false,
  type: 'ios',
  text: false,
  shadow: true,
  iosTemplate: iosTemplate
};

function Loading(options, type) {
  let _this = this;
  let _config = $.extend({}, defaults, options);
  let isGlobal = this instanceof $;
  let $context = $('body');
  let $loading = $('<div/>',{class: _config.type + 'Template'}).html(_config[_config.type + 'Template'](_config));

  options !== void 0 ? _config.display = options : '';
  if (isGlobal) {
    $context = this;
    $context.css('position', 'relative');
  }
  if (_config.display) {
    $context.data('loading', $loading).append($loading);
  } else {
    $context.data('loading').remove();
  }
}

function iosTemplate(config) {
  var loadingStr = `<div class="ios-loading"  ${config.shadow ? '' : 'style="background-color: transparent;"'}>
  <div class=indicator ${config.text ? '' : 'style="height: 55px;"'}>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
  </div>
  ${config.text ? '<span>Loading...</span>' : ''}
</div>`;
  return loadingStr;
}

$.fn.loading = Loading;

module.exports = { loading: Loading };

/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * 拿到url上的参数
 * 调用：$.getHash(url);
 */

var urlHelper = {

    // 获取单个参数
    // demo: getParam('query','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "hello"
    /**
     * [getParam ]
     * @param  {String} name
     * @param  {String} url   [default:location.href]
     * @return {String|Boolean}
     */
    getParam: function (name, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    // 设置单个参数
    // demo: setParam('query','world','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?query=world&time=2017-11-12"
    /**
     * [setParam 设置单个参数]
     * @param {String} name
     * @param {String|Number} val
     * @return {String|Boolean}
     */
    setParam: function (name, val, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        var _name = name.replace(/[\[\]]/g, '\\$&');
        var value = name + '=' + encodeURIComponent(val);
        var regex = new RegExp(_name + '=[^&]*');
        var urlArr = url.split('#');
        var result = '';

        if (regex.exec(url)) {
            result = url.replace(regex, value);
        } else {
            result = urlArr[0] + '&' + value + (urlArr[1] || '');
        }

        return result
    },

    // 移除单个参数
    // demo: removeParam('query','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?time=2017-11-12"
    /**
     * [removeParam 移除单个参数]
     * @param  {String} name
     * @param  {String} url   [default:location.href]
     * @return {String|Boolean}
     */
    removeParam: function (name, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        var urlparts = url.split('?');
        var prefix = encodeURIComponent(name + '=');
        var pars = urlparts[1].split(/[&;]/g);
        var i = 0, len = pars.length;

        for (; i < len; i++) {
            if (encodeURIComponent(pars[i]).lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');

        return url;
    },

    // 获取多个参数
    // demo: getParams('query time','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: {query: "hello", time: "2017-11-12"}
    /**
     * [getParams 获取多个参数]
     * @param  {String} names [多个用空格分割]
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    getParams: function (names, url) {
        if (typeof name !== 'string') return false;
        var names = names.split(' ');
        var result = {};
        var i = 0,
            len = names.length;
        if (names.length === 0) return false;
        for (; i < len; i++) {
            result[names[i]] = getParam(names[i], url);
        }
        return result;
    },

    // 设置多个参数
    // demo: setParams({a:111,b:222,query:'world'},'https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?query=world&time=2017-11-12&a=111&b=222"
    /**
     * [setParams 设置多个参数]
     * @param {Object} obj
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    setParams: function (obj, url) {
        var result = url || '';
        if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
        for (var name in obj) {
            result = setParam(name, obj[name], result);
        }
        return result;
    },

    // 移除多个参数
    // demo: removeParams('query time','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search"
    /**
     * [removeParams 移除多个参数]
     * @param  {String} names [多个用空格分割]
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    removeParams: function (names, url) {
        var result = url || '';
        var names = names.split(' ');
        var i = 0,
            len = names.length;
        if (names.length === 0) return false;

        for (; i < len; i++) {
            result = removeParam(names[i], result);
        }
        return result;
    },

    // url hash 操作
    /**
     * [getHash 方法]
     * @param  {[String]} url [default:location.href]
     * @return {[String]}
     */
    getHash: function (url) {
        return decodeURIComponent(url ? url.substring(url.indexOf('#') + 1) : window.location.hash.substr(1));
    },
    /**
     * [setHash 方法]
     * @param {String} hash
     */
    setHash: function (hash) {
        window.location.replace('#' + encodeURIComponent(hash));
    },
    /**
     * [removeHash 方法]
     */
    removeHash: function () {
        window.location.replace('#', '');
    }

};

// $.fn.getParam = urlHelper.getParam;
$.fn.getHash = urlHelper.getHash;

module.exports = urlHelper;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

;
(function () {

	$('.J-dropdown-multiple').NUI('multiSelect');
	
} ());

/***/ }),
/* 41 */
/***/ (function(module, exports) {

;
(function() {

    if(!$('.J-table-wrap').length) {return;}

    // 计算表格高度
    function getTbodyMaxHeight () {
        var headerHeight = $('.header').height();
        var contentPaddingTop = parseInt($('.content').css('padding-top'));
        var breadcrumbOuterHeight = $('.breadcrumb').outerHeight(true);
        var formSearchHeight = $('.form-horizontal').outerHeight();
        var captionHeight = $('.caption').outerHeight();

        var iboxContentTheadHeight = $('.ibox-content').find('thead').outerHeight();
        var iboxContentPaddingTop = parseInt($('.ibox-content').css('padding-top'));
        var iboxContentBorderWidth = parseInt($('.ibox-content').css('border-top-width')) + parseInt($('.ibox-content').css('border-bottom-width'));

        var windowHeight = $(window).height();
        var iboxContent = iboxContentTheadHeight + iboxContentPaddingTop + iboxContentBorderWidth + 1;
        var iboxContentOther = headerHeight + contentPaddingTop + breadcrumbOuterHeight + formSearchHeight + captionHeight;

        var tbodyMaxHeight = windowHeight - iboxContent - iboxContentOther;
        return tbodyMaxHeight;
    }

    let table = $('.J-table-wrap').NUI('table', {
        maxHeight: getTbodyMaxHeight(),
        // switchLock: true,
        childrenClass: '.lv-1',
        tableAjaxSuccess: function () {
            scrollbar.destroy();
            this.updateBodyMaxHeight(getTbodyMaxHeight());
            scrollbar.init();
        },
        tableCollBeforeSend: function (trIndex, event) {
            let _this = this;
            let $tableFixed = _this.$tableFixed;
            let $tableBody = _this.$tableBody;
            if ($tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').length) {
              $tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').loading(true, true);
            }
            $tableBody.find('tbody').find('tr').eq(trIndex).find('.loading').loading(true, true);
        },
        tableCollSuccess: function (trIndex, event) {
            let _this = this;
            let $tableFixed = _this.$tableFixed;
            let $tableBody = _this.$tableBody;
            if ($tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').length) {
              $tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').loading(false);
            }
            $tableBody.find('tbody').find('tr').eq(trIndex).find('.loading').loading(false);
        }
    });

    let scrollbar = $('.J-scrollbar').NUI('scrollbar', {
        autoScrollHeight: false
    });

    $(window).resize(function () {
        table.updateBodyMaxHeight(getTbodyMaxHeight());
        table.showTableFixed();
        scrollbar.updateSize();
    });

}());

/***/ }),
/* 42 */
/***/ (function(module, exports) {

;
(function () {
	$('.datepick').NUI('datepick', {
		// format: 'YYYY/MM/DD',
		selectMonth: function () {
			$('.form-time').trigger('submit');
		},
		weeks: function (weeks) {
			// console.log(weeks)
		}
	});
}());

/***/ }),
/* 43 */
/***/ (function(module, exports) {

(function($, window) {

    /**
     utils：通用方法
     */

    var utils = {
        animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
        scrollBarWidth: (function() {
            var scrollbarWidth;
            var $scrollDiv = $('<div/>');
            $scrollDiv.css({
                'width': 100,
                'height': 100,
                'overflow': 'scroll',
                'position': 'absolute',
                'top': -9999
            });
            $('html').append($scrollDiv);
            scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
            $scrollDiv.remove();
            return scrollbarWidth;
        }())
    };

    var isIE = document.all && !window.atob;

    function animateEnd(el, fn) {
        if (isIE) {
            fn();
        } else {
            el.on(utils.animateEnd, fn);
        }
    };

    function transitionEnd(el, fn) {
        if (isIE) {
            fn();
        } else {
            el.on(utils.transitionEnd, fn);
        }
    }

    function layer(config) {

        var defaults = {
            container: 'body',
            shadow: true,
            confirmHandle: '.btn-confirm',
            closeHandle: '.btn-cancel,.btn-close',
            offsetWidth: 'auto',
            offsetHeight: 'auto',
            animateClass: 'fadeInDown',
            // showLayer ['fadeInDown','layer-opening']
            showCall: function() {},
            hideCall: function() {},
            cancelCall: function() {},
            confirmCall: function() {}
        };

        this.config = $.extend(defaults, config);
        this.init();
        this.event();

    }

    layer.prototype.init = function() {
        var self = this;

        self.wrapItems();
        self.appendContentSizes();

        self.$layerBox.data('layer', self);
    };

    layer.prototype.wrapItems = function() {
        var self = this;
        var config = self.config;
        
        if($(config.id).length === 0) {
            self.$layerBox = $('<div/>', {
                class: 'layer-box hide',
                id: config.id.replace('#','')
            });
            self.$content = $('<div/>', {
                class: 'layer-content'
            });
            $(config.container).append(self.$layerBox);
        } else {
            self.$layerBox = $(config.id);
            self.$content = self.$layerBox.find('.layer-content');
            config.dataType = self.$layerBox.attr('data-dataType') || 'html'
        }
        
        //创建遮罩层
        self.$backdrop = $('<div/>', {
            class: 'layer-backdrop'
        });
        self.$layerBox.append(self.$content);
        self.$content.html(config.content);
    };

    layer.prototype.appendContentSizes = function() {
        var self = this;
        var config = self.config;
        var layerWidth = Number(self.$layerBox.attr('data-width')) || config.offsetWidth;
        var layerHeight = Number(self.$layerBox.attr('data-height')) || config.offsetHeight;
        self.$content.css({
            width: layerWidth,
            height: layerHeight
        });
    };

    layer.prototype.showLayer = function(cutto) {
        var self = this;
        var config = self.config;
        var screenH = document.documentElement.clientHeight;
        var gtIE10 = document.body.style.msTouchAction === undefined;
        var scrollBarWidth = utils.scrollBarWidth;
        var isCutto = cutto;
        // 当body高度大于可视高度，修正滚动条跳动
        // >=ie10的滚动条不需要做此修正,tmd :(
        if ($('body').height() > screenH & (gtIE10)) {
            $('body').css({
                'border-right': scrollBarWidth + 'px transparent solid',
                'overflow': 'hidden'
            });
        }
        //显示层
        self.$layerBox.removeClass('hide');
        self.$content.off(utils.animateEnd);

        if (isCutto) {
            self.$content.removeClass('layer-opening');
        } else {
            //插入-遮罩-dom
            self.$layerBox.after(self.$backdrop);
            //插入-遮罩-显示动画
            self.$backdrop.attr('style', 'opacity: 1;visibility: visible;');
        }

        //插入-弹层-css3显示动画
        self.$content.addClass(config.animateClass);

        animateEnd(self.$content, function(event) {
            self.$content.removeClass(config.animateClass);
            //触发showCall回调
            config.showCall();
        });

        //插入-遮罩-dom
        self.$layerBox.after(self.$backdrop);
        //插入-遮罩-显示动画
        self.$backdrop.attr('style', 'opacity: 1;visibility: visible;');
    };

    layer.prototype.hideLayer = function(cutto) {
        var self = this;
        var config = self.config;
        var isCutto = cutto;
        var Q = $.Deferred();
        //插入-弹层-隐藏动画
        self.$content.off(utils.animateEnd);
        self.$content.addClass('layer-closing');
        if (!isCutto) {
            self.$backdrop.removeAttr('style');
            transitionEnd(self.$backdrop, function() {
                self.$backdrop.remove();
            });
        }
        animateEnd(self.$content, function(event) {
            self.$backdrop.remove();
            //插入-遮罩-隐藏动画
            self.$content.removeClass('layer-closing');
            //隐藏弹层
            self.$layerBox.addClass('hide');
            //触发hideCall回调
            config.hideCall();
            Q.resolve();
        });

        //恢复 body 滚动条
        $('body').removeAttr('style');
        return Q;
    };

    layer.prototype.cutTo = function(nextId, currentId) {
        var self = this;
        var nextLayer = $(nextId).data('layer');
        var currentLayer = (currentId ? $(currentId) : self.$layerBox).data('layer');
        currentLayer.hideLayer(true).done(function() {
            nextLayer.showLayer(true);
        });
    };

    layer.prototype.ajaxLoad = function(url) {
        var self = this;
        var config = self.config;
        var _url = url || '?';
        var _method = self.$layerBox.attr('data-method') || 'GET';
        var _dataType = config.dataType;
        var _this = this;

        if (config.cache && self.$layerBox.data('success')) {
            _this.showLayer();
            return false;
        }

        $.loading(true, true);
        self.$layerBox.data('success', 1);
        $.ajax({
            url: _url,
            type: _method,
            dataType: config.dataType,
            data: config.data
        }).then(function(res) {
            $.loading(false);
            config.successCall.apply(self.$layerBox, [res, this, self.$layerBox]);
            _this.showLayer();
        }, function(err) {
            $.loading(false);
            _this.hideLayer();
            config.errorCall.apply(self.$layerBox, [err, this, self.$layerBox]);
        });
    };

    layer.prototype.event = function() {
        var self = this;
        var config = self.config;

        // 阴影层事件
        self.$layerBox.on('click.layer', function(event) {
            if ($(event.target).is(self.$layerBox)) {
                if (!config.shadow) {
                    return false;
                }
                if ($('body').find('.layer-loading').length) {
                    return false;
                }
                self.hideLayer();
                config.cancelCall();
            }
        });

        //绑定关闭事件
        self.$layerBox.on('click.layer', config.closeHandle, function(event) {
            self.hideLayer();
            config.cancelCall();
            return false;
        });

        //确认事件
        self.$layerBox.on('click.layer', config.confirmHandle, function(event) {
            event.preventDefault();
            config.confirmCall(self);
        });

    };

    //-----------工厂模式-------------//

    $.fn.layer = function(config) {
        return new layer(config);
    };

})(jQuery, window);

;
(function () {

    if (!$('[data-trigger="multiDialog"]').length) {return;}
    
    var layer = $('.dialog-multi').NUI('Layer',{
        // dynamic: true,
        boxType             : 'dialog',
        content             : '<form class="form-horizontal">' + $('.tipsbox-content').html() + '</form>',
        target              : $('[data-trigger="multiDialog"]'),
        // offsetWidth : 800
    });

    // $('[data-trigger="multiDialog"]').on('click', function (event) {
    //     event.preventDefault();
    //     layer.showDialog(event);
    // });

}());

/***/ }),
/* 44 */
/***/ (function(module, exports) {

;(function(){

    $('.treeview').on('click', 'a', function() {
        var $this = $(this);
        if ($this.parent().hasClass('menu-open') && !$('body').hasClass('sidebar-collapse')) {
            $this.parent().removeClass('menu-open');
            $this.siblings('.treeview-menu').slideUp('normal', function () {
                $this.siblings('.treeview-menu').hide();
            });
        } else {
            $this.parent().addClass('menu-open');
            $this.siblings('.treeview-menu').slideDown();
        }
    });

    $('#J-navSide-hide').on('click', function () {
        $('.skin-blue').toggleClass('sidebar-collapse');
    });

    // $('.wrapper').scroll(function () {
    //     $target = $('.main-sidebar');
    //     if ($(this).scrollTop() > 50) {
    //         $target.addClass('fixed');
    //         $('body').addClass('sidebar-collapse');
    //      } else {
    //         $target.removeClass('fixed');
    //         $('body').removeClass('sidebar-collapse');
    //      }
    // });
    
}());

/***/ }),
/* 45 */
/***/ (function(module, exports) {

;
(function() {

    var MapData;
    var $formMap = $('#formMap');
    var $formLine = $('#formLine');

    if($formMap.length === 0 && $formLine.length === 0) {
        return ;
    }

    // var geoCoordMap = {
    //     '上海': [121.4648,31.2891],
    //     '东莞': [113.8953,22.901],
    //     '东营': [118.7073,37.5513],
    //     '中山': [113.4229,22.478],
    //     '临汾': [111.4783,36.1615],
    //     '临沂': [118.3118,35.2936],
    //     '丹东': [124.541,40.4242],
    //     '丽水': [119.5642,28.1854],
    //     '乌鲁木齐': [87.9236,43.5883],
    //     '佛山': [112.8955,23.1097],
    //     '保定': [115.0488,39.0948],
    //     '兰州': [103.5901,36.3043],
    //     '包头': [110.3467,41.4899],
    //     '北京': [116.4551,40.2539],
    //     '北海': [109.314,21.6211],
    //     '南京': [118.8062,31.9208],
    //     '南宁': [108.479,23.1152],
    //     '南昌': [116.0046,28.6633],
    //     '南通': [121.1023,32.1625],
    //     '厦门': [118.1689,24.6478],
    //     '台州': [121.1353,28.6688],
    //     '合肥': [117.29,32.0581],
    //     '呼和浩特': [111.4124,40.4901],
    //     '咸阳': [108.4131,34.8706],
    //     '哈尔滨': [127.9688,45.368],
    //     '唐山': [118.4766,39.6826],
    //     '嘉兴': [120.9155,30.6354],
    //     '大同': [113.7854,39.8035],
    //     '大连': [122.2229,39.4409],
    //     '天津': [117.4219,39.4189],
    //     '太原': [112.3352,37.9413],
    //     '威海': [121.9482,37.1393],
    //     '宁波': [121.5967,29.6466],
    //     '宝鸡': [107.1826,34.3433],
    //     '宿迁': [118.5535,33.7775],
    //     '常州': [119.4543,31.5582],
    //     '广州': [113.5107,23.2196],
    //     '廊坊': [116.521,39.0509],
    //     '延安': [109.1052,36.4252],
    //     '张家口': [115.1477,40.8527],
    //     '徐州': [117.5208,34.3268],
    //     '德州': [116.6858,37.2107],
    //     '惠州': [114.6204,23.1647],
    //     '成都': [103.9526,30.7617],
    //     '扬州': [119.4653,32.8162],
    //     '承德': [117.5757,41.4075],
    //     '拉萨': [91.1865,30.1465],
    //     '无锡': [120.3442,31.5527],
    //     '日照': [119.2786,35.5023],
    //     '昆明': [102.9199,25.4663],
    //     '杭州': [119.5313,29.8773],
    //     '枣庄': [117.323,34.8926],
    //     '柳州': [109.3799,24.9774],
    //     '株洲': [113.5327,27.0319],
    //     '武汉': [114.3896,30.6628],
    //     '汕头': [117.1692,23.3405],
    //     '江门': [112.6318,22.1484],
    //     '沈阳': [123.1238,42.1216],
    //     '沧州': [116.8286,38.2104],
    //     '河源': [114.917,23.9722],
    //     '泉州': [118.3228,25.1147],
    //     '泰安': [117.0264,36.0516],
    //     '泰州': [120.0586,32.5525],
    //     '济南': [117.1582,36.8701],
    //     '济宁': [116.8286,35.3375],
    //     '海口': [110.3893,19.8516],
    //     '淄博': [118.0371,36.6064],
    //     '淮安': [118.927,33.4039],
    //     '深圳': [114.5435,22.5439],
    //     '清远': [112.9175,24.3292],
    //     '温州': [120.498,27.8119],
    //     '渭南': [109.7864,35.0299],
    //     '湖州': [119.8608,30.7782],
    //     '湘潭': [112.5439,27.7075],
    //     '滨州': [117.8174,37.4963],
    //     '潍坊': [119.0918,36.524],
    //     '烟台': [120.7397,37.5128],
    //     '玉溪': [101.9312,23.8898],
    //     '珠海': [113.7305,22.1155],
    //     '盐城': [120.2234,33.5577],
    //     '盘锦': [121.9482,41.0449],
    //     '石家庄': [114.4995,38.1006],
    //     '福州': [119.4543,25.9222],
    //     '秦皇岛': [119.2126,40.0232],
    //     '绍兴': [120.564,29.7565],
    //     '聊城': [115.9167,36.4032],
    //     '肇庆': [112.1265,23.5822],
    //     '舟山': [122.2559,30.2234],
    //     '苏州': [120.6519,31.3989],
    //     '莱芜': [117.6526,36.2714],
    //     '菏泽': [115.6201,35.2057],
    //     '营口': [122.4316,40.4297],
    //     '葫芦岛': [120.1575,40.578],
    //     '衡水': [115.8838,37.7161],
    //     '衢州': [118.6853,28.8666],
    //     '西宁': [101.4038,36.8207],
    //     '西安': [109.1162,34.2004],
    //     '贵阳': [106.6992,26.7682],
    //     '连云港': [119.1248,34.552],
    //     '邢台': [114.8071,37.2821],
    //     '邯郸': [114.4775,36.535],
    //     '郑州': [113.4668,34.6234],
    //     '鄂尔多斯': [108.9734,39.2487],
    //     '重庆': [107.7539,30.1904],
    //     '金华': [120.0037,29.1028],
    //     '铜川': [109.0393,35.1947],
    //     '银川': [106.3586,38.1775],
    //     '镇江': [119.4763,31.9702],
    //     '长春': [125.8154,44.2584],
    //     '长沙': [113.0823,28.2568],
    //     '长治': [112.8625,36.4746],
    //     '阳泉': [113.4778,38.0951],
    //     '青岛': [120.4651,36.3373],
    //     '韶关': [113.7964,24.7028]
    // };

    var options = {
        line: {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                }
            }],
            series: [{
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#108ee9'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#3aa5f2'
                        }, {
                            offset: 1,
                            color: '#108ee9'
                        }])
                    }
                },
                data: []
            }]
        },
        map: {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            visualMap: {
                min: 0,
                max: 1000000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                }
            },
            series: [{
                type: 'map',
                mapType: 'china',
                roam: false,
                label: { normal: { show: true }, emphasis: { show: true } },
                data: []
            }]
        },
        // mapCity: {
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: function (params) {
        //             return params.name + ' : ' + params.value[2];
        //         }
        //     },
        //     geo: {
        //         map: 'china',
        //         label: {
        //             emphasis: {
        //                 show: false
        //             }
        //         },
        //         roam: false,
        //         zoom: 1.2,
        //         itemStyle: {
        //             normal: {
        //                 areaColor: '#4e677c',
        //                 borderColor: '#828991'
        //             },
        //             emphasis: {
        //                 areaColor: '#add8f8'
        //             }
        //         }
        //     },
        //     series: [{
        //         type: 'effectScatter',
        //         coordinateSystem: 'geo',
        //         zlevel: 2,
        //         rippleEffect: {
        //             brushType: 'stroke'
        //         },
        //         label: {
        //             normal: {
        //                 show: true,
        //                 position: 'right',
        //                 formatter: '{b}'
        //             }
        //         },
        //         symbolSize: function (val) {
        //             if(val[2]>200) {
        //                 return 20;
        //             }
        //             // return val[2] / 4;
        //         },
        //         itemStyle: {
        //             normal: {
        //                 color: ['#0091f4'],
        //             }
        //         },
        //         data: data.data.map(function (dataItem) {
        //             var item = geoCoordMap[dataItem.name];
        //             if(item==null) {
        //                 return false;
        //             }
        //             return {
        //                 name: dataItem.name,
        //                 value: geoCoordMap[dataItem.name].concat([dataItem.value])
        //             };
        //         })
        //     }]
        // }
    };

    function actionEcharts(chart, options, form, status) {
        chart.hideLoading();
        if (options.series[0].data.length === 0) {
            form.append('<div class="noDataCover"><div class="noDataText">暂无数据</div></div>');
        } else {
            chart.setOption(options);
        }
    }

    function actionEchartsBefore(form) {
        form.find('.noDataCover').remove();
        form.data('chart').showLoading();
    }

    // 地图的表格拼接
    function MapHTMLstitching(data, form) {
        var html = '';
        $.each(data.data, function(key, value) {
            html += '<tr><td>' + value.name + '</td><td>' + value.value.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td></tr>';
        });
        form.find('tbody').html(html);
    }

    // 地图下面的进度条表格拼接
    function MapProgressHTMLstitching(data, form) {
        var html = '';
        $.each(data.data, function(key, value) {
            html += '<tr><td>' + value.name + '</td><td>' + value.value.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',') + '</td><td><div class="progress active progress-xs"><div class="progress-bar progress-bar-primary" style="width: ' + value.persent + '%;"></div></div></td><td><span class="badge bg-light-blue">' + value.persent + '%</span></td></tr>';
        });
        form.find('tbody').html(html);
    }

    $.sub('formLine', function(e, res, form) {
        var chart = form.data('chart');
        var chartData = $.extend(true, {}, options.line, res.data);
        actionEcharts(chart, chartData, form);
    });

    $.sub('formMap', function(e, data, form) {
        var chart = form.data('chart');

        if (data.data != null) {
            // 取出数组中最大值 
            Array.max = function(array) { return Math.max.apply(Math, array); };
            // 取出数组中最小值 
            Array.min = function(array) { return Math.min.apply(Math, array); };
            var arr = [];
            $.each(data.data, function(key, value) {
                arr.push(value.value);
            });
            options.map.visualMap.max = Array.max(arr);
            options.map.visualMap.min = Array.min(arr);
            MapHTMLstitching(data, $('.J-MapTable'));
            if (data.progress != undefined) {
                MapProgressHTMLstitching(data.progress.sex, $('.box-div-sex'));
                MapProgressHTMLstitching(data.progress.mobileType, $('.box-div-mobileType'));
                $('.total').text(data.total.replace(/\B(?=(?:\d{3})+\b)/g, ','));
            }
            options.map.series[0].data = data.data;
        }
        actionEcharts(chart, options.map, form);
    });

    $('#formLine').IUI("ajaxForm", {
        trigger: 'submit.echarts',
        before: function() {
            var $this = $(this);
            actionEchartsBefore($this);
        },
        success: function(response, config) {
            if(response.status) {
                var $this = $(this);
                $.pub("formLine", [response, $this]);
            }
        }
    });

    $('#formMap').IUI('ajaxForm', {
        trigger: 'submit.echarts',
        before: function() {
            var $this = $(this);
            actionEchartsBefore($this);
        },
        success: function(response, config) {
            if(response.status) {
                var $this = $(this);
                MapData = response;
                $.pub("formMap", [MapData.data.series[0], $this]);
            } else {
                actionEcharts($formMap.data('chart'), options.map, $formMap);
            }
        }
    });

    // 循环每个表单触发提交、初始化echarts
    $('.J-chartForm').each(function(index, form) {
        var $form = $(form);
        var target = $form.find('.chart-content')[0];
        $form.data('chart', echarts.init(target));
        $form.trigger('submit.echarts');
    });

    $(window).on('resize', function(event) {
        $('.J-chartForm').each(function(index, el) {
            var chart = $(el).data('chart');
            if (chart) {
                chart.resize();
            }
        });
    });

    $('.J-MapType').on('click', 'button', function() {
        var $this = $(this);
        var type = $this.data('type');
        $this.addClass('active').siblings().removeClass('active');
        if (type !== undefined) {
            $formMap.data('chart').showLoading();
            $.pub("formMap", [MapData.data.series[type], $formMap]);
        }
    });

    $('.J-MapOption').on('click', 'button', function(event) {
        event.preventDefault();

        var $this = $(this);
        var name = $this.data('name');
        var value = $this.data('value');
        var oldValue = $formMap.find('[name="' + name + '"]').val();
        $formMap.find('[name="' + name + '"]').val(value);
        $this.addClass('active').siblings().removeClass('active');

        if (oldValue !== value) {
            $formMap.trigger('submit');
        }
    });

}());

/***/ }),
/* 46 */
/***/ (function(module, exports) {

;(function(){

    $.sub('json_select',function(e, res, form, select){
        var id = form.val();
        select.html(jsonToSelect(res[id]));
    });

    function jsonToSelect(json) {
        var _html = '';
        _html = '<select>';
        $.each(json,function(key, value) {
            _html += '<option value="'+key+'">' + value + '</option>';
        });
        _html += '</select>';
        return _html;
    }

    // Usage method
    // $('#plan-plan_type').on("change",function(){
    //     var _this = $(this);
    //     $.pub('json_select',[typeName,_this,$('#plan-type_name')]);
    // });
    
}());

/***/ }),
/* 47 */
/***/ (function(module, exports) {

;
(function() {

    // $('.tipsbox').on('mouseover', function() {
    //     var $this = $(this);
    //     $this.children('.tipsbox-content').show();
    // });

    // $('.tipsbox').on('mouseleave', function() {
    //     var $this = $(this);
    //     $this.children('.tipsbox-content').hide();
    // });

    $(document).on('click', function(event) {
        var $this = $(event.target);
        if ($this.hasClass('tipsbox-trigger') && $this.siblings('.tipsbox-content').hasClass('tipsbox-hidden')) {
            $('.tipsbox-content').addClass('tipsbox-hidden fade-leave').removeClass('fade-enter');
            $this.siblings('.tipsbox-content').removeClass('tipsbox-hidden fade-leave').addClass('fade-enter');

            // 边缘检测
            if ($this.siblings('.tipsbox-content').offset().top + $this.siblings('.tipsbox-content').height() - $this.parents('.table-wrap').offset() ? $this.parents('.table-wrap').offset().top : 0 > $this.parents('.table-wrap').height() && $this.siblings('.tipsbox-content').height() > 38) {
                $this.siblings('.tipsbox-content').addClass('tipsbox-end');
            }
        } else {
            $('.tipsbox-content').addClass('tipsbox-hidden fade-leave').removeClass('fade-enter');
        }
    });

    // $('.tipsbox-content').on('click', function(event) {
    //     if(!($(event.target).hasClass('btn-confirm')||$(event.target).hasClass('btn-close'))) {
    //         event.stopPropagation();
    //     }
    // });

    // $('.btn-all').on('click', function() {
    //     var $this = $(this);
    //     var $context = $this.parents('[role="document"]');
    //     $context.find('.checkbox label').find('input').prop('checked', true);
    // });

    // $('.btn-rever').on('click', function() {
    //     var $this = $(this);
    //     var $context = $this.parents('[role="document"]');
    //     $.each($context.find('.checkbox label').find('input'), function(index, el) {
    //         $(el).prop('checked', !el.checked);
    //     });
    // });

}());

/***/ }),
/* 48 */
/***/ (function(module, exports) {

;
(function() {

    if (!$('.owl-carousel').length) {
        return;
    }

    $('.owl-carousel').owlCarousel({
        // margin: 30,
        nav: true,
        navText: ['<', '>'],
        responsive: {
            // 0: {
            //     items: 1
            // },
            // 600: {
            //     items: 3
            // },
            1000: {
                items: 6
            }
        }
    });

}());

;
(function() {

    if (!$('.owlSimple').length) {
        return;
    }

    function owlSimple(options) {
        var $this = $('.owlSimple');
        var pageIndex = 1;
        var maxLength = Math.ceil($('.owlSimple').find('li').length / options.items);
        $this.attr('data-pageIndex', pageIndex);
        $this.find('li').css({
            width: 100 / options.items + '%'
        });
        $this.find('li').css('display', 'none');
        for (var i = 0; i < options.items; i++) {
            $this.find('li').eq(i).css('display', 'block');
        }

        $this.find('.next').on('click', function() {
            if (pageIndex < maxLength) {
                pageIndex += 1;
                $this.attr('data-pageIndex', pageIndex);
                var index = $this.attr('data-pageIndex');

                $this.find('li').css('display', 'none');
                for (var j = 0; j < options.items; j++) {
                    $this.find('li').eq(j + options.items * (index - 1)).css('display', 'block');
                }
            }

        });
        $this.find('.prev').on('click', function() {
            if (pageIndex > 1) {
                pageIndex -= 1;
                $this.attr('data-pageIndex', pageIndex);
                var index = $this.attr('data-pageIndex');

                $this.find('li').css('display', 'none');
                for (var j = 0; j < options.items; j++) {
                    $this.find('li').eq(j + options.items * (index - 1)).css('display', 'block');
                }
            }
        });
    }

    owlSimple({
        items: 7
    });

    $('.owlSimple').find('li').on('click', function() {
        var $this = $(this);
        var type = $this.data('type');
        if (type !== undefined && !$this.hasClass('active')) {
            $('#formLine').find('[name="type"]').val(type);
            $('#formLine').trigger('submit.echarts');
        }
        $this.addClass('active').find('.fa-check-circle-o').removeClass('fa-check-circle-o').addClass('fa-check-circle');
        $this.siblings().removeClass('active').find('.fa-check-circle').removeClass('fa-check-circle').addClass('fa-check-circle-o');
    });


}());

/***/ }),
/* 49 */
/***/ (function(module, exports) {

;
(function() {

    if(!$('.bootstrap-date').length && !$('.bootstrap-date-month').length) {
        return;
    }

    var month = {
        '-1': '十一月',
        '0': '十二月',
        '1': '一月',
        '2': '二月',
        '3': '三月',
        '4': '四月',
        '5': '五月',
        '6': '六月',
        '7': '七月',
        '8': '八月',
        '9': '九月',
        '10': '十月',
        '11': '十一月',
        '12': '十二月'
    }

    var THeMonthBeforeLast = month[moment().month() - 1];
    var LastMonth = month[moment().month()];
    var CurrentMonth = month[moment().month() + 1];
    var obj = {};
    obj[THeMonthBeforeLast] = [moment([moment().years(), 0, 1]).month(moment().month() - 2), moment([moment().years(), 0, 31]).month(moment().month() - 2)];
    obj[LastMonth] = [moment([moment().years(), 0, 1]).month(moment().month() - 1), moment([moment().years(), 0, 31]).month(moment().month() - 1)];
    obj[CurrentMonth] = [moment([moment().years(), moment().month(), 1]), moment().subtract('days', 1)];

    // 填充时间
    $('[data-name="today"]').attr('data-value',moment().format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
    $('[data-name="yesterday"]').attr('data-value',moment().subtract('days', 1).format('YYYY-MM-DD') + ' 至 ' + moment().subtract('days', 1).format('YYYY-MM-DD'));
    $('[data-name="sevenday"]').attr('data-value',moment().subtract('days', 6).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
    $('[data-name="thirtyday"]').attr('data-value',moment().subtract('days', 29).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));

    $('[data-name="THeMonthBeforeLast"]').text(THeMonthBeforeLast).attr('data-value', moment([moment().years(), 0, 1]).month(moment().month() - 2).format('YYYY-MM-DD') + ' 至 ' + moment([moment().years(), 0, 31]).month(moment().month() - 2).format('YYYY-MM-DD'));
    $('[data-name="LastMonth"]').text(LastMonth).attr('data-value', moment([moment().years(), 0, 1]).month(moment().month() - 1).format('YYYY-MM-DD') + ' 至 ' + moment([moment().years(), 0, 31]).month(moment().month() - 1).format('YYYY-MM-DD'));
    $('[data-name="CurrentMonth"]').text(CurrentMonth).attr('data-value', moment([moment().years(), moment().month(), 1]).format('YYYY-MM-DD') + ' 至 ' + moment().subtract('days', 1).format('YYYY-MM-DD'));

    function activeTime (val) {
        var $btn = $('[data-value="'+ val +'"]');
        $('.btn-time').children().removeClass('btn-primary').addClass('btn-default');
        if($btn.length === 0) {
            $('[data-name="custom"]').removeClass('btn-default').addClass('btn-primary');
        } else {
            $btn.removeClass('btn-default').addClass('btn-primary');
        }
    }

    activeTime($('.bootstrap-date').val());

    $.each($('.bootstrap-date'), function() {
        var $this = $(this);
        $this.daterangepicker({
            // autoApply:true,
            autoUpdateInput: false,
            ranges: {
                //'最近1小时': [moment().subtract('hours',1), moment()],
                '今日': [moment().startOf('day'), moment().endOf('day')],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                '最近7日': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
                '最近30日': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')]
            },
            // timePicker: true,
            // timePicker24Hour: true,
            // timePickerIncrement: 30,
            locale: {
                // format: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DD',
                applyLabel: '确定',
                cancelLabel: '清除',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 0,
                separator: ' 至 '
            },
            opens: 'left',
            singleDatePicker: $this.attr('data-singleDatePicker') ? true : false
        });
    });

    $.each($('.bootstrap-date-month'), function() {
        var $this = $(this);
        $this.daterangepicker({
            // autoApply:true,
            autoUpdateInput: false,
            ranges: obj,
            // timePicker: true,
            // timePicker24Hour: true,
            // timePickerIncrement: 30,
            locale: {
                // format: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DD',
                applyLabel: '确定',
                cancelLabel: '清除',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 0,
                separator: ' 至 '
            },
            opens: 'left',
            singleDatePicker: $this.attr('data-singleDatePicker') ? true : false
        });
    });

    // 选择组件上选择时间的回调函数
    $('.bootstrap-date, .bootstrap-date-month').on('apply.daterangepicker', function(ev, picker) {
        var $this = $(this);
        if ($this.attr('data-singleDatePicker')) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        } else if (!$this.hasClass('single')) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' 至 ' + picker.endDate.format('YYYY-MM-DD'));
            activeTime(picker.startDate.format('YYYY-MM-DD') + ' 至 ' + picker.endDate.format('YYYY-MM-DD'));
        }
        $('.form-time').trigger('submit');
    });
    $('.bootstrap-date, .bootstrap-date-month').on('cancel.daterangepicker', function(ev, picker) {
        var $this = $(this);
        $this.val('');
    });

    // 表单外围填值、提示
    $('.btn-time').find('button').on('click', function(event) {
        var $this = $(event.target);
        $('.bootstrap-date, .bootstrap-date-month').val($this.attr('data-value'));
        $('.btn-time').children().removeClass('btn-primary').addClass('btn-default');
        $this.removeClass('btn-default').addClass('btn-primary');
        $('.form-time').trigger('submit');
    });

}());

/***/ }),
/* 50 */
/***/ (function(module, exports) {

;
(function ($, window) {

    function multiCheck(config) {

        var defaults = {
            container: 'body',
            dataType: '',
            confirmCall: function() {}
        };

        this.config = $.extend(defaults, config);

        this.init();
        this.event();

    }

    multiCheck.prototype.init = function() {
        var self = this;
        self.wrapItems();
        self.buildControls();
        self.buildButtons();
    };

    multiCheck.prototype.wrapItems = function() {
        var self = this;
        var config = self.config;
        var DATA = config.dataType;
        var html = self.htmlCityGenerate(DATA) || '';
        var title = '城市限制';
        self.$multiCheck = $('<div/>', {
            'class': 'multiCheck'
        });
        self.$header = $('<div/>', {
            'class': 'multiHeader',
            'html': '<h4>' + title + '</h4>'
        });
        self.$body = $('<div/>', {
            'class': 'multiBody'
        });
        self.$multiBox =$('<div/>', {
            'class': 'multiBox',
            'html':  html
        });
        self.$footer = $('<div/>', {
            'class': 'multiFooter'
        });
        $(config.container).append(self.$multiCheck);
        self.$multiCheck.append(self.$header);
        self.$multiCheck.append(self.$body);
        self.$multiCheck.append(self.$footer);
        self.$body.append(self.$multiBox);
    };

    /*===========生成 省市 html============*/
    multiCheck.prototype.htmlCityGenerate = function (data) {
        var self = this;
        var _str = '';
        var _letter=[];
        $.each(data, function(key, val) {
            if (val.parentId === '100000') {
                var lv2Str = '';

                $.each(data, function(key2, val2) {
                    if (val2.parentId === val.id) {
                        lv2Str += '<label class="lv-2"><input type="checkbox" data-pid="' + val2.parentId + '" data-name="' + val2.shortName + '" data-value="' + val2.id + '" data-letter="'+ val2.letter+'">' + val2.shortName + '</label>';
                        _letter.push(val2.letter);
                    }
                });

                _str += '<div class="checkbox"><label class="lv-1"><input type="checkbox" data-name="' + val.shortName + '" data-value="' + val.id + '" data-letter="'+ val.letter+'">' + val.shortName + '</label>' + lv2Str + '</div>';
                _letter.push(val.letter);
            }

        });

        _str = self.htmlLetter(_letter)+_str;

        return _str;
    };

    /*===========拼接letter html============*/
    multiCheck.prototype.htmlLetter = function(str) {
        var self = this;
        var templeArr = [];
        var arr = [];
        var _html = '';
        $.each(str, function(index, val) {
            if(!templeArr[val]&&val){
                arr.push(val);
                templeArr[val]=true;
            }
        });
        arr=arr.sort();
        $.each(arr, function(index, val) {
            _html += '<span>'+val+'</span>';
        });
        return '<div class="letterBox"><span role="showAllLetter">全部</span>'+_html+'</div>';
    };

    // 检查JSON (输出 已选择的值的数组
    multiCheck.prototype.checkedToJson = function () {
        var self = this;
        var data = self.$multiBox.find('input:checked');
        var globalArr = [];
        if (data.length === 0) {
            return '';
        }

        data.each(function(index, el) {
            var $el = $(el);
            var _pid = $el.attr('data-value');
            var tmpStr = '';
            var tmpArr = [];
            var tmpArr2 = self.$multiBox.find('input[data-pid="' + _pid + '"]:checked');

            tmpStr += '\"' + _pid + '\":[';

            if ($el.data('pid') === undefined) {
                $.each(tmpArr2, function(index2, el2) {
                    tmpArr.push(parseInt($(el2).data('value'), 10));
                });
                tmpStr += tmpArr.join(',');
                tmpStr += ']';
                globalArr.push(tmpStr);
            }
        });

        return '{' + globalArr.join(',') + '}';
    };

    //转换 名字 (输出 目前选择的选项的名字
    multiCheck.prototype.convertName = function () {
        var self = this;
        var config = self.config;
        var total = self.$multiBox.find('.lv-2').length;
        var _arr = [];
        $.each(self.$multiBox.find('.lv-2 input:checked'), function(index, el) {
            _arr.push($(el).data('name'));
        });

        return _arr.length === total ? (config === 'tag' ? '所有标签' : '所有城市') : (_arr.length > 14 ? _arr.slice(0, 15).join(';') + ' ...' : _arr.join(';'));
    };

    // 初始化 (输入页面已有数据,目标  保存目标到self  选择输入数据的选项
    multiCheck.prototype.initialization = function (data, $target) {
        var self = this;
        self.$target = $target;
        self.$clearAll.trigger('click');
        if (!data) {
            return false;
        }
        var initData = $.parseJSON(data);
        $.each(initData, function(key, val) {
            $.each(val, function(key2, val2) {
                var $target = self.$multiBox.find('.lv-2').find('input[data-value="' + val2 + '"]');
                $target.prop('checked', true).trigger('change');
            });
        });
    };

    /*===========反向选择============*/
    multiCheck.prototype.operateReverse = function (el) {
        var self = this;
        $.each(el, function(index, el) {
            $(el).prop('checked', !el.checked);
        });
        $.each(self.$multiBox.find('.lv-1'), function(index, _el) {
            var isChecked = $(_el).siblings('.lv-2').find('input:checked').length ? true : false;
            $(_el).find('input').prop('checked', isChecked);
        });
    };

    /*===========二级全空============*/
    multiCheck.prototype.isAllUnChecked = function (obj) {
        var len = obj.find('.lv-2 input').length;
        return obj.find('.lv-2 input').not(':checked').length === len ? true : false;
    };

    /*===========拼音匹配============*/
    multiCheck.prototype.matchLetter = function (el, $parent) {
        var templeArr = [];
        var letter = el.text();
        var $lv1 = $parent.find('.lv-1 input');
        $parent.find('.checkbox label').removeClass('hide');
        /*===========显示全部============*/
        if(el.attr('role')==='showAllLetter'){
            return false;
        }
        /*===========匹配省份============*/
        $.each($lv1,function(index, _el) {
            var _letter=$(_el).data('letter');
            if(letter!=_letter){
                templeArr.push($(_el));
            }
        });
        /*===========遍历不匹配的省份============*/
        $.each(templeArr,function(index, _el) {
            var isChecked=false;
            var $lv2=_el.parents('.checkbox').find('.lv-2 input');
            $.each($lv2,function(index, _el) {
                var _letter=$(_el).data('letter');
                if(letter===_letter){
                    isChecked=true;
                }else{
                    $(_el).parents('.lv-2').addClass('hide');
                }
            });
            if(!isChecked){
                _el.parents('.lv-1').addClass('hide');
            }
        });
    };

    multiCheck.prototype.buildControls = function() {
        var self = this;
        self.$selectAll = $('<label/>',{
            'role': 'selectAll',
            'html': '<input type="checkbox" id="selectAll">全选'
        });
        self.$selectReverse = $('<label/>', {
            'role': 'selectReverse',
            'html': '<input type="checkbox" id="selectReverse">反选'
        });
        self.$clearAll = $('<a/>',{
            'role': 'clearAll',
            'html': '全部清空',
            'href': 'javascript:;'
        });
        self.$header.append(self.$clearAll);
        self.$header.append(self.$selectReverse);
        self.$header.append(self.$selectAll);
    };

    multiCheck.prototype.buildButtons = function() {
        var self = this;
        self.$confirm = $('<button/>', {
            'role': 'confirm',
            'class': 'btn-confirm',
            'html': '保存'
        });
        self.$cancel = $('<button/>', {
            'class': 'btn-close',
            'html': '返回'
        });
        self.$footer.append(self.$confirm);
        self.$footer.append(self.$cancel);
    };

    multiCheck.prototype.event = function() {
        var self = this;
        var config = self.config;
        /*===========全选============*/
        self.$selectAll.on('click',function(event){
            self.$multiBox.find('.checkbox label').not('.hide').find('input').prop('checked', true);
        });
        /*===========反选============*/
        self.$selectReverse.on('change', function(event) {
            self.operateReverse(self.$multiBox.find('.lv-2').not('.hide').find('input'));
        });
        /*===========全部清空============*/
        self.$clearAll.on('click', function(event) {
            event.preventDefault();
            self.$multiCheck.find('input:checkbox').prop('checked',false);
        });
        /*===========点击拼音匹配城市============*/
        self.$multiBox.on('click', '.letterBox span', function(event) {
            $(this).addClass('active').siblings('span').removeClass('active');
            self.matchLetter($(this), self.$multiBox);
        });
        /*===========点击一级============*/
        self.$multiBox.on('change', '.lv-1 input', function(event) {
            var $context = $(this).parents('.checkbox');
            var $inputs = $context.find('.lv-2').not('.hide').find('input');
            $inputs.prop('checked', this.checked);

        });
        /*===========点击二级============*/
        self.$multiBox.on('change', '.lv-2 input', function(event) {
            var $context = $(this).parents('.checkbox');
            var $parent = $context.find('.lv-1 input');
            if (this.checked) {
                $parent[0].checked = true;
            }
            if (self.isAllUnChecked($context)) {
                $parent[0].checked = false;
            }
        });
        /*===========保存============*/
        self.$confirm.on('click', function(event) {
            if(self.$target!==undefined) {
                var $target = self.$target;
                var $name = self.convertName();
                var $value = self.checkedToJson();
                config.confirmCall($target,$name,$value);
            }
        });
    };

    //-----------工厂模式-------------//
    $.fn.multiCheck = function(config) {
        return new multiCheck(config);
    };

})(jQuery, window);

/***/ }),
/* 51 */
/***/ (function(module, exports) {

(function() {

  // 创建弹层
  // var dynamicLayer = $.fn.layer({
  //   id: '#dynamicLayer',
  //   vertical: false,
  //   cache: true,
  //   successCall: function(res) {
  //     this.find('.layer-content').html(res);
  //     $.pub('dynamicShow', [this]);
  //   },
  //   confirmCall: function(e, target, deferred) {
  //     this.find('form').trigger('submit');
  //     deferred.hideLayer();
  //   }
  // });

  $('[data-trigger="dynamic"]').on('click', function(event) {
    var $this = $(this);
    dynamicLayer.ajaxLoad($this.attr('data-url'));
  });

  // Usage method
  // <div class="layer-box hide" id="dynamicLayer" data-width="800" data-method="get" data-datatype="html">
  //     <div class="layer-content"></div>
  // </div>

}());

(function() {

  if ($('#fieldLayer').length === 0) {
    return;
  }

  var fieldLayer = $.fn.layer({
    id: '#fieldLayer',
    vertical: false,
    cache: true,
    confirmCall: function(deferred) {
      deferred.hideLayer();
    }
  });

  $('[data-trigger="fieldLayer"]').on('click', function(event) {
    var $this = $(this);
    fieldLayer.showLayer();
  });

}());

/***/ }),
/* 52 */
/***/ (function(module, exports) {

;
(function() {

    var $multiCheckInput = $('.multiCheckInput');

    if ($multiCheckInput.length === 0) {
        return;
    }

    var layerCity = $.fn.layer({
        id: '#layerCity',
        vertical: false,
        cache: true,
        offsetWidth: '800',
        offsetHeight: '100%',
        confirmCall: function(deferred) {
            deferred.hideLayer();
        }
    });

    var multiCheck = $.fn.multiCheck({
        container: '#layerCity .layer-content',
        dataType: cityData,
        confirmCall: function(target, name, value) {
            target.find('[role="text"]').val(value);
            target.find('[role="name"]').val(name);
        }
    });

    $('body').on('click', '.multiCheckInput', function(event) {
        event.preventDefault();
        var $text = $(this).find('[role="text"]');
        multiCheck.initialization($text.val(), $(this));
        layerCity.showLayer();
    });

    // 填充默认值
    $.each($('.multiCheckInput').find('[role="text"]'), function(index, value) {
        var $this = $(this);

        if($this.val() === '') {
            return;
        }

        var $value = $.parseJSON($this.val());
        var _arr = [];

        $.each($value, function(key, val) {
            $.each(val, function(key2, val2) {
                $.each(cityData, function(index, item) {
                    if (parseInt(item.id) === val2) {
                        _arr.push(item.name);
                    }
                })
            });
        });
        $this.siblings('[role="name"]').val(_arr.join(';'));
    });

}());

/***/ }),
/* 53 */
/***/ (function(module, exports) {

;
(function() {

    var $form = $('#formLine');

    $('.btn-list-delete').on('click', function(event) {
        var $this = $(this);
        var _url = $this.attr('data-url');
        var tips = $this.data('tips') || '您是否要删除这条记录';
        $.alert({
            title: '',
            content: tips,
            type: 'confirm',
            confirm: function(deferred) {
                $.loading(true, true);
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        "_csrf": $('meta[name="csrf-token"]').attr('content')
                    }
                }).fail(function(err) {
                    $.loading(false);
                    if ($.inArray(parseInt(err.status), [302, 200]) === -1) {
                        var res = $.parseJSON(err.responseText);
                        if (!res.status) {
                            $.tip({
                                text: res.info,
                                timeout: 2000,
                                status: false
                            });
                        }
                    }
                });
                deferred.hideAlert();
            }
        });
        return false;
    });

    // $('.J-search').on('submit', function(event) {
    //     event.preventDefault();
    //     var $this = $(this);
    //     var $val = $this.find('.bootstrap-date').val();

    //     $('#formLine').find('[name="range"]').val($val);
    //     $('#formLine').trigger('submit.echarts');
    // });

}());

/***/ })
/******/ ]);