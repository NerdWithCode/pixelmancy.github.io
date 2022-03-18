/*
The code and functions for the Glenbrook section of the text based adventure. The final area sends the player to
a location with the ID `Exit_Glenbrook`, which must be caught by the next section (probably as a Process)
*/

var toto = 4;

var Wolf = function(vic){
    let w = generateBaseEnemy(`Wolf`, 10, 10);
    w.boost = 0;
    w.scratch = 1;
    w.heal = 3;
    w.boostNum = 1;
    w.bite = 3;
    w.performCombat = function(){
        let me = this;
        let choice = getRandom(1,10);
        if(me.health <= 0){
            me.isAlive = false;
            return;
        }
        else if(me.health < 3){
            game.print(`The wolf does not look to be having a good time`);
        }
        else if(me.health < 7){
            game.print(`The wolf looks ready`);
        }
        else{
            game.print(`The wolf looks energetic`);
        }
        if(me.boost > 0){
            choice = 3;
        }
        if(choice < 8){
            game.print(`The wolf lunges forwards with a growl!`);
            choice = getRandom(1,7);
            let ammount = me.boost
            if(choice == 1){
                if(getRandom(1,2) == 1)game.print(`You duck aside just in time!`);
                else game.print(`The wolf stumbles on a tree branch and goes just wide`);
                ammount = 0;
            }
            else if(choice < 5){
                ammount += me.scratch;
                game.print(`It claws at you, drawing some blood, doing ${parseInt(ammount)} damage`);
            }
            else{
                ammount +=me.bite;
                game.print(`It fastens its jaws around your arm and bites down, you take ${parseInt(ammount)} damage!`);
            }
            player.health -= ammount;
            me.boost = 0;
        }
        else if(choice < 10){
            game.print(`The wolf bares its teeth and snarls at you`);
            game.print(`It crouches down in anticipation`);
            me.boost = 1;
        }
        else{
            game.print(`The wolf tilts its head back and lets out a guttural howl.`);
            me.boost = me.boostNum;
            me.health += me.heal;
            if(me.health > me.maxHealth){
                me.health = me.maxHealth;
            }
        }
    }

    w.victorySpeech = vic;
    return w;
}

var Spicy_Wolf = function(vic){
    let sw = Wolf(vic);
    sw.health = 18;
    sw.maxHealth = 18;
    sw.scratch = 3;
    sw.bite = 7;
    sw.heal = 5;
    sw.boostNum = 2;
    return sw;
}

var Goblin_Scout = function(vic){
    let g = generateBaseEnemy(`Goblin Scout`, 6, 6);
    g.performCombat = function(){
        let me = this;
        if(me.health < 0){
            me.isAlive = false;
            return;
        }
        let choice = getRandom(1,7);
        if(choice <= 5){
            game.print(`The goblin scout flails about with their club randomly`);
            let dmg = getRandom(0, 2);
            if(dmg === 0){
                game.print(`You deflect its blows away harmlessly`);
            }
            else{
                game.print(`It connects with a thud doing ${parseInt(dmg)} damage!`);
                player.health -= dmg;
            }
        }
        else{
            game.print(`In its incoherent babbling and flailing you make out the incantation for firebolt!`);
            game.print(`The goblin looks as confused as you do at the jet of flame that shoots towards you.`);
            seenGoblinFire = true;
            let dmg = getRandom(4,6);
            game.print(`You took ${parseInt(dmg)} damage!`);
            player.health -= dmg;
        }
    }
    g.victorySpeech = vic;
    return g;
}

var Goblin_Warlord = function(vic){
    let gw = generateBaseEnemy(`Goblin Warlord`, 16, 20);
    
    gw.buff = 0;
    gw.performCombat = function(){
        let me = this;
        if(me.health < 0){
            me.isAlive = false;
            Warlord_Quest_Triggered = false;
            return;
        }

        let choice = getRandom(1, 5);
        if(me.buff > 0){
            choice += 1;
        }
        if(choice === 1){
            game.print(`The Goblin Warlord chugs something from his pouch, and you notice his muscles pop noticably...`);
            me.buff = 2;
        }
        else if(choice < 5){
            let dmg = getRandom(2,4) + me.buff;
            let diologue = getRandom(0, 2);
            let diologues = [
                `The Warlord strikes with his palm while you are distracted, knocking your head back.`,
                `The Warlord's axe swings connect with your arm, cutting into it.`,
                `You try to block the Warlord's axe, but it bounces off your crossguard, grazing your arm.`
            ];
            game.print(diologues[diologue]+ ` It does ${dmg} damage!`);
            player.health -=  dmg;
            me.buff = 0;
        }  
        else{
            game.print(`The Warlord's axe comes whistling through the air towards you, slicing across your chest, 
            doing ${parseInt(me.buff + 5)} damage`);
             player.health -= (me.buff + 5);
             me.buff = 0;
        }
    }

    gw.victorySpeech = vic;
    return gw;
}

var seenGoblinFire = false;
var heardGlenRumor = false;
var swordUpgradeLevel = 0;
var Warlord_Quest_Triggered = false;

var i_betterSword = Tools.makeItem(`Better sword`,30,`A more... reliable looking weapon than your first, with less dents in it`,
function(){
    if(player.gold < 30){
        game.print(`The merchent scoffs as he informs you you don't have enough gold. Thats embarrassing`);
        return;
    }
    if(swordUpgradeLevel >1){
        game.print(`You consider buying the blade, but then remember you already have a <i>much</i> better one on hand`);
        return;
    }
    player.melee.min = 3;
    player.melee.max = 5;
    player.meleeBase.min = 3;
    player.meleeBase.max = 5;
    player.gold -= 30;
    let me = this;
    me.inShop = false;
},
function(){
    alert(`How the fuck did you manage to use a sword as an item..?`);
});
var i_healthGlen = Tools.makeItem(`Glenden health potion`,20,`A foul, brown looking brew, but the merchent assures you 
that it works (6 health)`,
function(){
    if(player.gold < 20){
        game.print(`The merchant informs you that the potion is for wounds, not eyesight, as he points out the price tag 
        on the bottle. You blush sheepishly, deciding to be a little more careful`);
        return;
    }
    player.gold -= 20;
    let me = this;
    player.items.push(me);
    me.inShop = false;
},
function(){
    game.print(`You choke down the brown mix. At first you wonder if it 'heals' you by making you forget how 
    badly your bleeding is due to your desire to cut off your own tongue, but soon realise such fears are unfounded. 
    Not the fear of it tasting bad though, this is still horrific`);
    game.print(`Recovered 6 health`);
    player.health += 6;
    if(player.health > player.max.health){
        player.health = player.max.health;
    }
    for(let i = 0 ; i < player.items ; i++){
        if(player.items[i].name === `Glenden health potion`){
            player.items.splice(i,1);
            i-=1;
        }
    }
    player.endTurn();
});

var i_fireboltUpgrade = Tools.makeItem(`Advanced Firebolts`, 25, `This book seems to detail ways more amateur casters 
fail to bring out firebolts at full potential. While you are <i>sure</i> that you don't make any such mistakes... perhaps... 
it wouldn't hurt to look...?`,
function(){
    if(player.gold < 25){
        game.print(`The clerk informs you that if you cannot <i>count</i> properly, you definitely couldn't use this 
        properly`);
         return;
    }
    player.gold -= 25;
    player.firebolt.min += 2;
    player.firebolt.max +=3;
    player.firebolt.cost += 5;
    let me = this;
    me.inShop = false;
},
function(){
    alert(`You shouldn't be able to use this`);
});
var i_buffUpgrade = Tools.makeItem(`"On Magical Musculature"`, 10, `An obscure book, for sorcerers and... muscle... 
enthusiasts. It details a way to improve your "Buff" spell`,
function(){
    if(player.gold < 10){
        game.print(`The clerk sniggers at how little money you actually have. You clench your teeth, unable to find 
        a good comeback`);
        return;
    }
    player.gold -= 10;
    let me = this;
    me.inShop = false;
    player.buffBy = 2;
    player.buffByCost +=5;
},
function(){
    alert(`Shouldn't be able to use a book though...`);
});
var i_increaseManaRecovery = Tools.makeItem(`"Higher Meditation"`, 0, `While not for sale, you can still read this book. 
It seems to explain simple brain exercises to increase mana recovery`,
function(){
    player.manaRecovery += 3;
    let me = this;
    me.inShop = false;
},
function(){alert(`NIET`);});


Tools.makeProcess(`DB_Gold_Give`,function(){
    player.gold = 200;
});

Tools.makeLocation(`The start`, `Here you are at your start of your adventure journey. 
You believe your first order of business should be to go to the nearby town of Glenbrook, as it should have more opportunities for you than 
the village you have been staying in. As you touch the trusty sword at your side you feel ready for anything...`,
[`Ah, a wolf`,`Glenbrook Outskirts`, `DB_Gold_Give`],
[`Begin your quest!`, `Debug to Glenbrook`, `Debug gold`]);
/*[`Ah, a wolf`],[`Begin your quest!`]);*/

Tools.makeEnemyEncounter(`Ah, a wolf`,`No sooner have you stepped into the forest than a wolf suddenly steps in front of your path. 
While you have spent a long time slaying mighty dragons in your head, now that there is an enemy in front of you the whole 
affair seems somewhat more... dangerous. 'Well, so be it! That's how adventure is!' you tell yourself as you unsheath your worn 
sword, trying to suppress your shaking hands...`,Wolf(function(){
    game.print(`The wolf sinks to the ground with a small yelp, panting with flecks of blood covering its flank.`);
    game.print(`You lean against a tree, panting heavily. This may be harder than you thought.`);
}),`Glenway Forest`);

Tools.makeLocation(`Glenway Forest`, `You are in the forest separating Farthing village to Glenbrook, and the light making its 
way through the trees carries with it a glow of green from the foliage all around. You hear a river in the distance, which you 
decide is probably the Glen Brook, and distant sounds of the forests inhabitants. Wolves for sure, and you think you have 
heard of goblins making their home here as well`,[`Glen_Encounter`,`Glenbrook Outskirts`],[`Wander about`,`Move to the river`]);

Tools.makeProcess(`Glen_Encounter`,function(){
    let max = 4;
    if(Warlord_Quest_Triggered === true){
        max += 1;
    }
    let choice = getRandom(1,max);
    if(choice < 3){
        switchLocation(`Another wolf...`);
    }
    else if(Warlord_Quest_Triggered && choice < max){
        switchLocation(`It's the Goblin Warlord!`);
    }
    else{
        switchLocation(`A goblin scout jumps out`);
    }
});

Tools.makeEnemyEncounter(`Another wolf...`,`As you wonder about gormlessly, you are completely oblivious to a shape stalking 
you through the trees. That is until it growls at you. It's hard to miss that. You ready yourself for another fight.`,Wolf(function(){
    game.print(`'That looks to be another wolf down' you think to yourself. You are getting pretty good at killing them.`);
    game.print(`But tales are never sung about a hero who only slew overgrown dogs. You must strive higher!`);
}),`Glenway Forest`);

Tools.makeEnemyEncounter(`A goblin scout jumps out`,`You are walking through the forest, wandering along down whatever 
trails you may happen to spot. However, clearly if there are trails, someone had to have made them. This brainwave hits you 
about the same time a cry comes out from the undergrowth ahead. A small, weedy looking goblin leaps forwards. While its 
size may be laughable, the stone club it's wielding definitely is not`, Goblin_Scout(function(){
    game.print(`The goblin scout starts flailing about on the ground, gurgling horribly.`);
    game.print(`... ew`);
}),`Glenway Forest`);

Tools.makeEnemyEncounter(`Its the Goblin Warlord!`, `It's him! It's the goblin warlord the people in the tavern were talking 
about! Unlike other goblins this one, while small, is impressively built, with a <i>huge</i> axe. But that doesn't matter 
to you anymore. After all, he will clearly be carrying treasure on him, and the reward for him back in town isn't small either.`,
Goblin_Warlord(function(){
    game.print(`The Goblin Warlord drops his axe and staggers backwards, before sinking to his knees, and finally falling 
    over. A pouch from his belt falls off, some gold pieces spilling forth. That will do nicely alongside 
    the <i>reward</i> you will be able to pick up if you head back to the <i>Laughing Wheel</i> at Glenbrook`);
    game.print(`You decide to chop off the Warlord's head to take with you as proof`);
    game.getLocationByID(`The Laughing Wheel`).transitionDiologue.push(`Collect the bounty`);
    game.getLocationByID(`The Laughing Wheel`).transitions.push(`Glen_Bounty_Collect`);
}),`Glenway Forest`);

Tools.makeProcess(`Glen_Bounty_Collect`,function(){
    player.gold += 25;
    let inn = game.getLocationByID(`The Laughing Wheel`);
    inn.transitions.pop();
    inn.transitionDiologue.pop();
    game.print(`A round of impressed mutters goes round the inn. Hah! Finally looks like you are getting some recognition. 
    As you hand over the head and collect your 25 Gold reward, you think of all the new gear you can buy with it. With 
    this, you may be able to take on that Orc Chief you hear is in the mountains!`);
    game_options.innerHTML = ``;
    inn.enter();
});

Tools.makeLocation(`Glenbrook Outskirts`, `You finally arrive. You see before you a town built within a seemingly natural clearing 
in the forest. The Glen Brook flows through the town's center, and the bustle of activity floats along into your ears.`,
[`Glenbrook`,`Glen_Recover`, `Glenway Forest`],[`Enter the town`,`Set up camp and rest`, `Return to the forest`]);
Tools.makeProcess(`Glen_Recover`,function(){
    game.print(`You decide to set up camp near the town, and quickly fall asleep`);
    player.fullRecover();
    game_options.innerHTML = ``;
    setTimeout(function(){game.getLocationByID(`Glenbrook Outskirts`).enter();},1000);
});
Tools.makeLocation(`Glenbrook`,`The polished dark-wood bulidings rise up around you; you have never seen so many 
buidlings with two stories before. You think you can even see one with three! The trickle of the Brook and attached 
water wheels mingles with the bustle of the market center. Where do you want to try heading first?`,
[`The Laughing Wheel`,`Hunter's Arms & Apothecary`,`Woodhome Library`, `Glenbrook Outskirts`],
[`The local Inn`,`The general store`, `The town's mage guild`, `The town outskirts`]);

Tools.makeLocation(`The Laughing Wheel`, `A dark room awaits you. You were ready for the kind of oppressive 
atmosphere that you heard about in the bard's stories, but that's not what you encounter at all. All 
around you are pleasant town-goers who are excited to hear of what's happening outside the forest. No one really 
seems that impressed by your victory over the wolf, rather telling you that you should be more careful, or that you 
are lucky you didn't get hurt. Not quite what you had envisioned.</p><p>You <i>do</i> however overhear one of the locals 
mention something about there being a <em>Golbin Warlord</em> somewhere in the woods. Supposedly there is 
a pretty big bounty on it... And more! Up ahead in the mountain trail, there is talk of the Orcs having a new chief, you 
imagine that it would increase your reputation a lot to take them down. Although, perhaps some preparations would be 
in order first. Speaking of which, this is the first time in a while you have had time to fully rest comfortably. 
You feel compleatly renewed! (Max HP, 12 -> 17)`,[`Laughing_Exit`],
[`The future looks interesting!`]);
Tools.makeProcess(`Laughing_Exit`,function(){
    if(heardGlenRumor === false){
        game.getLocationByID(`Glenbrook Outskirts`).transitions.push(`Exit_Glenbrook`);
        game.getLocationByID(`Glenbrook Outskirts`).transitionDiologue.push(`To the mountains!`);
        heardGlenRumor = true;
        Warlord_Quest_Triggered = true;
        player.health += 5;
        player.max.health+=5;
    }
    switchLocation(`Glenbrook`);
});
Tools.makeShop(`Hunter's Arms & Apothecary`, `The man behind the counter seemed... amused... to see you 
enter the shop. You elect to not think too deeply about it. Behind the counter is a variety of trinkets. 
You always hear in the tales of the hero with only their trusty sword, but after your first fight, the whole 
idea of not being as well equipt as possible sounds kind of silly.`,
[`Better sword`,`Healing potion`,`Glenbrook`],[`New sword`,`Healing potion`,`Exit`],
[Tools.makeItemFunction(i_betterSword, `Hunter's Arms & Apothecary`,
`While the merchant counts through your counts, you decide you will get rid of your old sword 
    somewhere else; it would not do well for your reputation to be pawning off such garbage here. 
    You look down at your new sword though, in its new scabard by your waist, and feel 
    an odd sense of accomplishment`),
Tools.makeItemFunction(i_healthGlen, `Hunter's Arms & Apothecary`, 
`You know, you really can't tell if you are being swindled here or not. Asking if it works 
for a fourth time in a row would probably be seen as disrespectful though, so you are forced to grit your teeth and grin. 
Adventurers buy potions... right? And this... is... one..? Apparently?`),
Tools.makeShopExit(`You hear a 'Goodbye, good luck' from the merchant as you leave`, `Glenbrook`)],
[i_betterSword, i_healthGlen]
);
Tools.makeShop(`Woodhome Library`, `A large, open library made of polished light brown wood, the bookshelves seemly blended 
perfectly with the ceilings and floors. There are many scrolls, quires and loose papers placed about the shelves and few 
desks. You note with some disappointment that there are actually not too many books here. It only makes sense; paper is 
expensive, and for you to need a books worth of it for anything particular is rare.</p><p>It seems that they <i>do</i> 
however have some small things for sale...`,
[`Upgrade firebolt`, `Upgrade buff`,`On mana recovery`,`Increase mana recovery`],
[`Fire book`,`Buff book`,`Read meditations`,`Leave`],[
Tools.makeItemFunction(i_fireboltUpgrade,`Woodhome Library`,`You just <i>know</i> you are going 
to have fun with this one...`),
Tools.makeItemFunction(i_buffUpgrade,`Woodhome Library`, `The clerk gives you a <i>look</i> as you buy this. 
Trying to say anything will just make the situation <i>waaay</i> more awkward though, so you just pretend 
to ignore it.`),
Tools.makeItemFunction(i_increaseManaRecovery, `Woodhome Library`, `...Wow... this is... pretty obvious stuff. 
Well, crap. I guess you'll put this into practice!`, false),
Tools.makeShopExit(`A curt 'Bye' is all you hear as you leave`, `Glenbrook`)],
[i_fireboltUpgrade,i_buffUpgrade,i_increaseManaRecovery]
);
