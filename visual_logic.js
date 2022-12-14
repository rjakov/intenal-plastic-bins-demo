/**
 * Generated by Verge3D Puzzles v.3.7.0
 * Sun Nov 20 2022 19:21:13 GMT+0200 (Восточная Европа, стандартное время)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};

// initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = false;
_initGlob.output.initOptions.preserveDrawBuf = false;
_initGlob.output.initOptions.useCompAssets = true;
_initGlob.output.initOptions.useFullscreen = true;

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var PROC = {
    
};

var cloned_obj_01, i, Size_01, Size_02, Size_03;



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




// show and hide puzzles
function changeVis(objSelector, bool) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
    }
}



// isObjectVisible puzzle
function isObjectVisible(objSelector) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        if (obj.visible)
            return true;
    }
    return false;
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, eventType, callback]);
    }
}



// loadScene puzzle
function loadScene(url, sceneName, loadCb, progCb, errorCb) {

    appInstance.unload();

    // clean object cache
    _pGlob.objCache = {};

    _pGlob.percentage = 0;
    appInstance.loadScene(url, function(loadedScene) {
        appInstance.enableControls();
        loadedScene.name = sceneName;

        _pGlob.percentage = 100;
        loadCb();
    }, function(percentage) {
        _pGlob.percentage = percentage;
        progCb();
    }, errorCb);
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



// cloneObject puzzle
function findUniqueObjectName(name) {
    function objNameUsed(name) {
        return Boolean(getObjectByName(name));
    }
    while (objNameUsed(name)) {
        var r = name.match(/^(.*?)(\d+)$/);
        if (!r) {
            name += "2";
        } else {
            name = r[1] + (parseInt(r[2], 10) + 1);
        }
    }
    return name;
}



// cloneObject puzzle
function cloneObject(objName) {
    if (!objName)
        return;
    var obj = getObjectByName(objName);
    if (!obj)
        return;
    var newObj = obj.clone();
    newObj.name = findUniqueObjectName(obj.name);
    appInstance.scene.add(newObj);
    return newObj.name;
}




/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && "v3d" in scene.userData && "coordSystem" in scene.userData.v3d) {
        return scene.userData.v3d.coordSystem;
    } else {
        // COMPAT: <2.17, consider replacing to 'Y_UP_RIGHT' for scenes with unknown origin
        return 'Z_UP_RIGHT';
    }
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();




function RotationInterface() {
    /**
     * For user manipulations use XYZ extrinsic rotations (which
     * are the same as ZYX intrinsic rotations)
     *     - Blender/Max/Maya use extrinsic rotations in the UI
     *     - XYZ is the default option, but could be set from
     *       some order hint if exported
     */
    this._userRotation = new v3d.Euler(0, 0, 0, 'ZYX');
    this._actualRotation = new v3d.Euler();
}

Object.assign(RotationInterface, {
    initObject: function(obj) {
        if (obj.userData.v3d.puzzles === undefined) {
            obj.userData.v3d.puzzles = {}
        }
        if (obj.userData.v3d.puzzles.rotationInterface === undefined) {
            obj.userData.v3d.puzzles.rotationInterface = new RotationInterface();
        }

        var rotUI = obj.userData.v3d.puzzles.rotationInterface;
        rotUI.updateFromObject(obj);
        return rotUI;
    }
});

Object.assign(RotationInterface.prototype, {

    updateFromObject: function(obj) {
        var SYNC_ROT_EPS = 1e-8;

        if (!this._actualRotation.equalsEps(obj.rotation, SYNC_ROT_EPS)) {
            this._actualRotation.copy(obj.rotation);
            this._updateUserRotFromActualRot();
        }
    },

    getActualRotation: function(euler) {
        return euler.copy(this._actualRotation);
    },

    setUserRotation: function(euler) {
        // don't copy the order, since it's fixed to ZYX for now
        this._userRotation.set(euler.x, euler.y, euler.z);
        this._updateActualRotFromUserRot();
    },

    getUserRotation: function(euler) {
        return euler.copy(this._userRotation);
    },

    _updateUserRotFromActualRot: function() {
        var order = this._userRotation.order;
        this._userRotation.copy(this._actualRotation).reorder(order);
    },

    _updateActualRotFromUserRot: function() {
        var order = this._actualRotation.order;
        this._actualRotation.copy(this._userRotation).reorder(order);
    }

});




// setObjTransform puzzle
function setObjTransform(objSelector, mode, x, y, z, offset) {

    var objNames = retrieveObjectNames(objSelector);

    function setObjProp(obj, prop, val) {
        if (!offset) {
            obj[mode][prop] = val;
        } else {
            if (mode != "scale")
                obj[mode][prop] += val;
            else
                obj[mode][prop] *= val;
        }
    }

    var inputsUsed = _pGlob.vec3Tmp.set(Number(x !== ''), Number(y !== ''),
            Number(z !== ''));
    var coords = _pGlob.vec3Tmp2.set(x || 0, y || 0, z || 0);

    if (mode === 'rotation') {
        // rotations are specified in degrees
        coords.multiplyScalar(v3d.Math.DEG2RAD);
    }

    var coordSystem = getCoordSystem();

    coordsTransform(inputsUsed, coordSystem, 'Y_UP_RIGHT', true);
    coordsTransform(coords, coordSystem, 'Y_UP_RIGHT', mode === 'scale');

    for (var i = 0; i < objNames.length; i++) {

        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
            // Blender/Max coordinates

            // need all the rotations for order conversions, especially if some
            // inputs are not specified
            var euler = eulerV3DToBlenderShortest(obj.rotation, _pGlob.eulerTmp);
            coordsTransform(euler, coordSystem, 'Y_UP_RIGHT');

            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            /**
             * convert from Blender/Max default XYZ extrinsic order to v3d XYZ
             * intrinsic with reversion (XYZ -> ZYX) and axes swizzling (ZYX -> YZX)
             */
            euler.order = "YZX";
            euler.reorder(obj.rotation.order);
            obj.rotation.copy(euler);

        } else if (mode === 'rotation' && coordSystem == 'Y_UP_RIGHT') {
            // Maya coordinates

            // Use separate rotation interface to fix ambiguous rotations for Maya,
            // might as well do the same for Blender/Max.

            var rotUI = RotationInterface.initObject(obj);
            var euler = rotUI.getUserRotation(_pGlob.eulerTmp);
            // TODO(ivan): this probably needs some reasonable wrapping
            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            rotUI.setUserRotation(euler);
            rotUI.getActualRotation(obj.rotation);
        } else {

            if (inputsUsed.x) setObjProp(obj, "x", coords.x);
            if (inputsUsed.y) setObjProp(obj, "y", coords.y);
            if (inputsUsed.z) setObjProp(obj, "z", coords.z);

        }

        obj.updateMatrixWorld(true);
    }

}



function matGetColors(matName) {
    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat)
        return [];

    if (mat.isMeshNodeMaterial)
        return Object.keys(mat.nodeRGBMap);
    else if (mat.isMeshStandardMaterial)
        return ['color', 'emissive'];
    else
        return [];
}



// setMaterialColor puzzle
function setMaterialColor(matName, colName, r, g, b, cssCode) {

    var colors = matGetColors(matName);

    if (colors.indexOf(colName) < 0)
        return;

    if (cssCode) {
        var color = new v3d.Color(cssCode);
        color.convertSRGBToLinear();
        r = color.r;
        g = color.g;
        b = color.b;
    }

    var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        if (mat.isMeshNodeMaterial) {
            var rgbIdx = mat.nodeRGBMap[colName];
            mat.nodeRGB[rgbIdx].x = r;
            mat.nodeRGB[rgbIdx].y = g;
            mat.nodeRGB[rgbIdx].z = b;
        } else {
            mat[colName].r = r;
            mat[colName].g = g;
            mat[colName].b = b;
        }
        mat.needsUpdate = true;

        if (appInstance.scene !== null) {
            if (mat === appInstance.scene.worldMaterial) {
                appInstance.updateEnvironment(mat);
            }
        }
    }
}



changeVis('Racks', false);
changeVis('Wall_Panels', false);
changeVis('Wire_Shelving', false);
changeVis('Rails', false);
changeVis('Bins_S1', false);
changeVis('Bins_S2', false);
changeVis('Bins_S3', false);
changeVis('Bins_Shelving_S1', false);
changeVis('Bins_Shelving_S2', false);
changeVis('Bins_Shelving_S3', false);
changeVis('Btn_dublicate_r_01', false);
changeVis('Btn_dublicate_r_02', false);
changeVis('Btn_dublicate_r_03', false);
changeVis('Btn2_dublicate_r_01', false);
changeVis('Btn2_dublicate_r_02', false);
changeVis('Btn2_dublicate_r_03', false);

eventHTMLElem('click', 'wall-panels', true, function(event) {
  loadScene('Plastic_Bins_Demo.gltf', 'Plastic_Bins_Demo.gltf', function() {
    changeVis('Wall_Panels', true);
    changeVis('Racks', false);
    changeVis('Wire_Shelving', false);
    changeVis('Rails', false);
    changeVis(['Bins_S1', 'Bins_S2', 'Bins_S3', 'Bins_Shelving_S1', 'Bins_Shelving_S2', 'Bins_Shelving_S3', 'Btn_dublicate_r_01', 'Btn_dublicate_r_02', 'Btn_dublicate_r_03', 'Btn2_dublicate_r_01', 'Btn2_dublicate_r_02', 'Btn2_dublicate_r_03'], false);
    if (isObjectVisible('Wall_Panels')) {
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_S1', true);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_S2', true);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_S3', false);
      });
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_Shelving_S1', false);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_Shelving_S2', false);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_Shelving_S3', false);
      });
    }
  }, function() {}, function() {});
});

eventHTMLElem('click', 'racks', true, function(event) {
  loadScene('Plastic_Bins_Demo.gltf', 'Plastic_Bins_Demo.gltf', function() {
    changeVis('Racks', true);
    changeVis('Wall_Panels', false);
    changeVis('Wire_Shelving', false);
    changeVis('Rails', false);
    changeVis(['Bins_S1', 'Bins_S2', 'Bins_S3', 'Bins_Shelving_S1', 'Bins_Shelving_S2', 'Bins_Shelving_S3', 'Btn_dublicate_r_01', 'Btn_dublicate_r_02', 'Btn_dublicate_r_03', 'Btn2_dublicate_r_01', 'Btn2_dublicate_r_02', 'Btn2_dublicate_r_03'], false);
    if (isObjectVisible('Racks')) {
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_S1', true);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_S2', true);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_S3', true);
      });
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_Shelving_S1', false);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_Shelving_S2', false);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_Shelving_S3', false);
      });
    }
  }, function() {}, function() {});
});

eventHTMLElem('click', 'wire-shelving', true, function(event) {
  loadScene('Plastic_Bins_Demo.gltf', 'Plastic_Bins_Demo.gltf', function() {
    changeVis('Wire_Shelving', true);
    changeVis('Wall_Panels', false);
    changeVis('Racks', false);
    changeVis('Rails', false);
    changeVis(['Bins_S1', 'Bins_S2', 'Bins_S3', 'Bins_Shelving_S1', 'Bins_Shelving_S2', 'Bins_Shelving_S3', 'Btn_dublicate_r_01', 'Btn_dublicate_r_02', 'Btn_dublicate_r_03', 'Btn2_dublicate_r_01', 'Btn2_dublicate_r_02', 'Btn2_dublicate_r_03'], false);
    if (isObjectVisible('Wire_Shelving')) {
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_Shelving_S1', true);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_Shelving_S2', true);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_Shelving_S3', true);
      });
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_S1', false);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_S2', false);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_S3', false);
      });
    }
  }, function() {}, function() {});
});

eventHTMLElem('click', 'rails', true, function(event) {
  loadScene('Plastic_Bins_Demo.gltf', 'Plastic_Bins_Demo.gltf', function() {
    changeVis('Rails', true);
    changeVis('Wire_Shelving', false);
    changeVis('Racks', false);
    changeVis('Wall_Panels', false);
    changeVis(['Bins_S1', 'Bins_S2', 'Bins_S3', 'Bins_Shelving_S1', 'Bins_Shelving_S2', 'Bins_Shelving_S3', 'Btn_dublicate_r_01', 'Btn_dublicate_r_02', 'Btn_dublicate_r_03', 'Btn2_dublicate_r_01', 'Btn2_dublicate_r_02', 'Btn2_dublicate_r_03'], false);
    if (isObjectVisible('Rails')) {
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_S1', true);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_S2', false);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_S3', false);
      });
      eventHTMLElem('click', 'size1', true, function(event) {
        changeVis('Bins_Shelving_S1', false);
      });
      eventHTMLElem('click', 'size2', true, function(event) {
        changeVis('Bins_Shelving_S2', false);
      });
      eventHTMLElem('click', 'size3', true, function(event) {
        changeVis('Bins_Shelving_S3', false);
      });
    }
  }, function() {}, function() {});
});

registerOnClick('Bins_S1', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_01', true);
}, function() {});
registerOnClick('Bins_S2', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_02', true);
}, function() {});
registerOnClick('Bins_S3', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_03', true);
}, function() {});

cloned_obj_01 = [];
registerOnClick('Btn_dublicate_r_01', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_01', false);
  for (i = 0.15; i <= 1.1; i += 0.15) {
    Size_01 = cloneObject('Bins_S1');
    setObjTransform(cloneObject(Size_01), 'position', i, '', '', true);
    cloned_obj_01.push(Size_01);
  }
}, function() {});
registerOnClick('Btn_dublicate_r_02', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_02', false);
  for (i = 0.22; i <= 1.1; i += 0.22) {
    Size_02 = cloneObject('Bins_S2');
    setObjTransform(cloneObject(Size_02), 'position', i, '', '', true);
    cloned_obj_01.push(Size_02);
  }
}, function() {});
registerOnClick('Btn_dublicate_r_03', false, false, [0,1,2], function() {
  changeVis('Btn_dublicate_r_03', false);
  for (i = 0.25; i <= 1.1; i += 0.25) {
    Size_03 = cloneObject('Bins_S3');
    setObjTransform(cloneObject(Size_03), 'position', i, '', '', true);
    cloned_obj_01.push(Size_03);
  }
}, function() {});

registerOnClick('Btn2_dublicate_r_01', false, false, [0,1,2], function() {
  for (i = 0.15; i <= 1.4; i += 0.15) {
    changeVis('Btn2_dublicate_r_01', false);
    Size_01 = cloneObject('Bins_Shelving_S1');
    setObjTransform(cloneObject(Size_01), 'position', i, '', '', true);
    cloned_obj_01.push(Size_01);
  }
}, function() {});
registerOnClick('Btn2_dublicate_r_02', false, false, [0,1,2], function() {
  changeVis('Btn2_dublicate_r_02', false);
  for (i = 0.22; i <= 1.4; i += 0.22) {
    Size_02 = cloneObject('Bins_Shelving_S2');
    setObjTransform(cloneObject(Size_02), 'position', i, '', '', true);
    cloned_obj_01.push(Size_02);
  }
}, function() {});
registerOnClick('Btn2_dublicate_r_03', false, false, [0,1,2], function() {
  changeVis('Btn2_dublicate_r_03', false);
  for (i = 0.3; i <= 1.2; i += 0.3) {
    Size_03 = cloneObject('Bins_Shelving_S3');
    setObjTransform(cloneObject(Size_03), 'position', i, '', '', true);
    cloned_obj_01.push(Size_03);
  }
}, function() {});

registerOnClick('Bins_Shelving_S1', false, false, [0,1,2], function() {
  changeVis('Btn2_dublicate_r_01', true);
}, function() {});
registerOnClick('Bins_Shelving_S2', false, false, [0,1,2], function() {
  changeVis('Btn2_dublicate_r_02', true);
}, function() {});
registerOnClick('Bins_Shelving_S3', false, false, [0,1,2], function() {
  changeVis('Btn2_dublicate_r_03', true);
}, function() {});

eventHTMLElem('click', 'light-green', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#83FF81');
});
eventHTMLElem('click', 'pink', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#FF3131');
});
eventHTMLElem('click', 'lilac', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#6635CE');
});
eventHTMLElem('click', 'turquoise', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#47DDB0');
});
eventHTMLElem('click', 'grey', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#D3D3D3');
});
eventHTMLElem('click', 'indigo', true, function(event) {
  setMaterialColor('Bins', 'Color_Bins', 0, 0, 0, '#00529A');
});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
