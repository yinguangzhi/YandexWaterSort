
module.exports = {

    i8labels : [],
    addi8L(_i8l)
    {
        this.i8labels.push(_i8l);
    },
    removei8L(_i8l)
    {
        let _idx = this.i8labels.indexOf(_i8l);
        if(_idx != -1)
        {
            this.i8labels.splice(_idx,1);
        }
    },

    currLang : 1,
    language : 
    {
        en : 1,
        ru : 2,
    },

    en :{
        start : 'Start',
        audio : 'Audio',
        music : 'Music',
        vibrate : 'Vibrate',
        thanks : 'No,thanks',
        get : 'Get',
        continue : 'Continue?',
        next : 'Next',
        highestScore : 'Highest Score',
        setting : 'SETTING',
        loading : 'Loading... ',
        extraLife : 'Extra Life',
    },

    ru :{
        start : 'Начать',
        audio : 'Аудио',
        music : 'Музыка',
        vibrate : 'Вибрировать',
        thanks : 'Нет, спасибо',
        get : 'Получить',
        continue : 'Продолжить?',
        next : 'Далее',
        highestScore : 'Высший счёт',
        setting : 'НАСТРОЙКА',
        loading : 'Загрузка...',
        extraLife : 'Дополнительная жизнь',
    },

    setLanguage(_lang)
    {
        if(this.isEmpty(_lang))
        {
            this.currLang = this.language.en
        }
        else
        {
            if(_lang == 'ru')
                this.currLang = this.language.ru;
            else
            {
                this.currLang = this.language.en
            }
        }

        for(let i = 0;i < this.i8labels.length;i++)
        {
            let _la = this.i8labels[i];
            if(cc.isValid(_la))
            {
                _la.refreshLanguage()
            }
        }
    },

    getValue(_key,_lang)
    {
        if(this.isEmpty(_key)) return;

        let _lg = this.currLang;
        if(!this.isEmpty(_lang))
        {
            _lg = _lang;
        }

        if(_lg == this.language.ru)
        {
            return this.ru[_key];
        }
        else
        {
            return this.en[_key];
        }

    },

    isEmpty: function (obj) {
        if (obj === '' || obj === null || obj === undefined) {
            return true;
        }
        else {
            return false;
        }
    },
}