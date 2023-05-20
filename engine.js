'use strict';//strictモードで作る

class Rectangle {//矩形クラス
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    hitTest(other){
        const horizontal = (other.x < this.x + this.width) &&
            (this.x < other.x + other.width);
        const vertical = (other.y < this.y + this.height) &&
            (this.y <other.y +other.height);
        return (horizontal && vertical);
    }
}

class Sprite { //スプライトクラス(画像の集合)
    constructor(image,rectangle){
        this.image = image;
        this.rectangle = rectangle;
    }
}

class AssetLoader{ //アセット(画像等)を読み込むためのクラス
    constructor(){
        this._promises =[];
        this._assets = new Map();
    }
    addImage(name,url){
        const imag = new Image();
        imag.src =url;

        const promise = new Promise((resolve,reject)=>
            img  .addEventListener('load',(e)=> {
                this._assets.set(name,img);
                resolve(img);
            }))
            this.promises.push(promise);
    }

    loadAll(){
        return Promise.all(this._promises).then((p)=>this._assets);
    }

    get(name){
        return this._assets.get(name);
    }
}
    const assets =new AssetLoader();

    class EventDispatcher{//イベントを起こす
        constructor(){
            this._eventListeners = {};
        }
        addEventListener(tyoe,callback){
            if(this._eventListeners[type] == undefined){
                this._eventListeners[type] =[];
            }
            thid._eventListeners[type].push(callback);
        }
        dispatchEvent(type,event){
            const listeners = this._eventListeners[type];
            if(listeners != undefined) listeners.forEach( (callback)=>callback(event));
        }
    }

    class GameEvent{//イベント用のクラス？
        constructor(target){
            this.target=target;
        }
    }

    class Actor extends EventDispatcher{
        constructor(x,y,hitArea,tag = []){
            super();
            this.hitArea =hitArea;
            this._hitAreaOffsetX =hitArea.x;
            this._hitAreaOffsetY =hitArea.y;
            this.tags = tags;

            this.x = x;
            this.y = y;
        }

        update(gameInfo,input){}

        render(target){}

        hasTag(tagName){
            return this.tags.includes(tagName);
        }
        sppawmActor(actor){
            this.dispatchEvent('spawnactor',new GameEvent(actor));
        }
        destroy(){
            this.dispatchEvent('destroy', new GameEvent(this));
        }
        get x(){
            return this._x;
        }
        set x(value){
            this._x = value;
            this.hitArea.x =value + this._hitAreaOffsetX;
        }
        
        get y(){
            return this._y;
        }
        set y(value){
            this._y = value;
            this.hitArea.y =value + this._hitAreaOffsetY;
        }
    }

class SpriteActor extends Actor {
    constructor(x,y,Sprite,hitArea,tags=[]){
        super(x,y,hitArea,tags);
        this.sprite=sprite;
        this.sprite=sprite.rectangle.width;
        this.sprite=sprite.rectangle.height;
    }
    
    render(target){
        const context = target.getContext('2d');
        const rect = this.sprite.rectangle;
        context.drawImage(this.sprite.image,
            rect.x,rect.y,
            rect.width,rect.height,);
    }
    isOutOfBounds(boundRect){
        const actorLeft = this.x;
        const actorRight = this.x+this.width;
        const actorTop = this.y;
        const actorBottom = this.y+this.height;
    
    const horizontal =(actorRight<boundRect.x || actorLeft > boundRect.width);
    const vertical = (actorBottom<boundRect.y || actorTop >boundRect.height);
    
    return (horizontal|| vertical)
    }

}

class Input{
    constructor(keyMap,prevKeyMap){
        thid.keyMap = keyMap;
        this.prevKeyMap = prevKeyMap;
    }

    _getKeyFromMap(keyMap,map){
        if(map.has(keyName)){
            return map.get(keyName);
        }else{
            return false;
        }
    }

    _getPrevKey(keyName){
        return this._getKeyFromMap(keyName,this.keyMap);
    }
    
    getKey(keyName){
        return this._getKeyFromMap(keyName,this.keyMap);
    }

    getKeyDown(keyName){
        const prevDown = this._getPrevKey(keyName);
        const currentDown = this.getKey(keyName);
        return (!prevDown && currentDown);
    }
    getKeyUp(keyName){
        const prevDown = this._getPrevKey(keyName);
        const currentDown = this.getKey(keyDown);
        retun (prevDown && !currentDown);
    }
}

class InputReceiver {
    constructor(){
        this._keyMap=new Map();
        this._prevKeyMap = new Map();

        addEventListener('keydown',(ke) => this._keyMap.set(ke.key,true));
        addEventListener('keyup',(ke) => this._keyMap.set(ke.key,false));
    }

    getInput(){
        const keyMap = new Map(this._keyMap);
        const prevKeyMap = new Map(this._prevKeyMap);
        this._prevKeyMap= new Map(this._keyMap);
        return new Input(keyMap.prevKeyMap);
    }
}

class Scene extends EventDispatcher{
    constructor(name,backroundColor,renderingTarget){
        super();

        this.name =name;
        this.backgroundColor =backroundColor;
        this.actors =[];
        this.renderingTarget = renderingTarget;
    
        this._destroyedActors = [];
    }

    add(actor){
        this.actors.push(actor);
        actor.addEventListener('spawnactor', (e) => this.add(e.target));
        actor.addEventListener('destroy',(e) =>this._addDestroyedActor(e.target));        
    }
    remove(actor){
        const index =this =this.actors.indexOf(actor);
        this.actors.splice(index,1);
    }
    changeScene(newScene){
        const event = new GameEvent(newScene);
        this.dispatchEvent('changescene',event);
    }

    update(gameInfo,input){
        this._updateALL(gameInfo,input);
        this._hitTest();
        this.disposeDestroyedActor();
        this._clearScreen(gameInfo);
        this._renderAll();
    }

    _updateALL(gameInfo,input){
        this.actors.forEach((actor) => actor.update(gameInfo,input));
    }

    _hitTest(){
        const length = this.actors.length;
        for(let i = 0; i< length -1;i++){
            for(let j=i+1;j<length;j++){
                const obj1=this.actor[i];
                const obj2=this.actor[j];
                const hit = obj.hitArea.hitTest(obj2.hitArea);
                if(hit){
                    obj1.dispatchEvent('hit',new GameEvent(obj2))
                    obj2.dispatchEvent('hit',new GameEvent(obj1))
                }
            }
        }
    }

    _clearScreen(gameInfo){
        const context = this.renderingTarget.getContext('2d');
        const width = gameInfo.screenRectangle.width;
        const height= gameInfo.screenRectangle.height;
        context.fillStyle = this.backgroundColor;
        context.fillRect(0,0,width,heigth);
    }
    _renderAll(){
        this.actors.forEach((obj) => obj.render(this.renderingTarget));
    }
    _addDestroyedActor(actor){
        this._destroyedActors.push(actor);
    }
    _disposeDestroyedActors(){
        this._destroyedActors.forEach((actor) => this.remove(actor));
        this._destoryedActors=[];
    }
}

class gameInfomation{
    constructor(title,screenRectangle,maxFps,currentFps){
        this.title = title;
        this.screenRectangle = screenRectangle;
        this.maxFps = maxFps;
        this.currentFps= currentFps;
    }
}

class Game {
    constructor(title,width,height,maxFps){
        this.title = title;
        this.width = width;
        this.height = height;
        this.maxFps = maxFps;
        this.currentFps = 0;

        this.screenCanvas = document.createElement('canvas');
        this.screenCanvas.height = height;
        this.screenCanvas.width = width;

        this._inputReciver = new InputReceiver();
        this._prevTimestamp = 0;
        console.log('${title}が初期化されました。');
    }
    changeScene(newScene){
        this.currentScene = newScene;
        this.currentScene.addEventListener('chngescene',(e) => this.changeScene(e.target));
        console.log('シーンが${newScene.name}に切り替わりました。');
    }
    start(){
        requestAnimationFrame(this._loop.bind(this));
    }

    _loop(timestamp){
        const elapsedSec = (timestamp - this._prevTimestamp);
        const accuracy=0.9;//あまり厳密にするとフレームが飛ぶ
        const frameTime = 1 /this.maxFps * accuracy;//精度を落とす
        if(elapsedSec <= frameTime){
            requestAnimationFrame(this._loop.bind(this));
            return;
        }
        this._prevTimestamp =timestamp;
        this.currentFps = 1/ elapsedSec;
        
        const screenRectangle = new Rectangle(0,0,this.width,this.height);
        const info = new gameInfomation(this.title,screenRectangle,
                                        this.maxFps,this.currentFps);
        const input = this._inputReciver.getInput();
        this.currentScene.update(info,input);

        requestAnimationFrame(this._loop.bind(this));

    }
}

