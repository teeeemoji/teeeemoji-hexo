(function () {
    window.lsloader = {jsRunSequence: [], jsnamemap: {}, cssnamemap: {}};
    lsloader.removeLS = function (key) {
        try {
            localStorage.removeItem(key)
        } catch (e) {
        }
    };
    lsloader.setLS = function (key, val) {
        try {
            localStorage.setItem(key, val)
        } catch (e) {
        }
    };
    lsloader.getLS = function (key) {
        var val = "";
        try {
            val = localStorage.getItem(key)
        } catch (e) {
            val = ""
        }
        return val
    };
    versionString = "/*" + (window.materialVersion || "unknownVersion") + "*/";
    lsloader.clean = function () {
        try {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i))
            }
            keys.forEach(function (key) {
                var data = lsloader.getLS(key);
                if (window.oldVersion) {
                    var remove = window.oldVersion.reduce(function (p, c) {
                        return p || data.indexOf("/*" + c + "*/") !== -1
                    }, false);
                    if (remove) {
                        lsloader.removeLS(key)
                    }
                }
            })
        } catch (e) {
        }
    };
    lsloader.clean();
    lsloader.load = function (jsname, jspath, cssonload, isJs) {
        if (typeof cssonload === "boolean") {
            isJs = cssonload;
            cssonload = undefined
        }
        isJs = isJs || false;
        cssonload = cssonload || function () {
            };
        var code;
        code = this.getLS(jsname);
        if (code && code.indexOf(versionString) === -1) {
            this.removeLS(jsname);
            this.requestResource(jsname, jspath, cssonload, isJs);
            return
        }
        if (code) {
            var versionNumber = code.split(versionString)[0];
            if (versionNumber != jspath) {
                console.log("reload:" + jspath);
                this.removeLS(jsname);
                this.requestResource(jsname, jspath, cssonload, isJs);
                return
            }
            code = code.split(versionString)[1];
            if (isJs) {
                this.jsRunSequence.push({name: jsname, code: code});
                this.runjs(jspath, jsname, code)
            } else {
                document.getElementById(jsname).appendChild(document.createTextNode(code));
                cssonload()
            }
        } else {
            this.requestResource(jsname, jspath, cssonload, isJs)
        }
    };
    lsloader.requestResource = function (name, path, cssonload, isJs) {
        var that = this;
        if (isJs) {
            this.iojs(path, name, function (path, name, code) {
                that.setLS(name, path + versionString + code);
                that.runjs(path, name, code)
            })
        } else {
            this.iocss(path, name, function (code) {
                document.getElementById(name).appendChild(document.createTextNode(code));
                that.setLS(name, path + versionString + code)
            }, cssonload)
        }
    };
    lsloader.iojs = function (path, jsname, callback) {
        var that = this;
        that.jsRunSequence.push({name: jsname, code: ""});
        try {
            var xhr = new XMLHttpRequest;
            xhr.open("get", path, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        if (xhr.response != "") {
                            callback(path, jsname, xhr.response);
                            return
                        }
                    }
                    that.jsfallback(path, jsname)
                }
            };
            xhr.send(null)
        } catch (e) {
            that.jsfallback(path, jsname)
        }
    };
    lsloader.iocss = function (path, jsname, callback, cssonload) {
        var that = this;
        try {
            var xhr = new XMLHttpRequest;
            xhr.open("get", path, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        if (xhr.response != "") {
                            callback(xhr.response);
                            cssonload();
                            return
                        }
                    }
                    that.cssfallback(path, jsname, cssonload)
                }
            };
            xhr.send(null)
        } catch (e) {
            that.cssfallback(path, jsname, cssonload)
        }
    };
    lsloader.iofonts = function (path, jsname, callback, cssonload) {
        var that = this;
        try {
            var xhr = new XMLHttpRequest;
            xhr.open("get", path, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        if (xhr.response != "") {
                            callback(xhr.response);
                            cssonload();
                            return
                        }
                    }
                    that.cssfallback(path, jsname, cssonload)
                }
            };
            xhr.send(null)
        } catch (e) {
            that.cssfallback(path, jsname, cssonload)
        }
    };
    lsloader.runjs = function (path, name, code) {
        if (!!name && !!code) {
            for (var k in this.jsRunSequence) {
                if (this.jsRunSequence[k].name == name) {
                    this.jsRunSequence[k].code = code
                }
            }
        }
        if (!!this.jsRunSequence[0] && !!this.jsRunSequence[0].code && this.jsRunSequence[0].status != "failed") {
            var script = document.createElement("script");
            script.appendChild(document.createTextNode(this.jsRunSequence[0].code));
            script.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(script);
            this.jsRunSequence.shift();
            if (this.jsRunSequence.length > 0) {
                this.runjs()
            }
        } else if (!!this.jsRunSequence[0] && this.jsRunSequence[0].status == "failed") {
            var that = this;
            var script = document.createElement("script");
            script.src = this.jsRunSequence[0].path;
            script.type = "text/javascript";
            this.jsRunSequence[0].status = "loading";
            script.onload = function () {
                that.jsRunSequence.shift();
                if (that.jsRunSequence.length > 0) {
                    that.runjs()
                }
            };
            document.body.appendChild(script)
        }
    };
    lsloader.tagLoad = function (path, name) {
        this.jsRunSequence.push({name: name, code: "", path: path, status: "failed"});
        this.runjs()
    };
    lsloader.jsfallback = function (path, name) {
        if (!!this.jsnamemap[name]) {
            return
        } else {
            this.jsnamemap[name] = name
        }
        for (var k in this.jsRunSequence) {
            if (this.jsRunSequence[k].name == name) {
                this.jsRunSequence[k].code = "";
                this.jsRunSequence[k].status = "failed";
                this.jsRunSequence[k].path = path
            }
        }
        this.runjs()
    };
    lsloader.cssfallback = function (path, name, cssonload) {
        if (!!this.cssnamemap[name]) {
            return
        } else {
            this.cssnamemap[name] = 1
        }
        var link = document.createElement("link");
        link.type = "text/css";
        link.href = path;
        link.rel = "stylesheet";
        link.onload = link.onerror = cssonload;
        var root = document.getElementsByTagName("script")[0];
        root.parentNode.insertBefore(link, root)
    };
    lsloader.runInlineScript = function (scriptId, codeId) {
        var code = document.getElementById(codeId).innerText;
        this.jsRunSequence.push({name: scriptId, code: code}
        );
        this.runjs()
    };
    lsloader.loadCombo = function (jslist) {
        var updateList = "";
        var requestingModules = {};
        for (var k in jslist) {
            var LS = this.getLS(jslist[k].name);
            if (!!LS) {
                var version = LS.split(versionString)[0];
                var code = LS.split(versionString)[1]
            } else {
                var version = ""
            }
            if (version == jslist[k].path) {
                this.jsRunSequence.push({name: jslist[k].name, code: code, path: jslist[k].path})
            } else {
                this.jsRunSequence.push({
                    name: jslist[k].name,
                    code: null,
                    path: jslist[k].path,
                    status: "comboloading"
                });
                requestingModules[jslist[k].name] = true;
                updateList += (updateList == "" ? "" : ";") + jslist[k].path
            }
        }
        var that = this;
        if (!!updateList) {
            var xhr = new XMLHttpRequest;
            xhr.open("get", combo + updateList, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        if (xhr.response != "") {
                            that.runCombo(xhr.response, requestingModules);
                            return
                        }
                    } else {
                        for (var i in that.jsRunSequence) {
                            if (requestingModules[that.jsRunSequence[i].name]) {
                                that.jsRunSequence[i].status = "failed"
                            }
                        }
                        that.runjs()
                    }
                }
            };
            xhr.send(null)
        }
        this.runjs()
    };
    lsloader.runCombo = function (comboCode, requestingModules) {
        comboCode = comboCode.split("/*combojs*/");
        comboCode.shift();
        for (var k in this.jsRunSequence) {
            if (!!requestingModules[this.jsRunSequence[k].name] && !!comboCode[0]) {
                this.jsRunSequence[k].status = "comboJS";
                this.jsRunSequence[k].code = comboCode[0];
                this.setLS(this.jsRunSequence[k].name, this.jsRunSequence[k].path + versionString + comboCode[0]);
                comboCode.shift()
            }
        }
        this.runjs()
    }
})();
