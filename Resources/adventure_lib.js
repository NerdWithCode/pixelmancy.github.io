var game_description;
var game_options;

var storage= {
    output : "",
    bought : false
};

var makeHandle = function(h){
    var ret=" " + h;
    return ret.slice(1);
}

var getRandom = function(min, max){
    var temp = Math.random();
    temp *= ((max - min)+1)
    temp = Math.floor(temp);
    temp += min;
    return temp;
}

var waitingInCombat = false;
var playerTurn = true;
var combatWait = function(funcOut){
    if(waitingInCombat){
        setTimeout(function(){combatWait(funcOut)});
    }
    else{
        funcOut();
    }
}
//Enemy needs a .reset() function
//Enemy needs performCombat function
var runCombat = function(enemy, endLocation){
    if(playerTurn === true){
        player.performCombat(enemy);
        waitingInCombat = true;
        playerTurn = false;
        combatWait(function(){runCombat(enemy,endLocation);})
    }
    else{
        game.addGap(2);
        playerTurn = true;
        game_options.innerHTML = "";
        enemy.performCombat();
        if(enemy.isAlive === true){
            player.combatRecover();
            setTimeout(function(){runCombat(enemy,endLocation);},1500);
        }
        else{
            game.addGap(2);
            enemy.victorySpeech();
            game.print("Combat has ended");
            player.exitCombat(enemy);
            game.addButton("Exit combat",function(){switchLocation(endLocation);});
        }
    }

}

var feqwad = {
    reset : function(){
        let me = this;
        me.isAlive = true;
    },
    name : "shite",
    isAlive : true,
    health : 20,
    goldDrop : 3,
    performCombat:function(){
        game.print("shojt");
        game.print(parseInt(this.health)+" left");
        if(this.health < 0){
            let me = this;
            me.isAlive = false;
        }
    }
}
var generateBaseEnemy = function(name, health, goldDrop){
    var base = {
        name : name,
        health : health,
        maxHealth : health,
        isAlive : true,
        value: goldDrop,
        reset : function(){
            let me = this;
            me.health = me.maxHealth;
            me.isAlive = true;
        }
    }

    return base;
}

var player = {
    health : 12,
    mana : 50,
    manaRecovery : 5,
    max : {
        health : 12,
        mana : 50
    },
    melee : {
        min : 2,
        max : 4
    },
    meleeBase : {
        min : 2,
        max : 4
    },
    heal : {
        max : 5,
        min : 2,
        cost : 20
    },
    buffBy : 1,
    buffByCost : 10,
    firebolt: {
        min : 5,
        max : 8,
        cost : 35,
        description : "A gout of flame licks at the "
    },
    gold : 20,
    items : [],
    performCombat : function(enemy){
        game.addGap(1);
        let p = this;
        p.announceMainOptions(enemy);
    },

    endTurn : function(){
        game_options.innerHTML = "";
        setTimeout(function(){waitingInCombat = false;},1500);
    },

    fullRecover : function(){
        let me = this;
        me.health = me.max.health;
        me.mana = me.max.mana;
        game.addGap(1);
        game.print("You feel fully rested");
        game.addGap(1);
    },

    combatRecover : function(){
        let p = this;
        if(p.mana < p.max.mana){
            p.mana += p.manaRecovery;
            if(p.mana > p.max.mana){
                p.mana = p.max.mana;
            }
            game.print("You have recovered "+parseInt(p.manaRecovery)+" mana");
        }
    },

    exitCombat : function(enemy){
        let me = this;
        me.melee.min = me.meleeBase.min;
        me.melee.max = me.meleeBase.max;
        me.gold += enemy.value;
        game.print("You got "+parseInt(enemy.value)+" gold pieces!");
    },

    strike : function(enemy){
        let me = this;
        game.print("You slice at the "+enemy.name+"!");
        let damage = getRandom(me.melee.min, me.melee.max);
        game.print("It does "+parseInt(damage)+" damage!");
        enemy.health -= damage;this
        me.endTurn();
    },

    castHeal : function(){
        let me = this;
        if(me.mana >= me.heal.cost){
            let orig = me.health;
            let ammount = getRandom(me.heal.min, me.heal.max);
            player.health += ammount;
            player.mana -= me.heal.cost;
            if(me.health > me.max.health){
                player.health = me.max.health;
            }
            game.print("You have healed by "+parseInt(ammount)+". HP: "+parseInt(orig)+"->"+parseInt(me.health));
            me.endTurn();
        }
        else{
            game.print("You do not have enough mana");
        }
    },

    castBuff : function(){
        let me = this;
        if(me.mana >= me.buffByCost){
            me.mana -= me.buffByCost;
            me.melee.min += me.buffBy;
            me.melee.max += me.buffBy;
            game.print("You have buffed yourself");
            me.endTurn();
        }
        else{
            game.print("You do not have enough mana");
        }
    },

    castFirebolt : function(enemy){
        let me = this;
        if(me.mana >= me.firebolt.cost){
            me.mana -= me.firebolt.cost;
            let damage = getRandom(me.firebolt.min, me.firebolt.max);
            enemy.health -= damage;
            game.print(me.firebolt.description+enemy.name);
            game.print("You have delt "+parseInt(damage)+" damage to the "+enemy.name);
            me.endTurn();
        }
        else{
            game.print("You do not have enough mana");
        }
    },

    announceMagic : function(enemy){
        let me = this;
        game_options.innerHTML = "";
        game.addGap(1);
        game.print("Heal:     heals "+parseInt(me.heal.min)+"-"+parseInt(me.heal.max)+" health. "+parseInt(me.heal.cost)+" Mana");
        game.print("Buff:     increases meleee damage by "+parseInt(me.buffBy)+". "+parseInt(me.buffByCost)+" Mana");
        game.print("Firebolt: deals "+parseInt(me.firebolt.min)+"-"+parseInt(me.firebolt.max)+" damage. "+parseInt(me.firebolt.cost)+" Mana");
        game.addGap(1);
        game.addButton("  Heal  ",function(){me.castHeal();});
        game.addButton("  Buff  ",function(){me.castBuff();});
        game.addButton("Firebolt",function(){me.castFirebolt(enemy);});
        game.addButton("Go back ",function(){game.addGap(2);me.announceMainOptions(enemy);});
    },

    announceItems : function(enemy){
        let me = this;
        game.addGap(1);
        if(me.items.length > 0){
            game_options.innerHTML = "";
            for(let i = 0 ; i < me.items.length ; i++){
                game.print(me.items[i].name + ": "+me.items[i].description);
                let f = function(){me.items[i].onUse(enemy)};
                game.addButton(me.items[i].name,f);
            }
            game.addButton("Go back ",function(){game.addGap(2);me.announceMainOptions(enemy);});
            game.addGap(1);
        }
        else{
            game.print("You don't have any battle items to use");
        }
    },

    announceMainOptions: function(enemy){
        game_options.innerHTML = "";
        let me = this;
        game.print("Health: "+parseInt(me.health)+"/"+parseInt(me.max.health));
        game.print("Mana: "+parseInt(me.mana)+"/"+parseInt(me.max.mana));
        game.addButton("Strike",function(){me.strike(enemy);});
        game.addButton("Magic",function(){me.announceMagic(enemy);});
        game.addButton("Items",function(){me.announceItems(enemy);});
    }
}

var game = {
    clear : function(){
        game_description.innerHTML = "";
        game_options.innerHTML="";
    },
    print : function(s, classes = ""){
        game_description.innerHTML+="<p class ="+classes+">"+s+"</p>";
        let num = game_description.childElementCount;
        game_description.children[num-1].scrollIntoView();
    },
    printf : print,
    addTitle : function(s){
        game_description.innerHTML+="<h2>"+s+"</h2>";
    },
    addGap : function(num){
        for(var i = 0;i<num;i++)game_description.innerHTML+="<br>";
    },
    addButton: function(text, func, classes=[]){
        var newElem = document.createElement("button");
        var inner = document.createTextNode(text);
        newElem.appendChild(inner);
        for(var i = 0 ;i<classes.length ; i++){
            newElem.classList.push(classes[i]);
        }
        newElem.onclick = func;
        game_options.appendChild(newElem);
    },
    getLocationByID : function(id){
        for(let i = 0 ; i<global_locations.length ; i++){
            if(global_locations[i].name === id){
                return global_locations[i];
            }
        }
        alert("No location with the id "+id+" can be found");
        return null;
    },
    currentLocation:null
}

var Tools ={
    makeLocationBase : function(name, information, transitions){
        var toret = Object();
    
        toret.name = name;
        toret.info = information;
        toret.isCombat = false;
        toret.transitions = [];
        for(var i = 0 ; i < transitions.length ; i++){
            toret.transitions.push(makeHandle(transitions[i]));
        }
        toret.announce = function(){
            game.clear();
            game.addTitle(this.name);
            game.print(this.info);
        }
    
        global_locations.push(toret);
    
        return toret;
    },

    makeLocation : function(name, information, transitions, transitionDiologue){
        var toret = this.makeLocationBase(name,information,transitions);

        toret.transitionDiologue = transitionDiologue;

        toret.enter = function(){
            for(var i = 0 ; i < this.transitions.length;i++){
                let name = this.transitions[i];
                game.addButton(this.transitionDiologue[i],function(){switchLocation(name)});
            }
        }
        toret.reEnter = function(){
            print("You decide to stay put");
        }

        return toret;
    },

    //onUse must take an enemy as an argument
    makeItem(name, price, description, onBuy, onUse){
        var item = Object();
        item.name = name;
        item.price = price;
        item.inShop = true;
        item.description = description;
        item.onUse = onUse;
        item.onBuy = onBuy;
        return item;
    },
    
    makeShop : function(name, information, transitions, transitionDiologue, transitionFunctions, items){
        var toret = this.makeLocationBase(name, information, transitions);

        toret.transitionDiologue = transitionDiologue;
        toret.functions = transitionFunctions;
        toret.items = items;

        toret.tellVendStatus = function(){
            game.print("For sale is:");
            for(let i = 0 ; i<this.items.length; i++){
                if(this.items[i].inShop === true){
                    game.print(this.items[i].name+": "+parseInt(this.items[i].price)+" Gold");
                    game.print("-----"+this.items[i].description);
                }
            }
            game.print("You have "+parseInt(player.gold)+" Gold");
        }

        toret.hasItemsLeft = function(){
            for(let i = 0 ; i <this.items.length ; i++){
                if(this.items[i].inShop === true){
                    return true;
                }
            }
            return false;
        }

        toret.enter = function(){
            if(this.items.length > 0 && this.hasItemsLeft()){
                this.tellVendStatus();
            }
            else{
                game.print("There is nothing more for sale");
            }
            for(let i = 0 ; i < this.transitions.length;i++){
                if(i < this.items.length){
                    if(this.items[i].inShop === false){
                        continue;
                    }
                }
                let f = this.functions[i];
                game.addButton(this.transitionDiologue[i],f);
            }
        }

        toret.reEnter = function(){
            game.addGap(2);
            if(storage.bought){
                game.print("\"Thanks for the purchase!\"");
            }
            game.print(storage.output);
            game_options.innerHTML="";
            this.enter();
        }

        return toret;
    },

    makeEnemyEncounter : function(name, information, enemy, endLocation){
        var toret = this.makeLocationBase(name, information,[]);
        toret.enemy = enemy;
        toret.endLocation = endLocation;

        toret.enter = function(){
            this.enemy.reset();
            runCombat(this.enemy,this.endLocation);
        }

        toret.reEnter = function(){
            alert("How did this happen");
        }
    },

    makeProcess : function(name, func){
        var toret = this.makeLocationBase(name,"",[]);
        toret.announce = function(){}
        toret.enter = func;
    },

    makeItemFunction : function(item, store, output, bought = true){
        return function(){
            item.onBuy();
            if(item.inShop){
                return;
            }
            storage.output = output;
            storage.bought = bought;
            game.getLocationByID(store).reEnter();
        };
    },

    makeShopExit : function(speech, location){
        return function(){
            game.print(speech);
            game_options.innerHTML = "";
            setTimeout(function(){switchLocation(location);},1200);
        };
    }
}

var global_locations = [];
var switchLocation = function(newLocation){

    if(newLocation === game.currentLocation.name){
        game.currentLocation.reEnter();
        return;
    }

    var found = false;
    for(var i=0;i<global_locations.length;i++){
        if(global_locations[i].name === newLocation){
            found = true;
            game.currentLocation = global_locations[i];
        }
    }
    if(found === false){
        game.clear();
        game.addTitle("Error");
        game.addGap(1);
        game.print("The game has encountered an error, and execution has stopped");
        game.print("Cannot find location " + newLocation);
    }
    else{
        game.option=-1;
        game.currentLocation.announce();
        game.currentLocation.enter();
    }
}