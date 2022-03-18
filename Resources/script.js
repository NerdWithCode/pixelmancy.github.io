
/*Tools.makeLocation(`Exit_Glenbrook`,`And that is as far as I have programmed this for now. Probably will do a bit more later but \
this is probably about 40% of what this will be. This isn't supposed to be a big thing. \
It would be bigger I suppose if you went through everything here, tbh most of what I made here is optional. It can be speed \
ran in like 1 minute.</p><p>This is actually sort of \
inspired by the first <i>ever</i> game I made in javascript, which is why its perhaps not the most.. complicated thing in \
the world. This part is already like 5 times longer than what I first made though, which only had three sequential fights, with \
1 strange encounter type thing between each. This one also allows you to interact via website as oppossed to via pop ups. \
</p><br><p>Well, that about wraps it up! Cya!`,[],[]);*/

var Gorskith = function(vic){
    let g = generateBaseEnemy(`Gorskith`, 20, 14);
    g.powerUp = false;
    g.healing = false;
    
    g.performCombat = function(){
        let me = this;
        if(me.healing){
            me.health += 5;
            game.print(`The outermost layer of rock and sediment falls off of the Gorskiths frame, swept away 
            by the swirling water surrounding it. You look on in shock as most of the proof that there has been fighting at 
            all slowly washes away...`);
            me.healing = false;
        }
        if(me.health <= 0){
            me.isAlive = false;
            return;
        }
        let choice = getRandom(1, 5);
        if(me.powerUp === true){
            me.powerUp = false;
            game.print(`The Gorskith lets out a grinding screech, sharpened pebbles whipping through the air. You raise your arms 
            to try to protect yourself as much as possible, but it's impossible to block it all. The rocks cut through what little 
            protective clothing you have doing 9 damage`);
            player.health -= 9;
        }
        else if(choice <= 3){
            player.health -= choice + 2;
            switch(choice){
                case 1:
                    game.print(`The Gorskith swings a fist-like object made of silt towards you, the impact staggering you, 
                    doing 3 points of damage`);
                    break;
                case 2:
                    game.print(`Some water detaches off of the rivers running around the Gorskith, whiping at you!`);
                    game.print(`You take 4 points of damage`);
                    break;
                case 3:
                    game.print(`The Gorskiths rock solid leg arcs upwards, cracking painfully into the side of your 
                    chest`);
                    game.print(`You take 5 points of damage, and hear something go '<i>crunch</i>'... You may 
                    want to look into that later. While you don't have much medical knowledge, you <i>do</i> know that 
                    ribs shouldn't make that noise.`);
                    break;
            }
        }
        else if(choice < 5){
            game.print(`The Gorskith lets out some strange gurggling sounds, and a huge spray of water leeps up from 
            the ground, forming a strange, whirling mist, making it hard to breathe...`);
            game.print(`You took 3 points of damage... and lost 20 points of mana!`);
            player.health -= 3;
            player.mana -= 20;
            if(player.mana < 0){
                player.mana = 0;
            }
        }
        else{
            me.powerUp = true;
            game.print(`The water around the Gorskith picks up pace, rapidly accelerating, and the rocks from the 
            path around your feet start to jitter about, getting caught up in the current...`);
            game.print(`You are not quite sure what is happening, but it is definitely nothing that will be good 
            for your health`);
        }
        let heal = getRandom(1, 5);
        if(heal === 5){
            game.addGap(1);
            game.print(`Specks of rock seem to be falling of the Gorskith, as if it were shedding`);
            me.healing = true;
        }
    }

    g.victorySpeech = vic;

    return g;
}

Tools.makeProcess(`Exit_Glenbrook`,function(){
    switchLocation(`Thirdpeak trail`);
});
Tools.makeLocation(`Thirdpeak trail`,`This path through the forest heads along the river briefly, before making its 
way up to the mountain where the Orc Chief is supposedly living. You aren't quite sure where you are along the path, but it 
shouldn't be much further... you hope. You know that there are some wolves up on the mountain but none in this part of the 
woods... so that's something you guess`,[`riverEncounter1`, `Glenbrook Outskirts`],[`Along the river!`, `Maybe back to town...`]);

Tools.makeEnemyEncounter(`A Goblin Scout from the river!`,`You are following the rivers path... when a strange yabbering 
emerges from the river. You look around for anywhere to hide yourself, but it's too late. The Goblin Scout 
charges up from the bank, ragged club flailing wildly`,Goblin_Scout(function(){
    game.print(`The dead body of the scout behind you, you walk down to the river to wash yourself and your sword off. Who 
    knew goblin blood smelt so damn bad?`);
}),`Should be changed by processes`);

Tools.makeEnemyEncounter(`A Gorskith emerges from a stream!`, `A strange mix of a water and rock elemental, and commonly 
spotted where the two elements would meet. This is all you learnt about the Gorskith from the folks at the inn in Glenbrook. 
You probably should have asked more about them, such as how to run away from them, given that something matching their description 
just formed out from a nearby puddle...`, Gorskith(function(){
    game.print(`The water that was tightly wrapped around the rocky form splashes down to the ground, forming a puddle, as the 
    rock itself begins to melt into mud. You decide not to stick around long enough to see if this puddle will turn 
    hostile as well`);
}), `Should be changed by processes`)

var riverEncounters = function(loc){
    let choice = getRandom(1,5);
    if(choice <= 2){
        game.getLocationByID(`A Goblin Scout from the river!`).endLocation = loc;
        switchLocation(`A Goblin Scout from the river!`);
    }
    else{
        game.getLocationByID(`A Gorskith emerges from a stream!`).endLocation = loc;
        switchLocation(`A Gorskith emerges from a stream!`);
    }
}

Tools.makeProcess(`riverEncounter1`,
    function(){
        riverEncounters(`You see the distant trail`);
    }
);

Tools.makeProcess(`riverEncounter2`,
    function(){
        riverEncounters(`The mountain looms ahead...`);
    }
);

Tools.makeProcess(`riverEncounter1_Reverse`,
    function(){
        riverEncounters(`Thirdpeak trail`);
    }
);

Tools.makeProcess(`riverEncounter2_Reverse`,
function(){
    riverEncounters(`You see the distant trail`);
});

Tools.makeLocation(`You see the distant trail`, `Occasionally through the trees you now spot the mountain ahead, 
but as you look at it now from this small marshy clearing you see a small streak of colour going up it. It must be the trail! 
Or, you hope it is. After all, your boots were more form over function, all the <i>look</i> of great adventuring gear, with 
none of the padding or support. Your feet are killing you. But, probably no more than the nearby Gorskith if you don't keep going`,
[`riverEncounter2`,`riverEncounter1_Reverse`],
[`Onwards!`,`Back towards Glenbrook`])

Tools.makeLocation(`The mountain looms ahead...`, `The river flows down into a very, <i>very</i> small looking cave. 
Chances are, you don't want to be going down there, and <i>probably</i> have already missed the exit you were going for. 
Welp, follow the river and then go up the mountain. These were the instructions you were given, and the mountain is here, 
so up you go then. Further up you see the trail you think you were supposed to get to.</p><p> 
 The climb looks pretty sheer, however, so you probably won't be able to come back down again.`,
 [`Mountain pass`, `riverEncounter2_Reverse`],
 [`Climb up the mountain`,`Turn back for now`]);

var setup = function(){
    game_description = document.getElementById(`description`);
    game_options = document.getElementById(`options`);

    game.currentLocation = game.getLocationByID(`The start`);
    game.currentLocation.announce();
    game.currentLocation.enter();
}