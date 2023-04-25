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
