// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const CocosHelper = require("./CocosHelper");
const ItemMgr = require("./ItemMgr");
const PlatformTool = require("./PlatformTool");
const StorageHelper = require("./StorageHelper");
const TimerHelper = require("./TimerHelper");

module.exports = {
    names : [ "Xenia", "Xylona", "Tertia",   "Yasmin", "Yelena Helen","Eva Eve", "Pamela", "Prudence", "Prunella", "Psyche", "Freda",  "Grace", "Aggie Agatha", "Agnes", "Beatrice","Cynthia", "Gretchen", "Grizelda", "Gwen", "Gytha", "Honey", "Honoria", "Hope", "Hoshi", "Ianthe",  "Isleta", "Isoke", "Ivie Ivy", "Ivy", "Izellah",  "Jillian Jill", "Joy", "Judith", "Judy Judith", "Julia", "Julie Julia", "Kenda", "Kenisha", "Kersen", "Kiona", "Lilac", "Lillian", "Linda", "Linnea", "Madeleine Madeline", "Madeline", "Madge Margaret", "Michelle", "Miki", "Mora", "Muriel", "Nabila", "Nadia", "Nafisa", "Nancy", "Naomi", "Natalia Natalie", "Natalie", "Neoma", "Nerissa", "Netany", "Nyako", "Nysa", "Obelia", , "Oralie", "Orenda", "Oria", "Orianna", "Oriel", "Oriole", "Paloma",  "Pythia", "Qamar", "Qoqa", "Querida", "Quinta",  "Bella Belle", "Belle","Quirita", "Rabia", "Rachel", "Radinka", "Rae", "Raissa", "Rochelle", "Rohana", "Ros Rosalind","Sally Sarah",  "Serepta", "Summer", "Sylvia", "Tabitha", "Talia", "Tallulah", "Tanisha", "Tanya", "Tawnie","Thalia",  "Tricia Patricia","Tesia", "Thadea", "Glenna", "Gloria", "Glory Gloria", "Trina Catherine", "Serwa", "Shirley", "Stella", "Sue Susan", "Trixie Beatrice", "Ula", "Uma", "Ummi", "Urania", "Ursula", "Vera","Faith","Florence", "Veronica", "Vesta", "Vevina", "Vicki Victoria", "Viveka", "Vivienne Vivi", "Wanda", "Welcome", "Wenda Wendy", "Wendy", "Willow", "Wilma", "Wilona", "Winola", "Winona", "Xandy", "Xanthe", "Xena Wendy",  "Yolanda", "Vala", "Valarie", "Valencia",  "Yonina", "Yvonne", "Zada", "Zahara", "Zahirah", "Zandra", "Zarah", "Zea", "Zenaide", "Zene", "Zerlinda", "Zeva", "Zina", "Zinia", "Ziva", "Zoe", "Zole", "Zora", "Zsuzsa Susan", "Zula", "Zuza", "Zuzanny", "Aakarshan", "Abelard", "Abenzio", "Abercio", "Abhay", "Abhi", "Abhijit", "Babul", "Baldwin", "Bale Mutima", "Cable",  "Calhoun", "Calisto", "Calixto", "Callis", "Dag", "Dagan",  "Daly", "Damek", "Damen", "Eamon", "Earl", "Eaton", "Eban", "Edric", "Edward", "Faxon", "Fear", "Februus", "Felix", "Fenton", "Gaman", "Gamba", "Gamble", "Habib", "Hahn", "Haile", "Haines", "Hakan", "Iaap", "Iago",  "Imre", "Ince", "Jabari", "Jabir", "Jack John",  "Jaidev", "Jal", "Jaleel",  "Kale", "Kaleo", "Kalidas",  "Lakshman Rama", "Lakshya", "Lalit", "Lalo",  "Maddock", "Maddox", "Madhav", "Mael", "Naariah", "Nabulung", "Nachmanke", "Nansen Nan", "Nantai", "Naphtali", "Quade", "Quant", "Quasim", "Qudamah", "Raanan",  "Raeburn", "Rafael", "Saar", "Sabola", "Sahen", "Taksony", "Taku", "Talbot", "Talib", "Talos Minos", "Ugod", "Ugor", "Ugur", "Uilleam", "Uilliam William", "Uisdean" , "Valdemar", "Valdis",  "Valfrid", "Valin Balin", "Wade", "Waggoner", "Wagner", "Wakefield", "Wakeley", "Walden", "Waldo","Warner", "Warren", "Ximenes",  "Yannick", "Yaphet", "Yardan", "Zahid", "Zahin", "Zahir", "Zahur", "Zaid", "Zaide"],
    

    playerNumber : 12,
    minTime : 30,

    nameArr : null,
    rankData : null,
    selfRankData: null,
    worldPlayers : null,

    getRandName() {

        if (this.nameArr == null) this.nameArr = this.names.concat();
        
        let idx = Math.floor(Math.random() * this.nameArr.length);
        
        if (idx >= this.nameArr.length) idx = this.nameArr.length - 1;

        let _name = this.nameArr[idx];

        this.nameArr.splice(idx,1);

        let nameIndex = this.names.indexOf(_name);

        return nameIndex;
    },

    getName(index)
    {
        if (index < 0 || index >= this.names.length)
        {
            console.log("cant get name by this index");
            return;
        }
        
        return this.names[index];
    },
    
    getCountry(nameIndex)
    {
        let countryIndex = nameIndex % this.countrys.length;
        return this.countrys[countryIndex];
    },

    getRank(index)
    {

        return this.rankData.list[index];
    },

    getRankNumber()
    {
        return this.rankData.list.length;
    },
    
    getSelfRankData()
    {
        return this.selfRankData;
    },
    
    generateRankList() {
        console.log("name length : ", this.names.length);

        let day = 7; //TimerHelper.getWeekDay();
        let _ttt = [2, 2, 3, 3, 3, 4, 5, 4, 3, 4, 4, 4, 4];
        let _dis = _ttt[day];
        
        let _ttt2 = [7, 8, 9, 10, 11, 12, 11, 10, 9, 10, 8, 7, 11];
        let _dis2 = _ttt2[day];

        this.selfRankData = null;
        this.rankData = [];
        this.worldPlayers = {};

        for (let i = 0; i < this.names.length; i++)
        {
            if (i % _dis2 == day)
            {
                let _name = this.names[i];
                this.rankData.push({
                    name: _name,
                    score: 0,
                    rank: 1,
                    isSelf: false,
                    isReal : false,
                        photo : "",
                })
            }

            if (this.rankData.length == this.playerNumber) break;
        }

        console.log(this.rankData.length);
        if (this.rankData.length < this.playerNumber)
        {
            for (let i = 0; i < this.names.length; i++)
            {
                let _name = this.names[i];
                let _arg = this.rankData.find(element => element.name == _name);
                if (!_arg)
                {
                    this.rankData.push({
                        name: _name,
                        score: 0,
                        rank: 1,
                        isSelf: false,
                        isReal: false,
                        photo : "",
                    })
                }

                if (this.rankData.length == this.playerNumber) break;
            }
        }

        //混乱排行榜
        let temps = [];
        let temps2 = [];
        for (let i = 0; i < this.rankData.length; i++)
        {
            if (i % _dis == 0 && i != 0)
            {
                temps.push(this.rankData[i]);
            }
            else temps2.push(this.rankData[i]);
        }

        this.rankData = temps.concat(temps2);



        let _maxScore = 600;
        let _minScore = 2;
        let _bk = 1;
        for (let i = 0; i < this.rankData.length; i++)
        {
            this.rankData[i].rank = i + 1;
            this.rankData[i].score = _maxScore;
            this.worldPlayers[_maxScore] = _bk;

            _maxScore -= 1;
            _bk += 1;
        }
        
        let _sameCount = 3;
        for(let i = _maxScore;i >= _minScore;i--)
        { 
            this.worldPlayers[i] = _bk;


            _bk += _sameCount;

            if(i % 33 == 0)
                _sameCount += 1;

        }
        
        // console.log(temps);
        // console.log(temps2);
        // console.log(this.rankData);
        // console.log(this.worldPlayers);
    },

    getPlayerRank()
    {
        let _level = ItemMgr.getLevel();
        let _rank = this.worldPlayers[_level];
        
        return {
            name : PlatformTool.playerName,
            score : _level,
            rank : _rank ? _rank : (this.worldPlayers[2] + 15),
            isReal: true,
            isSelf : true,
            photo : PlatformTool.playerPhoto,
        }
        
        
    }
}
